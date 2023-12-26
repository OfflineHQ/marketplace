-- Create the follow table to store follow relationships between accounts and organizers
CREATE TABLE "public"."follow"(
  "accountId" uuid NOT NULL REFERENCES "public"."account"("id"),
  "organizerSlug" text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("accountId", "organizerSlug")
);

COMMENT ON TABLE "public"."follow" IS 'Stores follow relationships. Each row represents an account following an organizer.';

-- Add comments to describe each column
COMMENT ON COLUMN "public"."follow"."accountId" IS 'References the unique identifier of the account that is following an organizer.';

COMMENT ON COLUMN "public"."follow"."organizerSlug" IS 'Represents the unique slug of the organizer being followed. Slugs are user-friendly identifiers that uniquely identify organizers.';

-- Comment on the primary key constraint
COMMENT ON CONSTRAINT "follow_pkey" ON "public"."follow" IS 'Composite primary key ensuring that an account can follow a specific organizer only once.';

-- Optional: Create an index on the organizerSlug column for faster queries
CREATE INDEX "idx_follow_organizerSlug" ON "public"."follow"("organizerSlug");
