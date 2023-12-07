import { IAdapter, UserInfo } from '@web3auth/base';
import { ModalConfig, Web3Auth, Web3AuthOptions } from '@web3auth/modal';

import { AuthKitBasePack } from '../../AuthKitBasePack';
import { getErrorMessage } from '../../lib/errors';
import type { AuthKitSignInData } from '../../types';
import { Web3AuthConfig, Web3AuthEvent, Web3AuthEventListener } from './types';
// eslint-disable-next-line import/no-unresolved
import '@next/types';
import { isDev } from '@shared/client';
import { Eip1193Provider } from 'ethers6';

/**
 * Web3AuthModalPack implements the SafeAuthClient interface for adapting the Web3Auth service provider
 * @class
 */
export class Web3AuthModalPack extends AuthKitBasePack {
  #provider: Eip1193Provider | null;
  #config: Web3AuthConfig;
  web3Auth?: Web3Auth;

  /**
   * Instantiate the Web3AuthModalPack
   * @param config Web3Auth specific config
   */
  constructor(config: Web3AuthConfig) {
    super();
    this.#config = config;
    this.#provider = null;
  }

  /**
   * Initialize the Web3Auth service provider
   * @param options Web3Auth options {@link https://web3auth.io/docs/sdk/web/modal/initialize#arguments}
   * @param adapters Web3Auth adapters {@link https://web3auth.io/docs/sdk/web/modal/initialize#configuring-adapters}
   * @param modalConfig The modal configuration {@link https://web3auth.io/docs/sdk/web/modal/whitelabel#whitelabeling-while-modal-initialization}
   * @throws Error if there was an error initializing Web3Auth
   */
  async init({
    options,
    adapters,
    modalConfig,
  }: {
    options: Web3AuthOptions;
    adapters?: IAdapter<unknown>[];
    modalConfig?: Record<string, ModalConfig>;
  }) {
    try {
      this.web3Auth = new Web3Auth(options);

      adapters?.forEach((adapter) => this.web3Auth?.configureAdapter(adapter));

      await this.web3Auth.initModal({ modalConfig: modalConfig });
      // here we set ethereum provider from ethereum in case this is running on playwright, used for testing, otherwise set the provider from web3auth
      this.#provider =
        window?.ethereumProviderMock && process.env.NEXT_PUBLIC_E2E_TEST
          ? (window.ethereumProviderMock as Eip1193Provider)
          : this.web3Auth.provider;
      console.log(
        'this.#provider',
        this.#provider,
        'window.ethereumProviderMock',
        window.ethereumProviderMock,
      );
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  }

  /**
   * Connect to the Web3Auth service provider
   * @returns The sign in data from the provider
   */
  async signIn(): Promise<AuthKitSignInData> {
    if (!this.web3Auth) {
      throw new Error('Web3AuthModalPack is not initialized');
    }

    this.#provider = await this.web3Auth.connect();

    const eoa = await this.getAddress();
    // TODO: when docker image for safe transaction service is ready, use it instead of txServiceUrl
    const safes = await this.getSafes(
      !isDev() ? this.#config?.txServiceUrl || '' : '',
    );
    return {
      eoa,
      safes,
    };
  }

  getProvider(): Eip1193Provider | null {
    return this.#provider as Eip1193Provider;
  }

  /**
   * Disconnect from the Web3Auth service provider
   */
  async signOut() {
    if (!this.web3Auth) {
      throw new Error('Web3AuthModalPack is not initialized');
    }
    await this.web3Auth.logout();
  }

  /**
   * Get authenticated user information
   * @returns The user info
   */
  async getUserInfo(): Promise<Partial<UserInfo>> {
    if (!this.web3Auth) {
      throw new Error('Web3AuthModalPack is not initialized');
    }

    return await this.web3Auth.getUserInfo();
  }

  /**
   * Allow to subscribe to the Web3Auth events
   * @param event The event you want to subscribe to (https://web3auth.io/docs/sdk/web/modal/initialize#subscribing-the-lifecycle-events)
   * @param handler The event handler
   */
  subscribe(event: Web3AuthEvent, handler: Web3AuthEventListener): void {
    this.web3Auth?.on(event, handler);
  }

  /**
   * Allow to unsubscribe to the Web3Auth events
   * @param event The event you want to unsubscribe to (https://web3auth.io/docs/sdk/web/modal/initialize#subscribing-the-lifecycle-events)
   * @param handler The event handler
   */
  unsubscribe(event: Web3AuthEvent, handler: Web3AuthEventListener): void {
    this.web3Auth?.off(event, handler);
  }

  get isAuthenticated() {
    return !!this.web3Auth?.connected;
  }
}
