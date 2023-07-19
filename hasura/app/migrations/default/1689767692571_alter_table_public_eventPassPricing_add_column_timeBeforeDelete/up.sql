alter table "public"."eventPassPricing" add column "timeBeforeDelete" integer
 not null default '14400';
