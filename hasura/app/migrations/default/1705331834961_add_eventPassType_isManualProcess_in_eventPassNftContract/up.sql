-- Step 1: Create eventPassType table
CREATE TABLE "public"."eventPassType" (
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);

-- Insert eventPassType values
INSERT INTO "public"."eventPassType"("value")
VALUES ('event_access'),
       ('redeemable');

COMMENT ON TABLE "public"."eventPassType" IS 'Defines the types of event passes.';

-- Add comments to describe each type in eventPassType
COMMENT ON COLUMN "public"."eventPassType"."value" IS 'Type name for event pass.';

COMMENT ON CONSTRAINT "eventPassType_pkey" ON "public"."eventPassType" IS 'event_access: Standard access to an event.
redeemable: A pass that is redeemable for services or goods.';

-- Step 2: Alter eventPassNftContract to include passType and isManualProcess
ALTER TABLE "public"."eventPassNftContract"
ADD COLUMN "passType" text NOT NULL DEFAULT 'event_access',
ADD COLUMN "isManualProcess" boolean NOT NULL DEFAULT false,
ADD FOREIGN KEY ("passType") REFERENCES "public"."eventPassType"("value");

COMMENT ON COLUMN "public"."eventPassNftContract"."passType" IS 'Type of the pass, referencing the eventPassType table.';
COMMENT ON COLUMN "public"."eventPassNftContract"."isManualProcess" IS 'Indicates if the pass is processed manually. True for manual processing, False otherwise.';
