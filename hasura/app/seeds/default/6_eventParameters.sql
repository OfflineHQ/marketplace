SET check_function_bodies = FALSE;

-- Insert data into eventParameters table
INSERT INTO public."eventParameters"("id", "eventId", "activityWebhookId", "status", "created_at", "updated_at", "dateStart", "dateEnd", "dateSaleStart", "dateSaleEnd", "timezone", "organizerId", "signingKey")
  VALUES ('f493d61a-d52b-4664-84c7-cd3cf1872ef1', 'clizzpvidao620buvxit1ynko', 'fake-webhook-id', 'PUBLISHED', '2023-08-24 08:35:47.155813+00', '2023-08-24 08:35:47.155813+00', '2023-08-24 08:35:47.155813+00', '2023-08-25 12:00:00.155813', '2023-04-23 12:00:00.0', '2023-07-24 12:00:00.0', 'Europe/London', 'clizzky8kap2t0bw7wka9a2id', 'fake-signing-key'),
('42d424d6-da70-4f9d-bf29-3f4ec27b32e7', 'clocula4d04g40bw1t9zefsuc', 'fake-webhook-id-2', 'DRAFT', '2023-08-24 08:35:47.155813+00', '2023-08-24 08:35:47.155813+00', '2023-08-24 08:35:47.155813+00', '2023-08-25 12:00:00.155813', '2023-07-23 12:00:00.0', '2023-08-24 12:00:00.0', 'Europe/London', 'clizzky8kap2t0bw7wka9a2id', 'fake-signing-key-2'),
('2f4a6f17-01a9-4c34-b61e-b1d190ff4a0e', 'fake-event-1', 'fake-webhook-id-3', 'PUBLISHED', '2024-02-12 08:35:47.155813+00', '2024-02-13 08:35:47.155813+00', '2024-03-12 08:00:00.155813', '2024-03-12 18:00:00.155813', '2023-01-23 12:00:00.0', '2024-03-12 08:00:00.155813', 'America/New_York', 'clizzky8kap2t0bw7wka9a2id', 'fake-signing-key-3');

