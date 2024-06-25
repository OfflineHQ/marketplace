import env from '@env/server';
import { handleAccount } from '@features/account/api';
import { adminSdk } from '@gql/admin/api';
import { GetShopifyCustomerQueryVariables } from '@gql/admin/types';
import handleApiRequest, {
  ApiHandlerOptions,
  BadRequestError,
  CustomError,
  ForbiddenError,
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
  CreateShopifyCustomerParams,
  GetShopifyCustomerParams,
  HasLoyaltyCardParams,
  MintLoyaltyCardWithCustomerIdParams,
  MintLoyaltyCardWithPasswordParams,
} from './validators';

export enum RequestType {
  MintLoyaltyCardWithPassword = 'MintLoyaltyCardWithPassword',
  MintLoyaltyCardWithCustomerId = 'MintLoyaltyCardWithCustomerId',
  HasLoyaltyCard = 'HasLoyaltyCard',
  CreateShopifyCustomer = 'CreateShopifyCustomer',
  GetShopifyCustomer = 'GetShopifyCustomer',
}

const requestTypeValidators = {
  [RequestType.MintLoyaltyCardWithPassword]: MintLoyaltyCardWithPasswordParams,
  [RequestType.MintLoyaltyCardWithCustomerId]:
    MintLoyaltyCardWithCustomerIdParams,
  [RequestType.HasLoyaltyCard]: HasLoyaltyCardParams,
  [RequestType.CreateShopifyCustomer]: CreateShopifyCustomerParams,
  [RequestType.GetShopifyCustomer]: GetShopifyCustomerParams,
};

type RequestTypeToValidator = {
  [RequestType.MintLoyaltyCardWithPassword]: z.infer<
    typeof MintLoyaltyCardWithPasswordParams
  >;
  [RequestType.MintLoyaltyCardWithCustomerId]: z.infer<
    typeof MintLoyaltyCardWithCustomerIdParams
  >;
  [RequestType.HasLoyaltyCard]: z.infer<typeof HasLoyaltyCardParams>;
  [RequestType.CreateShopifyCustomer]: z.infer<
    typeof CreateShopifyCustomerParams
  >;
  [RequestType.GetShopifyCustomer]: z.infer<typeof GetShopifyCustomerParams>;
};

export interface MintLoyaltyCardOptions extends ApiHandlerOptions {
  contractAddress: string;
  loyaltyCardSdk?: LoyaltyCardNftWrapper;
}
export type HasLoyaltyCardOptions = MintLoyaltyCardOptions;

export interface CreateShopifyCustomerOptions extends ApiHandlerOptions {
  id: string;
  loyaltyCardSdk?: LoyaltyCardNftWrapper;
}

export type GetShopifyCustomerOptions = CreateShopifyCustomerOptions;

export class ShopifyWebhookAndApiHandler extends BaseWebhookAndApiHandler {
  constructor() {
    super();
  }

  private async serializeAndValidateParams<T extends RequestType>(
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

  private async extractAndVerifyShopifyRequest(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const shop = this.getRequiredParam(searchParams, 'shop');
    const timestamp = this.getRequiredParam(searchParams, 'timestamp');

    this.guardRequestTimestamp(timestamp, 300); // 5 minutes in seconds as the allowed time difference

    const queryHash = this.populateQueryHash(searchParams);
    const resultParams = this.populateResultParams(searchParams);
    const signature = searchParams.get('signature');
    if (!signature || !this.verifyRequestSignature(queryHash, signature)) {
      throw new Error('Invalid signature');
    }
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
      integritySecret: env.SHOPIFY_API_SECRET,
      signature,
    });
  }

  private async getShopifyCustomer(props: GetShopifyCustomerQueryVariables) {
    const res = await adminSdk.GetShopifyCustomer(props);
    return res?.shopifyCustomer?.[0];
  }

  // POST apps/web/app/api/shopify/loyalty-card/[contractAddress]/route.ts
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
        customerId: customerId.toString(),
      });
      if (!shopifyCustomer) {
        throw new BadRequestError('Customer not found');
      } else if (
        shopifyCustomer.address.toLowerCase() !== ownerAddress.toLowerCase()
      ) {
        throw new ForbiddenError(
          'Invalid owner address. The owner address must match the address of the customer.',
        );
      }
      // Attempt to mint loyalty card
      await loyaltyCardSdk
        .mint({
          contractAddress: contractAddress.toLowerCase(),
          ownerAddress: ownerAddress.toLowerCase(),
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
      return new NextResponse(JSON.stringify(res || {}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    },
  );

  // GET apps/web/app/api/shopify/loyalty-card/[contractAddress]/route.ts
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
        ownerAddress: ownerAddress.toLowerCase(),
        chainId: getCurrentChain().chainIdHex,
        contractAddress: contractAddress.toLowerCase(),
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

  // POST apps/web/app/api/shopify/customer/[id]/route.ts
  createShopifyCustomer = handleApiRequest<CreateShopifyCustomerOptions>(
    async (options) => {
      const { req, id } = options;
      const { address, organizerId } =
        await this.extractAndValidateShopifyParams(
          req,
          RequestType.CreateShopifyCustomer,
        );
      const shopifyCustomer = await this.getShopifyCustomer({
        organizerId,
        customerId: id,
      });
      // get or create a new account
      await handleAccount({
        address: address.toLowerCase(),
      });
      if (!shopifyCustomer) {
        await adminSdk
          .InsertShopifyCustomer({
            object: {
              organizerId,
              customerId: id,
              address: address.toLowerCase(),
            },
          })
          .catch((error: Error) => {
            throw new InternalServerError(
              `Error creating shopify customer: ${getErrorMessage(error)}`,
            );
          });
      }
      const loyaltyCardSdk =
        options.loyaltyCardSdk || new LoyaltyCardNftWrapper();

      const contractAddress =
        await loyaltyCardSdk.getLoyaltyCardNftContractAddressForOrganizer({
          organizerId,
          chainId: getCurrentChain().chainIdHex,
        });
      if (!contractAddress) {
        throw new InternalServerError('No contract address found');
      }
      await loyaltyCardSdk
        .mint({
          contractAddress: contractAddress.toLowerCase(),
          ownerAddress: address.toLowerCase(),
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
      return new NextResponse(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    },
  );

  // GET apps/web/app/api/shopify/customer/[id]/route.ts
  hasShopifyCustomer = handleApiRequest<GetShopifyCustomerOptions>(
    async (options) => {
      const { req, id } = options;
      const { organizerId } = await this.extractAndValidateShopifyParams(
        req,
        RequestType.GetShopifyCustomer,
      );
      const shopifyCustomer = await this.getShopifyCustomer({
        organizerId,
        customerId: id,
      });
      return new NextResponse(
        JSON.stringify(
          shopifyCustomer
            ? { address: shopifyCustomer.address }
            : { address: null },
        ),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    },
  );
}
