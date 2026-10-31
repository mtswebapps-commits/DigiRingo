---
title: "Call Routing for Small Businesses: Send Every Call to the Right Place"
slug: small-business-call-routing
category: Call Handling
excerpt: Call routing decides where each call goes: an app, a cellphone, a desk phone, voicemail or your own system. Here's how to plan it, with example setups for 1, 3 and 10-person teams.
date: 2026-10-23
author: DIGIRINGO Team
---
When a customer calls your business, something has to decide where that call goes. In a one-person business, the answer is usually "my phone." But as soon as you add a second number, a second person, a desk phone or a reason to treat after-hours calls differently, you need a plan.

That plan is called **call routing**. It's the set of rules that sends each incoming call to the right place: a person, a device, voicemail, or even your own software. Good routing means callers reach someone who can help quickly. Bad routing means rings that go nowhere, voicemail boxes nobody checks, and customers who give up.

This guide explains the main ways to route calls, when each makes sense, and gives example routing plans for teams of one, three and ten people.

> **Key takeaway:** Start with one simple rule per number: who or what should answer it. Add a fallback for unanswered calls, then layer in time-of-day or department rules only when you actually need them.

## What call routing is

Call routing is a set of decisions made the moment a call arrives. The phone system looks at things like:

- **Which number was dialled.** Sales line, support line, or a number for a specific city or campaign.
- **What time it is.** Open, closed, lunch, holiday.
- **Who is available.** Signed in, on another call, or offline.
- **What the caller chooses**, if there's a menu ("press 1 for sales").

Then it sends the call to a destination:

| Destination | What it is | Typical use |
|---|---|---|
| App | A phone app on your computer or phone | Day-to-day answering |
| Cellphone | Forwarding to a regular mobile number | Field staff, backup |
| Desk phone or SIP device | A physical IP phone or office phone system | Front desks, call centres |
| Voicemail | A recorded message | After hours, overflow |
| Webhook | Your own software decides | Custom logic, integrations, AI agents |

Most small businesses only need a few of these. The trick is matching them to how your business actually runs.

## Routing by time of day

Time-based routing sends calls to different places depending on the hour and day.

A typical setup:

- **Business hours:** ring the app or the front desk.
- **Lunch:** forward to whoever covers.
- **After hours:** voicemail with your opening hours, or an on-call phone for emergencies.
- **Holidays:** a holiday greeting and voicemail.

This is useful for businesses with clear opening hours, such as clinics, shops and offices. It's less important for solo service providers who answer whenever they can.

If your phone system doesn't have time-based rules, you can switch routing manually when you open and close. It's less elegant, but it works. For the basics of what happens when calls go unanswered, see [conditional call forwarding](/blog/conditional-call-forwarding).

## Routing by number (sales line vs support line)

One of the simplest and most effective ways to route is to use **separate numbers** for different purposes. Instead of one number and a menu, each number goes straight to the right place.

| Number | Published where | Routes to |
|---|---|---|
| Sales line | Website, ads, quote forms | Owner or sales person |
| Support line | Invoices, emails to existing customers | Support person or shared app |
| Local number for a second city | Local listings in that city | Same team, with that city's caller ID |
| Campaign number | One specific ad or flyer | Same team, so you can see which ad drives calls |

Advantages over a phone menu:

- **No "press 1" for the caller.** They reach the right person directly.
- **Easy to measure.** Calls to a campaign number tell you that campaign is working.
- **Different caller IDs.** You can call out from the number that matches the conversation.

Numbers are inexpensive, often a few dollars a month each, so splitting lines is affordable even for very small businesses. If you'd like a menu instead, see our guide to [phone menus for small businesses](/blog/small-business-phone-menu-ivr).

## Routing to a desk phone or SIP device

Some businesses still want a physical phone on the desk. Others already have an office phone system, also called a PBX, or a contact-centre tool. In both cases, calls can be routed over **SIP**, the standard protocol internet phones use to connect.

When SIP routing makes sense:

- **A front desk** where someone answers calls all day with a headset or handset.
- **An existing phone system** you want to keep, while using a new provider for numbers.
- **A third-party voice tool**, such as an AI voice agent or call-centre platform, that accepts SIP calls.

Setting it up typically involves entering the SIP address or credentials from the device or system into your provider's routing settings. Your IT person or the device maker's guide will have the details.

## Sending calls to your own system via webhook

A **webhook** route hands each incoming call to your own software. When a call arrives, the phone provider sends the call details, such as the caller's number and the number dialled, to a web address you control. Your system replies with instructions: ring this person, play this message, send to this agent, and so on.

This is a developer feature, but it opens up a lot:

- **Custom routing rules** based on your own customer database, such as routing VIP customers to a senior person.
- **Connecting your own voice agents or call flows.**
- **Logging calls** into your own tools.

If you don't have a developer, you probably don't need this yet. If you do, it's the most flexible routing option there is.

## Example routing plans for 1, 3 and 10-person teams

**Solo business (1 person)**

1. Business number rings the app on your laptop and phone at the same time.
2. If unanswered, forward to your cellphone.
3. If still unanswered, voicemail.

**Small team (3 people)**

| Number | Primary | Fallback | Final |
|---|---|---|---|
| Main line | Owner's app | Office manager's cellphone | Voicemail |
| Support line | Support person's cellphone | None | Voicemail |
| After hours | Voicemail | None | None |

**Growing business (10 people)**

- **Sales number** goes to a sales group or desk phones.
- **Support number** goes to a support group, then voicemail.
- **City-specific numbers** for each market route to the same teams.
- **After-hours** calls go to an on-call phone for urgent issues, otherwise voicemail.
- **A webhook or SIP route** connects calls into the company's existing phone system or tools.

Notice that even the ten-person plan follows the same basic pattern: one clear rule per number, a fallback, and a final catch-all.

## How to do it with DIGIRINGO

In DIGIRINGO, each number has its own route. You choose one of these per number:

- **Ring in the app.** The call rings the web app and Android app on every device you're signed in on, at the same time. If nobody answers in about 30 seconds, it can be forwarded to your cellphone, and calls nobody answers go to voicemail.
- **Forward to a phone.** Send the number's calls straight to any phone number.
- **Send to a SIP agent.** Route calls to a SIP device, phone system or voice agent.
- **Send to your own webhook.** Your system receives each call and returns call instructions (TeXML), so developers can build any routing logic they like.

Because routing is set per number, the "routing by number" approach works well: get a separate sales line, support line or city number, and point each one where it belongs. You choose the caller ID on outgoing calls, so you can call back from the matching number.

Not yet available, but coming soon: business-hours routing, phone menus (IVR), and ring groups across multiple team members. Until then, you can change a number's route when you open and close.

Get started at [digiringo.com/app](/app). US local numbers are $2.50 a month and calls in the US and Canada are $0.015 a minute. See [pricing](/pricing) for details, or ask our team about routing through live chat in the app.

## Frequently asked questions

### What is call routing?

It's the set of rules that decides where an incoming call goes, such as an app, a cellphone, a desk phone, voicemail or your own software.

### Do I need a phone menu to route calls?

No. Using separate numbers for sales and support often works better for small businesses, because callers reach the right place without pressing anything.

### What is a SIP route?

It sends calls over SIP, the standard internet calling protocol, to a desk phone, office phone system or voice agent.

### What does routing calls to a webhook mean?

Your own software receives each incoming call's details and tells the phone provider what to do with it. It's useful for custom logic and is usually set up by a developer.

### Can DIGIRINGO route calls differently after hours?

Not automatically yet. Business-hours routing is coming soon. For now, you can switch a number's route manually when you close.
