SET check_function_bodies = FALSE;

-- Insert data into eventParameters table
INSERT INTO public."eventParameters"("id", "eventId", "activityWebhookId", "status", "created_at", "updated_at", "dateStart", "dateEnd", "dateSaleStart", "dateSaleEnd", "timezone", "organizerId", "signingKey")
  VALUES ('f493d61a-d52b-4664-84c7-cd3cf1872ef1', 'clizzpvidao620buvxit1ynko', 'fake-webhook-id', 'DRAFT', '2023-08-24 08:35:47.155813+00', '2023-08-24 08:35:47.155813+00', '2023-08-24 08:35:47.155813+00', '2023-08-25 12:00:00.155813+00', '2023-07-23 12:00:00.0', '2023-08-24 12:00:00.0', 'Europe/London', 'clizzky8kap2t0bw7wka9a2id', 'fake-signing-key');

