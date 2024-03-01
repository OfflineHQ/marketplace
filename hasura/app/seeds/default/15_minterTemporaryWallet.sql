SET check_function_bodies = FALSE;

INSERT INTO public."minterTemporaryWallet"("address", "privateKey", "eventPassId", "packId", "loyaltyCardId", "campaignId", "createdAt")
  VALUES ('0xTestWalletAddress1', 'TestPrivateKey1', 'cs_testSingleOrder', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress2', 'TestPrivateKey2', 'cs_testMultipleOrders', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress3', 'TestPrivateKey3', 'cs_testEventPassId1', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress4', 'TestPrivateKey4', 'cs_testEventPassId2', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress5', 'TestPrivateKey5', 'cs_testHighVolume', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress6', 'TestPrivateKey6', 'cs_testEventPassId3', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress7', 'TestPrivateKey7', 'cs_testEventPassId4', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress8', 'TestPrivateKey8', 'cs_testEventPassId5', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress9', 'TestPrivateKey9', 'cs_testEventPassId6', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress10', 'TestPrivateKey10', 'cs_testEventPassId7', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress11', 'TestPrivateKey11', 'fake-event-pass-3', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xfakeeventpass2', 'TestPrivateKeyFakeEventPass2', 'fake-event-pass-2', NULL, NULL, NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xMinterWalletAddress1', 'MinterPrivateKey1', NULL, NULL, 'loyaltyCardId1', NULL, '2023-01-01T00:00:00.000Z'),
('0xMinterWalletAddress2', 'MinterPrivateKey2', NULL, NULL, 'loyaltyCardId2', NULL, '2023-01-02T00:00:00.000Z'),
('0xMinterWalletAddress3', 'MinterPrivateKey3', NULL, NULL, 'loyaltyCardId3', NULL, '2023-01-03T00:00:00.000Z'),
('0xMinterWalletAddress4', 'MinterPrivateKey4', NULL, NULL, 'loyaltyCardId4', NULL, '2023-01-04T00:00:00.000Z');
