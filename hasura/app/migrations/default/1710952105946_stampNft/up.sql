-- Create shopifyCampaignStatus table
CREATE TABLE public."shopifyCampaignStatus"(
  value text NOT NULL
);

ALTER TABLE ONLY public."shopifyCampaignStatus"
  ADD CONSTRAINT "shopifyCampaignStatus_pkey" PRIMARY KEY (value);

INSERT INTO public."shopifyCampaignStatus"(value)
  VALUES ('DRAFT'),
('PUBLISHED');

-- Create shopifyCampaignParameters table
CREATE TABLE "public"."shopifyCampaignParameters"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "campaignId" text NOT NULL UNIQUE,
  "activityWebhookId" text,
  "activityWebhookSigningKey" text UNIQUE,
  "status" text DEFAULT 'DRAFT' REFERENCES "public"."shopifyCampaignStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "organizerId" text NOT NULL
);

-- Comments for shopifyCampaignParameters table
COMMENT ON TABLE "public"."shopifyCampaignParameters" IS E'The shopifyCampaignParameters model is designed to mirror a Shopify token gating campaign operated by a brand on its own Shopify store. It manages various settings and metadata related to the campaign, ensuring efficient and accurate management of token gating campaigns.';

COMMENT ON COLUMN "public"."shopifyCampaignParameters"."campaignId" IS E'Unique identifier for each Shopify campaign, storing the gate ID from Shopify.';

COMMENT ON COLUMN "public"."shopifyCampaignParameters"."activityWebhookId" IS E'The "activityWebhookId" column stores the identifier for the Alchemy webhook that tracks NFT transfers related to the campaign.';

COMMENT ON COLUMN "public"."shopifyCampaignParameters"."activityWebhookSigningKey" IS E'Unique signing key used for secure operations related to the campaign activity webhook.';

COMMENT ON COLUMN "public"."shopifyCampaignParameters"."status" IS E'Represents the current status of the campaign, either "DRAFT" or "PUBLISHED".';

COMMENT ON COLUMN "public"."shopifyCampaignParameters"."organizerId" IS E'Identifier for the organizer responsible for the campaign.';

-- Create trigger for shopifyCampaignParameters
CREATE TRIGGER set_shopifyCampaign_updated_at
  BEFORE UPDATE ON "public"."shopifyCampaignParameters"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Create the stampNftContractType table to store contract types
CREATE TABLE "public"."stampNftContractType"(
  "value" text NOT NULL,
  PRIMARY KEY ("value")
);

COMMENT ON TABLE "public"."stampNftContractType" IS 'Defines contract types for the stampNftContract, representing various marketing campaigns or actions.';

-- Insert default value into stampNftContractType
INSERT INTO "public"."stampNftContractType"("value")
  VALUES ('SHOPIFY_PURCHASE_COMPLETED');

COMMENT ON COLUMN "public"."stampNftContractType"."value" IS 'Type name for stamp NFT contract. Reflects the nature of the marketing campaign or action, like SHOPIFY_PURCHASE_COMPLETED indicating a purchase event in a token-gating campaign on Shopify.';

-- Create the stampNftContract table
CREATE TABLE "public"."stampNftContract"(
  "id" uuid DEFAULT gen_random_uuid(),
  "type" text NOT NULL REFERENCES "public"."stampNftContractType"("value"),
  "contractAddress" text NOT NULL,
  "chainId" text NOT NULL,
  "campaignId" text NOT NULL,
  "organizerId" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("contractAddress", "chainId")
);

COMMENT ON TABLE "public"."stampNftContract" IS 'Represents stamp NFT contracts used for marketing purposes. Each contract is associated with a type indicating the nature of the campaign, like a purchase completion event.';

COMMENT ON COLUMN "public"."stampNftContract"."type" IS 'The type of marketing campaign the contract is associated with, e.g., SHOPIFY_PURCHASE_COMPLETED.';

COMMENT ON COLUMN "public"."stampNftContract"."contractAddress" IS 'The blockchain address of the stamp NFT contract.';

COMMENT ON COLUMN "public"."stampNftContract"."chainId" IS 'The identifier of the blockchain network where the contract is deployed.';

COMMENT ON COLUMN "public"."stampNftContract"."campaignId" IS 'A unique identifier for the marketing campaign associated with this contract.';

-- Create trigger for stampNftContract
CREATE TRIGGER set_stampNftContract_updated_at
  BEFORE UPDATE ON "public"."stampNftContract"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Function to force lowercase contractAddress in stampNftContract table
