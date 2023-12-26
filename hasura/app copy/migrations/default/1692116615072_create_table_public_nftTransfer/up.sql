CREATE TABLE "public"."nftTransfer"(
  "contractAddress" text NOT NULL,
  "fromAddress" text NOT NULL,
  "toAddress" text NOT NULL,
  "transactionHash" text NOT NULL,
  "chainId" text NOT NULL,
  "blockNumber" bigint NOT NULL,
  "eventId" text NOT NULL,
  "organizerId" text NOT NULL,
  "eventPassId" text NOT NULL,
  "tokenId" bigint NOT NULL,
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  UNIQUE ("id")
);

COMMENT ON TABLE "public"."nftTransfer" IS E'The nftTransfer model is built to record and chronicle the transfer of NFTs between addresses. This model is crucial in tracing the movement of an NFT, especially when validating that an event pass has reached its intended recipient. Such a system facilitates debugging and reduces the need for excessive querying of our indexer. Entries in this table are populated through two primary avenues: either via an activity webhook responding to real-time NFT transfers or through a regular cron job as a failsafe, ensuring data integrity even if the webhook fails to capture certain events.';

CREATE EXTENSION IF NOT EXISTS pgcrypto;

