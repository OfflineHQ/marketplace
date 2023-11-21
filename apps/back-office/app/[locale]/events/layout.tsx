'use client';
import { Sheet } from '@ui/components';

export default function Layout({ children, sheet }) {
  return (
    <Sheet open={true}>
      {children}
      {sheet}
    </Sheet>
  );
}
