import { handleAccount } from '@features/account/api';
import { KycStatus_Enum } from '@gql/shared/types';
import { getSumSubApplicantPersonalData } from '@next/next-auth/common';
import type { AppUser } from '@next/types';
import { SmartWallet } from '@smart-wallet/admin';
import { getErrorMessage } from '@utils';
import { error } from 'loglevel';
import CredentialsProvider from 'next-auth/providers/credentials';

export const SiweProvider = () =>
  CredentialsProvider({
    name: 'Ethereum',
    credentials: {
      message: {
        label: 'Message',
        type: 'text',
        placeholder: '0x0',
      },
      signature: {
        label: 'Signature',
        type: 'text',
        placeholder: '0x0',
      },
      address: {
        type: 'text',
      },
    },
    async authorize(credentials, req) {
      const smartWallet = new SmartWallet();
      try {
        if (
          !credentials ||
          typeof credentials !== 'object' ||
          !('message' in credentials) ||
          !('signature' in credentials) ||
          !('address' in credentials)
        ) {
          throw new Error('Missing or invalid credentials');
        }
        const { message, signature, address } = credentials;
        const result = await smartWallet.isValidSignature({
          message,
          signature,
          address,
        });
        if (result) {
          try {
            // eslint-disable-next-line sonarjs/prefer-immediate-return
            const account = await handleAccount({
              address,
            });
            const appUser: AppUser = {
              ...account,
              kyc: account.kyc
                ? {
                    ...account.kyc,
                  }
                : undefined,
            };
            // here mean user is already registered to sumsub so need to get the user data from sumsub
            if (
              appUser?.kyc?.applicantId &&
              !appUser.kyc.applicantId.includes('fake-') && // here mean it's a test account so no need to get the data from sumsub
              appUser.kyc.reviewStatus === KycStatus_Enum.Completed
            ) {
              const sumsubData = await getSumSubApplicantPersonalData(
                appUser.kyc.applicantId,
              );
              appUser.email = sumsubData.email;
              appUser.phone = sumsubData.phone;
            }
            return appUser as AppUser;
          } catch (error) {
            console.error({ error });
            throw new Error(
              error instanceof Error ? getErrorMessage(error) : String(error),
            );
          }
        } else {
          const error = 'Invalid signature';
          console.error({ error });
          throw new Error(error);
        }
      } catch (error) {
        console.error({ error });
        throw new Error(
          error instanceof Error ? getErrorMessage(error) : String(error),
        );
      }
    },
  });
