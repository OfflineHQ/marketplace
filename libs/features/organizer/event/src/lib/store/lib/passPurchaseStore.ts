import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createEventPassesSlice,
  EventPassesSliceProps,
} from './createEventPassesSlice';

type StoreState = EventPassesSliceProps;

export const usePassPurchaseStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createEventPassesSlice(...a),
    }),
    {
      name: 'PassPurchase-store',
    }
  )
);
