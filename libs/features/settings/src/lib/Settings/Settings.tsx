import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardOverflow,
  CardOverlay,
  CardTitle,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import React from 'react';
import { GlobalSettings } from '../GlobalSettings/GlobalSettings';

export const Settings: React.FC = () => {
  const t = useTranslations('Settings');
  // getLocalCart();
  return (
    <section className="container">
      <Card noBorder>
        <CardOverflow>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <GlobalSettings
              languageText={t('language-text')}
              languageSelectText={{
                en: t('language-select-text.en'),
                fr: t('language-select-text.fr'),
              }}
              displayText={t('display-text')}
              displaySelectText={{
                light: t('display-select-text.light'),
                dark: t('display-select-text.dark'),
                system: t('display-select-text.auto'),
              }}
              currencySelectText={{
                eur: t('eur'),
                usd: t('usd'),
              }}
              currencyText={t('currency-select-text')}
            />
          </CardContent>
        </CardOverflow>
        <CardOverlay />
      </Card>
    </section>
  );
};
