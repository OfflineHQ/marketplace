

CREATE TABLE "public"."nftWithMetadata" ("contractAddress" text NOT NULL, "tokenId" int8 NOT NULL, "rawTokenUri" text, "metadata" jsonb NOT NULL, "error" text, "tokenUri" text, "chainId" text NOT NULL, "eventId" text NOT NULL, "eventPassId" text NOT NULL, "organizerId" text NOT NULL, "currentOwnerAddress" text NOT NULL, "lastTransfer" uuid, "id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );COMMENT ON TABLE "public"."nftWithMetadata" IS E'The nftWithMetadata model is designed to consolidate and store the metadata associated with each NFT. It leverages a structure resembling the alchemy-sdk, ensuring streamlined data extraction and management. This model centralizes fixed metadata, enabling the system to retrieve NFT details without frequently querying external APIs. Furthermore, the table is intended to integrate seamlessly with the existing nftTransfer model, providing a holistic view of each NFT\'s journey and characteristics within the platform.';
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_nftWithMetadata_updated_at"
BEFORE UPDATE ON "public"."nftWithMetadata"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_nftWithMetadata_updated_at" ON "public"."nftWithMetadata"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

comment on column "public"."nftWithMetadata"."contractAddress" is E'Identifies the smart contract associated with the NFT. This provides a direct link to the NFT\'s origin and behavior on the blockchain.';

comment on column "public"."nftWithMetadata"."tokenId" is E'The unique identifier of the NFT within its specific collection or contract. This remains constant across various platforms.';

alter table "public"."nftWithMetadata" alter column "rawTokenUri" set not null;
comment on column "public"."nftWithMetadata"."rawTokenUri" is E'The direct link to the raw metadata associated with the NFT, as per its smart contract.';

comment on column "public"."nftWithMetadata"."metadata" is E'The structured metadata parsed from the raw token URI. This contains a variety of details regarding the NFT.';

comment on column "public"."nftWithMetadata"."error" is E'Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process.';

comment on column "public"."nftWithMetadata"."tokenUri" is E'The designated URI for the NFT\'s metadata blob, providing a stable reference for data extraction.';

alter table "public"."nftWithMetadata" drop column "rawTokenUri" cascade;

comment on column "public"."nftWithMetadata"."chainId" is E'Denotes the specific blockchain or network of the NFT';

comment on column "public"."nftWithMetadata"."eventId" is E'A reference to the event associated with the NFT';

comment on column "public"."nftWithMetadata"."eventPassId" is E'Directly relates to a specific Event Pass within the system';

comment on column "public"."nftWithMetadata"."organizerId" is E'Ties the NFT to a specific organizer within the platform';

comment on column "public"."nftWithMetadata"."currentOwnerAddress" is E'The address currently holding the NFT, allowing tracking of ownership';

comment on column "public"."nftWithMetadata"."lastTransfer" is E'Reference `id` to the latest `nftTransfer` entry, detailing the most recent transaction for this NFT.';
alter table "public"."nftWithMetadata" rename column "lastTransfer" to "lastNftTransfer";

comment on column "public"."nftTransfer"."contractAddress" is E'Identifies the smart contract associated with the NFT. This provides a direct link to the NFT\'s origin and behavior on the blockchain.';

comment on column "public"."nftTransfer"."fromAddress" is E'Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFT\'s movement.';

comment on column "public"."nftTransfer"."toAddress" is E'Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT.';

comment on column "public"."nftTransfer"."transactionHash" is E'Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain.';

comment on column "public"."nftTransfer"."chainId" is E'Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains.';

comment on column "public"."nftTransfer"."blockNumber" is E'The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain\'s history.';

comment on column "public"."nftTransfer"."eventId" is E'Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform.';

comment on column "public"."nftTransfer"."organizerId" is E'Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers.';

comment on column "public"."nftTransfer"."eventPassId" is E'Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass.';

comment on column "public"."nftTransfer"."tokenId" is E'The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms.';

comment on column "public"."eventNftCollection"."contractAddress" is E'Represents the unique address of the smart contract that governs the NFT collection. It acts as the primary reference to the NFT\'s existence and behavior on the blockchain.';

comment on column "public"."eventNftCollection"."chainId" is E'Specifies the particular blockchain or network on which the NFT collection resides. Essential for distinguishing between different blockchains in a multi-chain environment.';

comment on column "public"."eventNftCollection"."eventId" is E'A unique identifier for the event associated with the NFT collection. This ties each collection directly to a specific event within the platform.';

comment on column "public"."eventNftCollection"."activityWebhookId" is E'Designates the unique identifier for the activity webhook related to the NFT collection. This is crucial for real-time monitoring and processing of events or changes associated with the NFT collection on the platform.';
