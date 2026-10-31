---
title: How VoIP calling works, explained without the jargon
slug: how-voip-calling-works
category: VoIP Basics
excerpt: Follow a single internet phone call from the moment you tap "call" to the moment it rings, and learn what that means for quality, reliability and cost.
date: 2026-08-12
author: DIGIRINGO Team
---
VoIP gets explained with a lot of acronyms: SIP, RTP, codecs, jitter buffers. You don't need any of them to decide whether internet calling is right for your business. What helps is a clear picture of what actually happens during a call, because once you can see the path, it's obvious why VoIP is cheaper, where problems come from, and how to avoid them.

So instead of definitions, this guide follows one ordinary call. You are at your desk, a customer's number is on the screen, and you tap call. Here is everything that happens next.

> **Key takeaway:** VoIP turns your voice into small packets of data, sends them over the internet to a provider, and the provider connects them to the regular phone network. Because the internet does most of the work, calls cost a fraction of a traditional line, and quality depends mostly on your connection.

## Your voice as data packets

When you speak into your laptop microphone or phone, the app samples the sound thousands of times per second and turns it into numbers. A piece of software called a codec compresses those numbers so they take up far less space, then chops the result into tiny packets. Each packet holds about 20 milliseconds of sound.

That means a one-minute conversation is a stream of roughly 3,000 packets in each direction. Each packet is labeled with where it came from, where it's going, and its position in the sequence, so the other end can put them back in order.

On the receiving end, the process runs backwards. Packets arrive, get lined up in the right order in a small waiting area (the jitter buffer), get decompressed, and play through the speaker. All of this happens fast enough that it feels like a normal conversation.

Modern codecs are efficient. A typical voice call uses somewhere around 30 to 100 kilobits per second in each direction, depending on the codec. That's a tiny fraction of what a video stream uses.

## What the provider does in the middle

Your packets don't travel straight to your customer's phone. They first go to your VoIP provider, which does three jobs:

1. **Signaling.** Before any audio flows, the app and provider exchange messages that set up the call: who is calling, which number to show as caller ID, and which number to reach. This is similar to dialing on an old phone, just digital.
2. **Bridging to the phone network.** Your customer probably has an ordinary mobile phone. The provider hands your call over to the public phone network through carrier connections, so the call reaches any phone in the world.
3. **Routing incoming calls.** When someone calls your number, the provider decides where the call should go based on your settings: ring your apps, forward to a cellphone, or go to voicemail.

The provider also handles things like caller ID authentication. In the US and Canada, carriers use a framework called STIR/SHAKEN to digitally sign calls so the receiving network can tell the caller ID hasn't been faked. A legitimate provider takes care of this on your behalf.

## What you need: internet speed, device, app

The equipment list is short:

- **An internet connection.** Speed matters less than stability. A connection with steady low latency beats a fast connection that stutters.
- **A device.** A laptop or desktop with a browser, or a smartphone. No special hardware required.
- **A headset (recommended).** Built-in laptop speakers and microphones work, but a basic wired or Bluetooth headset reduces echo and background noise a lot.
- **The provider's app or web app.** This is where you dial, answer, and see your call history.

Here are the network numbers that matter, in plain terms:

| What it measures | Plain meaning | Good target |
|---|---|---|
| Bandwidth | How much data per second your connection can carry | At least 100 kbps up and down per call |
| Latency | How long a packet takes to arrive | Under about 150 ms one way |
| Jitter | How uneven the arrival times are | Under about 30 ms |
| Packet loss | Share of packets that never arrive | Under 1% |

Almost any home or office broadband plan meets the bandwidth target easily. Latency, jitter and packet loss are where real-world problems come from, and those are mostly about Wi-Fi quality and what else is using your network.

## Why VoIP is cheaper than a phone line

A traditional business landline requires the phone company to maintain a dedicated physical circuit to your building, plus switching equipment in a local exchange. You pay for that infrastructure every month whether you make calls or not.

VoIP rides on an internet connection you already pay for. The provider only needs to carry your call across the internet to its network and then hand it to the phone network at the nearest sensible point. That leaves far fewer expensive pieces in the chain.

