'use client';
import { usePathname } from '@next/navigation';
import {
  Select,
  SelectItems,
  SelectItemsProps,
  SelectTrigger,
  SelectValue,
} from '@ui/components';
import { Menu } from '@ui/icons';

export type MenuNavMobileProps = SelectItemsProps & {
  goToText: string;
};

export const MenuNavMobile: React.FC<MenuNavMobileProps> = ({
  items,
  goToText,
  ...props
}) => {
  const pathname = usePathname();
  if (items.length === 0) return null;

  console.log({ pathname });
  return (
    <Select defaultValue={pathname !== '/' ? pathname : undefined}>
      <SelectTrigger className="flex min-w-min space-x-2">
        <Menu />
        <SelectValue placeholder={goToText} />
      </SelectTrigger>
      <SelectItems items={items} {...props} />
    </Select>
  );
};
