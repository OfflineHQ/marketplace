import { featuresUserApi } from './handleUserCreate';

describe('featuresUserApi', () => {
  it('should work', () => {
    expect(featuresUserApi()).toEqual('features-user-api');
  });
});
