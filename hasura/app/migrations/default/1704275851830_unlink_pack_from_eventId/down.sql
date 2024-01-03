
alter table "public"."nftTransfer" alter column "eventId" set not null;

comment on column "public"."packNftContract"."eventId" is E'packNftContract model to manage the NFTs associated with each pack.';
alter table "public"."packNftContract" alter column "eventId" drop not null;
alter table "public"."packNftContract" add column "eventId" text;
