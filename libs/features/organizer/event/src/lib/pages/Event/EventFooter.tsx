import { Button } from '@ui/components';

import { Link } from '@next/navigation';
import { PropsFrom } from '@next/types';
import { QrCode } from '@ui/icons';

export interface EventFooterProps {
  purchaseLink: PropsFrom<typeof Link>;
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
