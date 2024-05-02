
-- Create loyaltyCardStatus table
CREATE TABLE public."loyaltyCardStatus"(
  value text NOT NULL
);

ALTER TABLE ONLY public."loyaltyCardStatus"
  ADD CONSTRAINT "loyaltyCardStatus_pkey" PRIMARY KEY (value);

INSERT INTO public."loyaltyCardStatus"(value)
  VALUES ('DRAFT'),
('PUBLISHED');

-- Create loyaltyCardParameters table
CREATE TABLE "public"."loyaltyCardParameters"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "loyaltyCardId" text NOT NULL UNIQUE,
  "activityWebhookId" text,
  "activityWebhookSigningKey" text UNIQUE,
  "metadataUpdateWebhookId" text,
  "metadataUpdateWebhookSigningKey" text UNIQUE,
  "status" text DEFAULT 'DRAFT' REFERENCES "public"."loyaltyCardStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "organizerId" text NOT NULL
);

-- Comments for loyaltyCardParameters table
COMMENT ON TABLE "public"."loyaltyCardParameters" IS E'The loyaltyCardParameters model is designed to define properties on a loyalty card, including details like the loyaltyCardId and activityWebhookId. It manages various settings and metadata related to the loyalty card, ensuring efficient and accurate management of loyalty card programs.';

COMMENT ON COLUMN "public"."loyaltyCardParameters"."loyaltyCardId" IS E'Unique identifier for each loyalty card, ensuring no duplicates in the system.';

COMMENT ON COLUMN "public"."loyaltyCardParameters"."activityWebhookId" IS E'The "activityWebhookId" column stores the identifier for the Alchemy webhook that tracks NFT transfers related to the loyalty card.';

COMMENT ON COLUMN "public"."loyaltyCardParameters"."activityWebhookSigningKey" IS E'Unique signing key used for secure operations related to the loyalty card activity webhook.';

COMMENT ON COLUMN "public"."loyaltyCardParameters"."metadataUpdateWebhookId" IS E'The "metadataUpdateWebhookId" column stores the identifier for the Alchemy webhook that tracks metadata updates related to the loyalty card.';

COMMENT ON COLUMN "public"."loyaltyCardParameters"."metadataUpdateWebhookSigningKey" IS E'Unique signing key used for secure operations related to the loyalty card metadata update webhook.';

COMMENT ON COLUMN "public"."loyaltyCardParameters"."status" IS E'Represents the current status of the loyalty card, either "DRAFT" or "PUBLISHED".';

COMMENT ON COLUMN "public"."loyaltyCardParameters"."organizerId" IS E'Identifier for the organizer responsible for the loyalty card.';

-- Create trigger for loyaltyCardParameters
CREATE TRIGGER set_loyaltyCardParameters_updated_at
  BEFORE UPDATE ON "public"."loyaltyCardParameters"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Create loyaltyCardNftContract table
CREATE TABLE "public"."loyaltyCardNftContract"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "chainId" text NOT NULL,
  "contractAddress" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "organizerId" text NOT NULL,
  "loyaltyCardId" text NOT NULL UNIQUE,
  UNIQUE ("contractAddress", "chainId")
);

COMMENT ON TABLE "public"."loyaltyCardNftContract" IS E'The loyaltyCardNftContract model is designed to store metadata associated with NFT contracts that act as loyalty cards for organizers. This table captures critical details from the ERC-721 standard, such as the chainId and contractAddress, ensuring accurate tracking and referencing of NFT contracts. It includes organizerId to link each loyalty card contract directly with an organizer, facilitating the management and interaction with NFT-based loyalty programs.';

COMMENT ON COLUMN "public"."loyaltyCardNftContract"."contractAddress" IS E'Represents the unique address of the smart contract that governs the NFT-based loyalty card. It acts as the primary reference point to the loyalty card''s existence and behavior on the blockchain.';

