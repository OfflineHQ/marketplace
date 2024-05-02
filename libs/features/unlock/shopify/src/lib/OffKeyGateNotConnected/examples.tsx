import { ShopifyCustomerStatus } from '../types';
import { OffKeyGateNotConnectedProps } from './OffKeyGateNotConnected';

export const offKeyGateNotConnectedProps: OffKeyGateNotConnectedProps = {
  locale: 'en',
  organizerId: 'organizerId',
  textGateNotConnected: {
    subtitle: {
      [ShopifyCustomerStatus.NotConnected]: 'Not connected',
      [ShopifyCustomerStatus.ExistingAccountNewCustomer]:
        'Existing account, new customer',
      [ShopifyCustomerStatus.NewAccount]: 'New account',
      [ShopifyCustomerStatus.MatchingAccount]: 'Matching account',
      [ShopifyCustomerStatus.NoMatchingAccount]: 'No matching account',
    },
    mainText: {
      [ShopifyCustomerStatus.NotConnected]: 'Please connect your account.',
      [ShopifyCustomerStatus.ExistingAccountNewCustomer]:
        'Welcome back, please link your new customer account.',
      [ShopifyCustomerStatus.NewAccount]:
        'Welcome! Please create a new account.',
      [ShopifyCustomerStatus.MatchingAccount]:
        'Your account is successfully linked.',
      [ShopifyCustomerStatus.NoMatchingAccount]:
        'No account where found for "{customerEmail}".\n\nPlease try to connect to an existing one or proceed with the recovery process.',
    },
  },
} satisfies OffKeyGateNotConnectedProps;
