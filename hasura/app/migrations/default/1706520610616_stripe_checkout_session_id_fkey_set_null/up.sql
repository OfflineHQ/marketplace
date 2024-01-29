ALTER TABLE "public"."order"
DROP CONSTRAINT "order_stripeCheckoutSessionId_fkey";

ALTER TABLE "public"."order"
ADD CONSTRAINT "order_stripeCheckoutSessionId_fkey" FOREIGN KEY ("stripeCheckoutSessionId") REFERENCES "public"."stripeCheckoutSession"("stripeSessionId") ON DELETE SET NULL;
