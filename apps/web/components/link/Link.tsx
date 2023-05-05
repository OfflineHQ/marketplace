import { useLocale } from 'next-intl';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef } from 'react';
import { UrlObject } from 'url';
import type { Route } from 'next';

// type HrefType = UrlObject | Route;
// type LinkProps = Omit<NextLinkProps<HrefType>, 'href'> & {
//   href: HrefType;
// };

export type LinkProps = NextLinkProps<string | UrlObject>;

const Link = forwardRef<HTMLElement, LinkProps>(({ href, ...rest }, ref) => {
  const locale = useLocale();

  // Turn this off, to avoid updating the locale cookie for prefetch requests
  const prefetch = false;

  function getLocalizedHref(originalHref: string) {
    return originalHref.replace(/^\//, '/' + locale + '/');
  }

  const localizedHref =
    typeof href === 'string'
      ? getLocalizedHref(href)
      : 'pathname' in href && href.pathname != null
      ? { ...href, pathname: getLocalizedHref(href.pathname) }
      : href;

  return (
    <NextLink href={localizedHref as Route} prefetch={prefetch} {...rest} />
  );
});

Link.displayName = 'Link';
export default Link;
