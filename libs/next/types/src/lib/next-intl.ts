import type { Messages } from '@next/i18n';
declare global {
  // Use type safe message keys with `next-intl`
  type IntlMessages = Messages;
}
