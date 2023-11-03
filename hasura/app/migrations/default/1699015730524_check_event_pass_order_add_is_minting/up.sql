CREATE OR REPLACE FUNCTION check_event_pass_order()
RETURNS TRIGGER AS $$
DECLARE
  total_quantity INTEGER;
  total_quantity_per_user INTEGER;
  max_amount INTEGER;
  max_amount_per_user INTEGER;
  pending_quantity INTEGER;
  pending_quantity_per_user INTEGER;
BEGIN
  
  -- If the trigger function is being executed for the eventPassOrder table
  IF TG_TABLE_NAME = 'eventPassOrder' AND TG_OP = 'UPDATE' THEN
    -- If the status is being updated from 'COMPLETED' to another status than 'REFUNDED'
    IF OLD."status" = 'COMPLETED' AND NEW."status" IS NOT NULL AND NEW."status" != 'REFUNDED' THEN
      RAISE EXCEPTION 'Cannot change status from COMPLETED to %.', NEW."status";
    END IF;
    -- If the quantity is changing
    IF NEW."quantity" IS NOT NULL AND NEW."quantity" != OLD."quantity" THEN
      RAISE EXCEPTION 'Cannot change quantity from % to %.', OLD."quantity", NEW."quantity";
    END IF;
    -- If no exception was raised, return the new eventPassOrder row without performing any checks
    RETURN NEW;
  END IF;
  
  -- Lock the relevant rows in "eventPassOrder" and "eventPassPendingOrder"
  PERFORM "id" FROM "eventPassOrder"
  WHERE "eventPassId" = NEW."eventPassId" AND ("status" = 'CONFIRMED' OR "status" = 'COMPLETED' OR "status" = 'IS_MINTING') AND "id" != NEW."id"
  FOR UPDATE;

  PERFORM "id" FROM "eventPassPendingOrder"
  WHERE "eventPassId" = NEW."eventPassId" AND "id" != NEW."id"
  FOR UPDATE;

  -- Calculate the total quantity of confirmed or completed eventPassOrders for the eventPassId, excluding the order being inserted
  SELECT COALESCE(SUM("quantity"), 0) INTO total_quantity
  FROM (
    SELECT quantity FROM "eventPassOrder"
    WHERE "eventPassId" = NEW."eventPassId" AND ("status" = 'CONFIRMED' OR "status" = 'COMPLETED' OR "status" = 'IS_MINTING') AND "id" != NEW."id"
    UNION ALL
    SELECT quantity FROM "eventPassPendingOrder"
    WHERE "eventPassId" = NEW."eventPassId" AND "id" != NEW."id"
  ) AS combined_orders;

  -- Calculate the total quantity of confirmed or completed eventPassOrders for the eventPassId and accountId, excluding the order being inserted
  SELECT COALESCE(SUM("quantity"), 0) INTO total_quantity_per_user
  FROM (
    SELECT quantity FROM "eventPassOrder"
    WHERE "eventPassId" = NEW."eventPassId" AND "accountId" = NEW."accountId" AND ("status" = 'CONFIRMED' OR "status" = 'COMPLETED' OR "status" = 'IS_MINTING') AND "id" != NEW."id"
    UNION ALL
    SELECT quantity FROM "eventPassPendingOrder"
    WHERE "eventPassId" = NEW."eventPassId" AND "accountId" = NEW."accountId" AND "id" != NEW."id"
  ) AS combined_orders;

  -- Calculate the total quantity of eventPassPendingOrders that are being moved to eventPassOrder
  SELECT COALESCE(SUM("quantity"), 0) INTO pending_quantity
  FROM "eventPassPendingOrder"
  WHERE "eventPassId" = NEW."eventPassId" AND "accountId" = NEW."accountId";

  -- Subtract the quantities of the eventPassPendingOrder entries that are being moved to eventPassOrder from the total quantities
  total_quantity := total_quantity - pending_quantity;
  total_quantity_per_user := total_quantity_per_user - pending_quantity;

  -- Fetch the maxAmount and maxAmountPerUser for the eventPassId
  SELECT "maxAmount", "maxAmountPerUser" INTO max_amount, max_amount_per_user
  FROM "eventPassPricing"
  WHERE "eventPassId" = NEW."eventPassId";

  -- If the eventPassId doesn't have a corresponding eventPassPricing, raise an exception
  IF max_amount IS NULL THEN
    RAISE EXCEPTION 'The eventPassId % does not have a corresponding eventPassPricing. Triggered by table: % and operation: %', NEW."eventPassId", TG_TABLE_NAME, TG_OP;
  END IF;

  -- Check if the total quantity plus the new quantity exceeds the maxAmount or maxAmountPerUser
  IF total_quantity + NEW."quantity" > max_amount THEN
    RAISE EXCEPTION 'The total quantity exceeds the limit by %.', total_quantity + NEW."quantity" - max_amount;
  END IF;
  IF max_amount_per_user IS NOT NULL AND total_quantity_per_user + NEW."quantity" > max_amount_per_user THEN
    RAISE EXCEPTION 'The quantity per user exceeds the limit by %.', total_quantity_per_user + NEW."quantity" - max_amount_per_user;
  END IF;

  -- If no exception was raised, return the new eventPassOrder row
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER eventPassOrder_trigger
BEFORE INSERT OR UPDATE ON "eventPassOrder"
FOR EACH ROW
EXECUTE PROCEDURE check_event_pass_order();

CREATE TRIGGER eventPassPendingOrder_trigger
BEFORE INSERT OR UPDATE ON "eventPassPendingOrder"
FOR EACH ROW
EXECUTE PROCEDURE check_event_pass_order();
