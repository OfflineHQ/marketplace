'use client';

import { AppContainer } from '@features/unlock/app-nav';
import dynamic from 'next/dynamic';
const Auth = dynamic(
  () => import('@features/unlock/app-nav').then((mod) => mod.Auth),
  { ssr: false },
);

export default function Home() {
  return (
    <AppContainer>
      <Auth />
    </AppContainer>
  );
}
