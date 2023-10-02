import { type AppNavLayoutProps } from '@features/appNav/ui';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { ReactQueryProviders } from '@next/react-query';
import { UploaderProvider } from '@next/uploader-provider';
import { Toaster } from '@ui/components';
import { cn } from '@ui/shared';
import { ThemeProvider } from '@ui/theme';
import { Analytics } from '@web/components/Analytics';
import '@web/styles/globals.css';
import { useLocale, useTranslations } from 'next-intl';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { ProfileNavClient } from '../../components/ProfileNavClient/ProfileNavClient';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

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

export default function RootLayout({
  params,
  children,
  ...appNavLayout
}: RootLayoutProps) {
  const locale = useLocale();
  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== locale) {
    notFound();
  }
  const t = useTranslations('Auth');
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
                  title: t('user-closed-popup.title'),
                  description: t('user-closed-popup.description'),
                },
                siweStatement: t('siwe-statement'),
                errorSigningInWithSiwe: {
                  title: t('error-signing-in-with-siwe.title'),
                  description: t('error-signing-in-with-siwe.description'),
                  tryAgainButton: t(
                    'error-signing-in-with-siwe.try-again-button'
                  ),
                },
                siweDeclined: {
                  title: t('siwe-declined.title'),
                  description: t('siwe-declined.description'),
                  tryAgainButton: t('siwe-declined.try-again-button'),
                },
              }}
            >
              <UploaderProvider>
                <ReactQueryProviders>
                  <ProfileNavClient />
                  {children}
                  <Toaster />
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
