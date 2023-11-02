import { Role, Roles_Enum_Not_Const_Values } from '@roles/types';
import { Badge, BadgeProps } from 'libs/ui/components/src/lib/badge/Badge';
import { useTranslations } from 'next-intl';

export interface RoleBadgeProps extends Omit<BadgeProps, 'role' | 'variant'> {
  role: Role;
}

export function RoleBadge({ role, className, ...props }: RoleBadgeProps) {
  const t = useTranslations('Roles.RoleBadge');
  const texts = {
    [Roles_Enum_Not_Const_Values.OrganizerAdmin]: t('organizer-admin'),
    [Roles_Enum_Not_Const_Values.OrganizerAuditor]: t('organizer-auditor'),
    [Roles_Enum_Not_Const_Values.OrganizerContentManager]: t(
      'organizer-content-manager',
    ),
    [Roles_Enum_Not_Const_Values.OrganizerFinanceManager]: t(
      'organizer-finance-manager',
    ),
    [Roles_Enum_Not_Const_Values.OrganizerGuest]: t('organizer-guest'),
    [Roles_Enum_Not_Const_Values.OrganizerHumanResources]: t(
      'organizer-human-resources',
    ),
    [Roles_Enum_Not_Const_Values.OrganizerOperationsManager]: t(
      'organizer-operations-manager',
    ),
    [Roles_Enum_Not_Const_Values.OrganizerSuperAdmin]: t(
      'organizer-super-admin',
    ),
    [Roles_Enum_Not_Const_Values.OrganizerValidator]: t('organizer-validator'),
  };
  const classes = {
    [Roles_Enum_Not_Const_Values.OrganizerAdmin]:
      'bg-blue-200 text-blue-800 hover:bg-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800',
    [Roles_Enum_Not_Const_Values.OrganizerAuditor]:
      'bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800',
    [Roles_Enum_Not_Const_Values.OrganizerContentManager]:
      'bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800',
    [Roles_Enum_Not_Const_Values.OrganizerFinanceManager]:
      'bg-red-200 text-red-800 hover:bg-red-300 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800',
    [Roles_Enum_Not_Const_Values.OrganizerGuest]:
      'bg-purple-200 text-purple-800 hover:bg-purple-300 dark:bg-purple-900 dark:text-purple-100 dark:hover:bg-purple-800',
    [Roles_Enum_Not_Const_Values.OrganizerHumanResources]:
      'bg-pink-200 text-pink-800 hover:bg-pink-300 dark:bg-pink-900 dark:text-pink-100 dark:hover:bg-pink-800',
    [Roles_Enum_Not_Const_Values.OrganizerOperationsManager]:
      'bg-indigo-200 text-indigo-800 hover:bg-indigo-300 dark:bg-indigo-900 dark:text-indigo-100 dark:hover:bg-indigo-800',
    [Roles_Enum_Not_Const_Values.OrganizerSuperAdmin]:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800',
    [Roles_Enum_Not_Const_Values.OrganizerValidator]:
      'bg-teal-200 text-teal-800 hover:bg-teal-300 dark:bg-teal-900 dark:text-teal-100 dark:hover:bg-teal-800',
  };
  if (!role) return null;
  return (
    <Badge {...props} className={`${classes[role.role]} ${className}`}>
      {texts[role.role]}
    </Badge>
  );
}
