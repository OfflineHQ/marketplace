'use client';

import { EventPass } from '@features/back-office/events-types';
import { useAuthContext } from '@next/auth';
import { Button, useToast } from '@ui/components';
import { Reveal } from '@ui/icons';
import { getErrorMessage } from '@utils';
import { useLocale, useTranslations } from 'next-intl';
import { resetEventPasses } from '../../actions/resetEventPasses';
import { revealDelayedContract } from '../../actions/revealDelayedContract';

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
      const signer = await getSigner();
      if (!signer) throw new Error('noSigner');
      await revealDelayedContract(
        signer,
        eventPass.eventPassNftContract?.contractAddress as string,
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
