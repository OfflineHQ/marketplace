
alter table "public"."eventParameters" drop constraint "eventParameters_signingKey_key";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."eventParameters" add column "signingKey" text
--  null;
