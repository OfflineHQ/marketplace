

alter table "public"."packNftContract" drop column "eventId" cascade;

alter table "public"."nftTransfer" alter column "eventId" drop not null;

CREATE OR REPLACE FUNCTION convert_to_local_to_utc(timestmp timestamp without time zone, tz text)
RETURNS timestamp without time zone AS $$
BEGIN
    -- Converts a timestamp from a local time zone to UTC
    RETURN timestmp AT TIME ZONE tz;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.is_sale_ongoing(event_params public."eventParameters")
RETURNS boolean AS $$
BEGIN
    RETURN current_timestamp >= convert_to_local_to_utc(event_params."dateSaleStart", event_params."timezone") AND
           current_timestamp <= convert_to_local_to_utc(event_params."dateSaleEnd", event_params."timezone");
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.is_event_ongoing(event_params public."eventParameters")
RETURNS boolean AS $$
BEGIN
    RETURN current_timestamp >= convert_to_local_to_utc(event_params."dateStart", event_params."timezone") AND
           current_timestamp <= convert_to_local_to_utc(event_params."dateEnd", event_params."timezone");
END;
$$ LANGUAGE plpgsql STABLE;
