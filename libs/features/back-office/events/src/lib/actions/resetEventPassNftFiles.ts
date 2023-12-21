'use server';

import { GetEventPassOrganizerFolderPath } from '@features/pass-common';
import { revalidatePath, revalidateTag } from 'next/cache';

type ResetEventPassNftFilesProps = GetEventPassOrganizerFolderPath & {
  eventSlug: string;
  locale: string;
};

export const resetEventPassNftFiles = async ({
  organizerId,
  eventId,
  eventPassId,
  eventSlug,
  locale,
}: ResetEventPassNftFilesProps) => {
  revalidateTag(
    `${organizerId}-${eventId}-${eventPassId}-getEventPassNftFiles`,
  );
  await revalidatePath(`/${locale}/events/${eventSlug}`);
};
