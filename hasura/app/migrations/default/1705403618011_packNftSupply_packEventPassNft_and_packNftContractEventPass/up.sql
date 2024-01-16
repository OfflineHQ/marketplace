-- Create packNftSupply table
CREATE TABLE "public"."packNftSupply"(
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "contractAddress" text NOT NULL,
  "error" text,
  "tokenUri" text,
  "chainId" text NOT NULL,
  "packId" text NOT NULL,
  "organizerId" text NOT NULL,
  "currentOwnerAddress" text,
  "lastNftTransferId" uuid REFERENCES "public"."nftTransfer"("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  UNIQUE ("contractAddress", "chainId", "packId")
);

-- Comments for the packNftSupply table and its columns
COMMENT ON TABLE "public"."packNftSupply" IS E'This table represents the supply details of pack NFTs, tracking the ownership, contents, and metadata associated with each pack.';

COMMENT ON COLUMN "public"."packNftSupply"."contractAddress" IS E'The address of the smart contract representing the pack NFT. Essential for blockchain interactions.';

COMMENT ON COLUMN "public"."packNftSupply"."error" IS E'Any error messages related to this pack NFT, particularly during transactions or metadata retrieval.';

COMMENT ON COLUMN "public"."packNftSupply"."tokenUri" IS E'The URI pointing to the metadata of the pack NFT.';

COMMENT ON COLUMN "public"."packNftSupply"."chainId" IS E'The specific blockchain or network on which the pack NFT exists.';

COMMENT ON COLUMN "public"."packNftSupply"."packId" IS E'A unique identifier for the pack within the platform.';

COMMENT ON COLUMN "public"."packNftSupply"."organizerId" IS E'The identifier of the organizer associated with this pack NFT.';

COMMENT ON COLUMN "public"."packNftSupply"."currentOwnerAddress" IS E'The blockchain address of the current owner of the pack NFT.';

COMMENT ON COLUMN "public"."packNftSupply"."lastNftTransferId" IS E'The reference to the latest transfer record for this pack NFT.';

-- Create trigger for packNftSupply
CREATE TRIGGER set_packNftSupply_updated_at
  BEFORE UPDATE ON "public"."packNftSupply"
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Create a junction table for linking packNftSupply to eventPassNft
CREATE TABLE "public"."packEventPassNft"(
  "packNftSupplyId" uuid NOT NULL REFERENCES "public"."packNftSupply"("id"),
  "eventPassNftId" uuid NOT NULL REFERENCES "public"."eventPassNft"("id"),
  PRIMARY KEY ("packNftSupplyId", "eventPassNftId"),
  UNIQUE ("eventPassNftId")
);

COMMENT ON TABLE "public"."packEventPassNft" IS E'Junction table linking pack NFTs to event pass NFTs. Ensures that each event pass NFT is uniquely associated with a pack.';

COMMENT ON COLUMN "public"."packEventPassNft"."packNftSupplyId" IS E'Identifier for the pack NFT supply.';

COMMENT ON COLUMN "public"."packEventPassNft"."eventPassNftId" IS E'Identifier for the event pass NFT.';

-- Modify packNftContract table to remove eventPassIds column
ALTER TABLE "public"."packNftContract"
  DROP COLUMN "eventPassIds";

-- Create function for getting event pass NFTs for a pack
CREATE OR REPLACE FUNCTION public.get_event_pass_nfts_for_pack(pack_supply_row public."packNftSupply")
  RETURNS SETOF uuid
  AS $$
BEGIN
  RETURN QUERY
  SELECT
    pepn."eventPassNftId"
  FROM
    public."packEventPassNft" pepn
  WHERE
    pepn."packNftSupplyId" = pack_supply_row.id;
END;
$$
LANGUAGE plpgsql
STABLE;

-- Create packNftContractEventPass table
CREATE TABLE "public"."packNftContractEventPass"(
  "packNftContractId" uuid NOT NULL REFERENCES "public"."packNftContract"("id"),
  "eventPassNftContractId" uuid NOT NULL REFERENCES "public"."eventPassNftContract"("id"),
  "amount" integer NOT NULL CHECK (amount > 0),
  PRIMARY KEY ("packNftContractId", "eventPassNftContractId")
);

COMMENT ON TABLE "public"."packNftContractEventPass" IS E'This junction table links each pack NFT contract to various event pass NFT contracts, along with the quantity of each event pass type included in the pack. It facilitates the management of event passes bundled within a specific pack.';

COMMENT ON COLUMN "public"."packNftContractEventPass"."packNftContractId" IS E'Identifier for the pack NFT contract. This field links to the packNftContract table, establishing the connection between the pack and its contractual details.';

COMMENT ON COLUMN "public"."packNftContractEventPass"."eventPassNftContractId" IS E'Identifier for the event pass NFT contract. This field connects to the eventPassNftContract table, specifying which event pass is included in the pack.';

COMMENT ON COLUMN "public"."packNftContractEventPass"."amount" IS E'The quantity of this specific event pass NFT included in the pack. Indicates how many of this type of event pass are bundled in the associated pack NFT contract.';

-- Function for getting event pass NFT contracts for a packNftContract
CREATE OR REPLACE FUNCTION public.get_event_pass_nft_contracts_for_pack(pack_contract_row public."packNftContract")
  RETURNS SETOF public."packNftContractEventPass"
  AS $$
BEGIN
  RETURN QUERY
  SELECT
    pncep."eventPassNftContractId",
    pncep."amount"
  FROM
    public."packNftContractEventPass" pncep
  WHERE
    pncep."packNftContractId" = pack_contract_row.id;
END;
$$
LANGUAGE plpgsql
STABLE;

