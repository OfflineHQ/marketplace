-- Create lotteryStatus table
CREATE TABLE public."lotteryStatus"(
    value text NOT NULL
);

ALTER TABLE ONLY public."lotteryStatus"
    ADD CONSTRAINT "lotteryStatus_pkey" PRIMARY KEY (value);

INSERT INTO public."lotteryStatus"(value)
    VALUES ('DRAFT'),
('PUBLISHED');

-- Function to check if a sale is ongoing, handling nullable sale dates
CREATE OR REPLACE FUNCTION public.is_sale_ongoing(event_params public."eventParameters")
    RETURNS boolean
    AS $$
BEGIN
    IF event_params."dateSaleStart" IS NULL OR event_params."dateSaleEnd" IS NULL THEN
        RETURN FALSE;
        -- Return false if sale dates are not defined
    END IF;
    RETURN CURRENT_TIMESTAMP >= convert_to_local_to_utc(event_params."dateSaleStart", event_params."timezone")
        AND CURRENT_TIMESTAMP <= convert_to_local_to_utc(event_params."dateSaleEnd", event_params."timezone");
END;
$$
LANGUAGE plpgsql
STABLE;

-- Create lotteryParameters table
CREATE TABLE "public"."lotteryParameters"(
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "lotteryId" text NOT NULL UNIQUE,
    "activityWebhookId" text,
    "status" text DEFAULT 'DRAFT' REFERENCES "public"."lotteryStatus"("value") ON UPDATE NO action ON DELETE NO action,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "dateSaleStart" timestamp without time zone,
    "dateSaleEnd" timestamp without time zone,
    "timezone" text NOT NULL REFERENCES "public"."timezone"("value") ON UPDATE NO action ON DELETE NO action,
    "organizerId" text NOT NULL,
    "signingKey" text UNIQUE
);

-- Comments for lotteryParameters table
COMMENT ON TABLE "public"."lotteryParameters" IS E'The lotteryParameters model is designed to define properties on a lottery, including details like the lotteryId and activityWebhookId. It manages various timestamps and settings related to the lottery, ensuring efficient and accurate management of lottery events.';

COMMENT ON COLUMN "public"."lotteryParameters"."activityWebhookId" IS E'The "activityWebhookId" column stores the identifier for the Alchemy webhook that tracks NFT transfers related to the lottery.';

COMMENT ON COLUMN "public"."lotteryParameters"."dateSaleStart" IS E'Optional column for the start date and time for the lottery ticket sales, applicable if the lottery involves a sale.';

COMMENT ON COLUMN "public"."lotteryParameters"."dateSaleEnd" IS E'Optional column
for the end date and time for the lottery ticket sales, used when there is a defined sales period for the lottery.';

COMMENT ON COLUMN "public"."lotteryParameters"."timezone" IS E'The "timezone" column contains the timezone identifier for the lottery, ensuring accurate timing for events and sales across different regions.';

-- Create trigger for lotteryParameters
CREATE TRIGGER set_lotteryParameters_updated_at
    BEFORE UPDATE ON "public"."lotteryParameters"
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Functions for checking sales and event status
CREATE OR REPLACE FUNCTION public.is_lottery_sale_ongoing(lottery_params public."lotteryParameters")
    RETURNS boolean
    AS $$
BEGIN
    -- Handles cases where sale dates are not defined (e.g., airdrops)
    IF lottery_params."dateSaleStart" IS NULL OR lottery_params."dateSaleEnd" IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN CURRENT_TIMESTAMP >= convert_to_local_to_utc(lottery_params."dateSaleStart", lottery_params."timezone")
        AND CURRENT_TIMESTAMP <= convert_to_local_to_utc(lottery_params."dateSaleEnd", lottery_params."timezone");
END;
$$
LANGUAGE plpgsql
STABLE;

-- Create eventPassType table
CREATE TABLE "public"."eventPassType"(
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);

