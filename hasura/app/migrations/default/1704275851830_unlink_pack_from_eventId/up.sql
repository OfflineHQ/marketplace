
alter table "public"."packNftContract" drop column "eventId" cascade;

alter table "public"."nftTransfer" alter column "eventId" drop not null;
