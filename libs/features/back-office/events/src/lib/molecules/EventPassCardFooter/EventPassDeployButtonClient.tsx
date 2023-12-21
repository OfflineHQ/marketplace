'use client';

import { EventPass } from '@features/back-office/events-types';
import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { useAuthContext } from '@next/auth';
import { EventSmallData } from '@nft/types';
import { Button, ButtonSkeleton, useToast } from '@ui/components';
import { getErrorMessage } from '@utils';
import { useLocale, useTranslations } from 'next-intl';
import { checkEventPassNftFilesHash } from '../../actions/checkEventPassFilesHash';
import { deployCollectionWrapper } from '../../actions/deployCollectionWrapper';
import { getEventPassNftFiles } from '../../actions/getEventPassNftFiles';
import { renameEventPassNftFiles } from '../../actions/renameEventPassNftFiles';
import { resetEventPassNftFiles } from '../../actions/resetEventPassNftFiles';
import { resetEventPasses } from '../../actions/resetEventPasses';

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
  const { toast } = useToast();
  const { provider, getSigner } = useAuthContext();
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassCardFooter.EventPassDeployButtonClient',
  );
  const locale = useLocale();
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
      toast({
        title: t('success-title'),
        description: t('success-description', {
          eventPassName: eventPass.name,
        }),
      });
      await resetEventPassNftFiles({
        locale,
        eventSlug,
        eventPassId: eventPass.id,
        eventId,
        organizerId,
      });
      await resetEventPasses({
        eventSlug,
        locale,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t('error-title'),
        description: getErrorMessage(error),
        variant: 'destructive',
      });
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
