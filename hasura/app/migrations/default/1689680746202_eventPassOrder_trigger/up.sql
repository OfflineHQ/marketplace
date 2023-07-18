CREATE TRIGGER eventPassOrder_trigger
BEFORE INSERT OR UPDATE ON "eventPassOrder"
FOR EACH ROW
EXECUTE PROCEDURE check_event_pass_order_quantity();
