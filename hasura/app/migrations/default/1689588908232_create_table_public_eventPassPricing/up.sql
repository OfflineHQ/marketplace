CREATE TABLE "public"."eventPassPricing" ("eventPassId" Text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT gen_random_uuid(), "maxAmount" integer NOT NULL, "maxAmountPerUser" integer, "priceAmount" integer NOT NULL, "priceCurrency" text NOT NULL DEFAULT 'EUR', PRIMARY KEY ("id") , FOREIGN KEY ("priceCurrency") REFERENCES "public"."currency"("value") ON UPDATE no action ON DELETE no action);COMMENT ON TABLE "public"."eventPassPricing" IS E'The EventPassPricing table stores pricing information related to each Event Pass. It includes the price amount, the currency in which the price is denoted, and the maximum quantity that can be ordered both overall and per user. Each row in the table represents a unique combination of these attributes for a specific Event Pass. This table is key in managing the sales and availability of Event Passes.';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_eventPassPricing_updated_at"
BEFORE UPDATE ON "public"."eventPassPricing"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_eventPassPricing_updated_at" ON "public"."eventPassPricing"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
