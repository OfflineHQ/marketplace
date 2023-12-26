CREATE TABLE "public"."eventNftCollection"(
  "contractAddress" text NOT NULL,
  "chainId" text NOT NULL,
  "eventId" text NOT NULL,
  "activityWebhookId" text NOT NULL,
  PRIMARY KEY ("contractAddress"),
  UNIQUE ("contractAddress"),
  UNIQUE ("activityWebhookId")
);

COMMENT ON TABLE "public"."eventNftCollection" IS E'The eventNftCollection model is designed to store metadata associated with NFT collections linked to specific events. This table captures critical, immutable details from the ERC-721 standard, such as the chainId and contractAddress, ensuring accurate tracking and referencing of NFT collections. Additionally, this table integrates infrastructure-specific details, like the activityWebhookId, which aids in monitoring and processing events or changes related to the NFT collections in our platform. By centralizing this information, our system can effectively manage, reference, and interact with NFT collections tied to particular events.';

-- Create the eventPassNftContractType table to store the contract types
CREATE TABLE "public"."eventPassNftContractType"(
  "value" text NOT NULL,
  PRIMARY KEY ("value")
);

COMMENT ON TABLE "public"."eventPassNftContractType" IS 'Contract types representing the nature of the event pass NFT contract.';

-- Insert default values into eventPassNftContractType
INSERT INTO "public"."eventPassNftContractType"("value")
  VALUES ('normal'),
('delayed_reveal');

-- Add comments to describe each type in eventPassNftContractType
COMMENT ON COLUMN "public"."eventPassNftContractType"."value" IS 'Type name for event pass NFT contract.';

COMMENT ON CONSTRAINT "eventPassNftContractType_pkey" ON "public"."eventPassNftContractType" IS 'normal: Standard event pass NFT contract.
delayed_reveal: Event pass NFT contract with delayed reveal functionality.';

-- Alter the eventPassNftContract table to include new fields
ALTER TABLE "public"."eventPassNftContract"
  ADD COLUMN "type" text NOT NULL DEFAULT 'normal' REFERENCES "eventPassNftContractType"("value"),
  ADD COLUMN "password" text,
  ADD COLUMN "isDelayedRevealed" boolean NOT NULL DEFAULT FALSE,
  ADD COLUMN "isAirdrop" boolean NOT NULL DEFAULT FALSE,
  ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add comments to the new columns in eventPassNftContract
COMMENT ON COLUMN "public"."eventPassNftContract"."type" IS 'Type of the event pass NFT contract.';

COMMENT ON COLUMN "public"."eventPassNftContract"."password" IS 'Password for the delayed reveal functionality. Nullable and only applicable for delayed_reveal type.';

COMMENT ON COLUMN "public"."eventPassNftContract"."isDelayedRevealed" IS 'Flag indicating whether the delayed reveal functionality is active. Can be set to true only if type is delayed_reveal.';

COMMENT ON COLUMN "public"."eventPassNftContract"."isAirdrop" IS 'Flag indicating whether the event pass NFT is airdropped.';

COMMENT ON COLUMN "public"."eventPassNftContract"."created_at" IS 'Timestamp of when the record was created.';

COMMENT ON COLUMN "public"."eventPassNftContract"."updated_at" IS 'Timestamp of the last update to the record.';

-- Create trigger for updating updated_at in eventPassNftContract
CREATE TRIGGER set_eventPassNftContract_updated_at
  BEFORE UPDATE ON "public"."eventPassNftContract"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

