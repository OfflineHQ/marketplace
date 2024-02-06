export function isDev() {
  return process.env.VERCEL_ENV !== 'production';
}

export function isPreviewOrProduction() {
  const env = ['preview', 'production'];
  return env.includes(process.env.VERCEL_ENV as string);
}

export function isProd() {
  return process.env.VERCEL_ENV === 'production';
}

export function getNextAppURL(): string {
  if (isPreviewOrProduction()) {
    return process.env.NEXTAUTH_URL as string;
  } else {
    let vercelURL = '';
    if (process.env.VERCEL_URL) vercelURL = `https://${process.env.VERCEL_URL}`;
    return vercelURL || (process.env.NEXTAUTH_URL as string);
  }
}

export function isPreviewDeployment(): boolean {
  return !!process.env.VERCEL_GIT_COMMIT_SHA;
}

export function isPreviewOrPRDeployment(): boolean {
  return (
    !!process.env.VERCEL_GIT_COMMIT_SHA ||
    !!process.env.VERCEL_GIT_COMMIT_REF?.startsWith('pull/')
  );
}

export function isBackOffice(): boolean {
  return process.env.APP === 'BACKOFFICE';
}

export function getHasuraEndpoint(): string {
  return process.env.HASURA_PROJECT_ENDPOINT as string;
}

export function isLocal(): boolean {
  return !process.env.VERCEL_ENV;
}
