declare let STORYBOOK_ENV: string;

import { useNow as _useNow } from 'next-intl';
export function useNow(props: Parameters<typeof _useNow>[0] = undefined) {
  if (typeof STORYBOOK_ENV !== 'undefined') {
    // Storybook is running
    return new Date('2023-06-05T00:00:00Z');
  }
  return _useNow(props);
}
