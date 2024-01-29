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

CREATE TRIGGER eventPassNft_before_insert
BEFORE INSERT ON "eventPassNft"
FOR EACH ROW EXECUTE FUNCTION force_lowercase_eventPassNft();
