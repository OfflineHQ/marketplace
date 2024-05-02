export class ComethWallet {
  constructor() {}
  async getAddress() {}
  async connect() {}
  async logout() {}
  async signMessage() {}
}

export class ComethProvider {
  constructor(wallet) {
    this.wallet = wallet;
  }
  getSigner() {
    return this.wallet;
  }
}

export class ConnectAdaptor {
  constructor(provider) {
    this.provider = provider;
  }
  retrieveWalletAddressFromSigner(signer) {
    return signer.getAddress();
  }
}

export const SupportedNetworks = {
  POLYGON: '0x89',
  MUMBAI: '0x13881',
};
