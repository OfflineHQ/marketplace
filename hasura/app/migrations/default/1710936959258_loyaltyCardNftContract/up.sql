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

