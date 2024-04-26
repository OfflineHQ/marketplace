import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import { GetShopifyCampaignParametersForConnectedQueryVariables } from '@gql/admin/types';
import { Stage } from '@gql/shared/types';
import { cache } from 'react';

type GetShopifyCampaignParametersForConnectedProps = Omit<
  GetShopifyCampaignParametersForConnectedQueryVariables,
  'stage'
>;

export const getShopifyCampaignParametersForConnected = cache(
  async (props: GetShopifyCampaignParametersForConnectedProps) => {
    const data = await adminSdk.GetShopifyCampaignParametersForConnected({
      ...props,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    const campaign = data?.shopifyCampaignParameters_by_pk;
    if (!campaign || !campaign.shopifyCampaignTemplate) {
      return null;
    }
    return {
      ...campaign,
      shopifyCampaignTemplate: campaign.shopifyCampaignTemplate!,
    };
  },
);
