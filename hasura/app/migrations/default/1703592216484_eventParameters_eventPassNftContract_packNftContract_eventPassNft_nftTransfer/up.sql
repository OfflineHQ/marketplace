-- Create eventStatus table
CREATE TABLE public."eventStatus"(
  value text NOT NULL
);

ALTER TABLE ONLY public."eventStatus"
  ADD CONSTRAINT "eventStatus_pkey" PRIMARY KEY (value);

INSERT INTO public."eventStatus"(value)
  VALUES ('DRAFT'),
('PUBLISHED');

-- Create eventParameters table
CREATE TABLE "public"."eventParameters"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "eventId" text NOT NULL UNIQUE,
  "activityWebhookId" text,
  "status" text DEFAULT 'DRAFT' REFERENCES "public"."eventStatus"("value") ON UPDATE NO action ON DELETE NO action,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "dateStart" timestamp without time zone,
  "dateEnd" timestamp without time zone,
  "dateSaleStart" timestamp without time zone,
  "dateSaleEnd" timestamp without time zone,
  "timezone" text REFERENCES "public"."timezone"("value") ON UPDATE NO action ON DELETE NO action,
  "organizerId" text NOT NULL,
  "signingKey" text UNIQUE
);

COMMENT ON TABLE "public"."eventParameters" IS E'The eventParameters model is designed to define properties on an event involving all event passes. This table includes critical details like the eventId and activityWebhookId, which aids in monitoring and processing events or changes related to the event parameters. By centralizing this information, our system can effectively manage and control parameters tied to specific events, enhancing the overall functionality and flexibility of event handling.';

COMMENT ON COLUMN "public"."eventParameters"."activityWebhookId" IS E'The "activityWebhookId" column stores the identifier for the Alchemy webhook that tracks NFT transfers. This webhook ID is essential for real-time monitoring and processing of NFT transactions related to the event, ensuring that the platform stays updated with the latest transfer activities.';

COMMENT ON COLUMN "public"."eventParameters"."dateStart" IS E'The "dateStart" column represents the start date and time of the event. This timestamp, set in a timezone-neutral format, indicates when the event officially begins. It is crucial for scheduling and coordinating event-related activities.';

COMMENT ON COLUMN "public"."eventParameters"."dateEnd" IS E'The "dateEnd" column specifies the end date and time of the event. Similar to "dateStart", this timestamp is stored without a timezone, marking the official conclusion of the event. This information is vital for managing the overall duration and scheduling of the event.';

COMMENT ON COLUMN "public"."eventParameters"."dateSaleStart" IS E'The "dateSaleStart" column denotes the start date and time for when the event passes become available for sale. This timestamp, free from timezone specifics, is critical for controlling the sales window, allowing for precise planning and marketing of the event passes.';

COMMENT ON COLUMN "public"."eventParameters"."dateSaleEnd" IS E'The "dateSaleEnd" column indicates the end date and time for the sale of event passes. By providing a clear cut-off point for sales, this timestamp aids in the strategic planning and closure of the pass sale period.';

COMMENT ON COLUMN "public"."eventParameters"."timezone" IS E'The "timezone" column contains the timezone identifier for the event. All event-related timestamps, such as "dateStart", "dateEnd", "dateSaleStart", and "dateSaleEnd", are interpreted in this specified timezone. This column ensures consistency in timekeeping and scheduling across various geographic locations.';

-- Create trigger for eventParameters
CREATE TRIGGER set_eventParameters_updated_at
  BEFORE UPDATE ON "public"."eventParameters"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

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

-- Create eventPassNftContract table
CREATE TABLE "public"."eventPassNftContract"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "type" text NOT NULL DEFAULT 'normal' REFERENCES "public"."eventPassNftContractType"("value"),
  "chainId" text NOT NULL,
  "contractAddress" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "eventId" text NOT NULL,
  "eventPassId" text NOT NULL,
  "organizerId" text NOT NULL,
  "password" text,
  "isDelayedRevealed" boolean NOT NULL DEFAULT FALSE,
  "isAirdrop" boolean NOT NULL DEFAULT FALSE,
  UNIQUE ("contractAddress", "chainId")
);

