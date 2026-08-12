package com.digiringo.app;

import android.Manifest;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioDeviceInfo;
import android.media.AudioManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {

    // Weak handle to the live activity so CallActionReceiver (notification Decline)
    // can reach the WebView and hang up the WebRTC leg when the process is alive.
    static WeakReference<MainActivity> INSTANCE = new WeakReference<>(null);

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        INSTANCE = new WeakReference<>(this);
        // Let the web app cancel the ringing full-screen notification once it takes
        // over the call (answered in-app / call became active).
        try {
            getBridge().getWebView().addJavascriptInterface(new NativeBridge(), "DigiNative");
        } catch (Exception ignored) { }
        // Ask for the softphone's runtime permissions UP FRONT (first launch), so the
        // mic prompt never appears mid-call — a prompt at answer time used to block
        // the WebRTC getUserMedia and the call would never connect.
        requestCallPermissions();
        handleCallIntent(getIntent());
    }

    /** Request microphone (+ notifications on Android 13+) once, at startup, so the
     *  user grants them before their first call instead of during it. */
    private void requestCallPermissions() {
        List<String> need = new ArrayList<>();
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            need.add(Manifest.permission.RECORD_AUDIO);
        }
        if (Build.VERSION.SDK_INT >= 33
                && ContextCompat.checkSelfPermission(this, "android.permission.POST_NOTIFICATIONS") != PackageManager.PERMISSION_GRANTED) {
            need.add("android.permission.POST_NOTIFICATIONS");
        }
        if (!need.isEmpty()) {
            ActivityCompat.requestPermissions(this, need.toArray(new String[0]), 7);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleCallIntent(intent);
    }

    // The in-app WebRTC UI shows the call while the app is on-screen, so tell the
    // messaging service to skip its notification then (avoids a double ring).
    @Override
    public void onResume() {
        super.onResume();
        INSTANCE = new WeakReference<>(this);
        CallMessagingService.appForeground = true;
    }

    @Override
    public void onPause() {
        super.onPause();
        CallMessagingService.appForeground = false;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (INSTANCE.get() == this) INSTANCE = new WeakReference<>(null);
    }

    /** Opened from an incoming-call notification: wake + show over the lock screen
     *  and tell the web app to display the call. ANSWER auto-accepts; the
     *  full-screen (INCOMING) launch just surfaces the ringing call screen. */
    private void handleCallIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        boolean answer = "com.digiringo.app.ANSWER".equals(action);
        boolean incoming = "com.digiringo.app.INCOMING".equals(action);
        if (!answer && !incoming) return;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
            // Dismiss the keyguard so the call UI is interactive over the lock screen.
            KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
            if (km != null) km.requestDismissKeyguard(this, null);
        }

        String caller = intent.getStringExtra("caller");
        injectCallAction(answer ? "answer" : "show", caller == null ? "" : caller);
    }

    /** Deliver a call action to the web layer, retrying until the JS bridge
     *  (window.__dgCallAction) exists — the WebView may still be booting on a cold
     *  start / lock-screen launch. */
    void injectCallAction(final String action, final String caller) {
        final WebView wv;
        try { wv = getBridge().getWebView(); } catch (Exception e) { return; }
        if (wv == null) return;
        deliver(wv, action, caller, 0);
    }

    private void deliver(final WebView wv, final String action, final String caller, final int attempt) {
        if (attempt > 40) return; // ~20s of retries while the app boots
        wv.evaluateJavascript("!!(window.__dgCallAction)", value -> {
            if ("true".equals(value)) {
                String safe = caller.replace("\\", "\\\\").replace("'", "\\'");
                wv.evaluateJavascript("window.__dgCallAction('" + action + "','" + safe + "')", null);
            } else {
                wv.postDelayed(() -> deliver(wv, action, caller, attempt + 1), 500);
            }
        });
    }

    /** Exposed to the web app as `window.DigiNative`. */
    public class NativeBridge {
        @JavascriptInterface
        public void clearCallNotification() {
            NotificationManagerCompat.from(MainActivity.this).cancel(CallMessagingService.CALL_NOTIF_ID);
        }

        // ---- In-call audio routing ----
        // The WebView's WebRTC audio defaults to the LOUDSPEAKER, and Chromium's
        // audio stack actively re-asserts the speaker during call setup. For a
        // phone call it should come out of the EARPIECE and only switch to speaker
        // when the user taps Speaker. We put AudioManager in COMMUNICATION mode and
        // use setCommunicationDevice() (the authoritative API on Android 12+) to
        // pin the route, RE-ASSERTING it for the first few seconds to beat
        // Chromium's flipping. setSpeakerphoneOn() is the fallback on older devices.

        private AudioManager am() {
            return (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        }

        private void applyRoute(final boolean speaker) {
            runOnUiThread(() -> { try {
                AudioManager a = am();
                if (a == null) return;
                if (a.getMode() != AudioManager.MODE_IN_COMMUNICATION) a.setMode(AudioManager.MODE_IN_COMMUNICATION);
                if (Build.VERSION.SDK_INT >= 31) {
                    int want = speaker ? AudioDeviceInfo.TYPE_BUILTIN_SPEAKER : AudioDeviceInfo.TYPE_BUILTIN_EARPIECE;
                    AudioDeviceInfo target = null;
                    for (AudioDeviceInfo d : a.getAvailableCommunicationDevices()) {
                        if (d.getType() == want) { target = d; break; }
                    }
                    if (target != null) a.setCommunicationDevice(target);
                } else {
                    a.setSpeakerphoneOn(speaker);
                }
            } catch (Exception ignored) {} });
        }

        /** Call started → route to the earpiece, and keep re-asserting it for a few
         *  seconds so Chromium's WebRTC audio setup can't leave it on the speaker. */
        @JavascriptInterface
        public void startCallAudio() {
            speakerWanted = false;
            applyRoute(false);
            if (audioEnforcer != null) audioHandler.removeCallbacks(audioEnforcer);
            final long end = System.currentTimeMillis() + 5000;
            audioEnforcer = new Runnable() {
                @Override public void run() {
                    applyRoute(speakerWanted);
                    if (System.currentTimeMillis() < end) audioHandler.postDelayed(this, 500);
                }
            };
            audioHandler.postDelayed(audioEnforcer, 400);
        }

        /** Toggle the loudspeaker during a call. */
        @JavascriptInterface
        public void setSpeaker(final boolean on) {
            speakerWanted = on;
            applyRoute(on);
        }

        /** Call ended → release the route and restore normal media audio. */
        @JavascriptInterface
        public void stopCallAudio() {
            if (audioEnforcer != null) audioHandler.removeCallbacks(audioEnforcer);
            runOnUiThread(() -> { try {
                AudioManager a = am();
                if (a == null) return;
                if (Build.VERSION.SDK_INT >= 31) a.clearCommunicationDevice(); else a.setSpeakerphoneOn(false);
                a.setMode(AudioManager.MODE_NORMAL);
            } catch (Exception ignored) {} });
        }
    }

    private final Handler audioHandler = new Handler(Looper.getMainLooper());
    private volatile boolean speakerWanted = false;
    private Runnable audioEnforcer;
}
