import { PHProvider, PostHogPageview } from '@insight/client';
import { getMessages, locales } from '@next/i18n';
import { IFrameProvider } from '@next/iframe';
// import { IFrameResizer } from '@next/iframe';
import { getSession } from '@next/next-auth/user';
import { ReactQueryProviders } from '@next/react-query';
import { WalletProvider } from '@next/wallet';
import { Toaster } from '@ui/components';
import { ThemeProvider } from '@ui/theme';
import { siteConfig } from '@web/config/site';
import { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  // description: siteConfig.description,
  keywords: ['Event Pass', 'Exclusive Events', 'NFT', 'Web 3'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    // description: siteConfig.description,
    siteName: siteConfig.name,
    // images: [
    //   {
    //     url: siteConfig.ogImage,
    //     width: 1200,
    //     height: 630,
    //     alt: siteConfig.name,
    //   },
    // ],
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   images: [siteConfig.ogImage],
  //   creator: '@offline',
  // },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  // manifest: `${siteConfig.url}/site.webmanifest`, // set back when we have a manifest published
};

interface RootLayoutProps {
  params: {
    locale: string;
  };
  children: React.ReactNode;
}

export default async function RootLayout({
  params: { locale },
  children,
}: RootLayoutProps) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  const messages = await getMessages(locale);
  const session = await getSession();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body className="h-full">
        <ReactQueryProviders>
          <IFrameProvider>
            <PHProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <WalletProvider>
                  {children}
                  <Toaster />
                </WalletProvider>
              </ThemeProvider>
            </PHProvider>
          </IFrameProvider>
        </ReactQueryProviders>
        <Suspense>
          <PostHogPageview />
        </Suspense>
      </body>
    </html>
  );
}
