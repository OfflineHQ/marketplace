import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { Locale, messages } from '@next/i18n';
import {
  BlockchainAddress,
  Button,
  ButtonSkeleton,
  CardFooter,
  HelperText,
} from '@ui/components';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { checkEventPassNftFilesHash } from '../../actions/checkEventPassFilesHash';
import { getEventPassNftFiles } from '../../actions/getEventPassNftFiles';
import { EventPassContractRevealButtonClient } from './EventPassContractRevealButtonClient';
import {
  EventPassDeployButtonClient,
  EventPassDeployButtonClientProps,
} from './EventPassDeployButtonClient';

export interface EventPassCardFooterProps
  extends Omit<EventPassDeployButtonClientProps, 'children'> {}

function EventPassContractDeployButton({
  eventPass,
  ...props
}: EventPassCardFooterProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassCardFooter',
  );
  const texts = {
    deployContract: t('deploy-contract'),
    noPricingSet: t('no-pricing-set'),
    numFilesDoesNotMatch: t('num-files-does-not-match'),
    someFilesAreDuplicates: t('some-files-are-duplicates'),
  };
  return (
    <Suspense fallback={<ButtonSkeleton className="w-full" />}>
      <EventPassContractDeployButtonContent
        eventPass={eventPass}
        texts={texts}
        {...props}
      />
    </Suspense>
  );
}

interface EventPassContractDeployButtonContentProps
  extends EventPassCardFooterProps {
  texts: {
    deployContract: string;
    noPricingSet: string;
    numFilesDoesNotMatch: string;
    someFilesAreDuplicates: string;
  };
}

async function EventPassContractDeployButtonContent({
  eventPass,
  texts: {
    deployContract,
    noPricingSet,
    numFilesDoesNotMatch,
    someFilesAreDuplicates,
  },
  organizerId,
  eventId,
  ...props
}: EventPassContractDeployButtonContentProps) {
  const isDisabledReasons: string[] = [];

  if (!eventPass.eventPassPricing?.maxAmount)
    isDisabledReasons.push(noPricingSet);
  else {
    const maxAmount = eventPass.eventPassPricing.maxAmount;
    const nftFiles = await getEventPassNftFiles({
      organizerId,
      eventId,
      eventPassId: eventPass.id,
    });
    if (nftFiles?.length !== maxAmount)
      isDisabledReasons.push(numFilesDoesNotMatch);
    if (nftFiles?.length) {
      const duplicates = await checkEventPassNftFilesHash({
        filesPath: nftFiles.map((file) => file.filePath),
        organizerId,
        eventId,
        eventPassId: eventPass.id,
      });
      if (duplicates.length) isDisabledReasons.push(someFilesAreDuplicates);
    }
  }
  const locale = useLocale() as Locale;
  const localeMessages = deepPick(messages[locale], [
    'OrganizerEvents.Sheet.EventPassCard.EventPassCardFooter.EventPassDeployButtonClient',
  ]);
  return (
    <div className="w-full flex-col">
      {isDisabledReasons?.length ? (
        <>
          <Button block disabled>
            {deployContract}
          </Button>
          <HelperText message={isDisabledReasons} variant="warning" />
        </>
      ) : (
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <EventPassDeployButtonClient
            {...props}
            eventPass={eventPass}
            organizerId={organizerId}
            eventId={eventId}
          >
            {deployContract}
          </EventPassDeployButtonClient>
        </NextIntlClientProvider>
      )}
    </div>
  );
}

function EventPassContractDeployed({
  eventPass,
  eventPassType,
  ...props
}: EventPassCardFooterProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassCardFooter',
  );
  return (
    <div className="w-full flex-col space-y-4">
      <BlockchainAddress
        address={eventPass.eventPassNftContract?.contractAddress as string}
        copiedText={t('copied-contract-address')}
      />
      {eventPassType === EventPassNftContractType_Enum.DelayedReveal &&
        !eventPass?.eventPassNftContract?.isDelayedRevealed && (
          <EventPassContractRevealButtonClient
            eventPass={eventPass}
            {...props}
          />
        )}
    </div>
  );
}

export function EventPassCardFooter({
  eventPass,
  ...props
}: EventPassCardFooterProps) {
  return (
    <CardFooter>
      {!eventPass.eventPassNftContract ? (
        <EventPassContractDeployButton eventPass={eventPass} {...props} />
      ) : (
        <EventPassContractDeployed eventPass={eventPass} {...props} />
      )}
    </CardFooter>
  );
}
