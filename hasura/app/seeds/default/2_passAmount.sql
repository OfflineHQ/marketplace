SET check_function_bodies = FALSE;

INSERT INTO public."passAmount"("eventPassId", "packId", created_at, updated_at, id, "maxAmount", "maxAmountPerUser", "currency")
  VALUES ('fake-event-pass-1', NULL, '2023-07-17 18:53:23.240091+00', '2023-07-17 18:53:23.240091+00', '49c78d67-e7a6-45f7-b8e2-bfe64ffbcb8c', 100, NULL, 'EUR'),
('fake-event-pass-2', NULL, '2023-07-17 18:53:51.122975+00', '2023-07-17 18:53:51.122975+00', '882a6f55-75af-471d-8ed2-a8bb2e776409', 200, 10, 'EUR'),
('fake-event-pass-3', NULL, '2023-07-17 18:53:51.122975+00', '2023-07-17 18:53:51.122975+00', '609aa404-9467-4792-bb26-7b9de9cda12d', 200, 10, 'EUR'),
('clj8raobj7g8l0aw3bfw6dny4', NULL, '2023-07-31 15:55:59.133832+00', '2023-07-31 15:55:59.133832+00', '0e8097a7-dfb2-4fdc-93db-398ba3f9cc48', 100, NULL, 'EUR'),
('clkr1vpdhnqg80bw2ckil7ytq', NULL, '2023-07-31 15:56:29.383202+00', '2023-07-31 15:56:29.383202+00', '34fd4a49-1365-4e74-a710-7eccd17441ca', 20, 1, 'EUR'),
('cljhacja42h990but6yliuhza', NULL, '2023-07-31 15:56:29.383202+00', '2023-07-31 15:56:29.383202+00', 'effe8e84-164d-4943-8d01-f78566a50990', 20, 1, 'EUR');

