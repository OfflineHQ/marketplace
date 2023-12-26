
alter table "public"."eventParameters" alter column "activityWebhookId" set not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE TABLE "public"."eventParameters" (
--     "id" uuid NOT NULL DEFAULT gen_random_uuid(),
--     "eventId" text NOT NULL,
--     "activityWebhookId" text NOT NULL,
--     PRIMARY KEY ("id"),
--     UNIQUE ("activityWebhookId"),
--     UNIQUE ("eventId")
-- );
--
-- COMMENT ON TABLE "public"."eventParameters" IS E'The eventParameters model is designed to define properties on an event involving all event passes. This table includes critical details like the eventId and activityWebhookId, which aids in monitoring and processing events or changes related to the event parameters. By centralizing this information, our system can effectively manage and control parameters tied to specific events, enhancing the overall functionality and flexibility of event handling.';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- -- Create the new table eventPassNftContract
-- CREATE TABLE "public"."eventPassNftContract" (
--     "id" serial PRIMARY KEY,
--     "chainId" text NOT NULL,
--     "contractAddress" text NOT NULL,
--     "eventId" text NOT NULL,
--     "eventPassId" text NOT NULL,
--     "organizerId" text NOT NULL,
--     UNIQUE ("contractAddress")
-- );
--
-- COMMENT ON TABLE "public"."eventPassNftContract" IS E'The eventPassNftContract model is designed to store metadata associated with NFT contracts linked to specific event passes. This table captures critical, immutable details from the ERC-721 standard, such as the chainId and contractAddress, ensuring accurate tracking and referencing of NFT contracts. Additionally, this table includes information specific to each event pass, like the eventPassId and organizerId, allowing for precise management and interaction with NFT contracts tied to individual event passes. By centralizing this information, our system can effectively manage, reference, and interact with NFT contracts related to particular event passes.';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."eventNftCollection";
