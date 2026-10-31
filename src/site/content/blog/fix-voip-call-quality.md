---
title: Fixing choppy, dropped or echoing internet calls
slug: fix-voip-call-quality
category: VoIP Basics
excerpt: A practical troubleshooting checklist for bad VoIP calls, ordered from the quickest fixes to the deeper ones: symptoms, connection tests, Wi-Fi, router settings and headsets.
date: 2026-09-08
author: DIGIRINGO Team
---
A bad internet call is frustrating in a very specific way. The customer sounds like a robot, or you hear yourself echo back, or they can hear you but you can't hear them. It's tempting to blame the phone service and switch, but most of the time the cause sits somewhere between your device and your router, and it can be fixed in a few minutes.

The trick is to work from the symptom backwards. Different problems point to different causes, and fixing the right one first saves a lot of guesswork.

This checklist is ordered from the easiest fixes to the harder ones. Start at the top and stop when the problem goes away.

> **Key takeaway:** Most VoIP quality problems come from the local network, not the phone service. Identify the symptom, test your connection for jitter and packet loss rather than just speed, move to a wired or stronger connection, disable SIP ALG on your router, and use a headset.

## Diagnose the symptom first

Each common problem has a usual suspect. Use this table to decide where to start.

| Symptom | What it sounds like | Most likely cause | First thing to try |
|---|---|---|---|
| Choppy or robotic audio | Words cut out or sound metallic | Packet loss or jitter | Move closer to the router or plug in a cable |
| Delay | You talk over each other | High latency | Stop large uploads, avoid VPNs |
| Echo | You hear your own voice a moment later | Speaker sound picked up by the mic | Use a headset, lower speaker volume |
| One-way audio | One side hears nothing | Router or firewall blocking audio | Disable SIP ALG, check firewall |
| Calls drop after a set time | Cut off at around the same point | Router timing out the connection | Update router, disable SIP ALG |
| Random drops | Calls end unexpectedly | Unstable connection or network switching | Stay on one network for the call |
| Static or buzzing | Constant noise | Faulty headset, cable, or Bluetooth issue | Try a different headset |

It also helps to note whether the problem happens on every call or only some. If it's only calls to one person, the issue may be on their side. If it's every call at certain times of day, look at what else is using your network then.

## Test your connection the right way

A standard speed test tells you how fast your connection is, but speed is rarely the problem for voice. A call only needs roughly 100 kilobits per second in each direction. What matters more is consistency.

When you test, look for these three measures (many speed test sites show them, sometimes under "advanced" or "details"):

- **Latency (ping):** how long data takes to make a round trip. Under about 150 ms one way is comfortable for a conversation.
- **Jitter:** how much latency varies from moment to moment. Under about 30 ms is the usual target.
- **Packet loss:** the share of data that never arrives. Even 1 to 2% can make voices choppy.

Run the test from the same device and the same spot you take calls from, at the time of day you usually have problems. A test at midnight from next to the router doesn't tell you much about your 10 a.m. calls from the back office.

Also check upload speed, not just download. Home connections often have much slower upload, and if someone is backing up files to the cloud, your outgoing voice can get squeezed.

## Wi-Fi vs mobile data vs wired

How your device connects matters more than almost anything else.

**Wired Ethernet** is the most reliable. If you take a lot of calls on a desktop or laptop, a cable to the router removes most Wi-Fi problems instantly.

**Wi-Fi** works well when the signal is strong, but it degrades through walls and floors, and it's shared with every other device nearby. A few tips:

- Use the 5 GHz band if your router offers it. It's usually less congested than 2.4 GHz, though it has shorter range.
- Move closer to the router, or add a mesh access point near where you take calls.
- Restart the router if it hasn't been restarted in a long time.
- Reduce competing traffic during calls: pause big downloads, cloud backups, and video streaming.

**Mobile data** (4G or 5G) can be very good when coverage is strong. The main risk is a phone switching between Wi-Fi and mobile data mid-call, for example as you walk out of the office. That handover can drop the call. If you know you're leaving, finish the call first or turn off Wi-Fi before you start.

**VPNs** route your traffic through another server, which adds latency. If your calls are delayed and you're on a VPN, try the call with the VPN off.

## Router settings that matter (QoS, SIP ALG)

If basic fixes don't help, two router settings are worth checking. You'll find them in your router's admin page, usually reached through a browser.

