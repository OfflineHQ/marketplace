// PassPurchaseSheet.tsx
import { getSaleStatus } from '@features/organizer/event-actions';
import { EventParametersPasses } from '@features/organizer/event-types';
import {
  SheetDescription,
  SheetDescriptionSkeleton,
  SheetHeader,
  SheetNavigation,
  SheetNavigationSkeleton,
  SheetOverflow,
  SheetTitle,
  SheetTitleSkeleton,
  type SheetNavigationProps,
} from '@ui/components';
import Link, { LinkProps } from 'next/link';
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
  title: string;
  description: string;
  closeLink: LinkProps;
  eventParameters: EventParametersPasses;
}

export const PassPurchaseSheet: React.FC<PassPurchaseSheetProps> = ({
  size = 'lg',
  passes,
  description,
  title,
  backButtonText,
  organizerSlug,
  eventSlug,
  hasConfirmedPasses,
  closeLink,
  eventParameters,
  ...footerProps
}) => {
  const saleStatus = getSaleStatus(eventParameters);
  return (
    <>
      <SheetOverflow className="space-y-4">
        <SheetHeader size={size}>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <PassList
          passes={passes}
          organizerSlug={organizerSlug}
          eventSlug={eventSlug}
          hasConfirmedPasses={hasConfirmedPasses}
          saleStatus={saleStatus}
        />
      </SheetOverflow>
      <PassFooterServer>
        <PassFooterSheet
          passes={passes}
          organizerSlug={organizerSlug}
          eventSlug={eventSlug}
          {...footerProps}
        />
      </PassFooterServer>
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
