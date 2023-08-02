CREATE TABLE "public"."eventPassPendingOrder" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "eventPassId" text NOT NULL,
  "accountId" uuid NOT NULL,
  "quantity" integer NOT NULL CHECK (quantity > 0),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  UNIQUE ("eventPassId", "accountId")
);
COMMENT ON TABLE "public"."eventPassPendingOrder" IS 
  E'Pending Order with as quantity for Event Pass (linked to Hygraph model EventPass) and associated to an Account. 
  Those orders are time bound and are automatically destroyed given an amount of time to preserve access to the event for other users.';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
