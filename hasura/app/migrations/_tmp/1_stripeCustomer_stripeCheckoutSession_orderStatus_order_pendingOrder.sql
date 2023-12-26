-- Create the stripeCustomer table
CREATE TABLE "public"."stripeCustomer" (
	"stripeCustomerId" text NOT NULL,
	"accountId" uuid REFERENCES account(id) NOT NULL,
	"created_at" timestamptz NOT NULL DEFAULT current_timestamp,
	"updated_at" timestamptz NOT NULL DEFAULT current_timestamp,
	PRIMARY KEY ("stripeCustomerId")
);
-- Add comments to describe each field in the stripeCustomer table
COMMENT ON TABLE "public"."stripeCustomer" IS 'Table to store Stripe Customer IDs for tracking user payment processes.';
COMMENT ON COLUMN "public"."stripeCustomer"."stripeCustomerId" IS 'Unique identifier for the Stripe Customer.';
COMMENT ON COLUMN "public"."stripeCustomer"."accountId" IS 'UUID referencing to the account ID in the existing accounts table.';
COMMENT ON COLUMN "public"."stripeCustomer"."created_at" IS 'Timestamp automatically set when the row is created.';
COMMENT ON COLUMN "public"."stripeCustomer"."updated_at" IS 'Timestamp automatically updated whenever the row changes.';
-- Create trigger for updating the updated_at field
CREATE TRIGGER set_public_stripeCustomer_updated_at BEFORE
UPDATE ON "public"."stripeCustomer" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_stripeCustomer_updated_at ON "public"."stripeCustomer" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
-- Create the stripeCheckoutSession table
CREATE TABLE "public"."stripeCheckoutSession" (
	"stripeSessionId" text NOT NULL,
	"stripeCustomerId" text NOT NULL REFERENCES "public"."stripeCustomer"("stripeCustomerId"),
	"created_at" timestamptz NOT NULL DEFAULT current_timestamp,
	"updated_at" timestamptz NOT NULL DEFAULT current_timestamp,
	PRIMARY KEY ("stripeSessionId")
);
-- Add comments to describe each field in the stripeCheckoutSession table
COMMENT ON TABLE "public"."stripeCheckoutSession" IS 'Table to store Stripe Checkout Sessions for tracking user checkout processes. Sessions are deleted once they are successful or expired.';
COMMENT ON COLUMN "public"."stripeCheckoutSession"."stripeSessionId" IS 'Unique identifier for the Stripe Checkout Session.';
COMMENT ON COLUMN "public"."stripeCheckoutSession"."stripeCustomerId" IS 'Stripe Customer ID referencing to the stripeCustomer table.';
COMMENT ON COLUMN "public"."stripeCheckoutSession"."created_at" IS 'Timestamp automatically set when the row is created.';
COMMENT ON COLUMN "public"."stripeCheckoutSession"."updated_at" IS 'Timestamp automatically updated whenever the row changes.';
-- Create trigger for updating the updated_at field
CREATE TRIGGER set_public_stripeCheckoutSession_updated_at BEFORE
UPDATE ON "public"."stripeCheckoutSession" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_stripeCheckoutSession_updated_at ON "public"."stripeCheckoutSession" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
-- Order status
CREATE TABLE public."orderStatus" (value text NOT NULL);
ALTER TABLE ONLY public."orderStatus"
ADD CONSTRAINT "orderStatus_pkey" PRIMARY KEY (value);
INSERT INTO public."orderStatus" (value)
VALUES ('CONFIRMED'),
	('CANCELLED'),
	('ERROR'),
	('UNAUTHORIZED'),
	('REFUNDED'),
	('IS_MINTING'),
	('COMPLETED');
CREATE TABLE "public"."order" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"eventPassId" text,
	"packId" text,
	"accountId" uuid REFERENCES account(id) NOT NULL,
	"status" text NOT NULL,
	"quantity" integer NOT NULL CHECK (quantity > 0),
	"stripeCheckoutSessionId" text REFERENCES "public"."stripeCheckoutSession"("stripeSessionId"),
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	FOREIGN KEY ("status") REFERENCES "public"."orderStatus"("value") ON UPDATE no action ON DELETE no action,
	UNIQUE ("id"),
	CHECK (
		(
			"eventPassId" IS NOT NULL
			AND "packId" IS NULL
		)
		OR (
			"eventPassId" IS NULL
			AND "packId" IS NOT NULL
		)
	)
);
CREATE TABLE "public"."pendingOrder" (
	"id" uuid NOT NULL DEFAULT gen_random_uuid(),
	"eventPassId" text,
	"packId" text,
	"accountId" uuid REFERENCES account(id) NOT NULL,
	"quantity" integer NOT NULL CHECK (quantity > 0),
	"created_at" timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY ("id"),
	CHECK (
		(
			"eventPassId" IS NOT NULL
			AND "packId" IS NULL
		)
		OR (
			"eventPassId" IS NULL
			AND "packId" IS NOT NULL
		)
	)
);
CREATE UNIQUE INDEX idx_pendingorder_eventpassid_accountid ON "public"."pendingOrder"("eventPassId", "accountId")
WHERE "eventPassId" IS NOT NULL;
CREATE UNIQUE INDEX idx_pendingorder_packid_accountid ON "public"."pendingOrder"("packId", "accountId")
WHERE "packId" IS NOT NULL;
COMMENT ON TABLE "public"."pendingOrder" IS 'Order a quantity of Event Pass or Pack (linked to Hygraph model EventPass or Pack) and associated to an Account. Those orders are time bound and are automatically destroyed given an amount of time to preserve access to the event for other users.';
COMMENT ON TABLE "public"."order" IS 'Order a quantity of Event Pass or Pack (linked to Hygraph model EventPass or Pack) and associated to an Account';
CREATE TRIGGER set_order_updated_at BEFORE
UPDATE ON "public"."order" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();