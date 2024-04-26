import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import { GetShopifyCampaignParametersForNotConnectedQueryVariables } from '@gql/admin/types';
import { Stage } from '@gql/shared/types';
import { cache } from 'react';

type GetShopifyCampaignParametersForNotConnectedProps = Omit<
  GetShopifyCampaignParametersForNotConnectedQueryVariables,
  'stage'
>;

export const getShopifyCampaignParametersForNotConnected = cache(
  async (props: GetShopifyCampaignParametersForNotConnectedProps) => {
    const data = await adminSdk.GetShopifyCampaignParametersForNotConnected({
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
