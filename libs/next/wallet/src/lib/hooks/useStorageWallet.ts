'use client';
import { useEffect, useState } from 'react';

export function useStorageWallet() {
  const [comethWalletAddressInStorage, setComethWalletAddressInStorage] =
    useState<string | null>(null);

  useEffect(() => {
    const keysInStorage = Object.keys(localStorage);
    for (const key of keysInStorage) {
      if (key.startsWith('cometh-connect')) {
        const keyParts = key.split('-');
        const address = keyParts[keyParts.length - 1];
        setComethWalletAddressInStorage(address);
        break;
      }
    }
  }, []);

  return {
    comethWalletAddressInStorage,
  };
}
