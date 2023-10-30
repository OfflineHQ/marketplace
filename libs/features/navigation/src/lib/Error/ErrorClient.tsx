'use client';

import { Alert, Button, Card, CardContent, CardFooter } from '@ui/components';
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
    <Card variant="stickyFooter" noBorder className="container mx-auto h-full">
      <CardContent className="flex w-full flex-col items-center">
        <div className="relative h-80 w-80 grow">
          <Image fill src="/error.svg" alt={t('error-message')} />
        </div>
        <Alert variant="destructive" className="w-fit">
          {t('error-message')}
          {customMessage && <p>{customMessage}</p>}
        </Alert>
      </CardContent>
      <CardFooter className="flex flex-col items-center" variant="sticky">
        <Button
          variant="secondary"
          className={`w-full md:w-1/3`}
          block
          onClick={() => reset()}
        >
          {t('retry')}
        </Button>
      </CardFooter>
    </Card>
  );
}
