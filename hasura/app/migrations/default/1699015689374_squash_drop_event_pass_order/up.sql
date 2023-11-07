DROP TRIGGER eventPassOrder_trigger ON "eventPassOrder";
DROP TRIGGER eventPassPendingOrder_trigger ON "eventPassPendingOrder";
DROP FUNCTION check_event_pass_order();

DROP TRIGGER update_order_sums ON "eventPassOrder";
DROP TRIGGER update_pending_order_sums ON "eventPassPendingOrder";
DROP FUNCTION update_eventPassOrder_sums();
