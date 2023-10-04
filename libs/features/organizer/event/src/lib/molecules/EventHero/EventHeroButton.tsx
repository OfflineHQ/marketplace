import { Button } from '@ui/components';

import { Link } from '@next/navigation';
import { PropsFrom } from '@next/types';
import { QrCode } from '@ui/icons';
export interface EventHeroButtonProps {
  purchaseLink: PropsFrom<typeof Link>;
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
