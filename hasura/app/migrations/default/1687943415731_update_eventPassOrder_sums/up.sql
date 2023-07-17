CREATE OR REPLACE FUNCTION update_eventPassOrder_sums() RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM "eventPassOrder" WHERE "eventPassId" = NEW."eventPassId") THEN
    -- Update existing record in eventPassOrderSums
    UPDATE "eventPassOrderSums"
    SET "totalReserved" = (
      SELECT COALESCE(SUM(quantity), 0) AS totalReserved
      FROM "eventPassOrder"
      WHERE "eventPassId" = NEW."eventPassId" AND "status" != 'CANCELLED'
    )
    WHERE "eventPassId" = NEW."eventPassId";

    -- If eventPassId doesn't exist in eventPassOrderSums, insert it
    IF NOT FOUND THEN
      INSERT INTO "eventPassOrderSums" ("eventPassId", "totalReserved")
      VALUES (
        NEW."eventPassId",
        (
          SELECT COALESCE(SUM(quantity), 0) AS totalReserved
          FROM "eventPassOrder"
          WHERE "eventPassId" = NEW."eventPassId" AND "status" != 'CANCELLED'
        )
      );
    END IF;
  ELSE
    DELETE FROM "eventPassOrderSums" WHERE "eventPassId" = NEW."eventPassId";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
