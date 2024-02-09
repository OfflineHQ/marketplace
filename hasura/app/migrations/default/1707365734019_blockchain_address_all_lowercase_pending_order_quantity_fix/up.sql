
DROP TRIGGER IF EXISTS order_trigger ON "order";
DROP TRIGGER IF EXISTS pending_order_trigger ON "pendingOrder";

CREATE OR REPLACE FUNCTION orders_amount_handling()
  RETURNS TRIGGER
  AS $$
DECLARE
  target_eventPassId text;
  target_packId text;
  max_amount integer;
  max_amount_per_user integer;
  total_quantity integer;
  total_quantity_per_user integer;
  rows_affected integer := 0;
  existing_order_id uuid;
BEGIN
  -- Determine whether it's an event pass or pack order and set the target ID
  IF TG_OP = 'DELETE' THEN
    IF OLD."eventPassId" IS NOT NULL THEN
      target_eventPassId := OLD."eventPassId";
      target_packId := NULL;
    ELSE
      target_eventPassId := NULL;
      target_packId := OLD."packId";
    END IF;
  ELSE
    IF NEW."eventPassId" IS NOT NULL THEN
      target_eventPassId := NEW."eventPassId";
      target_packId := NULL;
    ELSE
      target_eventPassId := NULL;
      target_packId := NEW."packId";
    END IF;
  END IF;
  -- Handle updates on the order table
  IF TG_TABLE_NAME = 'order' AND TG_OP = 'UPDATE' THEN
    IF OLD."status" = 'COMPLETED' AND NEW."status" IS NOT NULL AND NEW."status" != 'REFUNDED' THEN
      RAISE EXCEPTION 'Cannot change status from COMPLETED to %.', NEW."status";
    END IF;
    IF NEW."quantity" IS NOT NULL AND NEW."quantity" != OLD."quantity" THEN
      RAISE EXCEPTION 'Cannot change quantity from % to %.', OLD."quantity", NEW."quantity";
    END IF;
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'pendingOrder' AND NEW."id" IS NULL THEN
    SELECT "id" INTO existing_order_id
    FROM "pendingOrder"
    WHERE "eventPassId" = NEW."eventPassId"
      AND "accountId" = NEW."accountId"
    LIMIT 1; -- Assuming uniqueness for eventPassId and accountId combination

    IF FOUND THEN
      NEW."id" := existing_order_id;
    END IF;
  END IF;
  -- Fetch the maxAmount and maxAmountPerUser for the order
  SELECT
    "maxAmount",
    "maxAmountPerUser" INTO max_amount,
    max_amount_per_user
  FROM
    "passAmount"
  WHERE ("eventPassId" = target_eventPassId
    OR "packId" = target_packId);
  -- Check if the order has a corresponding passAmount
  IF max_amount IS NULL THEN
    RAISE EXCEPTION 'The order does not have a corresponding passAmount. Triggered by table: % and operation: %', TG_TABLE_NAME, TG_OP;
  END IF;
  -- Calculate the total quantity and total quantity per user
  SELECT
    COALESCE(SUM("quantity"), 0) INTO total_quantity
  FROM (
    SELECT
      "quantity"
    FROM
      "order"
    WHERE ("eventPassId" = target_eventPassId
      OR "packId" = target_packId)
    AND ("status" = 'CONFIRMED'
      OR "status" = 'COMPLETED'
      OR "status" = 'IS_MINTING')
    AND "id" != COALESCE(NEW."id", OLD."id")
  UNION ALL
  SELECT
    "quantity"
  FROM
    "pendingOrder"
  WHERE ("eventPassId" = target_eventPassId
    OR "packId" = target_packId)
    AND "id" != COALESCE(NEW."id", OLD."id")
    AND "accountId" != COALESCE(NEW."accountId", OLD."accountId")) AS combined_orders;
  SELECT
    COALESCE(SUM("quantity"), 0) INTO total_quantity_per_user
  FROM (
    SELECT
      "quantity"
    FROM
      "order"
    WHERE ("eventPassId" = target_eventPassId
      OR "packId" = target_packId)
    AND "accountId" = COALESCE(NEW."accountId", OLD."accountId")
    AND ("status" = 'CONFIRMED'
      OR "status" = 'COMPLETED'
      OR "status" = 'IS_MINTING')
    AND "id" != COALESCE(NEW."id", OLD."id")
  UNION ALL
  SELECT
    "quantity"
  FROM
    "pendingOrder"
  WHERE ("eventPassId" = target_eventPassId
    OR "packId" = target_packId)
    AND "accountId" != COALESCE(NEW."accountId", OLD."accountId")
    AND "id" != COALESCE(NEW."id", OLD."id")) AS combined_orders_per_user;
  -- Check if the total quantity plus the new quantity exceeds the maxAmount or maxAmountPerUser
  IF total_quantity + COALESCE(NEW."quantity", 0) > max_amount THEN
    RAISE EXCEPTION 'The total quantity exceeds the limit by %.', total_quantity + COALESCE(NEW."quantity", 0) - max_amount;
  END IF;
  IF max_amount_per_user IS NOT NULL AND total_quantity_per_user + COALESCE(NEW."quantity", 0) > max_amount_per_user THEN
    RAISE EXCEPTION 'The quantity per user exceeds the limit by %.', total_quantity_per_user + COALESCE(NEW."quantity", 0) - max_amount_per_user;
  END IF;
  -- Update the totalReserved field in eventPassOrderSums or packOrderSums
  IF target_eventPassId IS NOT NULL THEN
    UPDATE
      "eventPassOrderSums"
    SET
      "totalReserved" = total_quantity
    WHERE
      "eventPassId" = target_eventPassId;
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    -- If eventPassId doesn't exist in eventPassOrderSums, insert it
    IF rows_affected = 0 THEN
      INSERT INTO "eventPassOrderSums"("eventPassId", "totalReserved")
        VALUES (target_eventPassId, total_quantity);
    END IF;
  ELSIF target_packId IS NOT NULL THEN
    UPDATE
      "packOrderSums"
    SET
      "totalReserved" = total_quantity
    WHERE
      "packId" = target_packId;
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    -- If packId doesn't exist in packOrderSums, insert it
    IF rows_affected = 0 THEN
      INSERT INTO "packOrderSums"("packId", "totalReserved")
        VALUES (target_packId, total_quantity);
    END IF;
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Trigger for order table for INSERT, UPDATE, and DELETE
CREATE TRIGGER order_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON "order"
  FOR EACH ROW
  EXECUTE FUNCTION orders_amount_handling();

-- Trigger for pendingOrder table for INSERT and UPDATE
CREATE TRIGGER pending_order_trigger
  BEFORE INSERT OR UPDATE ON "pendingOrder"
  FOR EACH ROW
  EXECUTE FUNCTION orders_amount_handling();

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