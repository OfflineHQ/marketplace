
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION public.is_event_ongoing(event_params public."eventParameters")
-- RETURNS boolean AS $$
-- BEGIN
--     RETURN current_timestamp >= convert_to_local_to_utc(event_params."dateStart", event_params."timezone") AND
--            current_timestamp <= convert_to_local_to_utc(event_params."dateEnd", event_params."timezone");
-- END;
-- $$ LANGUAGE plpgsql STABLE;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION public.is_sale_ongoing(event_params public."eventParameters")
-- RETURNS boolean AS $$
-- BEGIN
--     RETURN current_timestamp >= convert_to_local_to_utc(event_params."dateSaleStart", event_params."timezone") AND
--            current_timestamp <= convert_to_local_to_utc(event_params."dateSaleEnd", event_params."timezone");
-- END;
-- $$ LANGUAGE plpgsql STABLE;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION convert_to_local_to_utc(timestmp timestamp without time zone, tz text)
-- RETURNS timestamp without time zone AS $$
-- BEGIN
--     -- Converts a timestamp from a local time zone to UTC
--     RETURN timestmp AT TIME ZONE tz;
-- END;
-- $$ LANGUAGE plpgsql STABLE;


alter table "public"."nftTransfer" alter column "eventId" set not null;

comment on column "public"."packNftContract"."eventId" is E'packNftContract model to manage the NFTs associated with each pack.';
alter table "public"."packNftContract" alter column "eventId" drop not null;
alter table "public"."packNftContract" add column "eventId" text;
