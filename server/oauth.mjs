/**
 * Social sign-in — Google & Apple via the OAuth 2.0 / OIDC authorization-code
 * flow. Zero dependencies (provider REST endpoints via fetch + node:crypto).
 *
 * Why authorization-code (server-side) and not a client-side id_token:
 *   The code is exchanged for tokens by THIS server using our client secret, so
 *   the id_token comes straight from the provider's token endpoint over TLS — we
 *   can trust its claims without re-verifying the signature (confidential client).
 *   Nothing sensitive ever touches the browser.
 *
 * The same flow serves the web app AND the Capacitor native app: the browser (or
 * the phone's system browser) lands on the provider, the provider redirects back
 * to OUR callback, and the callback hands a DIGIRINGO session token back to the
 * app — via a URL hash on web, or a `com.digiringo.app://oauth` deep link on native.
 *
 * Config (server .env or the Control Hub encrypted store — the latter wins):
 *   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET      (from Google Cloud Console)
 *   APPLE_SERVICES_ID / APPLE_TEAM_ID /
 *   APPLE_KEY_ID / APPLE_PRIVATE_KEY             (from the Apple Developer portal)
 * A provider is simply "off" (its button hidden) until its keys are present, so
 * Google can ship today and Apple switches on the moment its keys are added.
 */
import { createPrivateKey, sign as cryptoSign } from "node:crypto";
import * as settings from "./settings-store.mjs";

const cfg = (name) => settings.getSecret(name) || process.env[name] || "";

/* ------------------------------------------------------------------- Google */
const googleId = () => cfg("GOOGLE_CLIENT_ID");
const googleSecret = () => cfg("GOOGLE_CLIENT_SECRET");
export const googleConfigured = () => !!(googleId() && googleSecret());

/* -------------------------------------------------------------------- Apple */
const appleServicesId = () => cfg("APPLE_SERVICES_ID");
const appleTeamId = () => cfg("APPLE_TEAM_ID");
const appleKeyId = () => cfg("APPLE_KEY_ID");
// A .p8 key pasted into an env var / the Control Hub keeps its newlines as "\n".
const applePrivateKey = () => cfg("APPLE_PRIVATE_KEY").replace(/\\n/g, "\n");
export const appleConfigured = () =>
  !!(appleServicesId() && appleTeamId() && appleKeyId() && applePrivateKey());

/** Which providers are live — the frontend shows a button only for these. */
export function providerStatus() {
  return { google: googleConfigured(), apple: appleConfigured() };
}

/** Is `provider` a real, configured provider we can start a flow for? */
export function isProvider(p) {
  return (p === "google" && googleConfigured()) || (p === "apple" && appleConfigured());
}

/* --------------------------------------------------------------- JWT helpers */
const b64u = (buf) => Buffer.from(buf).toString("base64url");

/** Decode a JWT payload WITHOUT verifying — safe only for tokens we fetched
 *  directly from the provider's token endpoint over TLS (see module header). */
function decodeJwtPayload(jwt) {
  const part = String(jwt || "").split(".")[1];
  if (!part) throw new Error("Malformed id_token");
  return JSON.parse(Buffer.from(part, "base64url").toString());
}

/** Sign an ES256 JWT (Apple's client_secret) with the .p8 private key. Node's
 *  `ieee-p1363` DSA encoding yields the raw R||S signature JOSE expects. */
function signES256(header, payload, pem) {
  const signingInput = `${b64u(JSON.stringify(header))}.${b64u(JSON.stringify(payload))}`;
  const key = createPrivateKey(pem);
  const sig = cryptoSign("sha256", Buffer.from(signingInput), { key, dsaEncoding: "ieee-p1363" });
  return `${signingInput}.${sig.toString("base64url")}`;
}

/* ------------------------------------------------------------ authorize URLs */
/** Build the provider consent URL to redirect the user to. */
export function authorizeUrl(provider, { redirectUri, state }) {
  if (provider === "google") {
    const p = new URLSearchParams({
      client_id: googleId(),
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
      access_type: "online",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${p.toString()}`;
  }
  if (provider === "apple") {
    const p = new URLSearchParams({
      client_id: appleServicesId(),
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "name email",
      state,
      // Apple returns the code as a POST form when any scope is requested.
      response_mode: "form_post",
    });
    return `https://appleid.apple.com/auth/authorize?${p.toString()}`;
  }
  throw new Error("Unknown provider");
}

/* ------------------------------------------------------------ code → profile */
/**
 * Exchange an authorization code for the user's verified profile.
 * Returns { provider, providerId, email, emailVerified, name }.
 */
export async function exchangeCode(provider, { code, redirectUri }) {
  if (provider === "google") {
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: googleId(),
        client_secret: googleSecret(),
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.id_token) throw new Error(j.error_description || j.error || "Google sign-in failed");
    const c = decodeJwtPayload(j.id_token);
    return {
      provider: "google",
      providerId: String(c.sub),
      email: String(c.email || "").trim().toLowerCase(),
      emailVerified: c.email_verified === true || c.email_verified === "true",
      name: String(c.name || "").trim(),
    };
  }
  if (provider === "apple") {
    const r = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: appleServicesId(),
        client_secret: appleClientSecret(),
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.id_token) throw new Error(j.error_description || j.error || "Apple sign-in failed");
    const c = decodeJwtPayload(j.id_token);
    return {
      provider: "apple",
      providerId: String(c.sub),
      email: String(c.email || "").trim().toLowerCase(),
      emailVerified: true, // Apple only returns verified emails
      name: "", // Apple sends the name once, in the callback form — not the id_token
    };
  }
  throw new Error("Unknown provider");
}

/** Apple's client_secret is itself a short-lived ES256 JWT signed by our key. */
function appleClientSecret() {
  const now = Math.floor(Date.now() / 1000);
  return signES256(
    { alg: "ES256", kid: appleKeyId(), typ: "JWT" },
    { iss: appleTeamId(), iat: now, exp: now + 3600, aud: "https://appleid.apple.com", sub: appleServicesId() },
    applePrivateKey(),
  );
}
