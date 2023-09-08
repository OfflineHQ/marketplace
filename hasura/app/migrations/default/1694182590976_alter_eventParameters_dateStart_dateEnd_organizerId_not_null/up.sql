alter table
  "public"."eventParameters"
add
  column "dateStart" date null;

alter table
  "public"."eventParameters"
add
  column "dateEnd" date null;

alter table
  "public"."eventParameters"
add
  column "organizerId" text not null;
