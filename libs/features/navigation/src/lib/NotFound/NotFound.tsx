import {
  AppContainer,
  AppContainerFooter,
  AppContainerOverflow,
} from '@features/app-nav';
import { Link } from '@next/navigation';
import { Alert, AlertTitle, Button, CardContent } from '@ui/components';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function NotFound() {
  const t = useTranslations('Navigation');
  return (
    <AppContainer>
      <AppContainerOverflow variant="stickyFooter">
        <CardContent className="size-full flex flex-col items-center">
          <div className="size-80 relative grow">
            <Image fill src="/not-found.svg" alt={t('404-not-found')} />
          </div>
          <Alert variant="info" className="w-fit">
            <AlertTitle>{t('404-not-found')}</AlertTitle>
          </Alert>
        </CardContent>
      </AppContainerOverflow>
      <AppContainerFooter>
        <Link href="/" legacyBehavior className="w-full justify-center">
          <Button variant="secondary" className={`w-full md:w-1/3`} block>
            {t('back-to-home')}
          </Button>
        </Link>
      </AppContainerFooter>
    </AppContainer>
  );
}