COMMENT ON COLUMN "public"."loyaltyCardNftContract"."chainId" IS E'Specifies the particular blockchain or network on which the NFT-based loyalty card resides. Essential for distinguishing between different blockchains in a multi-chain environment.';

COMMENT ON COLUMN "public"."loyaltyCardNftContract"."organizerId" IS E'A unique identifier for the organizer associated with the NFT-based loyalty card. This links the loyalty card directly to a specific organizer within the platform.';

COMMENT ON COLUMN "public"."loyaltyCardNftContract"."loyaltyCardId" IS E'Identifies the specific loyalty card model in the Hygraph CMS associated with this contract. Ensuring uniqueness of this field guarantees that each NFT-based loyalty card is uniquely linked to a single loyalty card model in the CMS.';

-- Create trigger to set updated_at column on updates
CREATE TRIGGER set_loyaltyCardNftContract_updated_at
  BEFORE UPDATE ON "public"."loyaltyCardNftContract"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Function to force lowercase contractAddress and loyaltyCardId in loyaltyCardNftContract table
CREATE OR REPLACE FUNCTION force_lowercase_loyaltyCardNftContract()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW."contractAddress" := LOWER(NEW."contractAddress");
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Trigger to apply lowercase function before insert
CREATE TRIGGER loyaltyCardNftContract_before_insert
  BEFORE INSERT ON "public"."loyaltyCardNftContract"
  FOR EACH ROW
  EXECUTE FUNCTION force_lowercase_loyaltyCardNftContract();


-- NFT status
CREATE TABLE public."nftStatus"(
  value text NOT NULL
);

ALTER TABLE ONLY public."nftStatus"
  ADD CONSTRAINT "nftStatus_pkey" PRIMARY KEY (value);

INSERT INTO public."nftStatus"(value)
  VALUES ('CONFIRMED'), -- NFT attribution is confirmed
('IS_MINTING'), -- NFT is being minted through a blockchain transaction
('ERROR'), -- An error occurred during the NFT attribution
('COMPLETED'), -- NFT is successfully attributed and held by the user's wallet
('BURNED'), -- NFT has been burned for any reason
('IS_TRANSFERRING'), -- NFT is being transferred to another wallet
('HELD_BY_CONTRACT'), -- NFT is held by a contract (e.g., lottery contract) before distribution
('LAZY_MINTED') -- NFT is lazily minted and not yet attributed to a user
;

-- Modify "eventPassNft" table
ALTER TABLE public."eventPassNft"
  ALTER COLUMN "tokenId" DROP NOT NULL,
  ALTER COLUMN "metadata" DROP NOT NULL,
  DROP COLUMN "isDelivered",
  ADD COLUMN "status" text DEFAULT 'CONFIRMED';

ALTER TABLE public."eventPassNft"
  ADD CONSTRAINT "eventPassNft_status_fkey" FOREIGN KEY ("status") REFERENCES public."nftStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Drop the existing unique constraint
ALTER TABLE public."eventPassNft"
  DROP CONSTRAINT "eventPassNft_contractAddress_tokenId_chainId_key";

-- Create a partial unique index
CREATE UNIQUE INDEX "eventPassNft_contractAddress_tokenId_chainId_idx" ON public."eventPassNft"("contractAddress", "tokenId", "chainId")
WHERE
  "tokenId" IS NOT NULL;

-- Modify "packNftSupply" table
ALTER TABLE public."packNftSupply"
  DROP COLUMN "isDelivered",
  ADD COLUMN "status" text DEFAULT 'CONFIRMED';

ALTER TABLE public."packNftSupply"
  ADD CONSTRAINT "packNftSupply_status_fkey" FOREIGN KEY ("status") REFERENCES public."nftStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Create loyaltyCardNft table
