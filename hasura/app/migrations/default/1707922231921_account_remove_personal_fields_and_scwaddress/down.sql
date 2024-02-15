
comment on column "public"."account"."phone" is E'An account can represent a user or a role on an organizer. It stores essential information and is used as the root class for relationships with other tables';
alter table "public"."account" alter column "phone" drop not null;
alter table "public"."account" add column "phone" text;

comment on column "public"."account"."scwAddress" is E'An account can represent a user or a role on an organizer. It stores essential information and is used as the root class for relationships with other tables';
alter table "public"."account" alter column "scwAddress" drop not null;
alter table "public"."account" add column "scwAddress" text;

comment on column "public"."account"."email" is E'An account can represent a user or a role on an organizer. It stores essential information and is used as the root class for relationships with other tables';
alter table "public"."account" alter column "email" drop not null;
alter table "public"."account" add column "email" text;
