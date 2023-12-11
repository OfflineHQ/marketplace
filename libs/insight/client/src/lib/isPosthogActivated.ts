import { isPreviewOrProduction } from '@shared/client';

export function isPosthogActivated() {
  if (typeof window === 'undefined') {
    return false;
  }
  // in case e2e playwright running or in local de-activate
  if (process.env.NEXT_PUBLIC_E2E_TEST) return false;
  // activate only in production or preview
  return isPreviewOrProduction();
}
