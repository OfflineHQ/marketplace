-- Create the kycStatus table to store the review statuses for KYC
CREATE TABLE "public"."kycStatus"(
  "value" text NOT NULL,
  PRIMARY KEY ("value")
);

COMMENT ON TABLE "public"."kycStatus" IS 'Statuses of Know Your Customer (KYC) processes.';

-- Insert default values into kycStatus
INSERT INTO "public"."kycStatus"("value")
  VALUES ('init'),
('pending'),
('prechecked'),
('queued'),
('completed'),
('onHold');

-- Comments for each KYC status
COMMENT ON COLUMN "public"."kycStatus"."value" IS 'Status value.';

COMMENT ON COLUMN "public"."kycStatus"."value" IS 'init: Initial registration has started. A client is still in the process of filling out the applicant profile. Not all required documents are currently uploaded.
pending: An applicant is ready to be processed.
prechecked: The check is in a half way of being finished.
queued: The checks have been started for the applicant.
completed: The check has been completed.
onHold: Applicant waits for a final decision from compliance officer or waits for all beneficiaries to pass KYC in case of company verification.';

-- Create the kycLevelName table to store the KYC levels
CREATE TABLE "public"."kycLevelName"(
  "value" text NOT NULL,
  PRIMARY KEY ("value")
);

COMMENT ON TABLE "public"."kycLevelName" IS 'KYC levels representing the level of verification for the applicant.';

-- Insert default values into kycLevelName
INSERT INTO "public"."kycLevelName"("value")
  VALUES ('basic_kyc_level'),
('advanced_kyc_level');

-- Comments for each KYC level
COMMENT ON COLUMN "public"."kycLevelName"."value" IS 'Level name for KYC verification.';

COMMENT ON COLUMN "public"."kycLevelName"."value" IS 'basic_kyc_level: Basic level of KYC verification.
advanced_kyc_level: Advanced level of KYC verification.';

-- Create the kyc table
CREATE TABLE "public"."kyc"(
  "applicantId" text,
  "externalUserId" uuid NOT NULL PRIMARY KEY REFERENCES "public"."account"("id"),
  "createDate" timestamptz NOT NULL,
  "reviewStatus" text REFERENCES "kycStatus"("value"),
  "levelName" text REFERENCES "kycLevelName"("value"),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Comments for each field in the kyc table
COMMENT ON COLUMN "public"."kyc"."applicantId" IS 'Unique identifier for the applicant provided by Sumsub.';

COMMENT ON COLUMN "public"."kyc"."externalUserId" IS 'UUID referencing the user ID in the existing accounts table.';

COMMENT ON COLUMN "public"."kyc"."createDate" IS 'The date and time when the applicant was created in Sumsub. Stored in UTC timestamp.';

COMMENT ON COLUMN "public"."kyc"."reviewStatus" IS 'Status of the applicant’s review in Sumsub, referring to kycStatus.';

COMMENT ON COLUMN "public"."kyc"."levelName" IS 'Level of KYC verification, referring to kycLevelName.';

COMMENT ON COLUMN "public"."kyc"."updated_at" IS 'Timestamp automatically updated whenever the kyc row changes.';

-- Create trigger for updating the updated_at field
CREATE TRIGGER set_public_kyc_updated_at
  BEFORE UPDATE ON "public"."kyc"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

COMMENT ON TRIGGER set_public_kyc_updated_at ON "public"."kyc" IS 'Trigger to set the value of the "updated_at" column to the current timestamp on row update';

-- Ensure unique constraint on externalUserId if needed
ALTER TABLE "public"."kyc"
  ADD CONSTRAINT "kyc_externalUserId_key" UNIQUE ("externalUserId");
