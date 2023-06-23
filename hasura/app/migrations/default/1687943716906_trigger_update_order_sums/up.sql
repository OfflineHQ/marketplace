CREATE TRIGGER update_order_sums
AFTER INSERT OR UPDATE OR DELETE ON "eventPassOrder"
FOR EACH ROW
EXECUTE FUNCTION update_eventPassOrder_sums();
