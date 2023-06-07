import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createEventPassesSlice,
  EventPassesSlice,
} from './createEventPassesSlice';

type StoreState = EventPassesSlice;

export const usePassPurchaseStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createEventPassesSlice(...a),
    }),
    {
      name: 'pass-purchase-store',
    }
  )
);
