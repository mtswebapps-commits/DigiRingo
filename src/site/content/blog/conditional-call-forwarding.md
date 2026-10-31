---
title: "Conditional Call Forwarding: When Busy, Unanswered or After Hours"
slug: conditional-call-forwarding
category: Call Handling
excerpt: Conditional forwarding sends calls elsewhere only when you can't answer. Here's how each condition works, how long to wait, and how to build a simple fallback chain.
date: 2026-09-25
author: DIGIRINGO Team
---
Forwarding every call to another phone is easy. The harder and more useful question is what should happen when you *can't* answer. Maybe you're on another call, driving, at a job site with no signal, or it's 9 p.m. and you've closed for the day.

That's what conditional call forwarding is for. Instead of redirecting every call, it only kicks in under specific conditions: when your line is busy, when nobody picks up, when your phone is off or out of coverage, or, with business systems, outside working hours.

Used well, conditional forwarding means your phone rings first, and only the calls you'd otherwise miss go somewhere else. This guide explains each condition with small-business examples, how long to let a phone ring, and how to combine rules into a fallback chain that catches nearly every call.

> **Key takeaway:** Let your primary device ring first, then forward unanswered calls to a backup after roughly 20 to 30 seconds. Keep the chain short: one or two fallbacks, then voicemail.

## Unconditional vs conditional forwarding

**Unconditional forwarding** sends every call straight to another number. Your original phone never rings. It's useful when you'll be completely unavailable, like on holiday, or when you've moved to a new phone and want the old number to point to it.

**Conditional forwarding** only forwards a call if something specific happens first. Your phone still gets its chance to ring.

| Type | Your phone rings? | Typical use |
|---|---|---|
| Unconditional (always) | No | Holidays, moving lines, full handover |
| When busy | Only if you're free | You take back-to-back calls |
| When not answered | Yes, for a set time | Day-to-day backup |
| When unreachable | Only if your phone is on and in coverage | Field work, travel, dead batteries |
| Time-based | Depends on the schedule | Business hours vs after hours |

Mobile carriers usually support the busy, unanswered and unreachable conditions. Time-based rules normally need a business phone system. For the basics of setting up forwarding on any device, see [how to forward business calls](/blog/how-to-forward-business-calls).

## Forward when busy

This condition forwards a call if you're already on the phone.

**Example:** a two-person landscaping company where the owner takes quote calls. If she's on a call when another comes in, the second caller is forwarded to her business partner's phone instead of getting a busy signal or voicemail.

Things to keep in mind:

- If you have **call waiting** turned on, your line may never register as busy, because the second call just beeps through. You may need to turn call waiting off for "busy" forwarding to work.
- Busy forwarding is most valuable when the person you forward to can actually help, not just take a message.
- Many business apps handle multiple simultaneous calls differently from mobile carriers, so check how yours behaves.

## Forward when not answered (and how long to wait)

This is the most common and useful condition. Your phone rings for a set time, and if you don't pick up, the call moves on.

**Example:** a solo electrician who's often on a ladder. Calls ring his business app first. If he doesn't answer, they forward to his office manager's phone.

How long should it ring? A typical ring cycle is around 5 to 6 seconds, so:

| Wait time | About how many rings | Good for |
|---|---|---|
| 10 to 15 seconds | 2 to 3 rings | When the backup should take most calls |
| 20 to 30 seconds | 4 to 5 rings | Balanced: you get a fair chance to answer |
| 30+ seconds | 6 or more rings | You usually answer but are slow to reach the phone |

Watch out for one trap: the destination phone's own voicemail. If you forward to a mobile number and that phone also doesn't answer, its voicemail will pick up, and the caller ends up in someone's personal mailbox. Either make sure the backup person will answer, or keep the forwarding chain short so business voicemail can catch the call.

On many mobile carriers you can set the no-answer delay using codes, often in 5-second steps up to around 30 seconds. Check your carrier's instructions.

## Forward when unreachable

This forwards calls when your phone is switched off, out of battery, or has no signal.

