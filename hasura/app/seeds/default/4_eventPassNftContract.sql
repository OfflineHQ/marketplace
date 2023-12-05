SET
    check_function_bodies = false;

-- Insert first record with 'normal' type
INSERT INTO public."eventPassNftContract" (
    id,
    "chainId",
    "contractAddress",
    "eventId",
    "eventPassId",
    "organizerId",
    "type",
    "password",
    "isDelayedRevealed",
    "isAirdrop",
    "created_at",
    "updated_at"
)
VALUES
    (
        '19d09cfe-6a5c-4481-a822-7161d5b4c8cf',
        '5',
        '0xfakecontractaddress1',
        'clizzpvidao620buvxit1ynko',
        'clj8raobj7g8l0aw3bfw6dny4',
        'clizzky8kap2t0bw7wka9a2id',
        'normal',
        NULL,
        false,
        false,
        '2023-07-19 12:58:46.636737+00',
        '2023-07-19 12:58:46.636737+00'
    );

-- Insert second record with 'normal' type
INSERT INTO public."eventPassNftContract" (
    id,
    "chainId",
    "contractAddress",
    "eventId",
    "eventPassId",
    "organizerId",
    "type",
    "password",
    "isDelayedRevealed",
    "isAirdrop",
    "created_at",
    "updated_at"
)
VALUES
    (
        '6fa834c5-cc89-4861-a1cf-ff4fce62ba20',
        '5',
        '0xfakecontractaddress2',
        'clizzpvidao620buvxit1ynko',
        'fake-event-pass-2',
        'clizzky8kap2t0bw7wka9a2id',
        'normal',
        NULL,
        false,
        false,
        '2023-07-19 15:58:46.636737+00',
        '2023-07-19 15:58:46.636737+00'
    );
;