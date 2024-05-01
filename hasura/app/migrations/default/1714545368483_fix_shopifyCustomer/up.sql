ALTER TABLE "public"."shopifyCustomer"
  DROP CONSTRAINT "shopifyCustomer_address_fkey",
  ADD CONSTRAINT "shopifyCustomer_address_fkey" FOREIGN KEY ("address") REFERENCES "public"."account"("address") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."shopifyCustomer"
  ADD CONSTRAINT "shopifyCustomer_pkey" PRIMARY KEY ("id");

ALTER TABLE "public"."shopifyCustomer"
  DROP COLUMN "updated_at" CASCADE;

