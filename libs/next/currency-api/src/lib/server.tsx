'use server';

import { getNextAppURL } from '@shared/server';

export async function getRates() {
  const response = await fetch(`${getNextAppURL()}/api/currency/rates`, {
    next: { tags: ['currency-rates'] },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
