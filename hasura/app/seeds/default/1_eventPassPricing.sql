SET
	check_function_bodies = false;

INSERT INTO
	public."eventPassPricing" (
		"eventPassId",
		created_at,
		updated_at,
		id,
		"maxAmount",
		"maxAmountPerUser",
		"priceAmount",
		"priceCurrency",
		"timeBeforeDelete"
	)
VALUES
	(
		'fake-event-pass-1',
		'2023-07-17 18:53:23.240091+00',
		'2023-07-17 18:53:23.240091+00',
		'49c78d67-e7a6-45f7-b8e2-bfe64ffbcb8c',
		100,
		NULL,
		120000,
		'EUR',
		14400
	);

INSERT INTO
	public."eventPassPricing" (
		"eventPassId",
		created_at,
		updated_at,
		id,
		"maxAmount",
		"maxAmountPerUser",
		"priceAmount",
		"priceCurrency",
		"timeBeforeDelete"
	)
VALUES
	(
		'fake-event-pass-2',
		'2023-07-17 18:53:51.122975+00',
		'2023-07-17 18:53:51.122975+00',
		'882a6f55-75af-471d-8ed2-a8bb2e776409',
		200,
		10,
		130000,
		'EUR',
		14400
	);

INSERT INTO
	public."eventPassPricing" (
		"eventPassId",
		created_at,
		updated_at,
		id,
		"maxAmount",
		"maxAmountPerUser",
		"priceAmount",
		"priceCurrency",
		"timeBeforeDelete"
	)
VALUES
	(
		'clj8raobj7g8l0aw3bfw6dny4',
		'2023-07-31 15:55:59.133832+00',
		'2023-07-31 15:55:59.133832+00',
		'0e8097a7-dfb2-4fdc-93db-398ba3f9cc48',
		100,
		NULL,
		8250,
		'EUR',
		14400
	);

INSERT INTO
	public."eventPassPricing" (
		"eventPassId",
		created_at,
		updated_at,
		id,
		"maxAmount",
		"maxAmountPerUser",
		"priceAmount",
		"priceCurrency",
		"timeBeforeDelete"
	)
VALUES
	(
		'clkr1vpdhnqg80bw2ckil7ytq',
		'2023-07-31 15:56:29.383202+00',
		'2023-07-31 15:56:29.383202+00',
		'34fd4a49-1365-4e74-a710-7eccd17441ca',
		20,
		1,
		16250,
		'EUR',
		14400
	);

;