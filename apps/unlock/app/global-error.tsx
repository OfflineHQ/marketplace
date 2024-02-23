'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    // TODO add toast notification for error
  }, [error]);

  return (
    <html lang="en">
      <body>{/* <UIError error={error} reset={reset} /> */}</body>
    </html>
  );
}