COMMENT ON TABLE "public"."eventPassNftContract" IS E'The eventPassNftContract model is designed to store metadata associated with NFT contracts linked to specific event passes. This table captures critical, immutable details from the ERC-721 standard, such as the chainId and contractAddress, ensuring accurate tracking and referencing of NFT contracts. Additionally, this table includes information specific to each event pass, like the eventPassId and organizerId, allowing for precise management and interaction with NFT contracts tied to individual event passes. By centralizing this information, our system can effectively manage, reference, and interact with NFT contracts related to particular event passes.';

COMMENT ON COLUMN "public"."eventPassNftContract"."contractAddress" IS E'Represents the unique address of the smart contract that governs the NFT collection. It acts as the primary reference to the NFTs existence and behavior on the blockchain.';

COMMENT ON COLUMN "public"."eventPassNftContract"."chainId" IS E'Specifies the particular blockchain or network on which the NFT collection resides. Essential for distinguishing between different blockchains in a multi-chain environment.';

COMMENT ON COLUMN "public"."eventPassNftContract"."eventId" IS E'A unique identifier for the event associated with the NFT collection. This ties each collection directly to a specific event within the platform.';

COMMENT ON COLUMN "public"."eventPassNftContract"."type" IS E'Type of the event pass NFT contract.';

COMMENT ON COLUMN "public"."eventPassNftContract"."password" IS E'Password for the delayed reveal functionality. Nullable and only applicable for delayed_reveal type.';

COMMENT ON COLUMN "public"."eventPassNftContract"."isDelayedRevealed" IS E'Flag indicating whether the delayed reveal functionality is active. Can be set to true only if type is delayed_reveal.';

COMMENT ON COLUMN "public"."eventPassNftContract"."isAirdrop" IS E'Flag indicating whether the event pass NFT is airdropped.';

-- Create trigger for eventPassNftContract
CREATE TRIGGER set_eventPassNftContract_updated_at
  BEFORE UPDATE ON "public"."eventPassNftContract"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Create packNftContract table
CREATE TABLE "public"."packNftContract"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "chainId" text NOT NULL,
  "contractAddress" text NOT NULL,
  "rewardsPerPack" integer NOT NULL DEFAULT 1,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "organizerId" text NOT NULL,
  "eventId" text NOT NULL,
  "packId" text NOT NULL,
  "eventPassIds" jsonb NOT NULL,
  UNIQUE ("contractAddress", "chainId")
);

COMMENT ON TABLE "public"."packNftContract" IS E'packNftContract model to manage the NFTs associated with each pack.';

-- Create trigger for packNftContract
CREATE TRIGGER set_packNftContract_updated_at
  BEFORE UPDATE ON "public"."packNftContract"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Create nftTransfer table
CREATE TABLE "public"."nftTransfer"(
  "contractAddress" text NOT NULL,
  "fromAddress" text NOT NULL,
  "toAddress" text NOT NULL,
  "transactionHash" text NOT NULL,
  "chainId" text NOT NULL,
  "blockNumber" bigint NOT NULL,
  "eventId" text NOT NULL,
  "organizerId" text NOT NULL,
  "eventPassId" text,
  "packId" text,
  "packAmount" integer,
  "tokenId" bigint NOT NULL,
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  CONSTRAINT nft_transfer_unique_transfer UNIQUE ("contractAddress", "transactionHash", "tokenId"),
  CHECK (("eventPassId" IS NOT NULL AND "packId" IS NULL AND "packAmount" IS NULL) OR ("eventPassId" IS NULL AND "packId" IS NOT NULL AND "packAmount" >= 1))
);

COMMENT ON TABLE "public"."nftTransfer" IS E'The nftTransfer model is built to record and chronicle the transfer of NFTs between addresses. This model is crucial in tracing the movement of an NFT, especially when validating that an event pass has reached its intended recipient. Such a system facilitates debugging and reduces the need for excessive querying of our indexer. Entries in this table are populated through two primary avenues: either via an activity webhook responding to real-time NFT transfers or through a regular cron job as a failsafe, ensuring data integrity even if the webhook fails to capture certain events.';