The result shows up in the bill. Instead of a fixed line rental plus long-distance charges, VoIP is typically priced as a small monthly fee per number plus a per-minute rate. International calls in particular get much cheaper, because the long-haul part of the trip travels over the internet. We break down a full phone bill in [how much a business phone line really costs per month](/blog/business-phone-line-cost).

## Where things can go wrong (and how they're fixed)

Because VoIP depends on your internet connection, call problems usually trace back to the network rather than the phone service itself. The common symptoms each have a common cause:

- **Robotic or choppy audio** usually means packet loss or jitter, often from weak Wi-Fi or a busy connection.
- **Delay and people talking over each other** points to high latency.
- **Echo** is often caused by speakers feeding back into the microphone. A headset usually fixes it.
- **One-way audio**, where you can hear them but they can't hear you, is frequently caused by a router feature called SIP ALG or a strict firewall.
- **Dropped calls** often happen when a phone switches between Wi-Fi and mobile data mid-call, or when a connection briefly cuts out.

Most of these are fixed by moving closer to the router, using a wired connection, pausing big downloads, or changing one router setting. Our troubleshooting checklist on [fixing choppy, dropped or echoing internet calls](/blog/fix-voip-call-quality) walks through them in order.

Providers also build in resilience on their side. Calls that aren't answered on the app can be forwarded to a regular cellphone, which means a flaky office connection doesn't have to cost you the call.

## Is VoIP right for a small business?

For most small businesses, yes. The trade-off is simple: you give up the old landline's independence from the internet, and in exchange you get lower costs, the ability to answer from anywhere, and features that used to require expensive equipment.

VoIP is a strong fit if:

- Your team works from more than one place, or moves around during the day.
- You want a business number separate from personal cellphones.
- You call or receive calls from other countries.
- You want to pay for usage rather than fixed line rentals.

It's a weaker fit if your location has no reliable internet at all and no mobile data coverage, or if you have equipment like an old alarm panel or fax machine that specifically needs an analog line. In those cases, some businesses keep one landline for that equipment and move everything else to VoIP.
## How to make VoIP calls with DIGIRINGO

DIGIRINGO is a VoIP phone service that runs in your browser and in an Android app, so you can try everything above without buying hardware.

1. **Sign up** at [digiringo.com/app](/app). On Android, install the app from Google Play. iPhone users can use the web app in Safari.
2. **Add funds** to your prepaid wallet with a $5, $10, $20 or $50 card top-up. There are no contracts or per-user fees.
3. **Choose a number.** US and Canadian local numbers, toll-free numbers, and numbers in many other countries are available.
4. **Place a call.** Dial from the keypad in the web app or the Android app, and pick which of your numbers to show as caller ID. During the call you have mute, hold, speaker, and a keypad for menus that ask you to press a number.
5. **Receive calls everywhere.** Incoming calls ring every device you are signed in on at the same time, and push notifications reach you even if the browser tab is in the background.
6. **Add a safety net.** Turn on forwarding to your cellphone so any call not answered in the app within about 30 seconds goes to your phone instead.

Calls within the US and Canada cost $0.015 per minute, and international calls to 220+ countries are priced per country in the [rate list](/rates).

## Frequently asked questions

### Does VoIP use a lot of data?

No. A voice call typically uses between about 30 and 100 kilobits per second in each direction, which works out to well under one megabyte per minute for most codecs. Video calls use many times more.

### Can I use VoIP on mobile data instead of Wi-Fi?

Yes. A stable 4G or 5G connection usually handles calls well. Just be aware that moving between Wi-Fi and mobile data in the middle of a call can cause a short drop.

### Is VoIP call quality as good as a regular phone?

On a stable connection, it is usually as good or better. Most quality complaints come from weak Wi-Fi, a congested network, or router settings, all of which can be fixed.

### What happens to my calls if my internet goes down?

Calls in the app won't connect without internet. With DIGIRINGO you can forward unanswered calls to your cellphone, so callers still reach you over the mobile network.

### Can people tell I'm calling over the internet?

Not usually. They see your business number as caller ID and hear a normal call. The internet part of the journey is invisible to them.
