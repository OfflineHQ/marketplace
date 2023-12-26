
alter table "public"."eventParameters" add column "signingKey" text
 null;

alter table "public"."eventParameters" add constraint "eventParameters_signingKey_key" unique ("signingKey");
