
alter table "public"."eventPassNft" drop constraint "eventPassNft_packNftContractId_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."eventPassNft" add column "packNftContractId" uuid
--  null;

DROP TABLE "public"."packNftContract";

alter table "public"."eventPassNftContract" drop constraint "eventPassNftContract_chainId_contractAddress_key";
alter table "public"."eventPassNftContract" add constraint "eventPassNftContract_chainId_contractAddress_key" unique ("chainId", "contractAddress");

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- drop schema "packNftContract" cascade;

drop schema "packNftContract" cascade;