CREATE TABLE "public"."loyaltyCardNft"(
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "contractAddress" text NOT NULL,
  "tokenId" bigint,
  "metadata" jsonb,
  "error" text,
  "tokenUri" text,
  "chainId" text NOT NULL,
  "loyaltyCardId" text NOT NULL,
  "organizerId" text NOT NULL,
  "ownerAddress" text NOT NULL,
  "burnedTransferId" uuid,
  "status" text DEFAULT 'CONFIRMED',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("status") REFERENCES "public"."nftStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Create a partial unique index on "loyaltyCardNft"
CREATE UNIQUE INDEX "loyaltyCardNft_contractAddress_tokenId_chainId_idx" ON public."loyaltyCardNft"("contractAddress", "tokenId", "chainId")
WHERE
  "tokenId" IS NOT NULL;

-- Partial unique index for ownerAddress to ensure uniqueness among active NFTs
CREATE UNIQUE INDEX idx_loyaltyCardNft_ownerAddress_active ON "public"."loyaltyCardNft"("ownerAddress")
WHERE
  "burnedTransferId" IS NULL;

-- Table and column comments
COMMENT ON TABLE "public"."loyaltyCardNft" IS E'The loyaltyCardNft model stores NFTs delivered by the loyaltyCardNftContract, each uniquely associated with a loyalty card. These NFTs are soulbound to a specific owner and not transferable, though they can be burned, indicating the end of their lifecycle. The structure allows for the dynamic update of NFT metadata by contract admins, adhering to the loyalty card contract stipulations.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."contractAddress" IS E'Identifies the smart contract associated with the loyalty card NFT. This provides a direct link to the NFT\'s origin and behavior on the blockchain.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."tokenId" IS E'The unique identifier of the loyalty card NFT within its specific collection or contract. This remains constant across various platforms.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."metadata" IS E'The structured metadata parsed from the token URI. This contains a variety of details regarding the loyalty card NFT.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."error" IS E'Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."tokenUri" IS E'The designated URI for the loyalty card NFT\'s metadata blob, providing a stable reference for data extraction.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."chainId" IS E'Denotes the specific blockchain or network of the loyalty card NFT.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."loyaltyCardId" IS E'A reference to the loyalty card associated with the NFT, linking it directly to the loyalty program within the platform.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."organizerId" IS E'A unique identifier for the organizer associated with the NFT. This links the loyalty card directly to a specific organizer within the platform.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."ownerAddress" IS E'The address currently holding the loyalty card NFT. Given the soulbound nature, this represents the permanent owner unless the NFT is burned.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."burnedTransferId" IS E'If not null, indicates the NFT has been burned, marking its lifecycle end. This field links to the transaction that executed the burn, whether by the NFT owner or a contract admin.';

-- Create trigger for loyaltyCardNft
CREATE TRIGGER set_loyaltyCardNft_updated_at
  BEFORE UPDATE ON "public"."loyaltyCardNft"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Function to force lowercase contractAddress and ownerAddress in loyaltyCardNft table
CREATE OR REPLACE FUNCTION force_lowercase_loyaltyCardNft()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW."contractAddress" := LOWER(NEW."contractAddress");
  NEW."ownerAddress" := LOWER(NEW."ownerAddress");
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Trigger to apply lowercase function before insert for loyaltyCardNft
CREATE TRIGGER loyaltyCardNft_before_insert
  BEFORE INSERT ON "public"."loyaltyCardNft"
  FOR EACH ROW
  EXECUTE FUNCTION force_lowercase_loyaltyCardNft();


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
  "gateId" text NOT NULL,
  "shopifyCampaignTemplateId" text NOT NULL,
  "organizerId" text NOT NULL,
  "status" text DEFAULT 'DRAFT' REFERENCES "public"."shopifyCampaignStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY ("gateId")
);

-- Comments on the purpose of the table and its fields
COMMENT ON TABLE "public"."shopifyCampaignParameters" IS E'This table stores parameters specific to Shopify campaigns, including gate identifiers and links to campaign data in the CRM. It supports context resolution in offline unlock iframes and enables tailored content display.';

