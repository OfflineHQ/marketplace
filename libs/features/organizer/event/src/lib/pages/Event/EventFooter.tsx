import { Button } from '@ui/components';

import { QrCode } from '@ui/icons';
import Link, { type LinkProps } from 'next/link';

export interface EventFooterProps {
  purchaseLink: LinkProps;
  purchaseText: string;
}

export const EventFooter: React.FC<EventFooterProps> = ({
  purchaseLink,
  purchaseText,
}) => {
  return (
    <Link {...purchaseLink} legacyBehavior passHref className="w-full">
      <Button icon={<QrCode />} block className="w-full md:w-1/6">
        {purchaseText}
      </Button>
    </Link>
  );
};
