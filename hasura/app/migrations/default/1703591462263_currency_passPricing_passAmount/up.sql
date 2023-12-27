-- currency table
CREATE TABLE "public"."currency"(
  "value" text NOT NULL,
  PRIMARY KEY ("value")
);

COMMENT ON TABLE "public"."currency" IS 'Currencies code following the standard ISO 4217 (https://en.wikipedia.org/wiki/ISO_4217)';

INSERT INTO public."currency"(value)
  VALUES ('EUR'),
('USD'),
('GBP'),
('CNY'),
('SGD'),
('QAR'),
('AED');

-- passPricing table
CREATE TABLE "public"."passPricing"(
  "eventPassId" text,
  "packId" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "amount" integer NOT NULL CHECK (amount >= 0),
  "currency" text NOT NULL DEFAULT 'EUR',
  PRIMARY KEY ("id"),
  FOREIGN KEY ("currency") REFERENCES "public"."currency"("value") ON UPDATE NO action ON DELETE NO action,
  CHECK (("eventPassId" IS NOT NULL AND "packId" IS NULL) OR ("eventPassId" IS NULL AND "packId" IS NOT NULL))
);

COMMENT ON TABLE "public"."passPricing" IS 'The passPricing table stores pricing information for an eventPass or Pack.';

CREATE TRIGGER set_passPricing_updated_at
  BEFORE UPDATE ON "public"."passPricing"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- passAmount table
CREATE TABLE "public"."passAmount"(
  "eventPassId" text,
  "packId" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "maxAmount" integer NOT NULL CHECK ("maxAmount" > 0),
  "maxAmountPerUser" integer CHECK ("maxAmountPerUser" IS NULL OR "maxAmountPerUser" > 0),
  "timeBeforeDelete" integer NOT NULL DEFAULT '14400',
  PRIMARY KEY ("id"),
  CHECK (("eventPassId" IS NOT NULL AND "packId" IS NULL) OR ("eventPassId" IS NULL AND "packId" IS NOT NULL))
);

CREATE UNIQUE INDEX idx_passamount_eventpassid ON "public"."passAmount"("eventPassId")
WHERE
  "eventPassId" IS NOT NULL;

CREATE UNIQUE INDEX idx_passamount_packid ON "public"."passAmount"("packId")
WHERE
  "packId" IS NOT NULL;

COMMENT ON TABLE "public"."passAmount" IS 'The passAmount table stores quantity information related to each eventPass or Pack';

