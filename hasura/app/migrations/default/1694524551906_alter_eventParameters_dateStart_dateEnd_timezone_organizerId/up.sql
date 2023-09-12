-- Add columns to eventParameters
ALTER TABLE "public"."eventParameters"
ADD COLUMN "dateStart" timestamp without time zone,
ADD COLUMN "dateEnd" timestamp without time zone,
ADD COLUMN "timezone" text,
ADD COLUMN "organizerId" text NOT NULL;

-- Add foreign key constraint
ALTER TABLE "public"."eventParameters"
ADD CONSTRAINT "fk_timezone"
FOREIGN KEY ("timezone")
REFERENCES "public"."timezone"("value")
ON DELETE CASCADE
ON UPDATE CASCADE;
