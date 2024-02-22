import { AppNavLayout, type AppNavLayoutProps } from '@features/app-nav';
import { PHProvider, PostHogPageview } from '@insight/client';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { getMessages, locales } from '@next/i18n';
import { getSession, isConnected } from '@next/next-auth/user';
import { ReactQueryProviders } from '@next/react-query';
import { WalletProvider } from '@next/wallet';
import { Toaster } from '@ui/components';
import { cn } from '@ui/shared';
import { ThemeProvider } from '@ui/theme';
import { siteConfig } from '@web/config/site';
import { Metadata, Viewport } from 'next';
import { getTranslations } from 'next-intl/server';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

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

// Error: Usage of next-intl APIs in Server Components is currently only available for dynamic rendering (i.e. no `generateStaticParams`).
// Support for static rendering is under consideration, please refer to the roadmap: https://next-intl-docs.vercel.app/docs/getting-started/app-router-server-components#roadmap
// also get issue with cookies and headers usage (most probably in the hasura fetcher)
// export async function generateStaticParams() {
//   return locales.map((locale) => ({ locale }));
// }

interface RootLayoutProps extends AppNavLayoutProps {
  params: {
    locale: string;
  };
}

export default async function RootLayout({
  params: { locale },
  ...appNavLayout
}: RootLayoutProps) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  const messages = await getMessages(locale);
  const session = await getSession();
  const t = await getTranslations({ locale, namespace: 'Auth' });
  let rates;
  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <PHProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <WalletProvider>
              <NextAuthProvider session={session}>
                <AuthProvider
                  messages={{
                    userClosedPopup: {
                      title: t('user-closed-popup.title'),
                      description: t('user-closed-popup.description'),
                    },
                    siweStatement: t('siwe-statement'),
                    errorSigningInWithSiwe: {
                      title: t('error-signing-in-with-siwe.title'),
                      description: t('error-signing-in-with-siwe.description'),
                      tryAgainButton: t(
                        'error-signing-in-with-siwe.try-again-button',
                      ),
                    },
                    siweDeclined: {
                      title: t('siwe-declined.title'),
                      description: t('siwe-declined.description'),
                      tryAgainButton: t('siwe-declined.try-again-button'),
                    },
                  }}
                  session={session}
                  isConnected={isConnected}
                >
                  <ReactQueryProviders>
                    <AppNavLayout {...appNavLayout} />
                    <Toaster />
                  </ReactQueryProviders>
                </AuthProvider>
              </NextAuthProvider>
            </WalletProvider>
          </ThemeProvider>
        </PHProvider>
        <Suspense>
          <PostHogPageview />
        </Suspense>
      </body>
    </html>
  );
}
