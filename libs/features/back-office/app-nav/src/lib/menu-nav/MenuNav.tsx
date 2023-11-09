import { AppUser } from '@next/types';
import { SelectItemProps, SelectItems, TextSkeleton } from '@ui/components';

export type MenuNavProps = {
  user?: AppUser;
};

export const MenuNav: React.FC<MenuNavProps> = ({ user }) => {
  const items: SelectItemProps[] = [];
  if (items.length === 0) return null;
  return <SelectItems items={items} />;
};

export const MenuNavSkeleton: React.FC = () => {
  return <TextSkeleton className="h-12 w-56" />;
};
