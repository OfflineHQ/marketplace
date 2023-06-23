import * as Types from '@gql/shared/types';

export type GetEventWithPassesQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
  locale: Types.Locale;
  stage: Types.Stage;
}>;


export type GetEventWithPassesQuery = { __typename?: 'query_root', event?: { __typename?: 'Event', id: string, slug: string, title: string, heroImage: { __typename?: 'Asset', url: string }, organizer?: { __typename?: 'Organizer', id: string, slug: string, name: string, image: { __typename?: 'Asset', url: string } } | null, eventPasses: Array<{ __typename?: 'EventPass', id: string, name: string, description: string, price: { __typename?: 'Money', amount: number, currency?: Types.Currency | null } }> } | null };
