SET check_function_bodies = FALSE;

INSERT INTO public."eventPassOrder"(id, "eventPassId", "accountId", status, quantity, created_at, updated_at, "stripeCheckoutSessionId")
  VALUES ('1e8b9aea-1b0a-4a05-803b-c72d0b46e9a2', 'fake-event-pass-2', '679f92d6-a01e-4ab7-93f8-10840d22b0a5', 'CONFIRMED', 8, '2023-10-10 16:59:59.364057+00', '2023-10-10 16:59:59.364057+00', 'cs_test_a17kYy8IpmWsLecscKe5pRQNP5hir8ysWC9sturzdXMfh7Y94gYJIAyePN');

INSERT INTO public."eventPassOrder"(id, "eventPassId", "accountId", status, quantity, created_at, updated_at, "stripeCheckoutSessionId")
  VALUES ('2e8b9aea-1b0a-4a05-803b-c72d0b46e9a3', 'fake-event-pass-3', '679f92d6-a01e-4ab7-93f8-10840d22b0a5', 'IS_MINTING', 2, '2023-10-10 16:59:59.364057+00', '2023-10-10 16:59:59.364057+00', '');

