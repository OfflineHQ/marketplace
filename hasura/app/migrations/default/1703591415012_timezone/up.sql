CREATE TABLE "public"."timezone"(
  "value" text NOT NULL,
  PRIMARY KEY ("value")
);

-- Comment to describe the purpose of the timezone table
COMMENT ON TABLE "public"."timezone" IS E'IANA Time Zones fetched from pg_timezone_names in PostgreSQL';

-- Populate the timezone table with values from pg_timezone_names
DO $$
DECLARE
  tz_name text;
BEGIN
  FOR tz_name IN (
    SELECT
      name
    FROM
      pg_timezone_names
    WHERE
      name NOT LIKE 'posix/%')
    LOOP
      INSERT INTO "public"."timezone"("value")
        VALUES (tz_name)
      ON CONFLICT ("value")
        DO NOTHING;
    END LOOP;
END
$$;

-- Comment to describe what the migration script is doing
COMMENT ON SCHEMA "public" IS E'This migration script creates a "timezone" table and populates it with IANA time zone names fetched from pg_timezone_names. It ensures the time zones are unique to prevent duplication.';
