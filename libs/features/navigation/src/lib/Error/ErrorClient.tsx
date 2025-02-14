'use client';

import {
  AppContainer,
  AppContainerFooter,
  AppContainerOverflow,
} from '@features/app-nav';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  CardContent,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  customMessage?: string;
}

export function ErrorClient({ error, reset, customMessage }: ErrorProps) {
  const t = useTranslations('Navigation');
  return (
    <AppContainer>
      <AppContainerOverflow variant="stickyFooter">
        <CardContent className="flex size-full flex-col items-center">
          <div className="relative size-80 grow">
            <Image fill src="/error.svg" alt={t('error-message')} />
          </div>
          {/* IMPORTANT: no idea why but putting Alert in this component is breaking the next apps with `TypeError: Cannot destructure property 'parallelRouterKey' of 'param' as it is null.` */}
          <Alert variant="destructive" className="w-fit">
            <AlertTitle>{t('error-message')}</AlertTitle>
            {customMessage && (
              <AlertDescription>{customMessage}</AlertDescription>
            )}
          </Alert>
        </CardContent>
      </AppContainerOverflow>
      <AppContainerFooter>
        <Button
          variant="secondary"
          className={`w-full md:w-1/3`}
          block
          onClick={() => reset()}
        >
          {t('retry')}
        </Button>
      </AppContainerFooter>
    </AppContainer>
  );
}
