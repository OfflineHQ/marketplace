import { Analytics } from '@back-office/components/Analytics';
import { siteConfig } from '@back-office/config/site';
import { Currency_Enum_Not_Const } from '@currency/types';
import {
  AppNavLayout,
  type AppNavLayoutProps,
} from '@features/back-office/app-nav';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { CurrencyCache } from '@next/currency-cache';
import { CurrencyProvider } from '@next/currency-provider';
import { getMessages, locales } from '@next/i18n';
import { getSession, isConnected } from '@next/next-auth/user';
import { ReactQueryProviders } from '@next/react-query';
import { UploaderProvider } from '@next/uploader-provider';
import { isLocal } from '@shared/server';
import { Toaster } from '@ui/components';
import { cn } from '@ui/shared';
import { ThemeProvider } from '@ui/theme';
import { Metadata } from 'next';
import { createTranslator } from 'next-intl';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';

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
};

// Error: Usage of next-intl APIs in Server Components is currently only available for dynamic rendering (i.e. no `generateStaticParams`).
// Support for static rendering is under consideration, please refer to the roadmap: https://next-intl-docs.vercel.app/docs/getting-started/app-router-server-components#roadmap
// export async function generateStaticParams() {
//   return locales.map((locale) => ({ locale }));
// }

interface RootLayoutProps extends AppNavLayoutProps {
  params: {
    locale: string;
  };
}

// export async function generateStaticParams() {
//   return locales.map((locale) => ({ locale }));
// }

export default async function RootLayout({
  params: { locale },
  ...appNavLayout
}: RootLayoutProps) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  const messages = await getMessages(locale);
  const session = await getSession();
  const t = createTranslator({ locale, messages });
  const currencyCache = new CurrencyCache();
  let rates;
  if (isLocal()) {
    const res = await currencyCache.getRate(Currency_Enum_Not_Const.Usd);
    if (!res) {
      await currencyCache.setRates();
    }
    rates = await currencyCache.getRates();
  }
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextAuthProvider session={session}>
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
                    'Auth.error-signing-in-with-siwe.try-again-button',
                  ),
                },
                siweDeclined: {
                  title: t('Auth.siwe-declined.title'),
                  description: t('Auth.siwe-declined.description'),
                  tryAgainButton: t('Auth.siwe-declined.try-again-button'),
                },
              }}
              session={session}
              isConnected={isConnected}
            >
              <UploaderProvider>
                <ReactQueryProviders>
                  <CurrencyProvider rates={rates}>
                    <AppNavLayout {...appNavLayout} />
                    <Toaster />
                  </CurrencyProvider>
                </ReactQueryProviders>
              </UploaderProvider>
            </AuthProvider>
          </NextAuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
