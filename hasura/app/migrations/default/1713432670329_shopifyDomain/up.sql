-- Create the shopifyDomain table
CREATE TABLE "public"."shopifyDomain" (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  domain text NOT NULL,
  "organizerId" text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create a unique index on the domain column for optimized querying
CREATE UNIQUE INDEX idx_shopify_domain_unique_domain ON "public"."shopifyDomain" (domain);

-- Comments on the purpose of the shopifyDomain table and its fields
COMMENT ON TABLE "public"."shopifyDomain" IS E'This table is used to link and authenticate queries from Shopify to an organizer in our system. It stores the unique Shopify domains associated with each organizer, allowing for efficient lookup and validation of incoming requests.';

COMMENT ON COLUMN "public"."shopifyDomain"."id" IS E'Unique identifier for each Shopify domain entry, generated automatically as a UUID.';

COMMENT ON COLUMN "public"."shopifyDomain"."domain" IS E'The Shopify domain value, which must be unique across the entire table to ensure accurate mapping between Shopify and our system.';

COMMENT ON COLUMN "public"."shopifyDomain"."organizerId" IS E'The unique identifier of the associated organizer in our external CRM system. This field is used to link Shopify domains to the corresponding organizers.';

COMMENT ON COLUMN "public"."shopifyDomain"."created_at" IS E'Timestamp indicating when the record was initially created, set automatically by the system.';

COMMENT ON COLUMN "public"."shopifyDomain"."updated_at" IS E'Timestamp indicating the last time the record was updated, automatically managed by a database trigger to ensure accuracy.';

-- Create trigger for updating the updated_at field in the shopifyDomain table
CREATE TRIGGER set_public_shopify_domain_updated_at
  BEFORE UPDATE ON "public"."shopifyDomain"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
