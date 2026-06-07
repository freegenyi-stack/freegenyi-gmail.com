-- Family model + child access (PIN / device pairing)
ALTER TABLE "children" ADD COLUMN IF NOT EXISTS "family_id" text;
ALTER TABLE "children" ADD COLUMN IF NOT EXISTS "access_pin_hash" text;

ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "family_id" text;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "token" text UNIQUE;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "expires_at" timestamp;

CREATE TABLE IF NOT EXISTS "child_device_pairings" (
  "id" serial PRIMARY KEY NOT NULL,
  "child_id" integer NOT NULL REFERENCES "children"("id") ON DELETE cascade,
  "device_token" text NOT NULL UNIQUE,
  "device_label" text,
  "last_used_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "child_pairing_codes" (
  "id" serial PRIMARY KEY NOT NULL,
  "child_id" integer NOT NULL REFERENCES "children"("id") ON DELETE cascade,
  "code" text NOT NULL UNIQUE,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
