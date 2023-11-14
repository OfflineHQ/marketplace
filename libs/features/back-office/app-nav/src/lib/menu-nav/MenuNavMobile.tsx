'use client';
import { usePathname, useRouter } from '@next/navigation';
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
  const router = useRouter();
  if (items.length === 0) return null;
  return (
    <Select
      defaultValue={pathname !== '/' ? pathname : undefined}
      onValueChange={(value) => router.push(value)}
    >
      <SelectTrigger className="flex min-w-min space-x-2">
        <Menu />
        <SelectValue placeholder={goToText} />
      </SelectTrigger>
      <SelectItems items={items} {...props} />
    </Select>
  );
};
