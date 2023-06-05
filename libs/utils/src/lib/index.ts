import { stringToPath } from 'remeda';
import type { NestedValueOf, NestedKeyOf } from '../types';

export function deepMerge(obj1: any, obj2: any): any {
  const output = Object.assign({}, obj1);
  if (isObject(obj1) && isObject(obj2)) {
    Object.keys(obj2).forEach((key) => {
      if (isObject(obj2[key])) {
        if (!(key in obj1)) Object.assign(output, { [key]: obj2[key] });
        else output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        Object.assign(output, { [key]: obj2[key] });
      }
    });
  }
  return output;
}

export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function deepPick<T, P extends NestedKeyOf<T>>(
  obj: T,
  paths: P[]
): NestedValueOf<T, P> {
  function pickHelper(item: any, path: string[]): any {
    if (path.length === 0 || item === undefined) {
      return undefined;
    }
    const [head, ...tail] = path;
    if (tail.length === 0) {
      return { [head]: item[head] };
    }
    return { [head]: pickHelper(item[head], tail) };
  }

  return paths
    .map(stringToPath as any)
    .map((path) => pickHelper(obj, path as string[]))
    .reduce((acc, val) => deepMerge(acc, val), {});
}

export interface MyRequestInit extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

export async function fetchJSON(
  url: RequestInfo | URL,
  options: MyRequestInit | undefined = {}
) {
  const { headers } = options;
  const defaultHeaders: HeadersInit = {
    ...headers,
    'Content-Type': headers?.['Content-Type'] || 'application/json',
  };
  Object.assign(options, { headers: defaultHeaders, credentials: 'include' });
  return fetch(url, options).then(async (res) => {
    if (!res.ok) {
      throw await res.json();
    }
    return res.json();
  });
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function toPascalCase(s: string): string {
  return (s.match(/[a-zA-Z0-9]+/g) || [])
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join('');
}

export function convertArrayOfObjtoObjWithKeys(arr: any[], key: string): any {
  return arr.reduce((obj, item) => ((obj[item?.[key]] = item), obj), {});
}

export function isServerSide(): boolean {
  return typeof window === 'undefined';
}

export function isJestRunning() {
  return process.env.JEST_WORKER_ID !== undefined;
}

export function isCypressRunning() {
  return window && (window as any).Cypress !== undefined;
}

export function isDev() {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
  );
}

export function isProd() {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
  );
}

export function isPreviewDeployment(): boolean {
  return (
    !!process.env.VERCEL_GIT_COMMIT_SHA ||
    !!process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
  );
}

export function isPreviewOrPRDeployment(): boolean {
  return (
    !!process.env.VERCEL_GIT_COMMIT_SHA ||
    !!process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    !!process.env.VERCEL_GIT_COMMIT_REF?.startsWith('pull/') ||
    !!process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF?.startsWith('pull/')
  );
}

export function truncateString(str: string, maxChars: number): string {
  if (maxChars < 5) {
    throw new Error(
      'maxChars must be at least 5 to allow proper truncation with three asterisks (***)'
    );
  }

  if (str.length <= maxChars) {
    return str;
  }

  const charsToShow = maxChars - 3;
  const frontChars = Math.floor(charsToShow / 2);
  const backChars = Math.ceil(charsToShow / 2);

  return str.slice(0, frontChars) + '***' + str.slice(-backChars);
}

export function truncateEmailString(str: string, maxChars: number): string {
  const emailParts = str.split('@');
  if (emailParts.length !== 2) {
    throw new Error('Invalid email format');
  }
  const localPart = emailParts[0];
  const domainPart = emailParts[1];
  return `${truncateString(localPart, maxChars)}@${domainPart}`;
}

export function checkCookie(name: string) {
  // Split cookie string and get all individual name=value pairs in an array
  const cookieArr = document.cookie.split(';');

  // Loop through the array elements
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');

    /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
    if (name == cookiePair[0].trim()) {
      // Return true if the cookie with the requested name exists
      return true;
    }
  }

  // Return false if the cookie with the requested name can't be found
  return false;
}
