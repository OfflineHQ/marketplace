import { ProfileAvatar } from '@features/app-nav';
import { AppUser } from '@next/types';
import {
  Button,
  DropdownMenu,
  DropdownMenuItems,
  DropdownMenuItemsProps,
  DropdownMenuTrigger,
} from '@ui/components';
import { useTranslations } from 'next-intl';

export interface ProfileProps extends DropdownMenuItemsProps {
  user: AppUser;
}

export const ShopifyProfile: React.FC<ProfileProps> = ({ user, items }) => {
  const t = useTranslations('Shopify.Profile');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="inline-flex h-16 w-fit p-0 md:h-12">
          <div className="flex size-16 flex-col items-center justify-center space-y-1 px-1 md:w-fit md:flex-row md:space-x-2 md:space-y-0 md:px-4">
            <ProfileAvatar user={user} />
            <div className="hidden pb-1 font-medium md:flex md:pb-0">
              {t('my-account')}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} />
    </DropdownMenu>
  );
};
