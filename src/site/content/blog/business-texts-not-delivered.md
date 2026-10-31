---
title: Why your business texts aren't being delivered
slug: business-texts-not-delivered
category: Texting & 10DLC
excerpt: A step-by-step checklist for finding out why business texts fail: registration, carrier content filters, links, sending speed, recipient problems and reading delivery reports.
date: 2026-09-29
author: DIGIRINGO Team
---
You sent the appointment reminder. The app says it went out. The customer swears they never got it. Undelivered business texts are frustrating because the failure is often silent: no bounce, no error, just a message that disappears somewhere between your number and their phone.

There are only a handful of reasons texts fail, and most of them can be checked in a few minutes. Some are on your side (registration, wording, links, volume). Some are on the recipient's side (they opted out, blocked you, or it's a landline). And some are carrier filtering, which sits in between.

This checklist goes through each cause in the order you should check it, starting with the most common, and ends with how to read delivery reports so you can tell which problem you have.

> **Key takeaway:** Check in this order: is your number registered for business texting, does the message look like spam, does it contain a risky link, are you sending too fast, and can the recipient actually receive texts? Delivery receipts tell you which of these to look at.

## Check registration status first

For texts from a US local number, the most common cause of failure by far is missing or incomplete A2P 10DLC registration. US carriers now block or heavily filter business texts from unregistered local numbers.

Questions to ask:

- Is your brand registered and verified?
- Is your campaign approved, not just submitted?
- Is the specific number you're sending from assigned to that approved campaign?
- Does what you're sending match the campaign's use case? Promotions sent on a customer-care campaign can be filtered or get the campaign suspended.

If any answer is no, fix that first. Nothing else on this list matters until registration is complete. Our guides to [what A2P 10DLC is](/blog/what-is-a2p-10dlc) and [registering step by step](/blog/10dlc-registration-step-by-step) cover the process.

## Content that triggers carrier filters

Carriers scan message content for patterns common in spam and fraud. Legitimate messages can trip these filters if they look too similar.

| Content pattern | Why it's risky | Better approach |
|---|---|---|
| ALL CAPS or lots of !!! | Looks like spam | Write normally, one exclamation mark at most |
| "Free," "winner," "act now," "cash" | Classic spam words | Describe the offer plainly |
| No business name | Recipient and filters can't tell who you are | Start with your business name |
| Same message to many numbers at once | Bulk pattern | Personalize with a name or detail |
| Restricted topics | Loans, debt relief, cannabis, gambling and others face extra rules | Check your provider's content policy |
| Asking for passwords or card numbers | Looks like phishing | Never request sensitive data by text |
| Excessive emoji or symbols | Can look like spam, and forces a shorter encoding | Use them sparingly |

A good test: would this text look normal if your customer read it out loud to a friend? If it sounds like an ad from a stranger, filters may agree.

## Link shorteners and URLs

Links are one of the biggest delivery risks in business texting.

- **Avoid public link shorteners.** Free shortener domains are used heavily by spammers, so carriers treat them with suspicion. A message with one can be blocked even if your link is harmless.
- **Use your own domain.** A link like yourbusiness.com/book is trusted far more than a random short link.
- **Make sure the link works.** Broken links and redirects through several domains look suspicious.
- **Keep the destination consistent with your campaign.** If your registration says "appointment reminders," linking to an unrelated sales page is a red flag.
- **Limit links per message.** One link is plenty.

If you suddenly see failures after adding links, send the same message without the link to a test number. If it arrives, the link is the problem.

## Sending volume and speed

Carriers watch how fast and how much you send. Bursts of identical texts look like spam, and registered campaigns have throughput limits.

- **Respect your campaign's limits.** Lower registration tiers have per-minute and daily caps. Exceeding them can cause messages to queue or fail.
- **Spread out large sends.** Sending 500 reminders over an hour is safer than sending them in a minute.
- **Ramp up new numbers gradually.** A brand-new number that suddenly sends hundreds of messages can be flagged.
- **Watch your opt-out and complaint rates.** If many people reply STOP or report spam, carriers may filter your future messages.

## Recipient-side causes

Sometimes your message is fine and the problem is the number you're texting.

| Cause | What's happening | What to do |
|---|---|---|
| Opted out | They replied STOP earlier | Don't text them; ask them to reply START if they want to resubscribe |
| Blocked your number | They blocked you on their phone | Nothing to fix; call or email instead |
| Landline or non-text number | The number can't receive SMS | Call them, or ask for a mobile number |
| Typo in the number | Wrong digits | Confirm the number with the customer |
| Phone off or out of coverage | Message waits, then may expire | It may deliver later; try again or call |
| Carrier spam folder | Some phones file unknown senders separately | Ask the customer to check filtered or unknown messages |
| International number | Different rules and routes | Check that your number supports texting that country |

Landlines are a surprisingly common cause. Many customers give their home or office number on forms. If texts to one person always fail, a quick phone call usually clears it up.

## How to read delivery reports

Delivery receipts (also called delivery reports or DLRs) tell you how far a message got. The exact labels differ by provider, but they usually follow this pattern:

| Status | What it means | What to check |
|---|---|---|
| Queued / sending | Your provider has the message and is passing it on | Wait; if stuck, check volume limits |
| Sent | Handed to the carrier network | Not yet confirmed on the device |
| Delivered | The recipient's carrier confirmed delivery | Delivered to the network or phone; it reached them |
| Failed | The carrier rejected it | Registration, content, link or invalid number |
| Undelivered / expired | It couldn't reach the device in time | Phone off, out of coverage, or landline |

Look for patterns rather than single failures:

1. **All messages failing:** almost always registration or an account issue.
2. **Messages with links failing:** a link or domain problem.
3. **One campaign or message type failing:** content or use-case mismatch.
4. **One recipient always failing:** landline, block or opt-out.
5. **Failures at a certain time:** volume bursts during bulk sends.

Keep in mind that "delivered" generally means the recipient's carrier accepted it. A phone's own spam filter can still hide it from the inbox, so if a customer says they didn't see it, ask them to check filtered messages.

## Fixing delivery with DIGIRINGO

DIGIRINGO is built to make these checks straightforward:

- **Trust Center registration.** Register your A2P 10DLC brand and campaign inside the app, and see where your registration stands. Carrier approval typically takes 1 to 7 days.
- **Delivery receipts.** Each message in a thread shows its delivery status, so you can spot failures quickly.
- **Threaded conversations per number.** See the full history with each customer, including any STOP replies.
- **International texting** where the number supports SMS, with per-country rates shown in the app.
- **Live chat support** inside the app if you can't figure out why something is failing.

US and Canada SMS costs $0.015 per message. [Create an account](/app) to get a number and register.

## Frequently asked questions

### Why does my text say "sent" but the customer didn't get it?

"Sent" usually means your provider handed the message to the carrier, not that the phone received it. Wait for a delivered or failed status, and if it shows delivered, ask the customer to check their filtered or unknown-sender messages.

### Can I text from a US local number without 10DLC registration?

In practice, no. US carriers block or heavily filter business texts from unregistered local numbers, so register your brand and campaign before you start sending.

### Do link shorteners really cause blocked texts?

They often do. Public shortener domains are widely abused, so carriers treat them as risky. Using links on your own domain is much safer.

### Why do texts to one specific customer always fail?

The number is probably a landline, mistyped, blocked, or opted out. Call the customer to confirm a mobile number that can receive texts.

### Are emojis bad for delivery?

A few emojis are fine, but heavy use can look spammy, and any emoji switches the message to an encoding that holds fewer characters per segment. Use them sparingly in business texts.
