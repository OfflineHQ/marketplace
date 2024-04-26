import { OffKeyLayout } from '@features/unlock/shopify';
import { type Locale } from '@next/i18n';

interface LayoutProps {
  children: React.ReactNode;
  auth: React.ReactNode;
  header: React.ReactNode;
  params: {
    locale: Locale;
    gateId: string;
  };
}

export default function Layout({
  children,
  auth,
  header,
  params: { locale },
}: LayoutProps) {
  return (
    <OffKeyLayout header={header}>
      {children}
      {auth}
    </OffKeyLayout>
  );
}
