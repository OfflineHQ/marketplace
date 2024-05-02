SET check_function_bodies = FALSE;

INSERT INTO public."loyaltyCardNftContract"("chainId", "contractAddress", "organizerId", "loyaltyCardId", "created_at", "updated_at")
VALUES 
('1', '0xLoyaltyCardActivityContractAddress', 'test-organizer-id', 'test-loyalty-card-activity', '2023-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z'),
('1', '0xLoyaltyCardContractAddress1', 'organizerId1', 'loyaltyCardId1', '2023-01-01T00:00:00.000Z', '2023-01-01T00:00:00.000Z'),
('1', '0xLoyaltyCardContractAddress2', 'organizerId2', 'loyaltyCardId2', '2023-01-02T00:00:00.000Z', '2023-01-02T00:00:00.000Z'),
('2', '0xLoyaltyCardContractAddress3', 'organizerId3', 'loyaltyCardId3', '2023-01-03T00:00:00.000Z', '2023-01-03T00:00:00.000Z'),
('2', '0xLoyaltyCardContractAddress4', 'organizerId4', 'loyaltyCardId4', '2023-01-04T00:00:00.000Z', '2023-01-04T00:00:00.000Z'),
('3', '0xLoyaltyCardContractAddress5', 'organizerId5', 'loyaltyCardId5', '2023-01-05T00:00:00.000Z', '2023-01-05T00:00:00.000Z'),
('3', '0xLoyaltyCardContractAddress6', 'organizerId6', 'loyaltyCardId6', '2023-01-06T00:00:00.000Z', '2023-01-06T00:00:00.000Z'),
('4', '0xLoyaltyCardContractAddress7', 'organizerId7', 'loyaltyCardId7', '2023-01-07T00:00:00.000Z', '2023-01-07T00:00:00.000Z'),
('4', '0xLoyaltyCardContractAddress8', 'organizerId8', 'loyaltyCardId8', '2023-01-08T00:00:00.000Z', '2023-01-08T00:00:00.000Z');