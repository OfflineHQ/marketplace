import { OffKeyLogo } from '@features/unlock/app-nav';
import { Link } from '@next/navigation';
import { Button } from '@ui/components';
import { useTranslations } from 'next-intl';
import type { LinkProps } from 'next/link';

export type OffKeyHowToGetProps = LinkProps;

export const OffKeyHowToGet: React.FC<OffKeyHowToGetProps> = ({ href }) => {
  const t = useTranslations('Shopify.OffKeyHowToGet');
  return (
    <Link href={href} legacyBehavior passHref>
      <Button className="bg-warning" block size="lg" icon={<OffKeyLogo />}>
        {t('locked-how-to-get-key')}
      </Button>
    </Link>
  );
};
