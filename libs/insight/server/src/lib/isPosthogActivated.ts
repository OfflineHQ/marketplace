import { isPreviewOrProduction } from '@shared/server';

export function isPosthogActivated() {
  // in case e2e playwright running or in local de-activate
  if (process.env.E2E_TEST) return false;
  // activate only in production or preview
  return isPreviewOrProduction();
}
