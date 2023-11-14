import { Roles_Enum } from '@gql/shared/types';
import { AppUser } from '@next/types';
import { TextSkeleton } from '@ui/components';
import { EventManagement, UserRoles, Users } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { MenuNavDesktop } from './MenuNavDesktop';
import { MenuNavMobile, MenuNavMobileProps } from './MenuNavMobile';

export type MenuNavProps = {
  user?: AppUser;
};

export const MenuNav: React.FC<MenuNavProps> = ({ user }) => {
  const t = useTranslations('AppNav.MenuNav');
  let items: MenuNavMobileProps['items'] = [];

  const adminItems: MenuNavMobileProps['items'] = [
    {
      icon: <EventManagement />,
      value: '/events',
      text: t('events-management-text'),
      type: 'item',
    },
  ];
  const manageRoles: MenuNavMobileProps['items'][0] = {
    icon: <Users />,
    value: '/manage-roles',
    text: t('manage-roles-text'),
    type: 'item',
  };
  if (!user) return null;
  if (user && !user?.role)
    items = [
      {
        icon: <UserRoles />,
        value: '/my-roles',

        text: t('my-roles-text'),
        type: 'item',
      },
    ];
  else {
    switch (user.role?.role) {
      case Roles_Enum.OrganizerSuperAdmin:
        items = [...adminItems, manageRoles];
        break;
      case Roles_Enum.OrganizerAdmin:
        items = [...adminItems];
        break;
      case Roles_Enum.OrganizerHumanResources:
        items = [manageRoles];
        break;
      default:
        break;
    }
  }
  if (items.length === 0) return null;
  return (
    <>
      <div className="hidden md:flex">
        <MenuNavDesktop items={items} />
      </div>
      <div className="flex md:hidden">
        <MenuNavMobile items={items} goToText={t('go-to-text')} />
      </div>
    </>
  );
};

export const MenuNavSkeleton: React.FC = () => {
  return <TextSkeleton className="h-12 w-56" />;
};
