import { AuthProvider, NextAuthProvider } from '@next/auth';
import { defaultLocale, getMessages, locales } from '@next/i18n';
import { ReactQueryProviders } from '@next/react-query';
import { Toaster } from '@ui/components';
import { cn } from '@ui/shared';
import { ThemeProvider } from '@ui/theme';
import { Analytics } from '@web/components/Analytics';
import { siteConfig } from '@web/config/site';
import '@web/styles/globals.css';
import { Metadata } from 'next';
import { createTranslator } from 'next-intl';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';

import { AppNavLayout, type AppNavLayoutProps } from '@features/appNav/ui';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Server Components',
    'Radix UI',
  ],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@offline',
  },
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
  params,
  children,
  ...appNavLayout
}: RootLayoutProps) {
  if (!params) return null;
  const locale = params?.locale || defaultLocale;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  const messages = await getMessages(locale);
  const t = createTranslator({ locale, messages });
  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextAuthProvider>
            <AuthProvider
              messages={{
                userClosedPopup: {
                  title: t('Auth.user-closed-popup.title'),
                  description: t('Auth.user-closed-popup.description'),
                },
                siweStatement: t('Auth.siwe-statement'),
                errorSigningInWithSiwe: {
                  title: t('Auth.error-signing-in-with-siwe.title'),
                  description: t('Auth.error-signing-in-with-siwe.description'),
                  tryAgainButton: t(
                    'Auth.error-signing-in-with-siwe.try-again-button'
                  ),
                },
                siweDeclined: {
                  title: t('Auth.siwe-declined.title'),
                  description: t('Auth.siwe-declined.description'),
                  tryAgainButton: t('Auth.siwe-declined.try-again-button'),
                },
              }}
            >
              <ReactQueryProviders>
                <AppNavLayout {...appNavLayout}>{children}</AppNavLayout>
                <Toaster />
              </ReactQueryProviders>
            </AuthProvider>
          </NextAuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
