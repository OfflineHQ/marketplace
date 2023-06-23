'use client';

import { StateCreator } from 'zustand';
import { produce } from 'immer';
import type {
  EventSlugs,
  EventPass,
  EventPassCart,
  AllPassesCart,
} from '@features/organizer/event/types';
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

export interface EventPassesSliceProps {
  passes: AllPassesCart;
  resetPasses: () => void;
  getPassCart: (props: GetPassCartProps) => EventPassCart | undefined;
  updatePassCart: (props: UpdatePassCartProps) => void;
  setPassesCart: (props: SetPassesCartProps) => void;
  deletePassesCart: (props: EventSlugs) => void;
  getPassesCart: (props: EventSlugs) => EventPassCart[] | undefined;
  getPassesCartTotalPrice: (props: GetPassesCartTotalPriceProps) => Money;
  getPassesCartTotalPasses: (props: EventSlugs) => number;
  getPassData: (props: getPassDataProps) => EventPass | undefined;
  getAllPassesCart: () => AllPassesCart;
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
        } else
          throw new Error(
            `Event passes for ${organizerSlug}/${eventSlug} do not exist`
          );
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
    // const totalCurrency: passesData[0].price.currency;
    const totalCurrency = passesData[0].price.currency;
    const passesCart = get().getPassesCart({ organizerSlug, eventSlug });
    if (!passesCart) return { amount: 0, currency: totalCurrency };
    passesCart.forEach((passCart) => {
      const passData = get().getPassData({
        passCartId: passCart.id,
        passesData,
      });
      if (passData) {
        totalAmount += passCart.amount * passData.price.amount;
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
  getAllPassesCart: () => {
    const passes = get().passes;
    const organizerSlugs = Object.keys(passes);
    const eventSlugs = organizerSlugs.map((organizerSlug) =>
      Object.keys(passes[organizerSlug])
    );
    const allPassesCart: AllPassesCart = {};
    organizerSlugs.forEach((organizerSlug, organizerIndex) => {
      eventSlugs[organizerIndex].forEach((eventSlug) => {
        const passesCart = get().getPassesCart({ organizerSlug, eventSlug });
        if (passesCart) {
          allPassesCart[organizerSlug] = {};
          allPassesCart[organizerSlug][eventSlug] = passesCart;
        }
      });
    });
    return allPassesCart;
  },
});
