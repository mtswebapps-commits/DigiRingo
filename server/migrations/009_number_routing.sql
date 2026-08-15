-- DIGIRINGO — per-number incoming-call routing.
-- Lets a user point ONE number's inbound calls at their own destination instead
-- of ringing the in-app softphone:
--   route_kind: 'app' (default) | 'number' | 'sip' | 'webhook'
--   route_dest: the phone (E.164), SIP URI, or HTTPS TeXML webhook URL.
-- The server (auth-db.ensureRoutingColumns) also self-applies these at runtime,
-- so running this by hand is optional. Safe to re-run.
--
--   mysql -h 127.0.0.1 -u <DB_USER> -p <DB_NAME> < server/migrations/009_number_routing.sql

ALTER TABLE numbers ADD COLUMN route_kind VARCHAR(16)  NOT NULL DEFAULT 'app';
ALTER TABLE numbers ADD COLUMN route_dest VARCHAR(255) NOT NULL DEFAULT '';