**SIP ALG.** Many consumer routers include a feature called SIP ALG (Application Layer Gateway) that tries to "help" VoIP traffic by rewriting it. In practice it often breaks calls, causing one-way audio, calls that won't connect, or calls that drop after a fixed time. Turning it off is one of the most common fixes in VoIP support. The setting may be under advanced, NAT, firewall, or WAN settings.

**QoS (Quality of Service).** QoS lets the router prioritize certain traffic. If your office shares one connection among many people, giving voice traffic priority stops downloads and streaming from crowding out calls. Some routers let you prioritize by device, which is the simplest approach: give your main calling computer or phone the highest priority.

**Firewall rules.** Business firewalls sometimes block the ports that carry call audio. If you have an IT person or managed network, ask them to allow your VoIP provider's traffic. Browser-based calling generally uses standard web technologies, which tend to pass through firewalls more easily than old desk-phone systems.

**Firmware.** Router updates often fix bugs that cause dropped connections. Check for updates in the admin page.

## Device and headset fixes

If the network checks out, look at the device.

- **Use a headset.** Echo is often caused by your speaker sound leaking back into your microphone. Even basic wired earbuds with a mic make a big difference.
- **Check the input device.** On a computer, make sure the browser or app is using the microphone you think it is. Laptops sometimes pick a webcam mic across the room.
- **Watch Bluetooth.** Bluetooth headsets can switch into a lower-quality mode for calls and can cut out when the battery is low or when you move away from the device. If audio sounds muffled or drops, try a wired headset.
- **Close heavy apps.** An overloaded computer can struggle to process audio smoothly. Close unnecessary tabs and programs.
- **Update the browser or app.** Calling features improve with updates, and old versions can have audio bugs.
- **Check permissions.** If the other person can't hear you at all, make sure the browser or app has microphone permission.

On phones, disable battery saver modes that restrict apps in the background, and make sure notifications are allowed so incoming calls ring reliably.

## When to contact your provider

Contact support when:

- The problem happens on every network you try, including a different Wi-Fi and mobile data.
- Calls fail to connect at all, or always to the same destination.
- Your connection tests are clean but quality is still poor.

Before you reach out, collect a few details: the time of the bad call, the number you called or that called you, what the problem sounded like, and the results of your connection test. That turns a vague "my calls are bad" into something support can actually trace.

If you're still deciding whether internet calling suits your business at all, our guide on [how VoIP calling works](/blog/how-voip-calling-works) explains where these problems come from in the first place.

## Getting clear calls with DIGIRINGO

DIGIRINGO calls run in your browser and in the Android app, so the tips above apply directly. A few features help when your network isn't perfect:

1. **Forwarding as a safety net.** Add your cellphone as a forwarding number. If a call isn't answered in the app within about 30 seconds, it's forwarded to your phone, which helps if your internet is struggling.
2. **Ring every device.** Incoming calls ring every device you're signed in on at the same time, so if your laptop's Wi-Fi is weak you can pick up on your phone instead.
3. **In-call controls.** Mute, hold, speaker and keypad are on screen, so you can mute while you move to a better spot.
4. **Call history.** Your call log shows when calls happened, which helps you spot patterns like problems at certain times of day.
5. **Live chat support.** If a problem persists, message us from inside the app with the details above, or use our [contact page](/contact).

New to DIGIRINGO? [Create an account](/app) and test a call from your browser. iPhone users can use the web app in Safari.

## Frequently asked questions

### Why do my VoIP calls sound robotic?

Robotic or choppy audio is usually caused by packet loss or jitter on your network. Moving closer to the router, using a cable, or pausing other heavy internet use typically fixes it.

### Why can the other person hear me but I can't hear them?

One-way audio is most often caused by a router feature called SIP ALG or a firewall blocking the audio stream. Disabling SIP ALG is the first thing to try.

### How do I stop echo on calls?

Use a headset so your speaker sound doesn't reach your microphone, and lower the speaker volume. If the echo only happens with one caller, it may be on their side.

### Does a faster internet plan fix call quality?

Not necessarily. Voice needs little bandwidth. Stability, low jitter and low packet loss matter more, so better Wi-Fi coverage or a wired connection often helps more than a faster plan.

### Why do calls drop when I leave the office?

Your phone is probably switching from Wi-Fi to mobile data mid-call. Finish the call before leaving, or start it on mobile data if you know you'll be on the move.
