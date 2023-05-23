import { getEvent } from '@features/organizer/event/server';
import {
  PassPurchase,
  type PassPurchaseProps,
} from '@features/organizer/event';
import { useTranslations } from 'next-intl';

export default async function PurchaseSection({
  event: _event,
  organizer,
  locale,
}) {
  const t = useTranslations('Organizer.Event');
  const event = await getEvent({ organizer, event: _event });
  // TODO get reserved passes and owned passes from user if connected and change pass props so it respect boundaries. Also need to change pass purchase to handle this.
  const passes: PassPurchaseProps['passes'] = event.passes.map(
    (pass) =>
      ({
        numTickets: 0,
        onChange: () => null,
        ...pass,
      } satisfies PassPurchaseProps['passes'][0])
  );
  return (
    <PassPurchase
      {...event}
      passes={passes}
      goPaymentText={t('pass-purchase.purchase-button')}
      soldOutText={t('pass-purchase.pass.sold-out')}
      open={false}
      onOpenChange={() => null}
    />
  );
}
