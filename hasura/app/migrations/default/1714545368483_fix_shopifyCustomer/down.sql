ALTER TABLE "public"."shopifyCustomer"
  DROP CONSTRAINT "shopifyCustomer_address_fkey",
  ADD CONSTRAINT "shopifyCustomer_address_fkey" FOREIGN KEY ("address") REFERENCES "public"."account"("address") ON UPDATE NO action ON DELETE NO action;

ALTER TABLE "public"."shopifyCustomer"
  DROP CONSTRAINT "shopifyCustomer_pkey";

COMMENT ON COLUMN "public"."shopifyCustomer"."updated_at" IS E'This table stores the link between the offline accounts and Shopify customer IDs. It allows organizers to manage customer data seamlessly across platforms without needing to handle sensitive personal information directly.';

ALTER TABLE "public"."shopifyCustomer"
  ALTER COLUMN "updated_at" SET DEFAULT now();

ALTER TABLE "public"."shopifyCustomer"
  ALTER COLUMN "updated_at" DROP NOT NULL;

ALTER TABLE "public"."shopifyCustomer"
  ADD COLUMN "updated_at" timestamptz;