**Example:** a property manager who often visits basements and rural properties without coverage. When her phone can't be reached, calls go to the office line.

Notes:

- On mobile networks, "unreachable" usually triggers instantly, since the network already knows your phone isn't connected.
- It's a great safety net, but it doesn't help if your phone is on and just not being answered. Combine it with "not answered."
- With an internet-based phone app, "unreachable" means no device is online. If your app is signed in on several devices, the call still rings the ones that are connected.

## Time-based rules for business hours

Time-based forwarding routes calls differently depending on the time and day.

**Example:** a dental office sends calls to the front desk from 8 a.m. to 5 p.m. After hours, calls go to an on-call phone or straight to voicemail with a message about emergency care.

Typical time-based setups:

- **During hours:** ring the office or the app.
- **Lunch break:** forward to a colleague's phone.
- **Evenings and weekends:** voicemail, or an on-call number for urgent issues.
- **Holidays:** a special greeting and voicemail.

Standard mobile carriers don't usually offer time-based forwarding. It's a feature of business phone systems. If yours doesn't have it, you can get close manually: switch forwarding on when you close and off when you open, or set a calendar reminder to do it.

## Building a simple fallback chain

The goal is to catch every call without bouncing callers around for minutes. A good chain is short and predictable.

1. **Primary:** ring your main device or app, around 20 to 30 seconds.
2. **Backup:** forward to a cellphone or a colleague.
3. **Final:** business voicemail with a clear greeting and a promise to call back.

| Business | Primary | Backup | Final |
|---|---|---|---|
| Solo freelancer | App on laptop and phone | Personal cellphone | Voicemail |
| Two-person trade business | Owner's app | Partner's cellphone | Voicemail |
| Small office | Front desk app | Manager's cellphone | Voicemail |

Tips:

- **Keep total wait under a minute.** Most callers won't wait longer than that before hanging up.
- **Test the whole chain** by calling your own number from another phone and not answering at each step.
- **Call voicemails back quickly.** A fallback chain only helps if messages are returned the same day.
- **Use a short greeting.** Tell callers who they've reached and when to expect a reply. See [business voicemail greeting examples](/blog/business-voicemail-greeting-examples) for scripts.

## How to do it with DIGIRINGO

DIGIRINGO builds the most useful fallback chain into each number:

1. **Ring every device first.** Incoming calls ring the DIGIRINGO web app and Android app on every device you're signed in on, at the same time, with push notifications even when the browser tab is in the background.
2. **Forward when not answered.** Add your cellphone, and if the app isn't answered within about 30 seconds, DIGIRINGO forwards the call to it.
3. **Voicemail at the end.** If nobody answers, a voicemail is recorded.
4. **Pick a route per number.** You can also send a number's calls straight to a phone (like unconditional forwarding), to a SIP agent, or to your own webhook.

Business-hours routing, where calls route differently by time of day, is coming soon to DIGIRINGO. Until then, you can switch a number's route between "ring the app" and "forward to phone" when you open and close.

You can [sign up](/app) in a few minutes, with no contract or seat fees. A US number is $2.50 a month and US and Canada calls are $0.015 a minute. Details are on our [pricing page](/pricing).

## Frequently asked questions

### What's the difference between conditional and unconditional forwarding?

Unconditional forwarding sends every call elsewhere without ringing your phone. Conditional forwarding only kicks in when you're busy, don't answer or can't be reached.

### How many seconds should my phone ring before forwarding?

Around 20 to 30 seconds suits most businesses. That's four or five rings, enough to reach your phone without making callers wait too long.

### Why does my forwarded call end up in someone's personal voicemail?

The backup phone didn't answer, so its own voicemail picked up. Make sure the backup person will answer, or forward to a service that controls its own voicemail.

### Can my mobile carrier do time-based forwarding?

Usually not. Time-based rules are a business phone system feature. You can toggle forwarding manually as a workaround.

### Does DIGIRINGO support business-hours routing?

Not yet. It's coming soon. Today you can ring the app first, forward unanswered calls to your cellphone, and fall back to voicemail.
