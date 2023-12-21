'use client';

import { EventPass } from '@features/back-office/events-types';
import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { useAuthContext } from '@next/auth';
import { EventSmallData } from '@nft/types';
import { Button, ButtonSkeleton } from '@ui/components';
import { checkEventPassNftFilesHash } from '../../actions/checkEventPassFilesHash';
import { getEventPassNftFiles } from '../../actions/getEventPassNftFiles';
import { renameEventPassNftFiles } from '../../actions/renameEventPassNftFiles';
import { deployCollectionWrapper } from './deployCollectionWrapper';

export interface EventPassDeployButtonClientProps extends EventSmallData {
  eventPassId: string;
  eventPass: EventPass;
  children: React.ReactNode;
  eventPassType: EventPassNftContractType_Enum;
}

export function EventPassDeployButtonClient({
  children,
  eventPass,
  organizerId,
  eventId,
  eventSlug,
  eventPassType,
}: EventPassDeployButtonClientProps) {
  const { provider, getSigner } = useAuthContext();
  async function deployContract() {
    if (!provider) return;
    try {
      const eventPassFiles = await getEventPassNftFiles({
        eventPassId: eventPass.id,
        eventId,
        organizerId,
      });
      if (eventPassFiles?.length !== eventPass.eventPassPricing?.maxAmount)
        throw new Error('numFilesDoesNotMatch');
      const filesPath = eventPassFiles.map((file) => file.filePath);
      const duplicates = await checkEventPassNftFilesHash({
        filesPath,
        eventPassId: eventPass.id,
        eventId,
        organizerId,
      });
      if (duplicates.length) throw new Error('someFilesAreDuplicates');

      await renameEventPassNftFiles({
        filesPath,
        eventPassId: eventPass.id,
        eventId,
        organizerId,
      });

      const signer = await getSigner();
      if (!signer) throw new Error('noSigner');
      await deployCollectionWrapper({
        signer,
        eventPassId: eventPass.id,
        organizerId,
        eventId,
        eventSlug,
        eventPassType,
        eventPass,
      });
    } catch (error) {
      console.error(error);
    }
  }
  //TODO add deploy button + await for sdk with signer
  return provider ? (
    <Button block onClick={deployContract}>
      {children}
    </Button>
  ) : (
    <ButtonSkeleton className="w-full" />
  );
}
