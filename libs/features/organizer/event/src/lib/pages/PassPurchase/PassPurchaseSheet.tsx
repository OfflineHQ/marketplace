// PassPurchaseSheet.tsx
import { getSaleStatus } from '@features/organizer/event-actions';
import {
  EventParametersPasses,
  SaleStatus,
} from '@features/organizer/event-types';
import {
  SheetDescriptionSkeleton,
  SheetHeader,
  SheetNavigation,
  SheetNavigationSkeleton,
  SheetOverflow,
  SheetTitle,
  SheetTitleSkeleton,
  type SheetNavigationProps,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import Link, { LinkProps } from 'next/link';
import { PassPurchaseHeader } from '../../molecules/PassPurchaseHeader/PassPurchaseHeader';
import { PassFooterServer } from '../../organisms/PassFooter/PassFooterServer';
import {
  PassFooterSheet,
  type PassFooterSheetProps,
} from '../../organisms/PassFooter/PassFooterSheet';
import {
  PassList,
  PassListProps,
  PassListSkeleton,
} from '../../organisms/PassList/PassList';

export interface PassPurchaseSheetProps
  extends SheetNavigationProps,
    Omit<PassListProps, 'saleStatus'>,
    PassFooterSheetProps {
  closeLink: LinkProps;
  eventParameters: EventParametersPasses;
}

export const PassPurchaseSheet: React.FC<PassPurchaseSheetProps> = ({
  size = 'lg',
  passes,
  backButtonText,
  organizerSlug,
  eventSlug,
  hasConfirmedPasses,
  closeLink,
  eventParameters,
  ...footerProps
}) => {
  const saleStatus = getSaleStatus(eventParameters);
  const t = useTranslations('Organizer.Event.PassPurchase');
  return (
    <>
      <SheetOverflow className="space-y-4">
        <SheetHeader size={size}>
          <SheetTitle>{t('title')}</SheetTitle>
          <PassPurchaseHeader
            hasConfirmedPasses={hasConfirmedPasses}
            saleStatus={saleStatus}
          />
        </SheetHeader>
        <PassList
          passes={passes}
          organizerSlug={organizerSlug}
          eventSlug={eventSlug}
          hasConfirmedPasses={hasConfirmedPasses}
          saleStatus={saleStatus}
        />
      </SheetOverflow>
      {!hasConfirmedPasses && saleStatus === SaleStatus.Ongoing && (
        <PassFooterServer>
          <PassFooterSheet
            passes={passes}
            organizerSlug={organizerSlug}
            eventSlug={eventSlug}
            {...footerProps}
          />
        </PassFooterServer>
      )}
      <SheetNavigation
        wrapper={<Link {...closeLink} />}
        backButtonText={backButtonText}
        size={size}
      />
    </>
  );
};

export type PassPurchaseSheetSkeletonProps = Pick<SheetNavigationProps, 'size'>;

export const PassPurchaseSheetSkeleton: React.FC<
  PassPurchaseSheetSkeletonProps
> = ({ size = 'lg' }) => {
  return (
    <>
      <SheetNavigationSkeleton size={size} />
      <SheetHeader size={size}>
        <SheetTitleSkeleton />
        <SheetDescriptionSkeleton />
      </SheetHeader>
      <SheetOverflow className="py-3">
        <PassListSkeleton />
      </SheetOverflow>
    </>
  );
};
