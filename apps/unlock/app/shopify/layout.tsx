'use client';

import { IFrameProvider } from '@next/iframe';
import { ReactQueryProviders } from '@next/react-query';
import { WalletProvider } from '@next/wallet';
import { ThemeProvider } from '@ui/theme';
import '@unlock/styles/globals.css';
import { Viewport } from 'next';
import dynamic from 'next/dynamic';

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: 'white' }],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <ReactQueryProviders>
      <IFrameProvider>
        <ThemeProvider forcedTheme="light">
          <WalletProvider>{children}</WalletProvider>
        </ThemeProvider>
      </IFrameProvider>
    </ReactQueryProviders>
  );
}

const DynamicRootLayout = dynamic(() => Promise.resolve(RootLayout), {
  ssr: false,
});

export default function Layout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head />
      <body
        className="h-full"
        style={{
          fontFamily:
            '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        }}
      >
        <DynamicRootLayout>{children}</DynamicRootLayout>
      </body>
    </html>
  );
}
