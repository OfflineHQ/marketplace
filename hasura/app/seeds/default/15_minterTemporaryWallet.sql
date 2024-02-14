SET check_function_bodies = FALSE;

INSERT INTO public."minterTemporaryWallet"("address", "privateKey", "eventPassId", "packId", "createdAt")
VALUES 
('0xTestWalletAddress1', 'TestPrivateKey1', 'cs_testSingleOrder', NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress2', 'TestPrivateKey2', 'cs_testMultipleOrders', NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress3', 'TestPrivateKey3', 'cs_testEventPassId1', NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress4', 'TestPrivateKey4', 'cs_testEventPassId2', NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress5', 'TestPrivateKey5', 'cs_testHighVolume', NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress6', 'TestPrivateKey6', 'cs_testEventPassId3', NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress7', 'TestPrivateKey7', 'cs_testEventPassId4', NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress8', 'TestPrivateKey8', 'cs_testEventPassId5', NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress9', 'TestPrivateKey9', 'cs_testEventPassId6', NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xTestWalletAddress10', 'TestPrivateKey10', 'cs_testEventPassId7', NULL, '2023-11-30T00:00:00.000000+00:00'),
('0xfakeeventpass2', 'TestPrivateKeyFakeEventPass2', 'fake-event-pass-2', NULL, '2023-11-30T00:00:00.000000+00:00');