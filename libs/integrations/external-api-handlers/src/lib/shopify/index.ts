import env from '@env/server';
import { handleAccount } from '@features/account/api';
import { adminSdk } from '@gql/admin/api';
import { GetShopifyCustomerQueryVariables } from '@gql/admin/types';
import handleApiRequest, {
  ApiHandlerOptions,
  BadRequestError,
  CustomError,
  InternalServerError,
  NotAuthorizedError,
} from '@next/api-handler';
import { getCurrentChain } from '@next/chains';
import { LoyaltyCardNftWrapper } from '@nft/loyalty-card';
import { getErrorMessage } from '@utils';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BaseWebhookAndApiHandler } from '../baseWebhookAndApiHandler';
import {
  HasLoyaltyCardParams,
  MintLoyaltyCardWithCustomerIdParams,
  MintLoyaltyCardWithPasswordParams,
} from './validators';

export enum RequestType {
  MintLoyaltyCardWithPassword = 'MintLoyaltyCardWithPassword',
  MintLoyaltyCardWithCustomerId = 'MintLoyaltyCardWithCustomerId',
  HasLoyaltyCard = 'HasLoyaltyCard',
}

const requestTypeValidators = {
  [RequestType.MintLoyaltyCardWithPassword]: MintLoyaltyCardWithPasswordParams,
  [RequestType.MintLoyaltyCardWithCustomerId]:
    MintLoyaltyCardWithCustomerIdParams,
  [RequestType.HasLoyaltyCard]: HasLoyaltyCardParams,
};

type RequestTypeToValidator = {
  [RequestType.MintLoyaltyCardWithPassword]: z.infer<
    typeof MintLoyaltyCardWithPasswordParams
  >;
  [RequestType.MintLoyaltyCardWithCustomerId]: z.infer<
    typeof MintLoyaltyCardWithCustomerIdParams
  >;
  [RequestType.HasLoyaltyCard]: z.infer<typeof HasLoyaltyCardParams>;
};

export interface MintLoyaltyCardOptions extends ApiHandlerOptions {
  contractAddress: string;
  loyaltyCardSdk?: LoyaltyCardNftWrapper;
}
export type HasLoyaltyCardOptions = MintLoyaltyCardOptions;

export class ShopifyWebhookAndApiHandler extends BaseWebhookAndApiHandler {
  constructor() {
    super();
  }

  async serializeAndValidateParams<T extends RequestType>(
    requestType: T,
    params: { [key: string]: string | string[] },
  ): Promise<RequestTypeToValidator[T]> {
    const deserializedParams = this.deserializeParams(params);
    const validator = requestTypeValidators[requestType];

    if (!validator) {
      throw new Error(`Validator for request type ${requestType} not found.`);
    }
    // Since the function is async, it automatically returns a Promise.
    // No need to wrap the return value in Promise.resolve().
    return validator.parse(deserializedParams) as RequestTypeToValidator[T];
  }

  async extractAndVerifyShopifyRequest(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    // // TODO: shopify doesn't have that but `x-shop-domain`, so must check that it's an authorized shop (and use it for the allowlist check + pricing logic)
    // const apiKey = headers().get('x-shopify-client-id') as string;
    // if (!apiKey) {
    //   throw new Error('Missing API key');
    // }
    // const secretApiKey = await this.getValidatedSecretApiKey(apiKey);

    const shop = this.getRequiredParam(searchParams, 'shop');
    const timestamp = this.getRequiredParam(searchParams, 'timestamp');

    this.guardRequestTimestamp(timestamp, 300); // 5 minutes in seconds as the allowed time difference
    // if (secretApiKey.allowlist)
    //   this.guardAllowListOrigin(secretApiKey.allowlist, `https://${shop}`);

    const queryHash = this.populateQueryHash(searchParams);
    const resultParams = this.populateResultParams(searchParams);
    const signature = searchParams.get('signature');
    if (!signature || !this.verifyRequestSignature(queryHash, signature))
      throw new Error('Invalid signature');
    const res = await adminSdk.GetShopifyDomain({
      domain: shop,
    });
    if (!res?.shopifyDomain_by_pk) {
      throw new Error(`Shopify domain ${shop} not found`);
    }
    return {
      resultParams,
      organizerId: res.shopifyDomain_by_pk.organizerId,
    };
  }

  private async extractAndValidateShopifyParams<T extends RequestType>(
    req: NextRequest,
    requestType: T,
  ): Promise<RequestTypeToValidator[T] & { organizerId: string }> {
    const { resultParams, organizerId } =
      await this.extractAndVerifyShopifyRequest(req).catch((error) => {
        throw new NotAuthorizedError(
          'Not Authorized: ' + getErrorMessage(error),
        );
      });
    const validatedParams = await this.serializeAndValidateParams(
      requestType,
      resultParams,
    ).catch((error: Error) => {
      throw new BadRequestError(
        'Invalid query parameters: ' + getErrorMessage(error),
      );
    });
    return {
      ...validatedParams,
      organizerId,
    };
  }

