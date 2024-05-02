import { act, render } from '@testing-library/react';
import { WalletContext, WalletProvider } from './context';

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

jest.mock('next/navigation', () => ({
  useSearchParams: () => {
    return new URLSearchParams('wcUri=mockUri&address=mockAddress');
  },
  useRouter: () => ({
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/mock-path',
}));

describe('WalletProvider', () => {
  // Setup mock localStorage before each test
  beforeEach(() => {
    jest.useFakeTimers();
    global.localStorage = mockLocalStorage as any;
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should initialize walletInStorage as null if no wallet is stored', () => {
    const { getByText } = render(
      <WalletProvider>
        <WalletContext.Consumer>
          {({ walletInStorage }) => (
            <span>
              Wallet in Storage: {walletInStorage ? 'Present' : 'Null'}
            </span>
          )}
        </WalletContext.Consumer>
      </WalletProvider>,
    );

    expect(getByText('Wallet in Storage: Null')).toBeTruthy();
  });

  it('should set walletInStorage with the correct values if a wallet is stored in localStorage', () => {
    const testAddress = '0x123';
    const testName = 'Test Wallet';
    localStorage.setItem(
      `cometh-connect-${testAddress}`,
      JSON.stringify({ name: testName }),
    );

    const { getByText } = render(
      <WalletProvider>
        <WalletContext.Consumer>
          {({ walletInStorage }) => (
            <span>
              Wallet Name: {walletInStorage ? walletInStorage[0].name : 'Null'}
            </span>
          )}
        </WalletContext.Consumer>
      </WalletProvider>,
    );

    // Since useEffect is asynchronous, we need to wait for the next tick
    act(() => {
      jest.runAllTimers();
    });

    expect(getByText(`Wallet Name: ${testName}`)).toBeTruthy();
  });
});
