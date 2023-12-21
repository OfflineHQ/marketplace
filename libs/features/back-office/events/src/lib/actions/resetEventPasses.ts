'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

type ResetEventPassesProps = {
  eventSlug: string;
  locale: string;
};

export const resetEventPasses = async ({
  eventSlug,
  locale,
}: ResetEventPassesProps) => {
  revalidateTag(`${eventSlug}-getEventWithPassesOrganizer`);
  await revalidatePath(`/${locale}/events/${eventSlug}`);
};
