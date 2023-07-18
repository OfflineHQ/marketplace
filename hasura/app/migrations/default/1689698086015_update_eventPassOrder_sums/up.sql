CREATE OR REPLACE FUNCTION update_eventPassOrder_sums() RETURNS TRIGGER AS $$
BEGIN
  -- Update existing record in eventPassOrderSums
  UPDATE "eventPassOrderSums"
  SET "totalReserved" = (
    SELECT COALESCE(SUM(quantity), 0) AS totalReserved
    FROM (
      SELECT quantity FROM "eventPassOrder"
      WHERE "eventPassId" = NEW."eventPassId" AND "status" != 'CANCELLED'
      UNION ALL
      SELECT quantity FROM "eventPassPendingOrder"
      WHERE "eventPassId" = NEW."eventPassId"
    ) AS combined_orders
  )
  WHERE "eventPassId" = NEW."eventPassId";

  -- If eventPassId doesn't exist in eventPassOrderSums, insert it
  IF NOT FOUND THEN
    INSERT INTO "eventPassOrderSums" ("eventPassId", "totalReserved")
    VALUES (
      NEW."eventPassId",
      (
        SELECT COALESCE(SUM(quantity), 0) AS totalReserved
        FROM (
          SELECT quantity FROM "eventPassOrder"
          WHERE "eventPassId" = NEW."eventPassId" AND "status" != 'CANCELLED'
          UNION ALL
          SELECT quantity FROM "eventPassPendingOrder"
          WHERE "eventPassId" = NEW."eventPassId"
        ) AS combined_orders
      )
    );
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_sums
AFTER INSERT OR UPDATE OR DELETE ON "eventPassOrder"
FOR EACH ROW
EXECUTE FUNCTION update_eventPassOrder_sums();

CREATE TRIGGER update_pending_order_sums
AFTER INSERT OR UPDATE OR DELETE ON "eventPassPendingOrder"
FOR EACH ROW
EXECUTE FUNCTION update_eventPassOrder_sums();
