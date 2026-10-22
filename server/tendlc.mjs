/**
 * 10DLC (US A2P SMS registration), scoped per user.
 *
 * All users share ONE platform Telnyx account, so the raw /10dlc API can't tell
 * whose brand is whose. This module is the only way in: it remembers each user's
 * brand + campaign in the DB (tendlc_registrations), checks ownership on every
 * call, and bills the carrier fees to the user's wallet up front (refunded if
 * Telnyx rejects the request).
 *
 * Telnyx 10DLC responses are NOT wrapped in { data } — objects come back at the
 * top level, lists as { records, page, totalRecords }.
 */

const BRAND_FEE = Number(process.env.TENDLC_BRAND_FEE ?? 4);
// Set TENDLC_BILL_USERS=0 to absorb the carrier fees instead of billing wallets.
const BILL_USERS = process.env.TENDLC_BILL_USERS !== "0";
const DAY = 24 * 3600 * 1000;

export function createTenDlc({ db, telnyxFetch }) {
  const tx = async (path, init) => {
    const r = await telnyxFetch(`/10dlc${path}`, init);
    const text = await r.text();
    let j = {};
    try { j = text ? JSON.parse(text) : {}; } catch { /* non-JSON */ }
    return { ok: r.ok, status: r.status, j };
  };
  const txError = (j, fallback) => {
    const e = j?.errors?.[0];
    return (e && (e.detail || e.title)) || j?.message || fallback;
  };

  const brandStatus = (b) => {
    const s = String(b?.status || "").toUpperCase();
    const id = String(b?.identityStatus || "").toUpperCase();
    if (s.includes("FAIL")) return "FAILED";
    if (id === "VERIFIED" || id === "VETTED_VERIFIED") return "VERIFIED";
    if (s.includes("PENDING") || !id) return "PENDING";
    // Sole proprietors sit UNVERIFIED until their mobile OTP is confirmed.
    if (String(b?.entityType).toUpperCase() === "SOLE_PROPRIETOR") return "PENDING";
    return "UNVERIFIED";
  };
  const campaignStatus = (c) => {
    const s = String(c?.campaignStatus || "").toUpperCase();
    if (String(c?.status || "").toUpperCase() === "EXPIRED") return "REJECTED";
    if (s === "MNO_PROVISIONED") return "ACTIVE";
    if (/FAILED|REJECTED|EXPIRED|SUSPENDED/.test(s) || String(c?.submissionStatus).toUpperCase() === "FAILED") return "REJECTED";
    return "PENDING";
  };

  // Short cache so /api/numbers (every app load) doesn't hammer Telnyx.
  const cache = new Map();
  const cached = async (key, ms, fn) => {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < ms) return hit.v;
    const v = await fn();
    cache.set(key, { v, at: Date.now() });
    return v;
  };
  const forget = (...keys) => keys.forEach((k) => cache.delete(k));

  async function fetchBrand(brandId) {
    const r = await tx(`/brand/${encodeURIComponent(brandId)}`);
    return r.ok ? r.j : null;
  }
  async function fetchCampaign(campaignId) {
    const r = await tx(`/campaign/${encodeURIComponent(campaignId)}`);
    return r.ok ? r.j : null;
  }
  async function fetchAssignment(e164) {
    const r = await tx(`/phone_number_campaigns/${encodeURIComponent(e164)}`);
    return r.ok ? r.j : null;
  }
  async function brandFeedback(brandId) {
    const r = await tx(`/brand/feedback/${encodeURIComponent(brandId)}`);
    const cats = r.ok ? (r.j?.category || r.j?.categories || []) : [];
    return cats.map((c) => c.description || c.displayName || c.id).filter(Boolean);
  }

  async function campaignCost(usecase) {
    const r = await tx(`/campaign/usecase/cost?usecase=${encodeURIComponent(usecase)}`);
    if (!r.ok) throw Object.assign(new Error(txError(r.j, "Couldn't price this use case")), { status: 400 });
    return { upfront: Number(r.j.upFrontCost) || 0, monthly: Number(r.j.monthlyCost) || 0 };
  }

  async function charge(uid, amount, label) {
    if (!BILL_USERS || !(amount > 0)) return 0;
    try { await db.debitWallet(uid, amount, label); }
    catch (e) {
      if (e.status === 402) throw Object.assign(new Error(`Top up your wallet — the carrier fee is $${amount.toFixed(2)}`), { status: 402 });
      throw e;
    }
    return amount;
  }
  async function refund(uid, amount, label) {
    if (amount > 0) await db.creditWallet(uid, amount, label).catch(() => {});
  }

  /** The user's registration, refreshed from Telnyx. */
  async function status(uid) {
    const reg = await db.getTenDlc(uid);
    const out = { brand: null, campaign: null, numbers: {}, fees: { brand: BILL_USERS ? BRAND_FEE : 0 }, billUsers: BILL_USERS };
    if (!reg?.brandId) return out;
    const b = await fetchBrand(reg.brandId);
    if (b) {
      const st = brandStatus(b);
      out.brand = {
        id: reg.brandId, displayName: b.displayName || reg.displayName, entityType: b.entityType || reg.entityType,
        status: st, identityStatus: b.identityStatus || "", rawStatus: b.status || "",
        otpRequired: String(b.entityType || reg.entityType).toUpperCase() === "SOLE_PROPRIETOR" && st !== "VERIFIED" && st !== "FAILED",
        reasons: st === "VERIFIED" || st === "PENDING" ? [] : await brandFeedback(reg.brandId),
      };
    } else {
      out.brand = { id: reg.brandId, displayName: reg.displayName, entityType: reg.entityType, status: "PENDING", reasons: [] };
    }
    if (reg.campaignId) {
      const c = await fetchCampaign(reg.campaignId);
      out.campaign = {
        id: reg.campaignId, usecase: c?.usecase || reg.usecase, status: c ? campaignStatus(c) : "PENDING",
        rawStatus: c?.campaignStatus || "", monthlyFee: reg.monthlyFee, paidUntil: reg.paidUntil,
        reasons: (c?.failureReasons || []).map((x) => x?.description || String(x)).filter(Boolean),
      };
      forget(`camp:${reg.campaignId}`);
      const nums = (await db.listNumbers(uid)) || [];
      await Promise.all(nums.filter((n) => n.e164?.startsWith("+1")).map(async (n) => {
        forget(`pnc:${n.e164}`);
        out.numbers[n.e164] = await numberSmsStatus(uid, n.e164, reg, out.campaign.status);
      }));
    }
    return out;
  }

  /** "active" (can text) / "pending" (registered, awaiting carriers) / "none". */
  async function numberSmsStatus(uid, e164, reg, campStatus) {
    reg = reg ?? await db.getTenDlc(uid);
    if (!reg?.campaignId) return "none";
    const a = await cached(`pnc:${e164}`, 5 * 60_000, () => fetchAssignment(e164)).catch(() => null);
    if (!a || (a.campaignId !== reg.campaignId && a.telnyxCampaignId !== reg.campaignId)) return "none";
    const as = String(a.assignmentStatus || "").toUpperCase();
    if (as.includes("FAIL")) return "failed";
    const cs = campStatus ?? await cached(`camp:${reg.campaignId}`, 5 * 60_000, async () => campaignStatus(await fetchCampaign(reg.campaignId))).catch(() => "PENDING");
    return as === "ASSIGNED" && cs === "ACTIVE" ? "active" : "pending";
  }

  function brandBody(d) {
    const sole = d.entityType === "SOLE_PROPRIETOR";
    const isPublic = d.entityType === "PUBLIC_PROFIT";
    const e164 = (s) => { const x = String(s || "").replace(/[^\d+]/g, ""); return x ? (x.startsWith("+") ? x : `+${x}`) : undefined; };
    return {
      entityType: d.entityType,
      displayName: d.displayName,
      companyName: sole ? undefined : d.companyName,
      firstName: sole ? d.firstName : undefined,
      lastName: sole ? d.lastName : undefined,
      mobilePhone: sole ? e164(d.mobilePhone) : undefined,
      ein: sole ? undefined : d.ein,
      einIssuingCountry: sole ? undefined : (d.einIssuingCountry || d.country),
      vertical: d.vertical,
      email: d.email,
      phone: e164(d.phone),
      website: d.website || undefined,
      street: d.street, city: d.city, state: d.state, postalCode: d.postalCode, country: d.country,
      stockSymbol: isPublic ? d.stockSymbol || undefined : undefined,
      stockExchange: isPublic ? d.stockExchange || undefined : undefined,
    };
  }

  async function sendOtp(brandId) {
    const r = await tx(`/brand/${encodeURIComponent(brandId)}/smsOtp`, { method: "POST", body: JSON.stringify({
      pinSms: "Your DIGIRINGO business verification code is @OTP_PIN@. It expires in 24 hours.",
      successSms: "Your DIGIRINGO business is verified. You can now register your SMS campaign.",
    }) });
    if (!r.ok) throw Object.assign(new Error(txError(r.j, "Couldn't send the verification code")), { status: 400 });
  }

  /** Create the user's brand (billed once), or update + re-vet a rejected one. */
  async function registerBrand(uid, d) {
    if (!["PRIVATE_PROFIT", "PUBLIC_PROFIT", "NON_PROFIT", "GOVERNMENT", "SOLE_PROPRIETOR"].includes(d?.entityType)) {
      throw Object.assign(new Error("Choose a business type"), { status: 400 });
    }
    if (d.entityType === "SOLE_PROPRIETOR" && !(d.firstName && d.lastName && d.mobilePhone)) {
      throw Object.assign(new Error("First name, last name and a US/Canada mobile number are required"), { status: 400 });
    }
    const reg = await db.getTenDlc(uid);
    const body = JSON.stringify(brandBody(d));

    if (reg?.brandId) {
      // Already registered → resubmit corrected details on the SAME brand (no new fee).
      const r = await tx(`/brand/${encodeURIComponent(reg.brandId)}`, { method: "PUT", body });
      if (!r.ok) throw Object.assign(new Error(txError(r.j, "The carrier rejected these details")), { status: 400 });
      await tx(`/brand/${encodeURIComponent(reg.brandId)}/revet`, { method: "PUT" }).catch(() => {});
      await db.saveTenDlcBrand(uid, { brandId: reg.brandId, entityType: d.entityType, displayName: d.displayName });
      await db.logActivity(uid, { kind: "verification", title: "Brand resubmitted", body: `"${d.displayName}" was sent to the carrier registry again.` }).catch(() => {});
      return status(uid);
    }

    const paid = await charge(uid, BRAND_FEE, "SMS registration (10DLC) — brand fee");
    const r = await tx("/brand", { method: "POST", body });
    const brandId = r.j?.brandId;
    if (!r.ok || !brandId) {
      await refund(uid, paid, "Refund — brand registration rejected");
      throw Object.assign(new Error(txError(r.j, "The carrier registry rejected these details")), { status: 400 });
    }
    await db.saveTenDlcBrand(uid, { brandId, entityType: d.entityType, displayName: d.displayName });
    await db.logActivity(uid, { kind: "verification", title: "Brand submitted", body: `"${d.displayName}" was sent to the carrier registry for verification.` }).catch(() => {});
    if (d.entityType === "SOLE_PROPRIETOR") await sendOtp(brandId).catch(() => {});
    return status(uid);
  }

  /** Sole proprietor: resend the OTP (no pin) or confirm it (pin). */
  async function brandOtp(uid, pin) {
    const reg = await db.getTenDlc(uid);
    if (!reg?.brandId) throw Object.assign(new Error("Register your brand first"), { status: 400 });
    if (!pin) { await sendOtp(reg.brandId); return status(uid); }
    const r = await tx(`/brand/${encodeURIComponent(reg.brandId)}/smsOtp`, { method: "PUT", body: JSON.stringify({ otpPin: String(pin).trim() }) });
    if (!r.ok) throw Object.assign(new Error(txError(r.j, "That code is wrong or expired")), { status: 400 });
    await db.logActivity(uid, { kind: "verification", title: "Mobile verified", body: "Your sole-proprietor brand's mobile number was confirmed." }).catch(() => {});
    return status(uid);
  }

  /** Create the user's single campaign (billed: the carrier's 3-month upfront fee). */
  async function createCampaign(uid, d) {
    const reg = await db.getTenDlc(uid);
    if (!reg?.brandId) throw Object.assign(new Error("Register your brand first"), { status: 400 });
    if (reg.campaignId) throw Object.assign(new Error("You already have a campaign — attach your numbers to it"), { status: 409 });
    const b = await fetchBrand(reg.brandId);
    if (brandStatus(b) !== "VERIFIED") throw Object.assign(new Error("Your brand isn't verified yet"), { status: 400 });
    const sole = String(b?.entityType).toUpperCase() === "SOLE_PROPRIETOR";
    const usecase = sole ? "SOLE_PROPRIETOR" : String(d?.usecase || "");
    if (!usecase || !d?.description || !d?.sample1 || !d?.messageFlow) throw Object.assign(new Error("Fill the use case, description, opt-in flow and a sample message"), { status: 400 });
    const cost = await campaignCost(usecase);
    const paid = await charge(uid, cost.upfront, `SMS campaign (10DLC) — carrier fee, first 3 months`);
    const r = await tx("/campaignBuilder", { method: "POST", body: JSON.stringify({
      brandId: reg.brandId, usecase,
      description: d.description, messageFlow: d.messageFlow,
      sample1: d.sample1, sample2: d.sample2 || undefined,
      subscriberOptin: true, subscriberOptout: true, subscriberHelp: true,
      optinKeywords: d.optinKeywords || undefined, optinMessage: d.optinMessage || undefined,
      optoutKeywords: d.optoutKeywords || undefined, optoutMessage: d.optoutMessage || undefined,
      helpKeywords: d.helpKeywords || undefined, helpMessage: d.helpMessage || undefined,
      embeddedLink: !!d.embeddedLink, embeddedPhone: !!d.embeddedPhone, ageGated: !!d.ageGated,
      directLending: !!d.directLending, affiliateMarketing: !!d.affiliateMarketing,
      termsAndConditions: true,
    }) });
    const campaignId = r.j?.campaignId;
    if (!r.ok || !campaignId) {
      await refund(uid, paid, "Refund — SMS campaign rejected");
      throw Object.assign(new Error(txError(r.j, r.status === 402 ? "Registration is temporarily unavailable — please contact support" : "The carrier rejected this campaign")), { status: 400 });
    }
    await db.saveTenDlcCampaign(uid, { campaignId, usecase, monthlyFee: BILL_USERS ? cost.monthly : 0, paidUntil: Date.now() + 90 * DAY });
    await db.logActivity(uid, { kind: "verification", title: "Campaign submitted", body: "Carriers usually review an SMS campaign within 1–7 business days." }).catch(() => {});
    return status(uid);
  }

  /** Attach one of the user's US numbers to their campaign. */
  async function assignNumber(uid, e164) {
    e164 = String(e164 || "").replace(/[^\d+]/g, "");
    if (!e164.startsWith("+1")) throw Object.assign(new Error("Only US/Canada numbers use 10DLC"), { status: 400 });
    const owner = await db.findNumberOwner(e164).catch(() => null);
    if (!owner || Number(owner.userId) !== Number(uid)) throw Object.assign(new Error("Number not found on your account"), { status: 404 });
    const reg = await db.getTenDlc(uid);
    if (!reg?.campaignId) throw Object.assign(new Error("Create your campaign first"), { status: 400 });
    const existing = await fetchAssignment(e164);
    if (existing && (existing.campaignId === reg.campaignId || existing.telnyxCampaignId === reg.campaignId)) return status(uid);
    if (reg.usecase === "SOLE_PROPRIETOR") {
      const nums = ((await db.listNumbers(uid)) || []).filter((n) => n.e164?.startsWith("+1") && n.e164 !== e164);
      for (const n of nums) {
        const a = await fetchAssignment(n.e164);
        if (a && (a.campaignId === reg.campaignId || a.telnyxCampaignId === reg.campaignId)) {
          throw Object.assign(new Error("Sole-proprietor campaigns allow only one number"), { status: 400 });
        }
      }
    }
    const r = await tx("/phone_number_campaigns", { method: "POST", body: JSON.stringify({ phoneNumber: e164, campaignId: reg.campaignId }) });
    if (!r.ok) throw Object.assign(new Error(txError(r.j, "Couldn't attach this number")), { status: 400 });
    forget(`pnc:${e164}`);
    await db.logActivity(uid, { kind: "verification", title: "Number registered", body: `${e164} was attached to your SMS campaign. Texts start once carriers approve the campaign.` }).catch(() => {});
    return status(uid);
  }

  return { status, numberSmsStatus, registerBrand, brandOtp, createCampaign, assignNumber, campaignCost, billUsers: BILL_USERS };
}
