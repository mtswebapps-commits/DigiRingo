---
title: How to Make One Number Ring Several Phones at Once
slug: ring-multiple-phones-one-number
category: Call Handling
excerpt: Simultaneous ring and ring-in-order explained, why basic forwarding only reaches one phone, and how to stop voicemail from stealing calls.
date: 2026-10-05
author: DIGIRINGO Team
---
A missed call is often a missed customer. If your business number only rings one phone, every call depends on that one phone being nearby, charged and not already in use. The obvious fix is to make the number ring more than one place: your laptop and your mobile, or you and a colleague.

There are two main ways to do this. **Simultaneous ring** rings every phone at the same moment, and whoever answers first takes the call. **Sequential ring**, sometimes called ring-in-order or hunt, tries one phone, then the next, then the next.

Both sound simple, but basic carrier forwarding can't really do either. This guide explains how the two approaches work, why ordinary forwarding falls short, how to keep voicemail from grabbing calls, and how to set it up.

> **Key takeaway:** Simultaneous ring is best when anyone can take the call. Ring-in-order is best when one person should answer first. Either way, you'll need an app or business phone system, because carrier forwarding only sends a call to one number at a time.

## Simultaneous ring vs ring-in-order

| | Simultaneous ring | Ring in order (sequential) |
|---|---|---|
| How it works | All phones ring at once | One phone at a time, in a set order |
| Who answers | Whoever picks up first | The first person available in the list |
| Caller's wait | Short | Longer, adds up per step |
| Best for | Small teams where anyone can help, one person with several devices | Owner answers first, staff as backup |
| Risk | Two people reach for the same call | Callers wait too long if the list is long |

**Simultaneous ring** works well for a single person with several devices, such as a laptop at the office and a phone in your pocket. It also suits a small team where any member can handle a call, like a two-person bakery taking orders.

**Ring in order** works well when there's a natural first responder. For instance, the owner of a small law practice wants to take calls herself but have them roll to her assistant if she's in a meeting.

Some systems combine both: ring one group simultaneously, then move on to a second group if nobody answers.

## Why basic forwarding only reaches one phone

Carrier call forwarding, set on your mobile or landline, redirects a call to **one** destination. You can't enter two numbers and have them both ring.

Workarounds people try, and their problems:

- **Chained forwarding.** Phone A forwards to Phone B when unanswered, which forwards to Phone C. It technically works, but each phone's own voicemail can interrupt the chain, and the caller may wait a long time.
- **Sharing one SIM or login.** Some people put the same account on several devices. This can be insecure, makes it hard to tell who handled what, and doesn't usually work with mobile SIMs at all.
- **Carrier add-ons.** Some carriers sell "simultaneous ring" or "number share" features for certain plans and devices. These can work but are usually limited to that carrier's own phones.

The more reliable approach is to let an internet-based phone app manage the call. Because the number lives in the app rather than on a single SIM, the app can ring several devices at once and decide what happens next.

## Ringing your devices and your cellphone

For a solo business owner, the most practical setup looks like this:

1. **Ring every device you're signed in on at once**: your laptop's browser, your Android phone, a tablet.
2. **If nobody answers in about 30 seconds, forward to your cellphone number**, in case you're away from Wi-Fi or the app isn't open.
3. **If that's not answered either**, send the caller to voicemail.

This combines simultaneous ring (all your devices) with a sequential step (your cellphone) and a final catch-all (voicemail).

For teams, the same logic applies with one more layer: ring a group of people, then move on to backups. This is often called a **ring group** or **hunt group**, and it's a standard feature of business phone systems built for teams.

## Avoiding voicemail grabbing the call

The most common problem with multi-phone ringing is a personal voicemail answering too early. Here's how it happens: your number forwards to a mobile, and that mobile's voicemail is set to pick up after 15 seconds. Even if another phone is still ringing, or another step was planned, the voicemail has already "answered" the call, so the system treats it as handled.

How to prevent it:

- **Lengthen the no-answer delay** on mobile phones in the chain, so their voicemail waits longer than your system's ring time. On many mobile networks you can set this with a carrier code, often up to around 30 seconds.
- **Put the forwarded cellphone last** in the chain, so if its voicemail does pick up, nothing else was skipped.
- **Use app-based ringing** wherever possible, because app devices don't have their own voicemail.
- **Test it**: call your number, let it ring out, and listen to which voicemail you reach.

## Choosing ring time per person

If you're using ring-in-order, the ring time for each step matters. Too short and people can't reach their phone. Too long and callers hang up.

| Role | Suggested ring time | Reason |
|---|---|---|
| Primary person or devices | 20 to 30 seconds | Enough time to reach a phone or laptop |
| Backup person | 15 to 20 seconds | They're expecting overflow calls |
| Final step before voicemail | 15 seconds | Keeps the total wait under a minute |

Aim to keep the total from first ring to voicemail under about 60 seconds. Many callers hang up before then if nobody answers.

## Setup walkthrough

The general steps are the same on most systems:

1. **List who and what should ring.** Your devices, team members, backup cellphones.
2. **Decide simultaneous or sequential.** Or a mix of both.
3. **Set ring times** for each step.
4. **Choose the final destination**, usually voicemail.
5. **Record a greeting** so callers know they reached the right place.
6. **Test from an outside phone**, letting each step ring out in turn.

If you also want to route different numbers to different places, such as a sales line versus a support line, see [call routing for small businesses](/blog/small-business-call-routing).

## How to do it with DIGIRINGO

DIGIRINGO gives a single user simultaneous ring with a cellphone fallback out of the box:

- **Every signed-in device rings at once.** Sign in on the web app and the Android app, and incoming calls ring all of them at the same time. Push notifications reach you even when the browser tab is in the background.
- **Cellphone fallback.** Add your cellphone number, and if nobody answers in the app within about 30 seconds, the call is forwarded to it.
- **Voicemail last.** When nobody answers, a voicemail is recorded.
- **Per-number routing.** Each number can instead forward straight to a phone, go to a SIP agent, or be sent to your own webhook, which lets developers build custom ringing logic.

Ring groups across several team members, with separate seats per person, are coming soon. iPhone users can use the DIGIRINGO web app in Safari today.

Get started at [digiringo.com/app](/app). A US local number is $2.50 a month and calls in the US and Canada are $0.015 a minute. See [pricing](/pricing) for more.

## Frequently asked questions

### Can call forwarding ring two phones at the same time?

Standard carrier forwarding can't. It only sends a call to one number. You need an app or business phone system for simultaneous ring.

### What happens if two people answer at once?

With simultaneous ring, the first person to answer gets the call and the other phones stop ringing.

### Is simultaneous ring or sequential ring better?

Simultaneous is better when anyone can help and speed matters. Sequential is better when one person should get first chance at every call.

### Why does my call keep going to my personal voicemail?

A phone in the chain has a voicemail that answers before the system moves on. Lengthen that phone's no-answer delay or put it last in the chain.

### Does DIGIRINGO support team ring groups?

Not yet. Today, all of one user's signed-in devices ring together with a cellphone fallback. Team ring groups are coming soon.
