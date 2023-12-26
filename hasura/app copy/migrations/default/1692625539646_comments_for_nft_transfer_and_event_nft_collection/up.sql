comment on column "public"."nftTransfer"."contractAddress" is E'Identifies the smart contract associated with the NFT. This provides a direct link to the NFT\'s origin and behavior on the blockchain.';

comment on column "public"."nftTransfer"."fromAddress" is E'Denotes the source address from which the NFT was transferred. Essential to trace the sender in the NFT\'s movement.';

comment on column "public"."nftTransfer"."toAddress" is E'Specifies the destination address receiving the NFT. Critical for determining the current holder of the NFT.';

comment on column "public"."nftTransfer"."transactionHash" is E'Represents the unique hash of the transaction in which the NFT was transferred. Ensures traceability and verification on the blockchain.';

comment on column "public"."nftTransfer"."chainId" is E'Indicates the specific blockchain or network where the NFT resides. Useful in a multi-chain environment to distinguish between various chains.';

comment on column "public"."nftTransfer"."blockNumber" is E'The specific block on the blockchain where this transfer was recorded. Allows for pinpointing the exact point of transfer in the blockchain\'s history.';

comment on column "public"."nftTransfer"."eventId" is E'Refers to the associated event ID for which the NFT was transferred. Ties the NFT transfer to a particular event in the platform.';

comment on column "public"."nftTransfer"."organizerId" is E'Identifies the organizer who facilitated the event linked to the NFT transfer. Aids in associating NFT movements with specific organizers.';

comment on column "public"."nftTransfer"."eventPassId" is E'Denotes the specific Event Pass associated with the NFT. Helps in tracking the lifecycle of a particular event pass.';

comment on column "public"."nftTransfer"."tokenId" is E'The unique identifier for the NFT within its associated smart contract. Maintains a constant reference to the NFT across platforms.';

comment on column "public"."eventNftCollection"."contractAddress" is E'Represents the unique address of the smart contract that governs the NFT collection. It acts as the primary reference to the NFT\'s existence and behavior on the blockchain.';

comment on column "public"."eventNftCollection"."chainId" is E'Specifies the particular blockchain or network on which the NFT collection resides. Essential for distinguishing between different blockchains in a multi-chain environment.';

comment on column "public"."eventNftCollection"."eventId" is E'A unique identifier for the event associated with the NFT collection. This ties each collection directly to a specific event within the platform.';

comment on column "public"."eventNftCollection"."activityWebhookId" is E'Designates the unique identifier for the activity webhook related to the NFT collection. This is crucial for real-time monitoring and processing of events or changes associated with the NFT collection on the platform.';