-- Insert eventPassType values
INSERT INTO "public"."eventPassType"("value")
    VALUES ('event_access'),
('redeemable');

COMMENT ON TABLE "public"."eventPassType" IS 'Defines the types of event passes.';

COMMENT ON COLUMN "public"."eventPassType"."value" IS 'Type name for event pass.';

COMMENT ON CONSTRAINT "eventPassType_pkey" ON "public"."eventPassType" IS 'event_access: Standard access to an event. redeemable: A pass that is redeemable for services or goods.';

-- Create eventPassValidationType table
CREATE TABLE "public"."eventPassValidationType"(
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);

-- Insert eventPassValidationType values
INSERT INTO "public"."eventPassValidationType"("value")
    VALUES ('external'),
('manual'),
('nft');

COMMENT ON TABLE "public"."eventPassValidationType" IS 'Defines the types of validation for event passes.';

COMMENT ON COLUMN "public"."eventPassValidationType"."value" IS 'Type name for event pass validation.';

COMMENT ON CONSTRAINT "eventPassValidationType_pkey" ON "public"."eventPassValidationType" IS 'external: Pass validation external to the platform. manual: Pass validation done manually. nft: Pass validation using our internal tool (Offline Pass).';

-- Alter eventPassNftContract to include new columns and constraints
ALTER TABLE "public"."eventPassNftContract"
    ADD COLUMN "passType" text NOT NULL DEFAULT 'event_access',
    ADD COLUMN "validationType" text NOT NULL DEFAULT 'external',
    ADD CONSTRAINT "eventPassId_unique" UNIQUE ("eventPassId"),
    ADD FOREIGN KEY ("passType") REFERENCES "public"."eventPassType"("value"),
    ADD FOREIGN KEY ("validationType") REFERENCES "public"."eventPassValidationType"("value");

COMMENT ON COLUMN "public"."eventPassNftContract"."passType" IS 'Type of the pass, referencing the eventPassType table.';

COMMENT ON COLUMN "public"."eventPassNftContract"."validationType" IS 'The method of validation for the event pass, referencing the eventPassValidationType table.';

-- Continue with previous alterations for packNftContract
ALTER TABLE "public"."packNftContract"
    ADD COLUMN "isAirdrop" boolean NOT NULL DEFAULT FALSE,
    ADD COLUMN "lotteryId" text NOT NULL,
    ADD CONSTRAINT "packId_unique" UNIQUE ("packId");

COMMENT ON TABLE "public"."packNftContract" IS 'Manages the NFTs associated with each pack, including details like contract address, chain ID, and the contents of each pack.';

COMMENT ON COLUMN "public"."packNftContract"."id" IS 'Unique identifier for each pack NFT contract.';

COMMENT ON COLUMN "public"."packNftContract"."chainId" IS 'Blockchain network identifier where the NFT contract resides.';

COMMENT ON COLUMN "public"."packNftContract"."contractAddress" IS 'Smart contract address for the NFT collection.';

COMMENT ON COLUMN "public"."packNftContract"."rewardsPerPack" IS 'Number of rewards (or items) contained within each pack.';

COMMENT ON COLUMN "public"."packNftContract"."organizerId" IS 'Identifier for the organizer responsible for the pack.';

COMMENT ON COLUMN "public"."packNftContract"."packId" IS 'Unique identifier for each pack, ensuring no duplicates in the system.';

COMMENT ON COLUMN "public"."packNftContract"."eventPassIds" IS 'JSONB array containing the IDs of event passes included in the pack.';

COMMENT ON COLUMN "public"."packNftContract"."isAirdrop" IS 'Indicates whether the pack is distributed through an airdrop. True for airdrops, False otherwise.';

COMMENT ON COLUMN "public"."packNftContract"."lotteryId" IS 'Identifier for the lottery associated with the pack.';

COMMENT ON CONSTRAINT "packId_unique" ON "public"."packNftContract" IS 'Ensures each packId is unique within the table.';