COMMENT ON COLUMN "public"."nftTransfer"."contractAddress" IS E'Identifies the smart contract associated with the NFT. This provides a direct link to the NFTs origin and behavior on the blockchain.';

COMMENT ON COLUMN "public"."nftTransfer"."fromAddress" IS E'Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFTs movement.';

COMMENT ON COLUMN "public"."nftTransfer"."toAddress" IS E'Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT.';

COMMENT ON COLUMN "public"."nftTransfer"."transactionHash" IS E'Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain.';

COMMENT ON COLUMN "public"."nftTransfer"."chainId" IS E'Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains.';

COMMENT ON COLUMN "public"."nftTransfer"."blockNumber" IS E'The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain history.';

COMMENT ON COLUMN "public"."nftTransfer"."eventId" IS E'Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform.';

COMMENT ON COLUMN "public"."nftTransfer"."organizerId" IS E'Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers.';

COMMENT ON COLUMN "public"."nftTransfer"."eventPassId" IS E'Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass.';

COMMENT ON COLUMN "public"."nftTransfer"."tokenId" IS E'The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms.';

COMMENT ON COLUMN "public"."nftTransfer"."packId" IS E'Identifies the specific pack associated with the NFT. This field is only populated if the NFT is part of a pack.';

COMMENT ON COLUMN "public"."nftTransfer"."packAmount" IS E'Specifies the number of NFTs transferred in the transaction. This field is only populated if the NFT is part of a pack.';

-- Create eventPassNft table
CREATE TABLE "public"."eventPassNft"(
  "contractAddress" text NOT NULL,
  "tokenId" bigint NOT NULL,
  "metadata" jsonb NOT NULL,
  "error" text,
  "tokenUri" text,
  "chainId" text NOT NULL,
  "eventId" text NOT NULL,
  "eventPassId" text NOT NULL,
  "packId" text,
  "organizerId" text NOT NULL,
  "currentOwnerAddress" text,
  "lastNftTransferId" uuid REFERENCES "public"."nftTransfer"("id") ON UPDATE NO action ON DELETE NO action,
  "isRevealed" boolean NOT NULL DEFAULT 'false',
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  UNIQUE ("contractAddress", "tokenId", "chainId")
);

COMMENT ON COLUMN "public"."eventPassNft"."contractAddress" IS E'Identifies the smart contract associated with the event pass NFT. This provides a direct link to the NFTs origin and behavior on the blockchain.';

COMMENT ON COLUMN "public"."eventPassNft"."tokenId" IS E'The unique identifier of the event pass NFT within its specific collection or contract. This remains constant across various platforms.';

COMMENT ON COLUMN "public"."eventPassNft"."metadata" IS E'The structured metadata parsed from the token URI. This contains a variety of details regarding the event pass NFT.';

COMMENT ON COLUMN "public"."eventPassNft"."error" IS E'Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process.';

COMMENT ON COLUMN "public"."eventPassNft"."tokenUri" IS E'The designated URI for the event pass NFTs metadata blob, providing a stable reference for data extraction.';

COMMENT ON COLUMN "public"."eventPassNft"."chainId" IS E'Denotes the specific blockchain or network of the event pass NFT';

COMMENT ON COLUMN "public"."eventPassNft"."eventId" IS E'A reference to the event associated with the event pass NFT';

COMMENT ON COLUMN "public"."eventPassNft"."eventPassId" IS E'Directly relates to a specific Event Pass within the system';

COMMENT ON COLUMN "public"."eventPassNft"."organizerId" IS E'Ties the event pass NFT to a specific organizer within the platform';

COMMENT ON COLUMN "public"."eventPassNft"."currentOwnerAddress" IS E'The address currently holding the event pass NFT, allowing tracking of ownership';

COMMENT ON COLUMN "public"."eventPassNft"."lastNftTransferId" IS E'Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this event pass NFT.';

COMMENT ON COLUMN "public"."eventPassNft"."isRevealed" IS E'Indicates whether the QR code pass for the event pass NFT has been revealed by the owner. This field is essential for tracking and managing the reveal status within the platform.';

-- Create trigger for eventPassNft
CREATE TRIGGER set_eventPassNft_updated_at
  BEFORE UPDATE ON "public"."eventPassNft"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

