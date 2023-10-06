import { FileWrapper, FileCopyStatus } from '@file-upload/admin';
import type { BatchTransferInput } from '@features/pass-types';
import { getPassUser } from '@features/pass-common';
import env from '@env/server';

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
    const { currentOwnerAddress, tokenId, eventId, eventPassId, organizerId } =
      input.eventPassNft;

    if (!currentOwnerAddress)
      throw new Error('The pass is not owned by anyone');

    const fileOrigin = getPassUser({
      address: input.formerOwnerAddress,
      organizerId,
      eventId,
      eventPassId,
      tokenId,
    });

    const fileDest = getPassUser({
      address: currentOwnerAddress,
      organizerId,
      eventId,
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
      env.UPLOAD_ACCOUNT_ID,
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
      env.UPLOAD_ACCOUNT_ID,
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
