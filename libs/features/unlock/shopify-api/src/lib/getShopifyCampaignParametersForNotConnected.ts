import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import {
  GetShopifyCampaignParametersForNotConnectedQuery,
  GetShopifyCampaignParametersForNotConnectedQueryVariables,
} from '@gql/admin/types';
import { Stage } from '@gql/shared/types';
import { cache } from 'react';

type GetShopifyCampaignParametersForNotConnectedProps = Omit<
  GetShopifyCampaignParametersForNotConnectedQueryVariables,
  'stage'
>;

type ShopifyCampaignParameters = NonNullable<
  GetShopifyCampaignParametersForNotConnectedQuery['shopifyCampaignParameters_by_pk']
>;

type ShopifyCampaignTemplate = NonNullable<
  ShopifyCampaignParameters['shopifyCampaignTemplate']
>;

interface ShopifyCampaignParametersForNotConnected
  extends Omit<ShopifyCampaignParameters, 'shopifyCampaignTemplate'> {
  shopifyCampaignTemplate: ShopifyCampaignTemplate;
}

export const getShopifyCampaignParametersForNotConnected = cache(
  async (
    props: GetShopifyCampaignParametersForNotConnectedProps,
  ): Promise<ShopifyCampaignParametersForNotConnected | null> => {
    const data = await adminSdk.GetShopifyCampaignParametersForNotConnected({
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
