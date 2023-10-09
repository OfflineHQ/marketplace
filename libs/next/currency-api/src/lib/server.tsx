'use server';

import { cache } from 'react';

async function getLastRates() {
  const response = await fetch('/api/currency/rates', {
    next: { tags: ['currency-rates'] },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export const getRates = cache(getLastRates);
