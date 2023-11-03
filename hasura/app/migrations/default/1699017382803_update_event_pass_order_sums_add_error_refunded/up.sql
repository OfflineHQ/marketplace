CREATE OR REPLACE FUNCTION update_eventPassOrder_sums() RETURNS TRIGGER AS $$
DECLARE
  target_eventPassId text;
BEGIN
  -- Determine whether this is an INSERT/UPDATE or DELETE operation
  IF TG_OP = 'DELETE' THEN
    target_eventPassId := OLD."eventPassId";
  ELSE
    target_eventPassId := NEW."eventPassId";
  END IF;

  -- Update existing record in eventPassOrderSums
  UPDATE "eventPassOrderSums"
  SET "totalReserved" = (
    SELECT COALESCE(SUM(quantity), 0) AS totalReserved
    FROM (
      SELECT quantity FROM "eventPassOrder"
      WHERE "eventPassId" = target_eventPassId AND ("status" != 'CANCELLED' OR "status" != "ERROR" OR "status" != "REFUNDED")
      UNION ALL
      SELECT quantity FROM "eventPassPendingOrder"
      WHERE "eventPassId" = target_eventPassId
    ) AS combined_orders
  )
  WHERE "eventPassId" = target_eventPassId;

  -- If eventPassId doesn't exist in eventPassOrderSums, insert it
  IF NOT FOUND THEN
    INSERT INTO "eventPassOrderSums" ("eventPassId", "totalReserved")
    VALUES (
      target_eventPassId,
      (
        SELECT COALESCE(SUM(quantity), 0) AS totalReserved
        FROM (
          SELECT quantity FROM "eventPassOrder"
          WHERE "eventPassId" = target_eventPassId AND ("status" != 'CANCELLED' OR "status" != "ERROR" OR "status" != "REFUNDED")
          UNION ALL
          SELECT quantity FROM "eventPassPendingOrder"
          WHERE "eventPassId" = target_eventPassId
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
