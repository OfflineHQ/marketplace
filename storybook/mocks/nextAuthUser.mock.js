import { accounts } from '../../libs/test-utils/gql/src';

const user = accounts.alpha_user;
export const getCurrentUser = async () => {
  return Promise.resolve({
    ...user,
  });
};
export const handleUnauthenticatedUser = async () => {
  return Promise.resolve('mockHandleUnauthenticatedUser');
};
export const getUnauthenticatedUserCookie = async () => {
  return Promise.resolve('mockHandleUnauthenticatedUser');
};

export const isConnected = async () => {
  return Promise.resolve(true);
};
