import { RoleAssignments, Roles_Enum } from '@gql/shared/types';
import { GetMyRolesWithOrganizerInfosQuery } from '@gql/user/types';

export const Roles_Enum_Not_Const_Values = {
  OrganizerAdmin: Roles_Enum.OrganizerAdmin,
  OrganizerAuditor: Roles_Enum.OrganizerAuditor,
  OrganizerContentManager: Roles_Enum.OrganizerContentManager,
  OrganizerFinanceManager: Roles_Enum.OrganizerFinanceManager,
  OrganizerGuest: Roles_Enum.OrganizerGuest,
  OrganizerHumanResources: Roles_Enum.OrganizerHumanResources,
  OrganizerOperationsManager: Roles_Enum.OrganizerOperationsManager,
  OrganizerSuperAdmin: Roles_Enum.OrganizerSuperAdmin,
  OrganizerValidator: Roles_Enum.OrganizerValidator,
};

export type Role = Pick<RoleAssignments, 'role' | 'organizerId' | 'eventId'>;

export type RoleWithOrganizer = Role & {
  organizer: GetMyRolesWithOrganizerInfosQuery['roleAssignments'][0]['organizer'];
};
