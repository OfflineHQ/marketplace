import { AppContainer } from '@features/app-nav';

export default function PurchaseTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppContainer>{children}</AppContainer>;
}
