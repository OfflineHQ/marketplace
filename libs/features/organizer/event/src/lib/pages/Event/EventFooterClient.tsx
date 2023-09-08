'use client';

import { Button } from '@ui/components';

import { QrCode } from '@ui/icons';
import Link, { type LinkProps } from 'next/link';

export interface EventFooterClientProps {
  purchaseLink: LinkProps;
  purchaseText: string;
}

export const EventFooterClient: React.FC<EventFooterClientProps> = ({
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
