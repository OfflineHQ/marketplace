import * as loyaltyCardApi from '@features/back-office/loyalty-card-api';
import { NftMintPasswordOrganizer } from '@nft/types';
import { i18nUiTablesServerMocks } from '@test-utils/ui-mocks';
import * as nextIntl from 'next-intl';
import { createMock } from 'storybook-addon-module-mock';
import * as createPasswordAction from '../../actions/createNftsPasswords';

export const loyaltyCardPasswords = [
  {
    password: 'password1',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2022-01-01T00:00:00Z',
  },
  {
    password: 'password2',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2022-01-01T00:00:00Z',
  },
  {
    password: 'password3',
    minterAddress: '0x1234567890abcdef',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2022-03-01T00:00:00Z',
  },
  {
    password: 'password4',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2022-01-01T00:00:00Z',
  },
  {
    password: 'password5',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2022-01-01T00:00:00Z',
  },
  {
    password: 'password6',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2022-01-01T00:00:00Z',
  },
] satisfies NftMintPasswordOrganizer[];

export function loyaltyCardNftsPasswordTableMocks() {
  const mockIntl = createMock(nextIntl, 'useLocale');
  mockIntl.mockReturnValue('en');
  const mockLoyaltyCardApi = createMock(
    loyaltyCardApi,
    'getNftMintPasswordsForContract',
  );
  mockLoyaltyCardApi.mockResolvedValue(loyaltyCardPasswords);
  const mockCreatePasswordAction = createMock(
    createPasswordAction,
    'createNftsPasswords',
  );
  mockCreatePasswordAction.mockResolvedValue(loyaltyCardPasswords.slice(0, 3));
  return [
    mockIntl,
    mockLoyaltyCardApi,
    mockCreatePasswordAction,
    ...i18nUiTablesServerMocks(),
  ];
}
