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
        '0333b255-e9ee-4834-9045-0a92ca4725f3',
        '5',
        '0xFakeDelayedReveal',
        'clizzpvidao620buvxit1ynko',
        'fakeEventPassDelayedRevealId',
        'clizzky8kap2t0bw7wka9a2id',
        'delayed_reveal',
        'Km8WWeg3NfJbyys3u6Cs7LegurpZd9mH',
        false,
        false,
        '2023-07-19 12:58:46.636737+00',
        '2023-07-19 12:58:46.636737+00'
    );

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
        'abca4d1b-467a-49be-b54f-57730ee67236',
        '5',
        '0xFakePack',
        'clizzpvidao620buvxit1ynko',
        'FakePackId',
        'clizzky8kap2t0bw7wka9a2id',
        'normal',
        'Km8WWeg3NfJbyys3u6Cs7LegurpZd9mH',
        false,
        false,
        '2023-07-19 12:58:46.636737+00',
        '2023-07-19 12:58:46.636737+00'
    );