-- Create the new table eventPassNftContract
CREATE TABLE "public"."eventPassNftContract" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "chainId" text NOT NULL,
    "contractAddress" text NOT NULL,
    "eventId" text NOT NULL,
    "eventPassId" text NOT NULL,
    "organizerId" text NOT NULL,
    UNIQUE ("contractAddress", "chainId")
);

COMMENT ON TABLE "public"."eventPassNftContract" IS E'The eventPassNftContract model is designed to store metadata associated with NFT contracts linked to specific event passes. This table captures critical, immutable details from the ERC-721 standard, such as the chainId and contractAddress, ensuring accurate tracking and referencing of NFT contracts. Additionally, this table includes information specific to each event pass, like the eventPassId and organizerId, allowing for precise management and interaction with NFT contracts tied to individual event passes. By centralizing this information, our system can effectively manage, reference, and interact with NFT contracts related to particular event passes.';

CREATE EXTENSION IF NOT EXISTS pgcrypto;
