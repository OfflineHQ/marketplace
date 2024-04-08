import { OffKeyHeader } from '@features/unlock/shopify';

interface HeaderProps {
  params: {
    locale: Locale;
    gateId: string;
  };
}

export default function Header({ params }: HeaderProps) {
  return <OffKeyHeader title="title" />;
}
