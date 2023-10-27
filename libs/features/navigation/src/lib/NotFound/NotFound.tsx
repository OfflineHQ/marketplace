import { Link } from '@next/navigation';
import { Alert, Button, Card, CardContent, CardFooter } from '@ui/components';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function NotFound() {
  const t = useTranslations('navigation');
  return (
    <Card variant="stickyFooter" noBorder className="container mx-auto h-full">
      <CardContent className="flex w-full flex-col items-center">
        <div className="relative h-80 w-80 grow">
          <Image fill src="/not-found.svg" alt={t('404-not-found')} />
        </div>
        <Alert variant="info" className="w-fit">
          {t('404-not-found')}
        </Alert>
      </CardContent>
      <CardFooter className="flex flex-col items-center" variant="sticky">
        <Link href="/" legacyBehavior className="w-full justify-center">
          <Button variant="secondary" className={`w-full md:w-1/3`} block>
            {t('back-to-home')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
