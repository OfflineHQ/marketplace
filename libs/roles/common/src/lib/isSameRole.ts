import { Role } from '@roles/types';

export const isSameRole = ({
  role,
  roleToCompare,
}: {
  role?: Role;
  roleToCompare?: Role;
}) => {
  return (
    role?.role === roleToCompare?.role &&
    role?.organizerId === roleToCompare?.organizerId &&
    (role?.eventId === roleToCompare?.eventId || !roleToCompare?.eventId)
  );
};
