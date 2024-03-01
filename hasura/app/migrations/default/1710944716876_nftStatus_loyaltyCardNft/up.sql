-- NFT status
CREATE TABLE public."nftStatus"(
  value text NOT NULL
);

ALTER TABLE ONLY public."nftStatus"
  ADD CONSTRAINT "nftStatus_pkey" PRIMARY KEY (value);

INSERT INTO public."nftStatus"(value)
  VALUES ('CONFIRMED'), -- NFT attribution is confirmed
('IS_MINTING'), -- NFT is being minted through a blockchain transaction
('ERROR'), -- An error occurred during the NFT attribution
('COMPLETED'), -- NFT is successfully attributed and held by the user's wallet
('BURNED'), -- NFT has been burned for any reason
('IS_TRANSFERRING'), -- NFT is being transferred to another wallet
('HELD_BY_CONTRACT'), -- NFT is held by a contract (e.g., lottery contract) before distribution
('LAZY_MINTED') -- NFT is lazily minted and not yet attributed to a user
;

-- Modify "eventPassNft" table
ALTER TABLE public."eventPassNft"
  ALTER COLUMN "tokenId" DROP NOT NULL,
  ALTER COLUMN "metadata" DROP NOT NULL,
  DROP COLUMN "isDelivered",
  ADD COLUMN "status" text DEFAULT 'CONFIRMED';

ALTER TABLE public."eventPassNft"
  ADD CONSTRAINT "eventPassNft_status_fkey" FOREIGN KEY ("status") REFERENCES public."nftStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Drop the existing unique constraint
ALTER TABLE public."eventPassNft"
  DROP CONSTRAINT "eventPassNft_contractAddress_tokenId_chainId_key";

-- Create a partial unique index
CREATE UNIQUE INDEX "eventPassNft_contractAddress_tokenId_chainId_idx" ON public."eventPassNft"("contractAddress", "tokenId", "chainId")
WHERE
  "tokenId" IS NOT NULL;

-- Modify "packNftSupply" table
ALTER TABLE public."packNftSupply"
  DROP COLUMN "isDelivered",
  ADD COLUMN "status" text DEFAULT 'CONFIRMED';

ALTER TABLE public."packNftSupply"
  ADD CONSTRAINT "packNftSupply_status_fkey" FOREIGN KEY ("status") REFERENCES public."nftStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Create loyaltyCardNft table
CREATE TABLE "public"."loyaltyCardNft"(
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "contractAddress" text NOT NULL,
  "tokenId" bigint,
  "metadata" jsonb,
  "error" text,
  "tokenUri" text,
  "chainId" text NOT NULL,
  "loyaltyCardId" text NOT NULL,
  "organizerId" text NOT NULL,
  "ownerAddress" text NOT NULL,
  "burnedTransferId" uuid,
  "status" text DEFAULT 'CONFIRMED',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("status") REFERENCES "public"."nftStatus"("value") ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Create a partial unique index on "loyaltyCardNft"
CREATE UNIQUE INDEX "loyaltyCardNft_contractAddress_tokenId_chainId_idx" ON public."loyaltyCardNft"("contractAddress", "tokenId", "chainId")
WHERE
  "tokenId" IS NOT NULL;

-- Partial unique index for ownerAddress to ensure uniqueness among active NFTs
CREATE UNIQUE INDEX idx_loyaltyCardNft_ownerAddress_active ON "public"."loyaltyCardNft"("ownerAddress")
WHERE
  "burnedTransferId" IS NULL;

-- Table and column comments
COMMENT ON TABLE "public"."loyaltyCardNft" IS E'The loyaltyCardNft model stores NFTs delivered by the loyaltyCardNftContract, each uniquely associated with a loyalty card. These NFTs are soulbound to a specific owner and not transferable, though they can be burned, indicating the end of their lifecycle. The structure allows for the dynamic update of NFT metadata by contract admins, adhering to the loyalty card contract stipulations.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."contractAddress" IS E'Identifies the smart contract associated with the loyalty card NFT. This provides a direct link to the NFT\'s origin and behavior on the blockchain.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."tokenId" IS E'The unique identifier of the loyalty card NFT within its specific collection or contract. This remains constant across various platforms.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."metadata" IS E'The structured metadata parsed from the token URI. This contains a variety of details regarding the loyalty card NFT.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."error" IS E'Contains any error message related to metadata retrieval, ensuring transparency in the data extraction process.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."tokenUri" IS E'The designated URI for the loyalty card NFT\'s metadata blob, providing a stable reference for data extraction.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."chainId" IS E'Denotes the specific blockchain or network of the loyalty card NFT.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."loyaltyCardId" IS E'A reference to the loyalty card associated with the NFT, linking it directly to the loyalty program within the platform.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."organizerId" IS E'A unique identifier for the organizer associated with the NFT. This links the loyalty card directly to a specific organizer within the platform.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."ownerAddress" IS E'The address currently holding the loyalty card NFT. Given the soulbound nature, this represents the permanent owner unless the NFT is burned.';

COMMENT ON COLUMN "public"."loyaltyCardNft"."burnedTransferId" IS E'If not null, indicates the NFT has been burned, marking its lifecycle end. This field links to the transaction that executed the burn, whether by the NFT owner or a contract admin.';

-- Create trigger for loyaltyCardNft
CREATE TRIGGER set_loyaltyCardNft_updated_at
  BEFORE UPDATE ON "public"."loyaltyCardNft"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Function to force lowercase contractAddress and ownerAddress in loyaltyCardNft table
CREATE OR REPLACE FUNCTION force_lowercase_loyaltyCardNft()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW."contractAddress" := LOWER(NEW."contractAddress");
  NEW."ownerAddress" := LOWER(NEW."ownerAddress");
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Trigger to apply lowercase function before insert for loyaltyCardNft
CREATE TRIGGER loyaltyCardNft_before_insert
  BEFORE INSERT ON "public"."loyaltyCardNft"
  FOR EACH ROW
  EXECUTE FUNCTION force_lowercase_loyaltyCardNft();

