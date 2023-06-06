// lib/slices/createEventPassesSlice.ts

import { StateCreator } from 'zustand';
import { EventPassCart } from '../types';

export interface EventPassesSlice {
  passes: Record<string, EventPassCart[]>; // EventPasses will be grouped by eventId
  updatePass: (eventId: string, pass: EventPassCart) => void;
  setPasses: (eventId: string, passes: EventPassCart[]) => void;
  getPasses: (eventId: string) => EventPassCart[] | undefined;
}

export const createEventPassesSlice: StateCreator<EventPassesSlice> = (
  set,
  get
) => ({
  passes: {},
  updatePass: (eventId: string, pass: EventPassCart) => {
    const passes = get().passes;
    if (!passes[eventId]) {
      // This event does not exist yet, create it and add the pass
      passes[eventId] = [pass];
    } else {
      // The event exists, find the pass
      const index = passes[eventId].findIndex((p) => p.id === pass.id);
      if (index !== -1) {
        // The pass exists, update the number of tickets
        passes[eventId][index] = pass;
      } else {
        // The pass does not exist, add it to the passes array
        passes[eventId].push(pass);
      }
    }
    set({ passes });
  },
  setPasses: (eventId: string, passes: EventPassCart[]) => {
    const currentPasses = get().passes;
    currentPasses[eventId] = passes;
    set({ passes: currentPasses });
  },
  getPasses: (eventId: string) => {
    const passes = get().passes;
    return passes[eventId];
  },
});
