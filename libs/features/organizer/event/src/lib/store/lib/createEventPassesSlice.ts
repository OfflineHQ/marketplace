'use client';

import { StateCreator } from 'zustand';
import { produce } from 'immer';
import type {
  EventSlugs,
  EventPass,
  EventPassCart,
  AllPassesCart,
} from '@features/organizer/event/types';
import type { GetEventPassPendingOrdersQuery } from '@gql/user/types';
import { Money } from '@next/currency';

interface GetPassCartProps extends EventSlugs {
  eventPassId: string;
}
interface UpdatePassCartProps extends EventSlugs {
  pass: EventPassCart;
}

interface SetPassesCartProps extends EventSlugs {
  newPasses: EventPassCart[];
}

interface GetPassesCartTotalPriceProps extends EventSlugs {
  passesData: EventPass[];
}
interface getPassDataProps {
  passCartId: EventPassCart['id'];
  passesData: EventPass[];
}

interface SyncAllPassesCartProps {
  userPassPendingOrders?: GetEventPassPendingOrdersQuery['eventPassPendingOrder'];
}

export interface EventPassesSliceProps {
  passes: AllPassesCart;
  resetPasses: () => void;
  getPassCart: (props: GetPassCartProps) => EventPassCart | undefined;
  updatePassCart: (props: UpdatePassCartProps) => void;
  setPassesCart: (props: SetPassesCartProps) => void;
  deletePassCart: (props: GetPassCartProps) => void;
  deletePassesCart: (props: EventSlugs) => void;
  getPassesCart: (props: EventSlugs) => EventPassCart[] | undefined;
  getPassesCartTotalPrice: (props: GetPassesCartTotalPriceProps) => Money;
  getPassesCartTotalPasses: (props: EventSlugs) => number;
  getPassData: (props: getPassDataProps) => EventPass | undefined;
  syncAllPassesCart: (props: SyncAllPassesCartProps) => AllPassesCart;
}

