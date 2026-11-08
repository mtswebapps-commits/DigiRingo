#!/usr/bin/env python3
"""Rename the app on its Google Play store listing to "Digi Ringo".

Play search splits "digi ringo" into two words, and the old one-word title
"DIGIRINGO" matched neither, so the app never showed up for it.

For every language the listing has, this sets the title, rewrites the short
description and writes the name as "Digi Ringo" in the full description (the
first mention also keeps "DigiRingo", so searches typed as one word still match).

Env:
  PLAY_SERVICE_ACCOUNT_JSON  service-account key JSON (required)
  PACKAGE_NAME               app id (default com.digiringo.app)
  APPLY                      "true" to save; anything else only prints the change
"""
import json
import os
import sys

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/androidpublisher"]
TITLE = "Digi Ringo - Second Number"
SHORT = "Digi Ringo (DigiRingo): second phone number to call & text. No extra SIM."
LIMITS = {"title": 30, "shortDescription": 80, "fullDescription": 4000}


def rename(full: str) -> str:
    full = full.replace("WHY DIGIRINGO", "WHY DIGI RINGO")  # an all-caps heading stays all caps
    for old in ("DIGIRINGO", "DigiRingo", "Digiringo"):
        if old in full:
            full = full.replace(old, "Digi Ringo (DigiRingo)", 1)
            break
    for old in ("DIGIRINGO", "Digiringo"):
        full = full.replace(old, "Digi Ringo")
    return full


def main() -> int:
    raw = os.environ.get("PLAY_SERVICE_ACCOUNT_JSON")
    if not raw:
        print("PLAY_SERVICE_ACCOUNT_JSON not set", file=sys.stderr)
        return 2
    pkg = os.environ.get("PACKAGE_NAME", "com.digiringo.app")
    apply = os.environ.get("APPLY", "").lower() == "true"

    creds = service_account.Credentials.from_service_account_info(json.loads(raw), scopes=SCOPES)
    svc = build("androidpublisher", "v3", credentials=creds, cache_discovery=False)
    eid = svc.edits().insert(packageName=pkg, body={}).execute()["id"]
    try:
        listings = svc.edits().listings().list(packageName=pkg, editId=eid).execute().get("listings", [])
        if not listings:
            print("No store listings found.", file=sys.stderr)
            return 1
        for cur in listings:
            lang = cur["language"]
            new = {
                "language": lang,
                "title": TITLE,
                "shortDescription": SHORT,
                "fullDescription": rename(cur.get("fullDescription", "")),
            }
            if cur.get("video"):
                new["video"] = cur["video"]
            for field, limit in LIMITS.items():
                if len(new[field]) > limit:
                    print(f"{lang}: {field} is {len(new[field])} chars, Play allows {limit}", file=sys.stderr)
                    return 1
            print(f"=== {lang}")
            print(f"title: {cur.get('title')!r} -> {new['title']!r}")
            print(f"short: {cur.get('shortDescription')!r} -> {new['shortDescription']!r}")
            print("full (before):\n" + cur.get("fullDescription", ""))
            print("full (after):\n" + new["fullDescription"])
            if apply:
                svc.edits().listings().update(packageName=pkg, editId=eid, language=lang, body=new).execute()
        if not apply:
            svc.edits().delete(packageName=pkg, editId=eid).execute()
            print("DRY RUN: nothing saved. Run again with apply ticked to save.")
            return 0
        svc.edits().commit(packageName=pkg, editId=eid).execute()
        print(f"OK: listing updated for {len(listings)} language(s) and sent to Google for review")
        return 0
    except HttpError as e:
        try:
            print("Play API error:", json.dumps(json.loads(e.content.decode()).get("error", {}), indent=2), file=sys.stderr)
        except Exception:
            print("Play API error:", e, file=sys.stderr)
        try:
            svc.edits().delete(packageName=pkg, editId=eid).execute()
        except Exception:
            pass
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