CREATE OR REPLACE FUNCTION force_lowercase_contractAddress_stampNftContract()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW."contractAddress" := LOWER(NEW."contractAddress");
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Trigger to apply lowercase function before insert or update for stampNftContract
CREATE TRIGGER force_lowercase_stampNftContract_before_insert_update
  BEFORE INSERT OR UPDATE ON "public"."stampNftContract"
  FOR EACH ROW
  EXECUTE FUNCTION force_lowercase_contractAddress_stampNftContract();

-- Create stampNft table to hold information about each token type within a contract
CREATE TABLE "public"."stampNft"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "contractAddress" text NOT NULL,
  "chainId" text NOT NULL,
  "tokenId" bigint NOT NULL,
  "tokenUri" text,
  "metadata" jsonb NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY ("contractAddress", "chainId") REFERENCES "public"."stampNftContract"("contractAddress", "chainId"),
  UNIQUE ("contractAddress", "tokenId", "chainId")
);

COMMENT ON COLUMN "public"."stampNft"."tokenId" IS 'The unique identifier of the token within its contract.';

COMMENT ON COLUMN "public"."stampNft"."tokenUri" IS 'URI pointing to the token metadata, which may include details such as the item associated with the token.';

COMMENT ON COLUMN "public"."stampNft"."metadata" IS 'Structured metadata associated with the token, stored in a JSONB format for flexibility.';

COMMENT ON TABLE "public"."stampNft" IS 'Stores information for each token type managed by a stampNftContract, focusing on unique token IDs and their associated metadata.';

-- Create trigger for stampNft
CREATE TRIGGER set_stampNft_updated_at
  BEFORE UPDATE ON "public"."stampNft"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Function to force lowercase contractAddress in stampNft table
CREATE OR REPLACE FUNCTION force_lowercase_contractAddress_stampNft()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW."contractAddress" := LOWER(NEW."contractAddress");
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Trigger to apply lowercase function before insert or update for stampNft
CREATE TRIGGER force_lowercase_stampNft_before_insert_update
  BEFORE INSERT OR UPDATE ON "public"."stampNft"
  FOR EACH ROW
  EXECUTE FUNCTION force_lowercase_contractAddress_stampNft();

-- Create stampNftSupply table for tracking ownership and quantities
CREATE TABLE "public"."stampNftSupply"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tokenId" bigint NOT NULL,
  "contractAddress" text NOT NULL,
  "chainId" text NOT NULL,
  "currentOwnerAddress" text NOT NULL,
  "lastNftTransferId" uuid REFERENCES "public"."nftTransfer"("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "amount" integer NOT NULL CHECK (amount >= 0),
  "error" text,
  "status" text DEFAULT 'CONFIRMED',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY ("tokenId", "contractAddress", "chainId") REFERENCES "public"."stampNft"("tokenId", "contractAddress", "chainId"),
  FOREIGN KEY ("contractAddress", "chainId") REFERENCES "public"."stampNftContract"("contractAddress", "chainId"),
  FOREIGN KEY ("status") REFERENCES "public"."nftStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  UNIQUE ("tokenId", "contractAddress", "chainId", "currentOwnerAddress")
);

COMMENT ON TABLE "public"."stampNftSupply" IS 'Tracks the current ownership and quantities of each token under a stampNftContract. Each row associates a token (identified by tokenId and contractAddress) with an owner and the quantity they hold.';

COMMENT ON COLUMN "public"."stampNftSupply"."currentOwnerAddress" IS 'The blockchain address of the current owner of the token.';

COMMENT ON COLUMN "public"."stampNftSupply"."lastNftTransferId" IS 'Reference to the last transfer event for this token, providing a link to detailed transfer information.';

COMMENT ON COLUMN "public"."stampNftSupply"."amount" IS 'The quantity of the token held by the current owner.';

-- Create trigger for stampNftSupply
CREATE TRIGGER set_stampNftSupply_updated_at
  BEFORE UPDATE ON "public"."stampNftSupply"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Function to force lowercase contractAddress and currentOwnerAddress in stampNftSupply table
CREATE OR REPLACE FUNCTION force_lowercase_addresses_stampNftSupply()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW."contractAddress" := LOWER(NEW."contractAddress");
  NEW."currentOwnerAddress" := LOWER(NEW."currentOwnerAddress");
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Trigger to apply lowercase function before insert or update for stampNftSupply
CREATE TRIGGER force_lowercase_stampNftSupply_before_insert_update
  BEFORE INSERT OR UPDATE ON "public"."stampNftSupply"
  FOR EACH ROW
  EXECUTE FUNCTION force_lowercase_addresses_stampNftSupply();

