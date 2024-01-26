'use client';

import env from '@env/client';
import { EventPass } from '@features/back-office/events-types';
import { useAuthContext } from '@next/auth';
import { NftCollection } from '@nft/thirdweb-organizer';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Button, useToast } from '@ui/components';
import { Reveal } from '@ui/icons';
import { getErrorMessage } from '@utils';
import { useLocale, useTranslations } from 'next-intl';
import { resetEventPasses } from '../../actions/resetEventPasses';

export interface EventPassContractRevealButtonClientProps {
  eventSlug: string;
  eventPass: EventPass;
}

export function EventPassContractRevealButtonClient({
  eventPass,
  eventSlug,
}: EventPassContractRevealButtonClientProps) {
  const { toast } = useToast();
  const { getSigner } = useAuthContext();
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassCardFooter.EventPassContractRevealButtonClient',
  );
  const locale = useLocale();
  async function revealContract() {
    try {
      if (!eventPass.eventPassNftContract?.contractAddress) {
        throw new Error('Password is undefined');
      }
      const signer = await getSigner();
      if (!signer) throw new Error('noSigner');
      const sdk = new NftCollection(
        ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN, {
          clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        }),
      );
      await sdk.revealDelayedContract(
        eventPass.eventPassNftContract?.contractAddress,
      );
      toast({
        title: t('success-title'),
        description: t('success-description', {
          eventPassName: eventPass.name,
        }),
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
  return (
    <Button block icon={<Reveal />} onClick={revealContract}>
      {t('reveal-contract')}
    </Button>
  );
}
