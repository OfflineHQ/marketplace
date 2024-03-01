'use server';

import { revalidatePath } from 'next/cache';

export const resetLoyaltyCard = async ({ locale }: { locale: string }) => {
  return revalidatePath(`/${locale}/loyalty-card`);
};
