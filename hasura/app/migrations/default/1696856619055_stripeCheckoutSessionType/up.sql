-- Create the stripeCheckoutSessionType table to store the types of checkout sessions
CREATE TABLE "public"."stripeCheckoutSessionType" (
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);
COMMENT ON TABLE "public"."stripeCheckoutSessionType" IS 'Types of Stripe Checkout Sessions.';

-- Insert default value into stripeCheckoutSessionType
INSERT INTO "public"."stripeCheckoutSessionType" ("value") VALUES 
('event_pass_order');

-- Add comments to describe each type in stripeCheckoutSessionType
COMMENT ON COLUMN "public"."stripeCheckoutSessionType"."value" IS 'Type value.';
COMMENT ON CONSTRAINT "stripeCheckoutSessionType_pkey" ON "public"."stripeCheckoutSessionType" IS 'event_pass_order: Checkout session for event pass order.';

-- Add the type column to the stripeCheckoutSession table
ALTER TABLE "public"."stripeCheckoutSession" 
ADD COLUMN "type" text NOT NULL DEFAULT 'event_pass_order' REFERENCES "public"."stripeCheckoutSessionType"("value");

-- Add comments to describe the type column in the stripeCheckoutSession table
COMMENT ON COLUMN "public"."stripeCheckoutSession"."type" IS 'Type of the Stripe Checkout Session. Default is event_pass_order. References to the stripeCheckoutSessionType table.';
