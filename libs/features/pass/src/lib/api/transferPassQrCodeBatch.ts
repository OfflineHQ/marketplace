import { FileWrapper, FileCopyStatus } from '@file-upload/admin';
import type { BatchTransferInput } from '@features/pass-types';
import { getPassUser } from './common';

const fileWrapper = new FileWrapper();

export const transferPassQrCodeBatch = async (
  transferInputs: BatchTransferInput[]
) => {
  const copyFileRequests: Parameters<
    typeof fileWrapper.copyFileBatchWithRetry
  >[1] = [];
  const filesToDelete: string[] = [];

  // Construct the source and destination paths
  for (const input of transferInputs) {
    const { eventPassId, address, tokenId, eventPass } = input.eventPassOwned;
    if (!eventPass?.event)
      throw new Error('Event not found for ' + eventPassId);
    const { slug: eventSlug } = eventPass.event;
    if (!eventPass?.event?.organizer)
      throw new Error('Organizer for event not found for ' + eventPassId);
    const { slug: organizerSlug } = eventPass.event.organizer;

    const fileOrigin = getPassUser({
      address: input.formerOwnerAddress,
      organizerSlug,
      eventSlug,
      eventPassId,
      tokenId,
    });

    const fileDest = getPassUser({
      address,
      organizerSlug,
      eventSlug,
      eventPassId,
      tokenId,
    });

    copyFileRequests.push({
      source: fileOrigin,
      destination: fileDest,
    });

    filesToDelete.push(fileOrigin);
  }

  try {
    // Execute the copy batch operation with retry
    await fileWrapper.copyFileBatchWithRetry(
      process.env.UPLOAD_ACCOUNT_ID as string,
      copyFileRequests
    );
  } catch (error: any) {
    throw new Error(
      `Error while copying files in transferPassQrCodeBatch: ${
        error.message
      }. Failed batch: ${JSON.stringify(copyFileRequests)}`
    );
  }

  try {
    // Execute the delete batch operation with retry
    await fileWrapper.deleteFilesBatchWithRetry(
      process.env.UPLOAD_ACCOUNT_ID as string,
      filesToDelete
    );
  } catch (error: any) {
    throw new Error(
      `Error while deleting files in transferPassQrCodeBatch: ${
        error.message
      }. Failed batch: ${JSON.stringify(filesToDelete)}`
    );
  }
};
