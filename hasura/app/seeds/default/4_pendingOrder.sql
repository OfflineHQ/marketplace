SET check_function_bodies = FALSE;

-- Insert data into pendingOrder table
INSERT INTO public."pendingOrder"("id", "eventPassId", "packId", "accountId", "quantity", "created_at")
  VALUES ('d4951f86-1a8f-410a-bbc1-607f1c7933b9', 'clj8raobj7g8l0aw3bfw6dny4', NULL, '679f92d6-a01e-4ab7-93f8-10840d22b0a5', 2, '2023-07-19 12:55:53.506236+00'),
('c44e9122-7818-47c2-8818-508121c9843d', 'fake-event-pass-2', NULL, '679f92d6-a01e-4ab7-93f8-10840d22b0a5', 2, '2023-07-19 12:58:46.636737+00'),
('d3ce4e64-f405-4b98-bcb9-e6b0222ad60a', 'clj8raobj7g8l0aw3bfw6dny4', NULL, '76189546-6368-4325-8aad-220e03837b7e', 12, '2023-07-19 12:59:19.072182+00'),
('383a710f-1baf-4b5b-9196-a95918e7d404', 'clj8raobj7g8l0aw3bfw6dny4', NULL, 'ac542c34-1907-451c-94be-5df69a959080', 2, '2023-08-01 12:45:22.322703+00'),
('8252b71e-a13e-4fe0-9fcc-62e41cf87fe2', 'clkr1vpdhnqg80bw2ckil7ytq', NULL, 'ac542c34-1907-451c-94be-5df69a959080', 1, '2023-08-01 12:45:22.322703+00');

