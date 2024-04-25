import { createMock } from 'storybook-addon-module-mock';
import * as shopifyCustomerApi from '../hooks/useShopifyCustomer';
import { OffKeyHeaderNotConnectedProps } from './OffKeyHeaderNotConnected';

export const offKeyHeaderNotConnectedProps = {
  organizerId: 'organizerId',
  textHeaderNotConnected: {
    customerNotConnected: 'Connect to your account',
    customerConnected: 'Hello {firstName}!',
  },
  locale: 'en',
} satisfies OffKeyHeaderNotConnectedProps;

export function shopifyCustomerMocks(
  props: ReturnType<typeof shopifyCustomerApi.useShopifyCustomer>,
) {
  const useShopifyCustomerMock = createMock(
    shopifyCustomerApi,
    'useShopifyCustomer',
  );
  useShopifyCustomerMock.mockReturnValue(props);
  return useShopifyCustomerMock;
}
