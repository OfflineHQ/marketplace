-- Function for eventPassNftContract table
CREATE OR REPLACE FUNCTION force_lowercase_eventPassNftContract() RETURNS TRIGGER AS $$
BEGIN
    NEW."contractAddress" := LOWER(NEW."contractAddress");
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER eventPassNftContract_before_insert
BEFORE INSERT ON "eventPassNftContract"
FOR EACH ROW EXECUTE FUNCTION force_lowercase_eventPassNftContract();

-- Function for account table
CREATE OR REPLACE FUNCTION force_lowercase_account() RETURNS TRIGGER AS $$
BEGIN
    NEW."address" := LOWER(NEW."address");
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER account_before_insert
BEFORE INSERT ON "account"
FOR EACH ROW EXECUTE FUNCTION force_lowercase_account();

-- Function for nftTransfer table
CREATE OR REPLACE FUNCTION force_lowercase_nftTransfer() RETURNS TRIGGER AS $$
BEGIN
    NEW."contractAddress" := LOWER(NEW."contractAddress");
    NEW."fromAddress" := LOWER(NEW."fromAddress");
    NEW."toAddress" := LOWER(NEW."toAddress");
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nftTransfer_before_insert
BEFORE INSERT ON "nftTransfer"
FOR EACH ROW EXECUTE FUNCTION force_lowercase_nftTransfer();

-- Function for eventPassNft table
CREATE OR REPLACE FUNCTION force_lowercase_eventPassNft() RETURNS TRIGGER AS $$
BEGIN
    NEW."contractAddress" := LOWER(NEW."contractAddress");
    NEW."currentOwnerAddress" := LOWER(NEW."currentOwnerAddress");
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adjusted trigger for both INSERT and UPDATE
CREATE TRIGGER eventPassNft_before_insert_or_update
BEFORE INSERT OR UPDATE ON "eventPassNft"
FOR EACH ROW EXECUTE FUNCTION force_lowercase_eventPassNft();

-- Function for packNftSupply table
CREATE OR REPLACE FUNCTION force_lowercase_packNftSupply() RETURNS TRIGGER AS $$
BEGIN
    NEW."contractAddress" := LOWER(NEW."contractAddress");
    NEW."currentOwnerAddress" := LOWER(NEW."currentOwnerAddress");
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for both INSERT and UPDATE on packNftSupply
CREATE TRIGGER packNftSupply_before_insert_or_update
BEFORE INSERT OR UPDATE ON "packNftSupply"
FOR EACH ROW EXECUTE FUNCTION force_lowercase_packNftSupply();

-- Function for packNftContract table
CREATE OR REPLACE FUNCTION force_lowercase_packNftContract() RETURNS TRIGGER AS $$
BEGIN
    NEW."contractAddress" := LOWER(NEW."contractAddress");
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for both INSERT and UPDATE on packNftContract
CREATE TRIGGER packNftContract_before_insert_or_update
BEFORE INSERT OR UPDATE ON "packNftContract"
FOR EACH ROW EXECUTE FUNCTION force_lowercase_packNftContract();