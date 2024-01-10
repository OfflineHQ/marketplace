-- Create packNftSupply table
CREATE TABLE "public"."packNftSupply" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "contractAddress" text NOT NULL,
  "error" text,
  "tokenUri" text,
  "chainId" text NOT NULL,
  "packId" text NOT NULL,
  "organizerId" text NOT NULL,
  "currentOwnerAddress" text,
  "lastNftTransferId" uuid REFERENCES "public"."nftTransfer"("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "eventPassNfts" uuid[] NULL,
  "redeemableNfts" uuid[] NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  UNIQUE ("contractAddress", "chainId", "packId")
);

-- Comments for the packNftSupply table and its columns
COMMENT ON TABLE "public"."packNftSupply" IS E'This table represents the supply details of pack NFTs, tracking the ownership, contents, and metadata associated with each pack.';

COMMENT ON COLUMN "public"."packNftSupply"."contractAddress" IS E'The address of the smart contract representing the pack NFT. Essential for blockchain interactions.';

COMMENT ON COLUMN "public"."packNftSupply"."error" IS E'Any error messages related to this pack NFT, particularly during transactions or metadata retrieval.';

COMMENT ON COLUMN "public"."packNftSupply"."tokenUri" IS E'The URI pointing to the metadata of the pack NFT.';

COMMENT ON COLUMN "public"."packNftSupply"."chainId" IS E'The specific blockchain or network on which the pack NFT exists.';

COMMENT ON COLUMN "public"."packNftSupply"."packId" IS E'A unique identifier for the pack within the platform.';

COMMENT ON COLUMN "public"."packNftSupply"."organizerId" IS E'The identifier of the organizer associated with this pack NFT.';

COMMENT ON COLUMN "public"."packNftSupply"."currentOwnerAddress" IS E'The blockchain address of the current owner of the pack NFT.';

COMMENT ON COLUMN "public"."packNftSupply"."lastNftTransferId" IS E'The reference to the latest transfer record for this pack NFT.';

COMMENT ON COLUMN "public"."packNftSupply"."eventPassNfts" IS E'An array of UUIDs representing the event pass NFTs contained in the pack. Null if the pack is unopened.';

COMMENT ON COLUMN "public"."packNftSupply"."redeemableNfts" IS E'An array of UUIDs representing redeemable NFTs contained in the pack. Null if the pack is unopened.';

-- Create trigger for packNftSupply
CREATE TRIGGER set_packNftSupply_updated_at
  BEFORE UPDATE ON "public"."packNftSupply"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
