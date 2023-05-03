import '@web/styles/globals.css';
import { Inter as FontSans } from 'next/font/google';
import localFont from 'next/font/local';

import { Metadata } from 'next';
import { siteConfig } from '@web/config/site';
import { Analytics } from '@web/components/Analytics';
import { ThemeProvider } from '@ui/theme';
import { cn } from '@ui/shared';
import { Toaster } from '@ui/components';
import { WagmiProvider, AuthProvider } from '@web/lib/providers';

import Header from '@web/components/header/Header';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

interface RootLayoutProps {
  children: React.ReactNode;
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
  // manifest: `${siteConfig.url}/site.webmanifest`, // set back when we have a manifest published
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WagmiProvider>
            <AuthProvider>
              {/* <SSXProvider> */}
              <div className="relative flex min-h-screen flex-col">
                {/* <Header /> */}
                {/* <SiteHeader /> */}
                <div className="flex-1">{children}</div>
                {/* <SiteFooter /> */}
              </div>
              {/* <TailwindIndicator /> */}
              {/* </SSXProvider> */}
            </AuthProvider>
          </WagmiProvider>
        </ThemeProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
