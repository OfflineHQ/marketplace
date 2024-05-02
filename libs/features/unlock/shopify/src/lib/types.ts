export enum OffKeyViewHeaderConnected {
  Default = 'Default',
  HowToGet = 'HowToGet',
}

export enum ShopifyCustomerStatus {
  NotConnected = 'NotConnected', // Means the customer is not connected to the shopify store
  ExistingAccountNewCustomer = 'ExistingAccountNewCustomer', // Means the customer has an existing account but no recorded shopify customer yet
  NewAccount = 'NewAccount', // Means the customer has no existing account at offline and no recorded shopify customer yet (so is probably a new account)
  MatchingAccount = 'MatchingAccount', // Means the customer is connected to the shopify store and has a account that matches the shopify customer
  NoMatchingAccount = 'NoMatchingAccount', // Means the customer is connected to the shopify store and has a account that does not match the shopify customer
}
