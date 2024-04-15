import { decryptSecret } from '@crypto';
import { adminSdk } from '@gql/admin/api';
import { ApiKeyType_Enum } from '@gql/shared/types';
import { getSecretApiKey } from '@integrations/api-keys';
import handleApiRequest, {
  ApiHandlerOptions,
  BadRequestError,
  CustomError,
  InternalServerError,
  NotAuthorizedError,
} from '@next/api-handler';
import { getCurrentChain } from '@next/chains';
import {
  LoyaltyCardNftWrapper,
  MintWithPasswordProps,
} from '@nft/loyalty-card';
import { getErrorMessage } from '@utils';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BaseWebhookAndApiHandler } from './baseWebhookAndApiHandler';

export enum RequestType {
  MintLoyaltyCard = 'MintLoyaltyCard',
  HasLoyaltyCard = 'HasLoyaltyCard',
}

const MintLoyaltyCardParams = z.object({
  password: z.string(),
  ownerAddress: z.string(),
});

const HasLoyaltyCardParams = z.object({
  ownerAddress: z.string(),
});

const requestTypeValidators = {
  [RequestType.MintLoyaltyCard]: MintLoyaltyCardParams,
  [RequestType.HasLoyaltyCard]: HasLoyaltyCardParams,
};

type RequestTypeToValidator = {
  [RequestType.MintLoyaltyCard]: z.infer<typeof MintLoyaltyCardParams>;
  [RequestType.HasLoyaltyCard]: z.infer<typeof HasLoyaltyCardParams>;
};

interface MintLoyaltyCardWithPasswordProps
  extends Pick<
      MintWithPasswordProps,
      'password' | 'contractAddress' | 'chainId' | 'ownerAddress'
    >,
    Required<Pick<MintWithPasswordProps, 'organizerId'>> {}

// Extended options for the specific handler
export interface MintLoyaltyCardOptions extends ApiHandlerOptions {
  contractAddress: string;
  loyaltyCardSdk?: LoyaltyCardNftWrapper;
}

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
    const apiKey = headers().get('x-shopify-client-id') as string;
    if (!apiKey) {
      throw new Error('Missing API key');
    }
    const secretApiKey = await this.getValidatedSecretApiKey(apiKey);

    const shop = this.getRequiredParam(searchParams, 'shop');
    const timestamp = this.getRequiredParam(searchParams, 'timestamp');

    this.guardRequestTimestamp(timestamp, 300); // 5 minutes in seconds as the allowed time difference
    if (secretApiKey.allowlist)
      this.guardAllowListOrigin(secretApiKey.allowlist, `https://${shop}`);

    const queryHash = this.populateQueryHash(searchParams);
    const resultParams = this.populateResultParams(searchParams);
    const signature = searchParams.get('signature');
    if (
      !signature ||
      !this.verifyRequestSignature(
        queryHash,
        signature,
        secretApiKey.encryptedIntegritySecret as string,
      )
    )
      throw new Error('Invalid signature');
    return {
      resultParams,
      organizerId: secretApiKey.organizerId,
    };
  }

  private async getValidatedSecretApiKey(apiKey: string) {
    const secretApiKey = await getSecretApiKey(apiKey);
    if (
      !secretApiKey ||
      secretApiKey.type !== ApiKeyType_Enum.Shopify ||
      !secretApiKey.encryptedIntegritySecret
    ) {
      throw new Error('Invalid signature');
    }
    return secretApiKey;
  }

  private populateQueryHash(searchParams: URLSearchParams): {
    [key: string]: string | string[];
  } {
    const queryHash: { [key: string]: string | string[] } = {};
    searchParams.forEach((value, key) => {
      if (key !== 'signature') {
        queryHash[key] = queryHash[key]
          ? [...(queryHash[key] as string[]), value]
          : value;
      }
    });
    return queryHash;
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
    queryHash: { [key: string]: string | string[] },
    signature: string | null,
    encryptedIntegritySecret: string,
  ) {
    if (!signature) {
      throw new Error('Invalid signature');
    }
    const sortedParams = Object.entries(queryHash)
      .map(
        ([key, value]) =>
          `${key}=${Array.isArray(value) ? value.join(',') : value}`,
      )
      .sort()
      .join('');
    const decryptedIntegritySecret = decryptSecret(encryptedIntegritySecret);
    return this.verifySignature({
      body: sortedParams,
      integritySecret: decryptedIntegritySecret,
      signature,
    });
  }

  mintLoyaltyCardWithPassword = handleApiRequest<MintLoyaltyCardOptions>(
    async (options) => {
      // Destructure options and provide default value for loyaltyCardSdk
      const { req, contractAddress } = options;

      const loyaltyCardSdk =
        options.loyaltyCardSdk || new LoyaltyCardNftWrapper();

      // Extract and verify Shopify request
      const { resultParams, organizerId } =
        await this.extractAndVerifyShopifyRequest(req).catch((error) => {
          throw new NotAuthorizedError(
            'Not Authorized: ' + getErrorMessage(error),
          );
        });

      // Serialize and validate parameters
      const validatedParams = await this.serializeAndValidateParams(
        RequestType.MintLoyaltyCard,
        resultParams,
      ).catch((error: Error) => {
        throw new BadRequestError(
          'Invalid query parameters: ' + getErrorMessage(error),
        );
      });

      // Prepare data for minting
      const mintData: MintLoyaltyCardWithPasswordProps = {
        ...validatedParams,
        contractAddress,
        chainId: getCurrentChain().chainIdHex,
        organizerId,
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
      return new NextResponse(JSON.stringify(res), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    },
  );

  async hasLoyaltyCard(options: ApiHandlerOptions, contractAddress: string) {
    const { req } = options;

    const { resultParams, organizerId } =
      await this.extractAndVerifyShopifyRequest(req).catch((error) => {
        throw new NotAuthorizedError(
          'Not Authorized: ' + getErrorMessage(error),
        );
      });

    const { ownerAddress } = await this.serializeAndValidateParams(
      RequestType.HasLoyaltyCard,
      resultParams,
    ).catch((error: Error) => {
      throw new BadRequestError(
        'Invalid query parameters: ' + getErrorMessage(error),
      );
    });

    const nftExists = await this.checkNftExistence(
      ownerAddress,
      contractAddress,
      organizerId,
    ).catch((error: Error) => {
      console.error(`Error checking NFT existence: ${getErrorMessage(error)}`);
      throw new InternalServerError(
        `Error checking NFT existence: ${getErrorMessage(error)}`,
      );
    });

    return new NextResponse(JSON.stringify({ exists: nftExists }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async checkNftExistence(
    ownerAddress: string,
    contractAddress: string,
    organizerId: string,
  ): Promise<boolean> {
    const loyaltyCardNft = (
      await adminSdk.GetLoyaltyCardOwnedByAddress({
        contractAddress,
        ownerAddress,
        organizerId,
        chainId: getCurrentChain().chainIdHex,
      })
    ).loyaltyCardNft[0];

    return !!loyaltyCardNft;
  }
}
