-- Create the personalInfo table
CREATE TABLE "public"."personalInfo"(
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  "address" text REFERENCES account("address") NOT NULL,
  "organizerId" text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE ("address", "organizerId") -- Ensures one entry per organizerId for an account
);

-- Comments on the purpose of the table and its fields
COMMENT ON TABLE "public"."personalInfo" IS E'This table stores the personal information of users linked to specific organizers. It is designed to ensure that organizers can securely contact their clients. Sensitive information is encrypted by the application before being stored here to comply with GDPR and protect against data leaks.';

COMMENT ON COLUMN "public"."personalInfo"."id" IS E'Unique identifier for each entry, generated automatically as a UUID.';

COMMENT ON COLUMN "public"."personalInfo"."address" IS E'Reference to the account table, ensuring that personal information is associated with a unique account address.';

COMMENT ON COLUMN "public"."personalInfo"."organizerId" IS E'Identifier for the organizer, used to scope personal information to specific organizers, allowing them to manage their client data independently.';

COMMENT ON COLUMN "public"."personalInfo"."email" IS E'Encrypted email address of the user, stored securely to maintain privacy and comply with data protection regulations.';

COMMENT ON COLUMN "public"."personalInfo"."created_at" IS E'Timestamp indicating when the record was initially created, set automatically by the system.';

COMMENT ON COLUMN "public"."personalInfo"."updated_at" IS E'Timestamp indicating the last time the record was updated, automatically managed by a database trigger to ensure accuracy.';

-- Index for faster lookup by accountId and organizerId
CREATE INDEX idx_personal_info_on_account_and_company ON "public"."personalInfo"("address", "organizerId");

-- Create trigger for updating the updated_at field
CREATE TRIGGER set_public_personal_info_updated_at
  BEFORE UPDATE ON "public"."personalInfo"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

