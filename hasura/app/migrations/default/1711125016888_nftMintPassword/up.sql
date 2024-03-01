-- Create nftMintPassword table
CREATE TABLE "public"."nftMintPassword"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "password" text NOT NULL,
  "contractAddress" text NOT NULL,
  "chainId" text NOT NULL,
  "organizerId" text NOT NULL,
  "minterAddress" text,
  "tokenId" bigint,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE (
    "password",
    "contractAddress",
    "chainId",
    "organizerId"
  )
);
-- Table and column comments
COMMENT ON TABLE "public"."nftMintPassword" IS E'The nftMintPassword table stores unique passwords that allow for the minting of NFTs on a specific contract. Each password is associated with a contract address, chain ID, and organizer ID, ensuring it can only be used for the intended NFT. Once a password is used to mint an NFT, the minterAddress and tokenId fields are populated, marking the password as consumed and linking it to the minted NFT.';
COMMENT ON COLUMN "public"."nftMintPassword"."password" IS E'The unique password that allows for the minting of an NFT. It should be a combination of letters and numbers, typically 6 characters long.';
COMMENT ON COLUMN "public"."nftMintPassword"."contractAddress" IS E'The address of the NFT contract that the password is associated with.';
COMMENT ON COLUMN "public"."nftMintPassword"."chainId" IS E'The ID of the blockchain network where the NFT contract is deployed.';
COMMENT ON COLUMN "public"."nftMintPassword"."organizerId" IS E'The ID of the organizer that the NFT contract belongs to.';
COMMENT ON COLUMN "public"."nftMintPassword"."minterAddress" IS E'The address of the user who used the password to mint an NFT. If null, the password has not been used yet.';
COMMENT ON COLUMN "public"."nftMintPassword"."tokenId" IS E'The ID of the NFT that was minted using this password. If null, the password has not been used yet.';
-- Create trigger for nftMintPassword
CREATE TRIGGER set_nftMintPassword_updated_at BEFORE
UPDATE ON "public"."nftMintPassword" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
-- Function to force lowercase contractAddress and minterAddress in nftMintPassword table
CREATE OR REPLACE FUNCTION force_lowercase_nftMintPassword() RETURNS TRIGGER AS $$ BEGIN NEW."contractAddress" := LOWER(NEW."contractAddress");
IF NEW."minterAddress" IS NOT NULL THEN NEW."minterAddress" := LOWER(NEW."minterAddress");
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger to apply lowercase function before insert for nftMintPassword
CREATE TRIGGER nftMintPassword_before_insert BEFORE
INSERT ON "public"."nftMintPassword" FOR EACH ROW EXECUTE FUNCTION force_lowercase_nftMintPassword();
ALTER TABLE "public"."lotteryParameters"
  RENAME COLUMN "signingKey" TO "activityWebhookSigningKey";
ALTER TABLE "public"."eventParameters"
  RENAME COLUMN "signingKey" TO "activityWebhookSigningKey";
ALTER TABLE "public"."eventParameters"
ADD COLUMN "metadataUpdateWebhookId" text,
  ADD COLUMN "metadataUpdateWebhookSigningKey" text UNIQUE;
COMMENT ON COLUMN "public"."eventParameters"."activityWebhookSigningKey" IS E'The unique signing key used for securing activity webhooks.';
COMMENT ON COLUMN "public"."eventParameters"."metadataUpdateWebhookId" IS E'The identifier for the metadata update webhook.';
COMMENT ON COLUMN "public"."eventParameters"."metadataUpdateWebhookSigningKey" IS E'The unique signing key used for securing metadata update webhooks.';