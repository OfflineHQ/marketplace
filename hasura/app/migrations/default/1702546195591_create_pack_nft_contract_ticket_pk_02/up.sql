
create schema "packNftContract";

drop schema "packNftContract" cascade;

alter table "public"."eventPassNftContract" drop constraint "eventPassNftContract_contractAddress_chainId_key";
alter table "public"."eventPassNftContract" add constraint "eventPassNftContract_chainId_contractAddress_key" unique ("chainId", "contractAddress");

CREATE TABLE "public"."packNftContract" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "chainId" text NOT NULL, "contractAddress" text NOT NULL, "rewardsPerPack" integer NOT NULL DEFAULT 1, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "organizerId" text NOT NULL, "eventId" text NOT NULL, "packId" text NOT NULL, "eventPassIds" jsonb NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"), UNIQUE ("contractAddress", "chainId"));COMMENT ON TABLE "public"."packNftContract" IS E'packNftContract model to manage the NFTs associated with each pack.';
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
CREATE TRIGGER "set_public_packNftContract_updated_at"
BEFORE UPDATE ON "public"."packNftContract"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_packNftContract_updated_at" ON "public"."packNftContract"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."eventPassNft" add column "packNftContractId" uuid
 null;

alter table "public"."eventPassNft"
  add constraint "eventPassNft_packNftContractId_fkey"
  foreign key ("packNftContractId")
  references "public"."packNftContract"
  ("id") on update restrict on delete restrict;
