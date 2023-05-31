import '@web/styles/globals.css';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';
import { useLocale } from 'next-intl';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@web/config/site';
import { Analytics } from '@web/components/Analytics';
import { ThemeProvider } from '@ui/theme';
import { cn } from '@ui/shared';
import { locales } from '@client/i18n';
import App from './app';

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

// Support for static rendering is under consideration, please refer to the roadmap: https://next-intl-docs.vercel.app/docs/next-13/server-components#roadmap
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
          <AppNavLayout {...appNavLayout}>
            {children}
            {/* <App>{children}</App> */}
          </AppNavLayout>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
