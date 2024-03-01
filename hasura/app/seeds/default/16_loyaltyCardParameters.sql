SET check_function_bodies = FALSE;

INSERT INTO public."loyaltyCardParameters"(id, "loyaltyCardId", "activityWebhookId", status, created_at, updated_at, "organizerId", "activityWebhookSigningKey", "metadataUpdateWebhookId", "metadataUpdateWebhookSigningKey")
  VALUES 
  ('bc357268-8897-4b3b-8a9a-071c432e71d3', 'test-loyalty-card-id', NULL, 'DRAFT', '2024-03-25 13:13:30.060598+00', '2024-03-25 13:13:30.060598+00', 'test-organizer-id', NULL, NULL, NULL),
  ('bc357268-8897-4b3b-8a9a-071c432e71d4', 'test-loyalty-card-activity', 'activity-loyalty-card-webhook-id', 'DRAFT', '2024-03-25 13:13:30.060598+00', '2024-03-25 13:13:30.060598+00', 'test-organizer-id', 'test-loyalty-card-activity-signing-key', NULL, NULL);

