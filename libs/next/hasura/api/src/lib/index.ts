import env from '@env/server';
import { getHasuraEndpoint } from '@shared/server';
import { isJestRunning } from '@utils';
import { cookies } from 'next/headers';

// Used to convert BigInt to string when sending to Hasura to avoid JSON parse error
interface BigInt {
  /** Convert to BigInt to string form in JSON.stringify */
  toJSON: () => string;
}
// @ts-ignore: Unreachable code error
// eslint-disable-next-line @typescript-eslint/no-redeclare
BigInt.prototype.toJSON = function () {
  return this.toString();
};
type HasuraOpts = {
  admin?: boolean;
};
export const fetchData = (hasuraOpts: HasuraOpts = { admin: false }) => {
  return async <TResult, TVariables>(
    doc: string,
    variables: TVariables,
    opts?: unknown,
  ): Promise<TResult> => {
    const { admin } = hasuraOpts;
    const headers: RequestInit['headers'] = {
      'Content-Type': 'application/json',
    };
    if (admin) {
      headers['X-Hasura-Admin-Secret'] = env.HASURA_GRAPHQL_ADMIN_SECRET;
    } else if (!isJestRunning()) {
      // include the cookie because it's not sent by default in server side with next
      headers['Cookie'] = cookies().toString();
    }
    const res = await fetch(getHasuraEndpoint(), {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        query: doc,
        variables,
      }),
      // used for nextjs custom fetch options such as caching
      ...(opts as Record<string, unknown>),
    });
    const json = await res.json();
    if (json.errors) {
      const { message } = json.errors[0] || 'Error..';
      throw new Error(message);
    }

    return json.data;
  };
};
