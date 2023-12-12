'use client';

import env from '@env/client';
import { getNextAppURL } from '@shared/client';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { isPosthogActivated } from './isPosthogActivated';
export { Analytics as VercelAnalytics } from '@vercel/analytics/react';

if (typeof window !== 'undefined' && isPosthogActivated()) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_VERCEL_ENV
      ? `${getNextAppURL()}/ingest`
      : 'https://eu.posthog.com',
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    advanced_disable_feature_flags_on_first_load: true,
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

export function PostHogPageview(): JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      if (isPosthogActivated())
        posthog.capture('$pageview', {
          $current_url: url,
        });
    }
  }, [pathname, searchParams]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return isPosthogActivated() ? (
    <PostHogProvider client={posthog}>{children}</PostHogProvider>
  ) : (
    children
  );
}
