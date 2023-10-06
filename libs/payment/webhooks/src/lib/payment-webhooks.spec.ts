import { paymentWebhooks } from './payment-webhooks';

describe('paymentWebhooks', () => {
  it('should work', () => {
    expect(paymentWebhooks()).toEqual('payment-webhooks');
  });
});
