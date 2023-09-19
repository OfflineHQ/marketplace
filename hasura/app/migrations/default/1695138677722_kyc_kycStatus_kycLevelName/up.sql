
-- Create the kycStatus table to store the review statuses for KYC
CREATE TABLE "public"."kycStatus" (
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);
COMMENT ON TABLE "public"."kycStatus" IS 'Statuses of Know Your Customer (KYC) processes.';

-- Insert default values into kycStatus
INSERT INTO "public"."kycStatus" ("value") VALUES 
('init'), 
('pending'), 
('prechecked'), 
('queued'), 
('completed'), 
('onHold');

-- Add comments to describe each status in kycStatus
COMMENT ON COLUMN "public"."kycStatus"."value" IS 'Status value.';
COMMENT ON CONSTRAINT "kycStatus_pkey" ON "public"."kycStatus" IS 'init: Initial registration has started. A client is still in the process of filling out the applicant profile. Not all required documents are currently uploaded.
pending: An applicant is ready to be processed.
prechecked: The check is in a half way of being finished.
queued: The checks have been started for the applicant.
completed: The check has been completed.
onHold: Applicant waits for a final decision from compliance officer (manual check was initiated) or waits for all beneficiaries to pass KYC in case of company verification.';

-- Create the kycLevelName table to store the KYC levels
CREATE TABLE "public"."kycLevelName" (
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);
COMMENT ON TABLE "public"."kycLevelName" IS 'KYC levels representing the level of verification for the applicant.';

-- Insert default values into kycLevelName
INSERT INTO "public"."kycLevelName" ("value") VALUES 
('basic_kyc_level'), 
('advanced_kyc_level');

-- Add comments to describe each level in kycLevelName
COMMENT ON COLUMN "public"."kycLevelName"."value" IS 'Level name for KYC verification.';
COMMENT ON CONSTRAINT "kycLevelName_pkey" ON "public"."kycLevelName" IS 'basic_kyc_level: Basic level of KYC verification.
advanced_kyc_level: Advanced level of KYC verification.';

-- Create the kyc table
CREATE TABLE "public"."kyc" (
    "applicantId" text NOT NULL,
    "externalUserId" uuid NOT NULL,
    "createDate" timestamptz NOT NULL,
    "reviewStatus" text REFERENCES "kycStatus"("value"),
    "levelName" text REFERENCES "kycLevelName"("value"),
    "updated_at" timestamptz DEFAULT current_timestamp,
    PRIMARY KEY ("applicantId")
);

-- Add comments to describe each field in the kyc table
COMMENT ON COLUMN "public"."kyc"."applicantId" IS 'Unique identifier for the applicant provided by Sumsub.';
COMMENT ON COLUMN "public"."kyc"."externalUserId" IS 'UUID referencing to the user ID in the existing accounts table.';
COMMENT ON COLUMN "public"."kyc"."createDate" IS 'The date and time when the applicant was created in Sumsub. Stored in UTC timestamp.';
COMMENT ON COLUMN "public"."kyc"."reviewStatus" IS 'Status of the applicant’s review in Sumsub, which refers to kycStatus.';
COMMENT ON COLUMN "public"."kyc"."levelName" IS 'Level of KYC verification, which refers to kycLevelName.';
COMMENT ON COLUMN "public"."kyc"."updated_at" IS 'Timestamp automatically updated whenever the kyc row changes.';

-- Create trigger for updating the updated_at field
CREATE TRIGGER set_public_kyc_updated_at BEFORE UPDATE ON "public"."kyc" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_kyc_updated_at ON "public"."kyc" IS 'trigger to set value of column "updated_at" to current timestamp on row update';

BEGIN TRANSACTION;
ALTER TABLE "public"."kyc" DROP CONSTRAINT "kyc_pkey";

ALTER TABLE "public"."kyc"
    ADD CONSTRAINT "kyc_pkey" PRIMARY KEY ("externalUserId");
COMMIT TRANSACTION;

alter table "public"."kyc" add constraint "kyc_externalUserId_key" unique ("externalUserId");
