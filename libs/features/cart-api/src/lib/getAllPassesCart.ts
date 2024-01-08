import { AllPassesCart, UserPassPendingOrder } from '@features/cart-types';
import { PassCache } from '@features/pass-cache';
export const getAllPassesCart = async (
  passCache: PassCache = new PassCache(), // Add this line,
  userPassPendingOrders?: UserPassPendingOrder[],
) => {
  let allPassesCart: AllPassesCart | null = null;
  if (userPassPendingOrders) {
    allPassesCart = userPassPendingOrders.reduce((acc, order) => {
      const organizerSlug = order.eventPass?.event?.organizer?.slug;
      const eventSlug = order.eventPass?.event?.slug;
      if (organizerSlug && eventSlug) {
        if (!acc[organizerSlug]) {
          acc[organizerSlug] = {};
        }
        if (!acc[organizerSlug][eventSlug]) {
          acc[organizerSlug][eventSlug] = [];
        }
        acc[organizerSlug][eventSlug].push(order);
      }
      return acc;
    }, {} as AllPassesCart);
  } else allPassesCart = await passCache.getAllPassesCart();
  // TODO maybe add a next cache validation process here in lieu of router.refresh ?
  return allPassesCart;
};
