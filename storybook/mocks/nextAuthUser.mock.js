import { accounts } from '../../libs/test-utils/gql/src';

const user = accounts.alpha_user;
export const getCurrentUser = async () => {
  return Promise.resolve({
    ...user,
  });
};
export const handleUnauthenticatedUser = () => {
  return 'mockHandleUnauthenticatedUser';
};
export const getUnauthenticatedUserCookie = () => {
  return 'mockHandleUnauthenticatedUser';
};

export const isConnected = () => {
  return true;
};
