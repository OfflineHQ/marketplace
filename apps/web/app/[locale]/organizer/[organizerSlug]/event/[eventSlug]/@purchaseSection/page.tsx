import { getEventPasses } from '@features/organizer/event/server';
import type { EventPass } from '@features/organizer/event/types';
import {
  PassPurchase,
  type PassPurchaseProps,
} from '@features/organizer/event';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

export default async function PurchaseSection() {
  const router = useRouter();
  const eventSlug = router.query.eventSlug as string;
  const organizerSlug = router.query.organizerSlug as string;
  const passes = await getEventPasses({ eventSlug, organizerSlug });

  return (
    <PurchaseSectionContent
      passes={passes}
      eventSlug={eventSlug}
      organizerSlug={organizerSlug}
    />
  );
}

interface PurchaseSectionContentProps {
  passes: EventPass[];
  eventSlug: string;
  organizerSlug: string;
}

function PurchaseSectionContent({
  passes: _passes,
  eventSlug,
  organizerSlug,
}: PurchaseSectionContentProps) {
  const t = useTranslations('Organizer.Event');
  // TODO get reserved passes and owned passes from user if connected and change pass props so it respect boundaries. Also need to change pass purchase to handle this.
  const passes: PassPurchaseProps['passes'] = _passes.map(
    (pass) =>
      ({
        numTickets: 0,
        onChange: () => null,
        ...pass,
      } satisfies PassPurchaseProps['passes'][0])
  );
  return (
    <PassPurchase
      passes={passes}
      title={t('pass-purchase.title')}
      description={t('pass-purchase.description')}
      goPaymentText={t('pass-purchase.purchase-button')}
      soldOutText={t('pass-purchase.pass.sold-out')}
      open={false}
      onOpenChange={() => null}
    />
  );
}
