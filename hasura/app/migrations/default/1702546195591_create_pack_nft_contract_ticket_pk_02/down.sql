-- Drop the foreign key constraint
alter table "public"."eventPassNft" drop constraint "eventPassNft_packNftContractId_fkey";

-- Drop the packNftContractId column
alter table "public"."eventPassNft" drop column "packNftContractId";

-- Drop the packNftContract table
DROP TABLE "public"."packNftContract";

-- Drop the pgcrypto extension
DROP EXTENSION IF EXISTS pgcrypto;