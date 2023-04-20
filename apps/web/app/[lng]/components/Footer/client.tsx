'use client';

import Link from 'next/link';
import { Trans } from 'react-i18next/TransWithoutContext';
import { languages } from '../../../i18n/settings';
import { useTranslation } from '../../../i18n/client';
import { Button } from '@ui/components';

type Props = {
  lng: I18nLanguage;
};

export const Footer = ({ lng }: Props) => {
  const { t } = useTranslation(lng, 'footer');
  return (
    <footer style={{ marginTop: 50 }}>
      <Button>Client Button</Button>
      <Trans i18nKey="languageSwitcher" t={t}>
        Switch from <strong>{{ lng } as TI}</strong> to:{' '}
      </Trans>
      {languages
        .filter((l) => lng !== l)
        .map((l, index) => {
          return (
            <span key={l}>
              {index > 0 && ' or '}
              <Link href={`/${l}`}>{l}</Link>
            </span>
          );
        })}
    </footer>
  );
};