export const createEventPassesSlice: StateCreator<EventPassesSliceProps> = (
  set,
  get
) => ({
  passes: {},
  resetPasses: () => set({ passes: {} }),
  updatePassCart: ({ organizerSlug, eventSlug, pass }) => {
    return set((state) =>
      produce(state, (draft) => {
        const passes = draft.passes;

        if (!passes[organizerSlug]) {
          // This organizer does not exist yet, create it and add the event
          passes[organizerSlug] = { [eventSlug]: [pass] };
        } else if (!passes[organizerSlug][eventSlug]) {
          // The event does not exist yet, create it and add the pass
          passes[organizerSlug][eventSlug] = [pass];
        } else {
          // The event exists, find the pass
          const index = passes[organizerSlug][eventSlug].findIndex(
            (p) => p.id === pass.id
          );
          if (index !== -1) {
            // The pass exists, update it
            passes[organizerSlug][eventSlug][index] = pass;
          } else {
            // The pass does not exist, add it
            passes[organizerSlug][eventSlug].push(pass);
          }
        }

        draft.passes = passes;
      })
    );
  },
  setPassesCart: ({ organizerSlug, eventSlug, newPasses }) =>
    set((state) =>
      produce(state, (draft) => {
        const passes = draft.passes;
        if (!passes[organizerSlug]) {
          passes[organizerSlug] = {};
        }
        passes[organizerSlug][eventSlug] = newPasses;
        draft.passes = passes;
      })
    ),
  deletePassesCart: ({ organizerSlug, eventSlug }) =>
    set((state) =>
      produce(state, (draft) => {
        const passes = draft.passes;
        if (passes[organizerSlug]?.[eventSlug]) {
          const newPasses = { ...passes };
          delete newPasses[organizerSlug][eventSlug];
          draft.passes = newPasses;
        }
      })
    ),
  deletePassCart: ({ organizerSlug, eventSlug, eventPassId }) =>
    set((state) =>
      produce(state, (draft) => {
        const passes = draft.passes;
        if (passes[organizerSlug]?.[eventSlug]) {
          const newPasses = { ...passes };
          const passesCart = newPasses[organizerSlug][eventSlug];
          const passIndex = passesCart.findIndex((p) => p.id === eventPassId);
          if (passIndex !== -1) {
            passesCart.splice(passIndex, 1);
          }
          draft.passes = newPasses;
        }
      })
    ),
  getPassesCart: ({ organizerSlug, eventSlug }) => {
    const passes = get().passes;
    if (passes[organizerSlug]) {
      return passes[organizerSlug][eventSlug]?.filter((pass) => pass.amount);
    }
  },
  getPassCart: ({ organizerSlug, eventSlug, eventPassId }) => {
    const passes = get().getPassesCart({ organizerSlug, eventSlug });
    return passes?.find((pass) => pass.id === eventPassId);
  },
  getPassData: ({ passCartId, passesData }) => {
    return passesData.find((pass) => pass.id === passCartId);
  },
  getPassesCartTotalPrice: ({ organizerSlug, eventSlug, passesData }) => {
    let totalAmount = 0;
    const totalCurrency = passesData[0].eventPassPricing?.priceCurrency;
    const passesCart = get().getPassesCart({ organizerSlug, eventSlug });
    if (!passesCart) return { amount: 0, currency: totalCurrency };
    passesCart.forEach((passCart) => {
      const passData = get().getPassData({
        passCartId: passCart.id,
        passesData,
      });
      if (passData) {
        totalAmount +=
          passCart.amount * (passData.eventPassPricing?.priceAmount || 0);
      }
    });
    return { amount: totalAmount, currency: totalCurrency };
  },
  getPassesCartTotalPasses: ({ organizerSlug, eventSlug }) => {
    const passesCart = get().getPassesCart({ organizerSlug, eventSlug });
    if (!passesCart) return 0;

    return passesCart.reduce(
      (totalPasses, passCart) => totalPasses + passCart.amount,
      0
    );
  },
  syncAllPassesCart: ({ userPassPendingOrders }) => {
    const passes = get().passes;
    const organizerSlugs = Object.keys(passes);
    const allPassesCart: AllPassesCart = {};

    organizerSlugs.forEach((organizerSlug) => {
      const eventSlugs = Object.keys(passes[organizerSlug]);
      eventSlugs.forEach((eventSlug) => {
        const passesCart = passes[organizerSlug][eventSlug];
        if (passesCart && passesCart.length > 0) {
          // Ensure there are passes in the event
          if (!allPassesCart[organizerSlug]) {
            // Initialize the organizer if it hasn't been added yet
            allPassesCart[organizerSlug] = {};
          }
          allPassesCart[organizerSlug][eventSlug] = passesCart;
        }
      });

      // After going through all events, check if the organizer has any events left.
      // If not, delete the organizer from the object.
      if (
        allPassesCart[organizerSlug] &&
        Object.keys(allPassesCart[organizerSlug]).length === 0
      ) {
        delete allPassesCart[organizerSlug];
      }
    });

    if (userPassPendingOrders) {
      const updatePassCart = get().updatePassCart;
      // Iterate through userPassPendingOrders and add them if they don't exist
      userPassPendingOrders.forEach((order) => {
        const { eventPassId: id, quantity: amount } = order;

        const organizerSlug = order.eventPass?.event?.organizer?.slug;
        const eventSlug = order.eventPass?.event?.slug;

        if (!organizerSlug || !eventSlug) return;

        if (!allPassesCart[organizerSlug]) {
          allPassesCart[organizerSlug] = {};
        }

        if (!allPassesCart[organizerSlug][eventSlug]) {
          allPassesCart[organizerSlug][eventSlug] = [];
        }

        // Check if this pass already exists
        const passExists = allPassesCart[organizerSlug][eventSlug].some(
          (pass) => pass.id === id
        );

        if (!passExists) {
          // If it doesn't exist, add it
          const newPass = { id, amount };
          allPassesCart[organizerSlug][eventSlug].push({ id, amount });
          updatePassCart({ organizerSlug, eventSlug, pass: newPass });
        }
      });
    }
    return allPassesCart;
  },
});
