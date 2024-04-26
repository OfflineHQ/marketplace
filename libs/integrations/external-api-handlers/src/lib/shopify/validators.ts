import { z } from 'zod';

export const MintLoyaltyCardWithPasswordParams = z.object({
  password: z.string(),
  ownerAddress: z.string(),
});

export const MintLoyaltyCardWithCustomerIdParams = z.object({
  ownerAddress: z.string(),
  customerId: z.string(),
});

export const HasLoyaltyCardParams = z.object({
  ownerAddress: z.string(),
});

export const CreateShopifyCustomerParams = z.object({
  address: z.string(),
});

export const GetShopifyCustomerParams = z.object({
  address: z.string(),
});

export const LineItemSchema = z.object({
  key: z.string(),
  destination_location_id: z.number(),
  fulfillment_service: z.string(),
  gift_card: z.boolean(),
  grams: z.number(),
  origin_location_id: z.number(),
  presentment_title: z.string(),
  presentment_variant_title: z.string(),
  product_id: z.number(),
  properties: z.null().optional(),
  quantity: z.number(),
  requires_shipping: z.boolean(),
  sku: z.string(),
  tax_lines: z.array(
    z.object({
      price: z.string(),
      position: z.number(),
      rate: z.number(),
      title: z.string(),
      source: z.string(),
      zone: z.string(),
      channel_liable: z.boolean(),
    }),
  ),
  taxable: z.boolean(),
  title: z.string(),
  variant_id: z.number(),
  variant_title: z.string(),
  variant_price: z.string(),
  vendor: z.string(),
  unit_price_measurement: z.object({
    measured_type: z.null().optional(),
    quantity_value: z.null().optional(),
    quantity_unit: z.null().optional(),
    reference_value: z.null().optional(),
    reference_unit: z.null().optional(),
  }),
});

export const CustomerSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  orders_count: z.number(),
  state: z.string(),
  total_spent: z.string(),
  verified_email: z.boolean(),
  tax_exempt: z.boolean(),
  tags: z.string(),
  currency: z.string(),
});

export const WebhookCheckoutsPaidParams = z.object({
  id: z.bigint(),
  token: z.string(),
  cart_token: z.string(),
  email: z.string().email(),
  gateway: z.null().optional(),
  buyer_accepts_marketing: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  landing_site: z.null().optional(),
  note: z.null().optional(),
  note_attributes: z.array(z.any()).optional(), // Can be more specific based on actual data
  referring_site: z.null().optional(),
  shipping_lines: z.array(z.any()).optional(), // Can be more specific based on actual data
  taxes_included: z.boolean(),
  total_weight: z.number(),
  currency: z.string(),
  completed_at: z.null().optional(),
  closed_at: z.null().optional(),
  line_items: z.array(LineItemSchema),
  name: z.string(),
  abandoned_checkout_url: z.string().url(),
  discount_codes: z.array(z.any()).optional(), // Can be more specific based on actual data
  tax_lines: z.array(
    z.object({
      price: z.string(),
      rate: z.number(),
      title: z.string(),
      channel_liable: z.boolean(),
    }),
  ),
  source_name: z.string(),
  presentment_currency: z.string(),
  buyer_accepts_sms_marketing: z.boolean(),
  sms_marketing_phone: z.null().optional(),
  total_discounts: z.string(),
  total_line_items_price: z.string(),
  total_price: z.string(),
  total_tax: z.string(),
  subtotal_price: z.string(),
  total_duties: z.null().optional(),
  reservation_token: z.null().optional(),
  customer: CustomerSchema,
});