COMMENT ON COLUMN "public"."shopifyCampaignParameters"."gateId" IS E'Primary key. Unique identifier corresponding to the gate id from Shopify campaigns.';

COMMENT ON COLUMN "public"."shopifyCampaignParameters"."shopifyCampaignTemplateId" IS E'Foreign key linking to the shopifyCampaignTemplate model in the CRM.';

COMMENT ON COLUMN "public"."shopifyCampaignParameters"."organizerId" IS E'Identifier for the organizer responsible for the campaign.';

COMMENT ON COLUMN "public"."shopifyCampaignParameters"."created_at" IS E'Timestamp indicating when the record was initially created, set automatically by the system.';

COMMENT ON COLUMN "public"."shopifyCampaignParameters"."updated_at" IS E'Timestamp indicating the last update time for the record, set automatically on creation and updated via trigger on modification.';

-- Create trigger to set updated_at column on updates
CREATE TRIGGER set_shopifyCampaignParameters_updated_at
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
  "metadata" jsonb NOT NULL,
  "activityWebhookId" text,
  "activityWebhookSigningKey" text UNIQUE,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("contractAddress", "chainId")
);

COMMENT ON TABLE "public"."stampNftContract" IS 'Represents stamp NFT contracts used for marketing purposes. Each contract is associated with a type indicating the nature of the campaign, like a purchase completion event.';

COMMENT ON COLUMN "public"."stampNftContract"."type" IS 'The type of marketing campaign the contract is associated with, e.g., SHOPIFY_PURCHASE_COMPLETED.';

COMMENT ON COLUMN "public"."stampNftContract"."contractAddress" IS 'The blockchain address of the stamp NFT contract.';

COMMENT ON COLUMN "public"."stampNftContract"."chainId" IS 'The identifier of the blockchain network where the contract is deployed.';

COMMENT ON COLUMN "public"."stampNftContract"."metadata" IS 'Structured metadata associated with the contract, stored in a JSONB format for flexibility.';

COMMENT ON COLUMN "public"."stampNftContract"."campaignId" IS 'A unique identifier for the marketing campaign associated with this contract. For instance, a Shopify campaign ID.';

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
-- Create apiKeyStatus table
CREATE TABLE public."apiKeyStatus"(
  value text NOT NULL
);

ALTER TABLE ONLY public."apiKeyStatus"
  ADD CONSTRAINT "apiKeyStatus_pkey" PRIMARY KEY (value);

INSERT INTO public."apiKeyStatus"(value)
  VALUES ('ACTIVE'), -- The key is active and usable
('DISABLED'), -- The key has been manually disabled
('EXPIRED');

-- The key has expired based on the expiresAt timestamp
COMMENT ON TABLE "public"."apiKeyStatus" IS E'The apiKeyStatus table defines the possible status values for API keys. It ensures data integrity and provides a centralized reference for the status field in the publishableApiKey and secretApiKey tables.';

COMMENT ON COLUMN "public"."apiKeyStatus"."value" IS E'The status value for API keys. It can be "ACTIVE" (default), "DISABLED", or "EXPIRED".';

-- Create apiKeyType table
CREATE TABLE public."apiKeyType"(
  value text NOT NULL
);

ALTER TABLE ONLY public."apiKeyType"
  ADD CONSTRAINT "apiKeyType_pkey" PRIMARY KEY (value);

INSERT INTO public."apiKeyType"(value)
  VALUES ('EXTERNAL');

-- The secret API key is used for external integrations
COMMENT ON TABLE "public"."apiKeyType" IS E'The apiKeyType table defines the possible types of API keys. It ensures data integrity and provides a centralized reference for the type field in the api key tables.';

COMMENT ON COLUMN "public"."apiKeyType"."value" IS E'The type of the API key';

