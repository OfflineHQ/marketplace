'use client';

import { StateCreator } from 'zustand';
import { produce } from 'immer';
import type {
  EventSlugs,
  EventPass,
  EventPassCart,
  AllPassesCart,
} from '@features/organizer/event/types';

interface UpdatePassCartProps extends EventSlugs {
  pass: EventPassCart;
}

interface SetPassesCartProps extends EventSlugs {
  newPasses: EventPassCart[];
}

interface SetPassesProps extends EventSlugs {
  passes: EventPass[];
}

export interface EventPassesSliceProps {
  passes: AllPassesCart;
  resetPasses: () => void;
  updatePassCart: (props: UpdatePassCartProps) => void;
  setPasses: (props: SetPassesProps) => void;
  setPassesCart: (props: SetPassesCartProps) => void;
  deletePasses: (props: EventSlugs) => void;
  getPasses: (props: EventSlugs) => EventPassCart[] | undefined;
  getPassesCart: (props: EventSlugs) => EventPassCart[] | undefined;
  getAllPassesCart: () => AllPassesCart;
}

export const createEventPassesSlice: StateCreator<EventPassesSliceProps> = (
  set,
  get
) => ({
  passes: {},
  resetPasses: () => set({ passes: {} }),
  updatePassCart: ({ organizerSlug, eventSlug, pass }) =>
    set((state) =>
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
    ),
  setPasses: ({ organizerSlug, eventSlug, passes: newPasses }) =>
    set((state) =>
      produce(state, (draft) => {
        const currentPassesCart =
          get().getPassesCart({ organizerSlug, eventSlug }) || [];
        const currentPasses = draft.passes;

        if (!currentPasses[organizerSlug]) {
          currentPasses[organizerSlug] = {};
        }

        currentPasses[organizerSlug][eventSlug] = newPasses.map((newPass) => {
          const existingPass = currentPassesCart.find(
            (pass) => pass.id === newPass.id
          );
          return existingPass
            ? { ...newPass, numTickets: existingPass.numTickets }
            : { ...newPass, numTickets: 0 };
        });

        draft.passes = currentPasses;
      })
    ),

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
  deletePasses: ({ organizerSlug, eventSlug }) =>
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
  getPasses: ({ organizerSlug, eventSlug }) => {
    const passes = get().passes;
    if (passes[organizerSlug]) {
      return passes[organizerSlug][eventSlug];
    }
  },
  getPassesCart: ({ organizerSlug, eventSlug }) => {
    return get()
      .getPasses({ organizerSlug, eventSlug })
      ?.filter((pass) => pass.numTickets);
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
