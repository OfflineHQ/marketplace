import { Button } from '@ui/components';

import { QrCode } from '@ui/icons';
import Link, { type LinkProps } from 'next/link';

export interface EventHeroButtonProps {
  purchaseLink: LinkProps;
  purchaseText: string;
}

export const EventHeroButton: React.FC<EventHeroButtonProps> = ({
  purchaseLink,
  purchaseText,
}) => {
  return (
    <Link {...purchaseLink} legacyBehavior passHref>
      <Button icon={<QrCode />} block variant="secondary" className="px-8">
        {purchaseText}
      </Button>
    </Link>
  );
};