-- Create publishableApiKey table
CREATE TABLE "public"."publishableApiKey"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text DEFAULT 'Publishable API Key',
  "apiKey" text NOT NULL,
  "allowlist" text NOT NULL DEFAULT '*',
  "organizerId" text NOT NULL,
  "expiresAt" timestamptz,
  "status" text DEFAULT 'ACTIVE' REFERENCES "public"."apiKeyStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "type" text NOT NULL DEFAULT 'EXTERNAL' REFERENCES "public"."apiKeyType"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("apiKey")
);

COMMENT ON TABLE "public"."publishableApiKey" IS E'The publishableApiKey table stores the publishable API keys used for querying data from the server externally. It includes fields for management and security, such as an allowlist, expiration timestamp, and status.';

COMMENT ON COLUMN "public"."publishableApiKey"."name" IS E'A user-defined name for the publishable API key, providing a human-readable identifier for the key.';

COMMENT ON COLUMN "public"."publishableApiKey"."apiKey" IS E'The publishable API key used for identification when querying data from the server externally.';

COMMENT ON COLUMN "public"."publishableApiKey"."allowlist" IS E'A comma-separated list of allowed domains or IP addresses that are permitted to use the publishable API key, restricting usage to authorized sources.';

COMMENT ON COLUMN "public"."publishableApiKey"."organizerId" IS E'The unique identifier of the organizer associated with the publishable API key, establishing a link between the key and the organizer it belongs to.';

COMMENT ON COLUMN "public"."publishableApiKey"."expiresAt" IS E'The expiration timestamp for the publishable API key, specifying the validity period after which the key becomes invalid and cannot be used.';

COMMENT ON COLUMN "public"."publishableApiKey"."status" IS E'The current status of the publishable API key, referencing the apiKeyStatus table. It can be "ACTIVE" (default), "DISABLED", or "EXPIRED".';

-- Create trigger to set updated_at column on updates for publishableApiKey
CREATE TRIGGER set_publishableApiKey_updated_at
  BEFORE UPDATE ON "public"."publishableApiKey"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Create secretApiKey table
CREATE TABLE "public"."secretApiKey"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text DEFAULT 'Secret API Key',
  "apiKey" text NOT NULL,
  "hashedOriginSecret" text,
  "originSecretSalt" text,
  "encryptedIntegritySecret" text,
  "organizerId" text NOT NULL,
  "allowlist" text NOT NULL DEFAULT '*',
  "expiresAt" timestamptz,
  "status" text DEFAULT 'ACTIVE' REFERENCES "public"."apiKeyStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "type" text NOT NULL DEFAULT 'EXTERNAL' REFERENCES "public"."apiKeyType"("value") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("apiKey")
);

COMMENT ON TABLE "public"."secretApiKey" IS E'The secretApiKey table stores the secret API keys used for querying sensitive data and performing mutations. It includes additional fields for security and management, such as hashed origin secret, encrypted integrity secret, expiration timestamp, and status.';

COMMENT ON COLUMN "public"."secretApiKey"."name" IS E'A user-defined name for the secret API key, providing a human-readable identifier for the key.';

COMMENT ON COLUMN "public"."secretApiKey"."apiKey" IS E'The secret API key used for authentication and identification when querying sensitive data and performing mutations.';

COMMENT ON COLUMN "public"."secretApiKey"."hashedOriginSecret" IS E'The hashed secret used for verifying the origin of the request. The origin secret is hashed using a secure hashing algorithm and a unique salt before storing it in the database.';

COMMENT ON COLUMN "public"."secretApiKey"."originSecretSalt" IS E'The unique salt value used during the hashing process for the origin secret. It enhances security by making it more difficult to crack the hashed origin secret.';

COMMENT ON COLUMN "public"."secretApiKey"."encryptedIntegritySecret" IS E'The encrypted secret used for verifying the integrity of the request data. The integrity secret is encrypted using a secure encryption algorithm and a salt before storing it in the database.';

