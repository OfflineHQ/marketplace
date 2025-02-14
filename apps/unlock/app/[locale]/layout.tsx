import { locales } from '@next/i18n';
import { IFrameProvider } from '@next/iframe';
import '@unlock/styles/globals.css';
// import { IFrameResizer } from '@next/iframe';
import { ReactQueryProviders } from '@next/react-query';
import { WalletProvider } from '@next/wallet';
import { Toaster } from '@ui/components';
import { ThemeProvider } from '@ui/theme';
import { siteConfig } from '@web/config/site';
import { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

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
  const headersList = headers();
  const url = headersList.get('x-url');
  const { searchParams } = new URL(url ?? 'https://n');
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  return (
    <html lang={locale} suppressHydrationWarning className={`h-full`}>
      <head />
      {/* here take the default font-family from system and add it to the body https://github.com/necolas/normalize.css/issues/665 */}
      <body
        className={`h-full`}
        style={{
          fontFamily:
            '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        }}
      >
        <ReactQueryProviders>
          <IFrameProvider>
            {/* TODO: Handle dark and light mode from parent iframe if available, for now use light theme */}
            <ThemeProvider forcedTheme="light">
              <WalletProvider>
                {children}
                <Toaster />
              </WalletProvider>
            </ThemeProvider>
          </IFrameProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
