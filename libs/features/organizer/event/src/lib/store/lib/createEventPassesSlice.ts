'use client';

import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { EventPassCart, AllPassesCart } from '../../types';
import type { EventSlugs } from '@features/organizer/event/types';

interface UpdatePassProps extends EventSlugs {
  pass: EventPassCart;
}

interface SetPassesProps extends EventSlugs {
  newPasses: EventPassCart[];
}

export interface EventPassesSliceProps {
  passes: AllPassesCart;
  updatePass: (props: UpdatePassProps) => void;
  setPasses: (props: SetPassesProps) => void;
  deletePasses: (props: EventSlugs) => void;
  getPasses: (props: EventSlugs) => EventPassCart[] | undefined;
}

export const createEventPassesSlice: StateCreator<EventPassesSliceProps> = (
  set,
  get
) => ({
  passes: {},
  updatePass: ({ organizerSlug, eventSlug, pass }) =>
    set((state) =>
      produce(state, (draft) => {
        const passes = draft.passes;

        if (pass.numTickets <= 0) {
          // Don't add a pass if numTickets is 0 or less, remove it if it exists
          if (passes[organizerSlug] && passes[organizerSlug][eventSlug]) {
            const index = passes[organizerSlug][eventSlug].findIndex(
              (p) => p.id === pass.id
            );
            if (index !== -1) {
              // The pass exists, remove it
              passes[organizerSlug][eventSlug].splice(index, 1);
            }
          }
        } else {
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
        }

        draft.passes = passes;
      })
    ),
  setPasses: ({ organizerSlug, eventSlug, newPasses }) =>
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
});
