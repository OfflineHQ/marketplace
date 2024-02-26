'use client';

import { AppContainer } from '@features/unlock/app-nav';
import dynamic from 'next/dynamic';
const Auth = dynamic(
  async () => (await import('@features/unlock/app-nav')).Auth,
  { ssr: false },
);

export default function Home() {
  return (
    <AppContainer>
      <Auth />
    </AppContainer>
  );
}
