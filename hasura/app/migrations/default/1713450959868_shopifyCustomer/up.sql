-- Create the shopifyCustomer table
CREATE TABLE "public"."shopifyCustomer"(
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  "address" text REFERENCES account("address") NOT NULL,
  "organizerId" text NOT NULL,
  "customerId" text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE ("address", "organizerId", "customerId") -- Ensures unique pairing of account, organizer, and Shopify customer
);

-- Comments on the purpose of the table and its fields
COMMENT ON TABLE "public"."shopifyCustomer" IS E'This table stores the link between the offline accounts and Shopify customer IDs. It allows organizers to manage customer data seamlessly across platforms without needing to handle sensitive personal information directly.';

COMMENT ON COLUMN "public"."shopifyCustomer"."id" IS E'Unique identifier for each entry, generated automatically as a UUID.';

COMMENT ON COLUMN "public"."shopifyCustomer"."address" IS E'Reference to the account table, ensuring that customer data is associated with a unique account address.';

COMMENT ON COLUMN "public"."shopifyCustomer"."organizerId" IS E'Identifier for the organizer, used to scope Shopify customer data to specific organizers, allowing them to manage their client data independently.';

COMMENT ON COLUMN "public"."shopifyCustomer"."customerId" IS E'The unique identifier for the customer as stored in Shopify. This links the internal account to the Shopify customer record, facilitating integrated data management across systems.';

COMMENT ON COLUMN "public"."shopifyCustomer"."created_at" IS E'Timestamp indicating when the record was initially created, set automatically by the system.';

-- Index for faster lookup by address, organizerId, and customerId
CREATE INDEX idx_shopify_customer_on_address_organizer_customer ON "public"."shopifyCustomer"("address", "organizerId", "customerId");
