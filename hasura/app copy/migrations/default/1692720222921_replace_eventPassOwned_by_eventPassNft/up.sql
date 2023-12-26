ALTER TABLE "public"."nftTransfer"
  ADD CONSTRAINT nft_transfer_unique_transfer UNIQUE ("contractAddress", "transactionHash", "tokenId");

CREATE TABLE "public"."eventPassNft"(
  "contractAddress" text NOT NULL,
  "tokenId" bigint NOT NULL,
  "metadata" jsonb NOT NULL,
  "error" text,
  "tokenUri" text,
  "chainId" text NOT NULL,
  "eventId" text NOT NULL,
  "eventPassId" text NOT NULL,
  "organizerId" text NOT NULL,
  "currentOwnerAddress" text NOT NULL,
  "lastNftTransferId" uuid,
  "isRevealed" boolean NOT NULL DEFAULT 'false',
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  UNIQUE ("contractAddress", "tokenId", "chainId")
);

COMMENT ON TABLE "public"."eventPassNft" IS E'The eventPassNft model is designed to consolidate and store the metadata associated with each event pass NFT. It centralizes fixed metadata, enabling the system to retrieve NFT details without frequently querying external APIs. It integrates with the existing nftTransfer model, providing a holistic view of each event pass NFT\'s journey and characteristics within the platform.';

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
  RETURNS TRIGGER
  AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER "set_public_eventPassNft_updated_at"
  BEFORE UPDATE ON "public"."eventPassNft"
  FOR EACH ROW
  EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();

COMMENT ON TRIGGER "set_public_eventPassNft_updated_at" ON "public"."eventPassNft" IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE EXTENSION IF NOT EXISTS pgcrypto;

COMMENT ON COLUMN "public"."eventPassNft"."contractAddress" IS E'Identifies the smart contract associated with the event pass NFT. This provides a direct link to the NFT\'s origin and behavior on the blockchain.';

COMMENT ON COLUMN "public"."eventPassNft"."tokenId" IS E'The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms.';

COMMENT ON COLUMN "public"."eventPassNft"."metadata" IS E'The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT.';

COMMENT ON COLUMN "public"."eventPassNft"."error" IS E'Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process.';

COMMENT ON COLUMN "public"."eventPassNft"."tokenUri" IS E'The designated URI for the event pass NFT\'s metadata blob, providing a stable reference for data extraction.';

COMMENT ON COLUMN "public"."eventPassNft"."chainId" IS E'Denotes the specific blockchain or network of the event pass NFT';

COMMENT ON COLUMN "public"."eventPassNft"."eventId" IS E'A reference to the event associated with the event pass NFT';

COMMENT ON COLUMN "public"."eventPassNft"."eventPassId" IS E'Directly relates to a specific Event Pass within the system';

COMMENT ON COLUMN "public"."eventPassNft"."organizerId" IS E'Ties the event pass NFT to a specific organizer within the platform';

COMMENT ON COLUMN "public"."eventPassNft"."currentOwnerAddress" IS E'The address currently holding the event pass NFT, allowing tracking of ownership';

COMMENT ON COLUMN "public"."eventPassNft"."lastNftTransferId" IS E'Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this event pass NFT.';

COMMENT ON COLUMN "public"."eventPassNft"."isRevealed" IS E'Indicates whether the QR code pass for the event pass NFT has been revealed by the owner. This field is essential for tracking and managing the reveal status within the platform.';

ALTER TABLE "public"."eventPassNft"
  ADD CONSTRAINT event_pass_nft_unique_nft UNIQUE ("contractAddress", "tokenId", "chainId");

DROP TABLE "public"."eventPassOwned";

