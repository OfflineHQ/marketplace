import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import {
  GetShopifyCampaignParametersForConnectedQuery,
  GetShopifyCampaignParametersForConnectedQueryVariables,
} from '@gql/admin/types';
import { Stage } from '@gql/shared/types';
import { cache } from 'react';

type GetShopifyCampaignParametersForConnectedProps = Omit<
  GetShopifyCampaignParametersForConnectedQueryVariables,
  'stage'
>;

type ShopifyCampaignParameters = NonNullable<
  GetShopifyCampaignParametersForConnectedQuery['shopifyCampaignParameters_by_pk']
>;

type ShopifyCampaignTemplate = NonNullable<
  ShopifyCampaignParameters['shopifyCampaignTemplate']
>;

interface ShopifyCampaignParametersForConnected
  extends Omit<ShopifyCampaignParameters, 'shopifyCampaignTemplate'> {
  shopifyCampaignTemplate: ShopifyCampaignTemplate;
}

export const getShopifyCampaignParametersForConnected = cache(
  async (
    props: GetShopifyCampaignParametersForConnectedProps,
  ): Promise<ShopifyCampaignParametersForConnected | null> => {
    const data = await adminSdk.GetShopifyCampaignParametersForConnected({
      ...props,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    const campaign = data?.shopifyCampaignParameters_by_pk;
    if (!campaign || !campaign.shopifyCampaignTemplate) {
      return null;
    }
    return campaign;
  },
);
