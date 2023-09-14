export type ErrorWithMessageAndCode = {
  message: string;
  code?: number | number;
};

function isErrorWithMessageAndCode(
  error: unknown
): error is ErrorWithMessageAndCode {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string' &&
    'code' in error &&
    (typeof (error as Record<string, unknown>).code === 'string' ||
      typeof (error as Record<string, unknown>).code === 'number')
  );
}

function toErrorWithMessageAndCode(
  maybeError: unknown
): ErrorWithMessageAndCode {
  if (isErrorWithMessageAndCode(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessageAndCode(error).message;
}

export function getErrorCode(error: unknown): number | undefined {
  const errorCode = toErrorWithMessageAndCode(error).code;
  return errorCode !== undefined ? parseInt(String(errorCode)) : undefined;
}
