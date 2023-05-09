import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './HeaderClient';
import { NextIntlClientProvider } from 'next-intl';

describe('HeaderClient', () => {
  let mockSetTheme, mockRouterPush, mockLogout, mockLogin;

  beforeEach(() => {
    mockSetTheme = jest.fn();
    mockRouterPush = jest.fn();
    mockLogout = jest.fn();
    mockLogin = jest.fn();

    jest.mock('next-themes', () => ({
      useTheme: () => ({
        setTheme: mockSetTheme,
        theme: 'dark',
      }),
    }));

    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockRouterPush,
      }),
      useSearchParams: () => new URLSearchParams(),
    }));

    jest.mock('next-intl/client', () => ({
      usePathname: () => '/',
    }));

    jest.mock('@client/auth', () => ({
      useAuthContext: () => ({
        safeUser: null,
        login: mockLogin,
        logout: mockLogout,
        safeAuth: true,
        provider: null,
      }),
    }));
  });
  it('renders without crashing', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Header />
      </NextIntlClientProvider>
    );
  });
  it('changes theme on click', () => {
    render(
      <NextIntlClientProvider locale="en">
        <Header />
      </NextIntlClientProvider>
    );
    fireEvent.click(screen.getByText('display-options.light'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
  // Add more tests as needed
});
