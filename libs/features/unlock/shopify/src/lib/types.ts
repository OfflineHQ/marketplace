export enum OffKeyViewHeaderConnected {
  Default = 'Default',
  HowToGet = 'HowToGet',
}

export enum ShopifyCustomerStatus {
  NotConnected = 'NotConnected', // Means the customer is not connected to the shopify store
  NoRecordedShopifyCustomer = 'NoRecordedShopifyCustomer', // Means the customer has an existing wallet but no recorded shopify customer yet
  NewAccount = 'NewAccount', // Means the customer has no existing wallet at offline and no recorded shopify customer yet (so is probably a new account)
  MatchingWallet = 'MatchingWallet', // Means the customer is connected to the shopify store and has a wallet that matches the shopify customer
  NoMatchingWallet = 'NoMatchingWallet', // Means the customer is connected to the shopify store and has a wallet that does not match the shopify customer
}
