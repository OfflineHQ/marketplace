
comment on column "public"."eventNftCollection"."activityWebhookId" is NULL;

comment on column "public"."eventNftCollection"."eventId" is NULL;

comment on column "public"."eventNftCollection"."chainId" is NULL;

comment on column "public"."eventNftCollection"."contractAddress" is NULL;

comment on column "public"."nftTransfer"."tokenId" is NULL;

comment on column "public"."nftTransfer"."eventPassId" is NULL;

comment on column "public"."nftTransfer"."organizerId" is NULL;

comment on column "public"."nftTransfer"."eventId" is NULL;

comment on column "public"."nftTransfer"."blockNumber" is NULL;

comment on column "public"."nftTransfer"."chainId" is NULL;

comment on column "public"."nftTransfer"."transactionHash" is NULL;

comment on column "public"."nftTransfer"."toAddress" is NULL;

comment on column "public"."nftTransfer"."fromAddress" is NULL;

comment on column "public"."nftTransfer"."contractAddress" is NULL;


alter table "public"."nftWithMetadata" rename column "lastNftTransfer" to "lastTransfer";
comment on column "public"."nftWithMetadata"."lastTransfer" is NULL;

comment on column "public"."nftWithMetadata"."currentOwnerAddress" is NULL;

comment on column "public"."nftWithMetadata"."organizerId" is NULL;

comment on column "public"."nftWithMetadata"."eventPassId" is NULL;

comment on column "public"."nftWithMetadata"."eventId" is NULL;

comment on column "public"."nftWithMetadata"."chainId" is NULL;

comment on column "public"."nftWithMetadata"."rawTokenUri" is E'The nftWithMetadata model is designed to consolidate and store the metadata associated with each NFT. It leverages a structure resembling the alchemy-sdk, ensuring streamlined data extraction and management. This model centralizes fixed metadata, enabling the system to retrieve NFT details without frequently querying external APIs. Furthermore, the table is intended to integrate seamlessly with the existing nftTransfer model, providing a holistic view of each NFT\'s journey and characteristics within the platform.';
alter table "public"."nftWithMetadata" alter column "rawTokenUri" drop not null;
alter table "public"."nftWithMetadata" add column "rawTokenUri" text;

comment on column "public"."nftWithMetadata"."tokenUri" is NULL;

comment on column "public"."nftWithMetadata"."error" is NULL;

comment on column "public"."nftWithMetadata"."metadata" is NULL;

comment on column "public"."nftWithMetadata"."rawTokenUri" is NULL;
alter table "public"."nftWithMetadata" alter column "rawTokenUri" drop not null;

comment on column "public"."nftWithMetadata"."tokenId" is NULL;

comment on column "public"."nftWithMetadata"."contractAddress" is NULL;

DROP TABLE "public"."nftWithMetadata";