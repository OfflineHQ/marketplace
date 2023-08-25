import { isJestRunning, isServerSide } from '@utils';

export const endpointUrl = (): string => {
  if (isJestRunning()) {
    return 'http://localhost:9696/v1/graphql';
  }
  let url = isServerSide()
    ? process.env.HASURA_PROJECT_ENDPOINT
    : process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT;
  if (!url) url = 'http://localhost:8080/v1/graphql';
  return url;
};

// Used to convert BigInt to string when sending to Hasura to avoid JSON parse error
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
BigInt.prototype.toJSON = function (): number {
  return this.toString();
};