COMMENT ON COLUMN "public"."secretApiKey"."organizerId" IS E'The unique identifier of the organizer associated with the secret API key, establishing a link between the key and the organizer it belongs to.';

COMMENT ON COLUMN "public"."secretApiKey"."allowlist" IS E'A comma-separated list of allowed domains or IP addresses that are permitted to use the secret API key, restricting usage to authorized sources.';

COMMENT ON COLUMN "public"."secretApiKey"."expiresAt" IS E'The expiration timestamp for the secret API key, specifying the validity period after which the key becomes invalid and cannot be used.';

COMMENT ON COLUMN "public"."secretApiKey"."status" IS E'The current status of the secret API key, referencing the apiKeyStatus table. It can be "ACTIVE" (default), "DISABLED", or "EXPIRED".';

COMMENT ON COLUMN "public"."secretApiKey"."type" IS E'The type of the secret API key, referencing the apiKeyType table. It determines how the secret is verified and what scope/routes of query are accessible.';

-- Create trigger to set updated_at column on updates for secretApiKey
CREATE TRIGGER set_secretApiKey_updated_at
  BEFORE UPDATE ON "public"."secretApiKey"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();


-- Create the shopifyDomain table
CREATE TABLE "public"."shopifyDomain"(
  domain text PRIMARY KEY,
  "organizerId" text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Comments on the purpose of the shopifyDomain table and its fields
COMMENT ON TABLE "public"."shopifyDomain" IS E'This table is used to link and authenticate queries from Shopify to an organizer in our system. It stores the unique Shopify domains associated with each organizer, allowing for efficient lookup and validation of incoming requests.';

COMMENT ON COLUMN "public"."shopifyDomain"."domain" IS E'The Shopify domain value, which serves as the primary key for the table, ensuring uniqueness across all records.';

COMMENT ON COLUMN "public"."shopifyDomain"."organizerId" IS E'The unique identifier of the associated organizer in our external CRM system. This field is used to link Shopify domains to the corresponding organizers.';

COMMENT ON COLUMN "public"."shopifyDomain"."created_at" IS E'Timestamp indicating when the record was initially created, set automatically by the system.';


-- Create the shopifyCustomer table
CREATE TABLE "public"."shopifyCustomer"(
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  "address" text REFERENCES account("address") NOT NULL,
  "organizerId" text NOT NULL,
  "customerId" text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE ("address", "organizerId", "customerId") -- Ensures unique pairing of account, organizer, and Shopify customer
);

-- Comments on the purpose of the table and its fields
COMMENT ON TABLE "public"."shopifyCustomer" IS E'This table stores the link between the offline accounts and Shopify customer IDs. It allows organizers to manage customer data seamlessly across platforms without needing to handle sensitive personal information directly.';

COMMENT ON COLUMN "public"."shopifyCustomer"."id" IS E'Unique identifier for each entry, generated automatically as a UUID.';

COMMENT ON COLUMN "public"."shopifyCustomer"."address" IS E'Reference to the account table, ensuring that customer data is associated with a unique account address.';

COMMENT ON COLUMN "public"."shopifyCustomer"."organizerId" IS E'Identifier for the organizer, used to scope Shopify customer data to specific organizers, allowing them to manage their client data independently.';

COMMENT ON COLUMN "public"."shopifyCustomer"."customerId" IS E'The unique identifier for the customer as stored in Shopify. This links the internal account to the Shopify customer record, facilitating integrated data management across systems.';

COMMENT ON COLUMN "public"."shopifyCustomer"."created_at" IS E'Timestamp indicating when the record was initially created, set automatically by the system.';

-- Index for faster lookup by address, organizerId, and customerId
CREATE INDEX idx_shopify_customer_on_address_organizer_customer ON "public"."shopifyCustomer"("address", "organizerId", "customerId");
