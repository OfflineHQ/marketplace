import { isJestRunning, isServerSide } from '@utils';
import { endpointUrl } from '@next/hasura/shared';
import { logger } from '@logger';
import { cookies } from 'next/headers';

/// This fetcher is used for fetching data from Hasura GraphQL API.
// The admin mode is used solely for the admin role, it returns an error if the HASURA_GRAPHQL_ADMIN_SECRET is not set or if it's not called server side
// Otherwise it include the auth cookie or get the jwt for testing purposes
type Opts = {
  admin?: boolean;
};
export const fetchData = (opts: Opts = { admin: false }) => {
  return async <TResult, TVariables>(
    doc: string,
    variables: TVariables
  ): Promise<TResult> => {
    const { admin } = opts;
    const headers: RequestInit['headers'] = {
      'Content-Type': 'application/json',
    };
    if (admin) {
      // forbid calling on client side and allow if jest is running
      if (!isServerSide() && !isJestRunning())
        throw new Error('Admin access is only available on the server');
      if (!process.env.HASURA_GRAPHQL_ADMIN_SECRET)
        throw new Error('Admin secret env is missing');
      headers['X-Hasura-Admin-Secret'] =
        process.env.HASURA_GRAPHQL_ADMIN_SECRET;
    } else if (isServerSide()) {
      // if server side, include the cookie because it's not sent by default in server side with next
      headers['Cookie'] = cookies().toString();
    }
    const res = await fetch(endpointUrl(), {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        query: doc,
        variables,
      }),
    });
    const json = await res.json();
    if (json.errors) {
      if (!isJestRunning())
        logger.error(
          '\n\nerror:\n',
          json.errors,
          '\n\nquery:\n',
          doc,
          '\n\nvariables\n:',
          variables
        );
      const { message } = json.errors[0] || 'Error..';
      throw new Error(message);
    }

    return json.data;
  };
};
