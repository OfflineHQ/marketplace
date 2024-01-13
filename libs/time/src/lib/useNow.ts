import { useNow as _useNow } from 'next-intl';
export function useNow(props: Parameters<typeof _useNow>[0] = undefined) {
  if (window?.STORYBOOK_ENV) {
    return new Date('2023-06-05T00:00:00Z');
  }
  return _useNow(props);
}
