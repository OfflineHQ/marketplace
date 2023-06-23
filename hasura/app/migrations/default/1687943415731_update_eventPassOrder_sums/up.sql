CREATE OR REPLACE FUNCTION update_eventPassOrder_sums() RETURNS TRIGGER AS $$
BEGIN
  -- Update existing record in eventPassOrderSums
  UPDATE "eventPassOrderSums"
  SET "totalReserved" = (
    SELECT SUM(quantity) AS totalReserved
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
        SELECT SUM(quantity) AS totalReserved
        FROM "eventPassOrder"
        WHERE "eventPassId" = NEW."eventPassId" AND "status" != 'CANCELLED'
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
