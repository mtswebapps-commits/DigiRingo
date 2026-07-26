#!/usr/bin/env python3
"""Promote an already-uploaded bundle to a Play track (default: production).

Auth comes from the PLAY_SERVICE_ACCOUNT_JSON env var (the raw service-account
JSON, same secret the upload workflow uses). No file is uploaded here — this
only moves an EXISTING versionCode between tracks, so it never collides with a
previously-used code.

Env / inputs:
  PLAY_SERVICE_ACCOUNT_JSON  service-account key JSON (required)
  PACKAGE_NAME               app id (default com.digiringo.app)
  TRACK                      target track (default production)
  STATUS                     draft | inProgress | completed (default completed)
  VERSION_CODE               bundle to promote (default: highest uploaded)
  ROLLOUT_FRACTION           e.g. 0.1 for a 10% staged rollout (only with
                             STATUS=inProgress)
  RELEASE_NAME               release name shown in console (default = versionName)

Note: a brand-new app that has never had a live production release can only
create *draft* production releases via the API. The very first go-live must be
sent for review from the Play Console UI. After that, STATUS=completed works.
"""
import json
import os
import sys

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/androidpublisher"]


def main() -> int:
    raw = os.environ.get("PLAY_SERVICE_ACCOUNT_JSON")
    if not raw:
        print("PLAY_SERVICE_ACCOUNT_JSON not set", file=sys.stderr)
        return 2
    info = json.loads(raw)
    pkg = os.environ.get("PACKAGE_NAME", "com.digiringo.app")
    track = os.environ.get("TRACK", "production")
    status = os.environ.get("STATUS", "completed")
    version_code = os.environ.get("VERSION_CODE", "").strip()
    fraction = os.environ.get("ROLLOUT_FRACTION", "").strip()
    rel_name = os.environ.get("RELEASE_NAME", "").strip()

    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    svc = build("androidpublisher", "v3", credentials=creds, cache_discovery=False)

    edit = svc.edits().insert(packageName=pkg, body={}).execute()
    eid = edit["id"]
    try:
        # Pick the versionCode to promote: explicit input, else highest uploaded.
        bundles = svc.edits().bundles().list(packageName=pkg, editId=eid).execute()
        codes = sorted(int(b["versionCode"]) for b in bundles.get("bundles", []))
        if not codes:
            print("No uploaded bundles found — upload a build first.", file=sys.stderr)
            return 1
        vc = int(version_code) if version_code else codes[-1]
        if vc not in codes:
            print(f"versionCode {vc} not uploaded (have {codes})", file=sys.stderr)
            return 1

        release = {"status": status, "versionCodes": [str(vc)]}
        if rel_name:
            release["name"] = rel_name
        if status == "inProgress" and fraction:
            release["userFraction"] = float(fraction)

        svc.edits().tracks().update(
            packageName=pkg, editId=eid, track=track,
            body={"track": track, "releases": [release]},
        ).execute()
        svc.edits().commit(packageName=pkg, editId=eid).execute()
        print(f"OK: promoted versionCode {vc} to '{track}' as '{status}'"
              + (f" @ {fraction}" if fraction and status == "inProgress" else ""))
        return 0
    except HttpError as e:
        try:
            err = json.loads(e.content.decode()).get("error", {})
            print("Play API error:", json.dumps(err, indent=2), file=sys.stderr)
        except Exception:
            print("Play API error:", e, file=sys.stderr)
        try:
            svc.edits().delete(packageName=pkg, editId=eid).execute()
        except Exception:
            pass
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
