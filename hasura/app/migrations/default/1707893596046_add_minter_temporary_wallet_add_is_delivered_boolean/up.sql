-- Create minterTemporaryWallet table
CREATE TABLE "public"."minterTemporaryWallet"(
  "address" text NOT NULL,
  "privateKey" text NOT NULL,
  "eventPassId" text,
  "packId" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("address")
);

COMMENT ON TABLE "public"."minterTemporaryWallet" IS E'Temporary wallet information for minters, including optional links to event passes and packs.';

COMMENT ON COLUMN "public"."minterTemporaryWallet"."address" IS E'The blockchain address of the temporary wallet.';
COMMENT ON COLUMN "public"."minterTemporaryWallet"."privateKey" IS E'The private key for the temporary wallet, necessary for signing transactions.';
COMMENT ON COLUMN "public"."minterTemporaryWallet"."eventPassId" IS E'Optional identifier for an event pass associated with this wallet.';
COMMENT ON COLUMN "public"."minterTemporaryWallet"."packId" IS E'Optional identifier for a pack associated with this wallet.';
COMMENT ON COLUMN "public"."minterTemporaryWallet"."createdAt" IS E'The timestamp when the temporary wallet was created.';

-- Add isDelivered column to packNftSupply table
ALTER TABLE "public"."packNftSupply"
ADD COLUMN "isDelivered" boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN "public"."packNftSupply"."isDelivered" IS E'Indicates whether the pack NFT has been delivered to the owner.';

-- Add isDelivered column to eventPassNft table
ALTER TABLE "public"."eventPassNft"
ADD COLUMN "isDelivered" boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN "public"."eventPassNft"."isDelivered" IS E'Indicates whether the event pass NFT has been delivered to the owner.';

-- Function for minterTemporaryWallet table to ensure address is lowercase
CREATE OR REPLACE FUNCTION force_lowercase_minterTemporaryWallet() RETURNS TRIGGER AS $$
BEGIN
    NEW."address" := LOWER(NEW."address");
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT and UPDATE on minterTemporaryWallet to apply lowercase function
CREATE TRIGGER minterTemporaryWallet_before_insert_or_update
BEFORE INSERT OR UPDATE ON "minterTemporaryWallet"
FOR EACH ROW EXECUTE FUNCTION force_lowercase_minterTemporaryWallet();
