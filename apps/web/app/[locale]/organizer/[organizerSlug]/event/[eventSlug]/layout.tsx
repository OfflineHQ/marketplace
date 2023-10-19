import { Sheet } from '@ui/components';

export interface EventLayoutProps {
  children: React.ReactNode;
}

export default function EventLayout({ children }: EventLayoutProps) {
  return <Sheet open={true}>{children}</Sheet>;
}
