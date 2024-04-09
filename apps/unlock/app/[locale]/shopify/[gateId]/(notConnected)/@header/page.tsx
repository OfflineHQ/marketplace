import { OffKeyHeader } from '@features/unlock/shopify';
import { type Locale } from '@next/i18n';

interface HeaderProps {
  params: {
    locale: Locale;
    gateId: string;
  };
}

export default function Header({ params }: HeaderProps) {
  return <OffKeyHeader title="title" />;
}