  private populateQueryHash(searchParams: URLSearchParams): string {
    // Create a new instance of URLSearchParams to ensure we're not modifying the original
    const filteredParams = new URLSearchParams(searchParams);

    // Remove the 'signature' parameter
    filteredParams.delete('signature');

    // Convert the filtered URLSearchParams to a string
    return filteredParams.toString();
  }

  private populateResultParams(searchParams: URLSearchParams): {
    [key: string]: string | string[];
  } {
    const resultParams: { [key: string]: string | string[] } = {};
    searchParams.forEach((value, key) => {
      if (!['signature', 'timestamp', 'shop'].includes(key)) {
        resultParams[key] = resultParams[key]
          ? [...(resultParams[key] as string[]), value]
          : value;
      }
    });
    return resultParams;
  }

  private verifyRequestSignature(
    queryParams: string,
    signature: string | null,
  ) {
    if (!signature) {
      throw new Error('Invalid signature');
    }
    return this.verifySignature({
      body: queryParams,
      integritySecret: env.SHOPIFY_SHARED_SECRET,
      signature,
    });
  }

  private async getShopifyCustomer(props: GetShopifyCustomerQueryVariables) {
    const res = await adminSdk.GetShopifyCustomer(props);
    return res?.shopifyCustomer?.[0];
  }

  mintLoyaltyCardWithCustomerId = handleApiRequest<MintLoyaltyCardOptions>(
    async (options) => {
      const { req, contractAddress } = options;

      const loyaltyCardSdk =
        options.loyaltyCardSdk || new LoyaltyCardNftWrapper();

      const { ownerAddress, customerId, organizerId } =
        await this.extractAndValidateShopifyParams(
          req,
          RequestType.MintLoyaltyCardWithCustomerId,
        );
      const shopifyCustomer = await this.getShopifyCustomer({
        organizerId,
        customerId,
      });
      if (shopifyCustomer && shopifyCustomer.address !== ownerAddress) {
        throw new NotAuthorizedError(
          'Invalid owner address. The owner address must match the address of the customer.',
        );
      }
      // Attempt to mint loyalty card
      await loyaltyCardSdk
        .mint({
          contractAddress,
          ownerAddress,
          chainId: getCurrentChain().chainIdHex,
          organizerId,
        })
        .catch((error: Error) => {
          // Check if the error is already one of our custom errors
          if (error instanceof CustomError) {
            throw error; // It's already a custom error, re-throw it
          } else {
            // It's not one of our custom errors, wrap it in a custom error class
            console.error(
              `Error minting loyalty card: ${getErrorMessage(error)}`,
            );
            throw new InternalServerError(
              `Error minting loyalty card: ${getErrorMessage(error)}`,
            );
          }
        });
      // get or create a new account
      await handleAccount({
        address: ownerAddress,
      });

      if (!shopifyCustomer) {
        await adminSdk.InsertShopifyCustomer({
          object: {
            organizerId,
            customerId,
            address: ownerAddress,
          },
        });
      }
      return new NextResponse(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    },
  );

  // deprecated (replaced by mintLoyaltyCardWithCustomerId)
  mintLoyaltyCardWithPassword = handleApiRequest<MintLoyaltyCardOptions>(
    async (options) => {
      const { req, contractAddress } = options;

      const loyaltyCardSdk =
        options.loyaltyCardSdk || new LoyaltyCardNftWrapper();

      const validatedParams = await this.extractAndValidateShopifyParams(
        req,
        RequestType.MintLoyaltyCardWithPassword,
      );

      // Prepare data for minting
      const mintData = {
        ...validatedParams,
        contractAddress,
        chainId: getCurrentChain().chainIdHex,
      };

      // Attempt to mint loyalty card
      const res = await loyaltyCardSdk
        .mintWithPassword(mintData)
        .catch((error: Error) => {
          // Check if the error is already one of our custom errors
          if (error instanceof CustomError) {
            throw error; // It's already a custom error, re-throw it
          } else {
            // It's not one of our custom errors, wrap it in a custom error class
            console.error(
              `Error minting loyalty card: ${getErrorMessage(error)}`,
            );
            throw new InternalServerError(
              `Error minting loyalty card: ${getErrorMessage(error)}`,
            );
          }
        });
      // get or create a new account
      await handleAccount({
        address: validatedParams.ownerAddress,
      });
      return new NextResponse(JSON.stringify(res), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    },
  );

  hasLoyaltyCard = handleApiRequest<HasLoyaltyCardOptions>(async (options) => {
    const { req, contractAddress } = options;

    const loyaltyCardSdk =
      options.loyaltyCardSdk || new LoyaltyCardNftWrapper();

    const { ownerAddress, organizerId } =
      await this.extractAndValidateShopifyParams(
        req,
        RequestType.HasLoyaltyCard,
      );

    const loyaltyCard = await loyaltyCardSdk
      .getLoyaltyCardOwnedByAddress({
        ownerAddress,
        chainId: getCurrentChain().chainIdHex,
        contractAddress,
        organizerId,
      })
      .catch((error: Error) => {
        console.error(
          `Error checking NFT existence: ${getErrorMessage(error)}`,
        );
        throw new InternalServerError(
          `Error checking NFT existence: ${getErrorMessage(error)}`,
        );
      });

    return new NextResponse(JSON.stringify({ isOwned: !!loyaltyCard }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });
}
