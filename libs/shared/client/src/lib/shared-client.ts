import env from '@env/client';

export function isDev() {
  return process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';
}

export function isPreviewOrProduction() {
  const env = ['preview', 'production'];
  return env.includes(process.env.NEXT_PUBLIC_VERCEL_ENV as string);
}

export function isProd() {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
}

export function getNextAppURL(): string {
  if (isPreviewOrProduction()) {
    return process.env.NEXT_PUBLIC_SITE_URL as string;
  } else {
    let vercelURL = '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL)
      vercelURL = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return vercelURL || window.location.origin;
  }
}

export function isPreviewDeployment(): boolean {
  return !!process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
}

export function isPreviewOrPRDeployment(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    !!process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF?.startsWith('pull/')
  );
}

export function isBackOffice(): boolean {
  return env.NEXT_PUBLIC_APP === 'BACKOFFICE';
}

export function getHasuraEndpoint(): string {
  return env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT;
}
