-- Add stampNftId column
ALTER TABLE "public"."nftTransfer"
ADD COLUMN "stampNftId" uuid;

-- Add stampAmount column
ALTER TABLE "public"."nftTransfer"
ADD COLUMN "stampAmount" integer;

-- Add foreign key constraint for stampNftId
ALTER TABLE "public"."nftTransfer"
ADD CONSTRAINT "fk_stampNftId"
FOREIGN KEY ("stampNftId") REFERENCES "public"."stampNft"("id");

-- Add comments for the new columns
COMMENT ON COLUMN "public"."nftTransfer"."stampNftId" IS 'References the specific stampNft associated with the NFT transfer. This field is populated if the transfer involves a stamp NFT.';
COMMENT ON COLUMN "public"."nftTransfer"."stampAmount" IS 'Specifies the quantity of the stamp NFT transferred. This field is only populated if the transfer involves a stamp NFT.';

-- Drop the existing check constraint (if it's named; replace 'your_constraint_name' with its actual name)
ALTER TABLE "public"."nftTransfer"
DROP CONSTRAINT "nftTransfer_check";

-- Add the updated check constraint
ALTER TABLE "public"."nftTransfer"
ADD CONSTRAINT "nftTransfer_check"
CHECK (
  ("eventPassId" IS NOT NULL AND "packId" IS NULL AND "packAmount" IS NULL AND "stampNftId" IS NULL AND "stampAmount" IS NULL) OR
  ("eventPassId" IS NULL AND "packId" IS NOT NULL AND "packAmount" >= 1 AND "stampNftId" IS NULL AND "stampAmount" IS NULL) OR
  ("stampNftId" IS NOT NULL AND "stampAmount" > 0 AND "eventPassId" IS NULL AND "packId" IS NULL AND "packAmount" IS NULL)
);

ALTER TABLE "public"."minterTemporaryWallet"
ADD COLUMN "campaignId" text,
ADD COLUMN "loyaltyCardId" text;

COMMENT ON COLUMN "public"."minterTemporaryWallet"."campaignId" IS 'Identifies the campaign associated with this temporary wallet for minting purposes. This text field corresponds to a campaign in the stampNftContract.';
COMMENT ON COLUMN "public"."minterTemporaryWallet"."loyaltyCardId" IS 'Identifies the loyalty card associated with this temporary wallet for minting purposes. This text field corresponds to a loyalty card in the loyaltyCardNftContract.';
