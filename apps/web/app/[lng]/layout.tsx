import '@web/styles/globals.css';
import { Metadata } from 'next';
import { dir } from 'i18next';
import { languages } from '../i18n/settings';
// import { cn } from '@ui/shared';
import { fontSans } from '@web/lib/fonts';
import { siteConfig } from '@web/config/site';
import { Analytics } from '@web/components/Analytics';
import { ThemeProvider } from '@ui/theme';
import { Toaster } from '@ui/components';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'Server Components', 'Radix UI'],
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
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({ children, params: { lng } }) {
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <head />
      <body className={fontSans.variable}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            {/* <SiteHeader /> */}
            <div className="flex-1">{children}</div>
            {/* <SiteFooter /> */}
          </div>
          {/* <TailwindIndicator /> */}
        </ThemeProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
