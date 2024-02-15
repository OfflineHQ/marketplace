import { renderHook } from '@testing-library/react';
import { useStorageWallet } from './useStorageWallet';
// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    },
  };
})();

describe('useStorageWallet', () => {
  // Setup mock localStorage before each test
  beforeEach(() => {
    global.localStorage = mockLocalStorage;
  });

  it('should return null if no wallet address is stored', () => {
    const { result } = renderHook(() => useStorageWallet());
    expect(result.current.comethWalletAddressInStorage).toBeNull();
  });

  it('should return the wallet address if stored in localStorage', () => {
    const testAddress = '0x123';
    localStorage.setItem(`cometh-connect-${testAddress}`, testAddress); // Adjust the key based on your actual key format
    const { result } = renderHook(() => useStorageWallet());
    expect(result.current.comethWalletAddressInStorage).toBe(testAddress);
  });
});
