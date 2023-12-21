'use client';

import { EventPass } from '@features/back-office/events-types';
import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { useAuthContext } from '@next/auth';
import NftCollection from '@nft/thirdweb-organizer';
import { EventSmallData } from '@nft/types';
import { Button, ButtonSkeleton } from '@ui/components';
import { ethers } from 'ethers6';
import { checkEventPassNftFilesHash } from '../../actions/checkEventPassFilesHash';
import { getEventPassNftFiles } from '../../actions/getEventPassNftFiles';

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
  const { provider, chainConfig, chainId } = useAuthContext();
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
      const duplicates = await checkEventPassNftFilesHash({
        filesPath: eventPassFiles.map((file) => file.filePath),
        eventPassId: eventPass.id,
        eventId,
        organizerId,
      });
      if (duplicates.length) throw new Error('someFilesAreDuplicates');

      const web3Provider = new ethers.BrowserProvider(provider, {
        chainId: parseInt(chainId as string),
        name: chainConfig.displayName,
      });
      const signer = await web3Provider.getSigner();
      // TODO to update once thirdweb support diem or ethers6
      const sdk = new NftCollection(signer as any);
      await sdk.deployACollection(
        eventPass,
        {
          organizerId,
          eventId,
          eventSlug,
        },
        eventPassType,
      );
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
