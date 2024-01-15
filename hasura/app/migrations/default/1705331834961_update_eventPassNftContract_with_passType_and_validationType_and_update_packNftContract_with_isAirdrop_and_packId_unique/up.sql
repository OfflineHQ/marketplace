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

COMMENT ON CONSTRAINT "packId_unique" ON "public"."packNftContract" IS 'Ensures each packId is unique within the table.';

