CREATE OR REPLACE FUNCTION check_event_pass_order_quantity()
RETURNS TRIGGER AS $$
DECLARE
  total_quantity INTEGER;
  total_quantity_per_user INTEGER;
  max_amount INTEGER;
  max_amount_per_user INTEGER;
BEGIN
  -- Lock the relevant rows in "eventPassOrder" and "eventPassPendingOrder"
  PERFORM "id" FROM "eventPassOrder"
  WHERE "eventPassId" = NEW."eventPassId" AND "status" = 'CONFIRMED' AND "id" != NEW."id"
  FOR UPDATE;

  PERFORM "id" FROM "eventPassPendingOrder"
  WHERE "eventPassId" = NEW."eventPassId" AND "id" != NEW."id"
  FOR UPDATE;

  -- Calculate the total quantity of non-cancelled eventPassOrders for the eventPassId, excluding the order being inserted/updated
  SELECT COALESCE(SUM("quantity"), 0) INTO total_quantity
  FROM (
    SELECT quantity FROM "eventPassOrder"
    WHERE "eventPassId" = NEW."eventPassId" AND "status" != 'CANCELLED' AND "id" != NEW."id"
    UNION ALL
    SELECT quantity FROM "eventPassPendingOrder"
    WHERE "eventPassId" = NEW."eventPassId" AND "id" != NEW."id"
  ) AS combined_orders;

  -- Calculate the total quantity of non-cancelled eventPassOrders for the eventPassId and accountId, excluding the order being inserted/updated
  SELECT COALESCE(SUM("quantity"), 0) INTO total_quantity_per_user
  FROM (
    SELECT quantity FROM "eventPassOrder"
    WHERE "eventPassId" = NEW."eventPassId" AND "accountId" = NEW."accountId" AND "status" != 'CANCELLED' AND "id" != NEW."id"
    UNION ALL
    SELECT quantity FROM "eventPassPendingOrder"
    WHERE "eventPassId" = NEW."eventPassId" AND "accountId" = NEW."accountId" AND "id" != NEW."id"
  ) AS combined_orders;

  -- Fetch the maxAmount and maxAmountPerUser for the eventPassId
  SELECT "maxAmount", "maxAmountPerUser" INTO max_amount, max_amount_per_user
  FROM "eventPassPricing"
  WHERE "eventPassId" = NEW."eventPassId";

  -- If the eventPassId doesn't have a corresponding eventPassPricing, raise an exception
  IF max_amount IS NULL THEN
    RAISE EXCEPTION 'The eventPassId does not have a corresponding eventPassPricing.';
  END IF;

  -- Check if the total quantity plus the new quantity exceeds the maxAmount or maxAmountPerUser
  IF total_quantity + NEW."quantity" > max_amount THEN
    RAISE EXCEPTION 'The total quantity exceeds the limit.';
  END IF;
  IF total_quantity_per_user + NEW."quantity" > max_amount_per_user THEN
    RAISE EXCEPTION 'The quantity per user exceeds the limit.';
  END IF;

  -- If no exception was raised, return the new eventPassOrder row
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER eventPassOrder_trigger
BEFORE INSERT OR UPDATE ON "eventPassOrder"
FOR EACH ROW
EXECUTE PROCEDURE check_event_pass_order_quantity();

CREATE TRIGGER eventPassPendingOrder_trigger
BEFORE INSERT OR UPDATE ON "eventPassPendingOrder"
FOR EACH ROW
EXECUTE PROCEDURE check_event_pass_order_quantity();
