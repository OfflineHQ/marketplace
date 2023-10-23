export const getCurrentUser = async () => {
  return Promise.resolve({
    id: 'mockUserId',
    email: 'mockUserEmail',
    roles: ['mockUserRole'],
  });
};
export const handleUnauthenticatedUser = () => {
  return 'mockHandleUnauthenticatedUser';
};
export const getUnauthenticatedUserCookie = () => {
  return 'mockHandleUnauthenticatedUser';
};
