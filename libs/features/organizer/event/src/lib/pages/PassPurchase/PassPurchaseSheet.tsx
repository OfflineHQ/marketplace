// PassPurchaseSheet.tsx
import { Link } from '@next/navigation';
import { PropsFrom } from '@next/types';
import {
  SheetDescription,
  SheetDescriptionSkeleton,
  SheetHeader,
  SheetNavigationSkeleton,
  SheetOverflow,
  SheetTitle,
  SheetTitleSkeleton,
  type SheetNavigationProps,
} from '@ui/components';
import { PassFooterServer } from '../../organisms/PassFooter/PassFooterServer';
import { PassFooterSheetClient } from '../../organisms/PassFooter/PassFooterSheetClient';
import {
  PassList,
  PassListProps,
  PassListSkeleton,
} from '../../organisms/PassList/PassList';
import {
  PassPurchaseSheetNavigationClient,
  type PassPurchaseSheetNavigationClientProps,
} from './PassPurchaseSheetNavigationClient';

export interface PassPurchaseSheetProps
  extends PassPurchaseSheetNavigationClientProps,
    PassListProps {
  goPaymentText: string;
  goPaymentLink: PropsFrom<typeof Link>;
  title: string;
  description: string;
}

export const PassPurchaseSheet: React.FC<PassPurchaseSheetProps> = ({
  size = 'lg',
  passes,
  description,
  title,
  backButtonText,
  backButtonLink,
  organizerSlug,
  eventSlug,
  hasConfirmedPasses,
  ...footerProps
}) => {
  return (
    <>
      <SheetHeader size={size}>
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>{description}</SheetDescription>
      </SheetHeader>
      <SheetOverflow className="py-3">
        <PassList
          passes={passes}
          organizerSlug={organizerSlug}
          eventSlug={eventSlug}
          hasConfirmedPasses={hasConfirmedPasses}
        />
      </SheetOverflow>
      <PassFooterServer>
        <PassFooterSheetClient
          passes={passes}
          organizerSlug={organizerSlug}
          eventSlug={eventSlug}
          {...footerProps}
        />
      </PassFooterServer>
      <PassPurchaseSheetNavigationClient
        size={size}
        backButtonText={backButtonText}
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
