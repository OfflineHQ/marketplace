'use client';

import { DropdownMenuItem, DropdownMenuShortcut } from './DropdownMenu';
import { useToast, type ToastT } from '../toast/useToast';
import { iconCVA } from '@ui/icons';
import { cn } from '@ui/shared';
import { getErrorMessage, type ErrorWithMessage } from '@utils';

export interface HandleActionProps {
  action?: (() => void) | undefined;
  toastSuccess?: (res: unknown) => Promise<ToastT>;
  toastError?: (error: ErrorWithMessage) => Promise<ToastT>;
}

export interface MenuItem extends HandleActionProps {
  type: 'label' | 'separator' | 'item' | 'sub' | 'children';
  text?: string;
  children?: React.ReactNode;
  wrapper?: React.ReactElement;
  icon?: React.ReactElement;
  shortcut?: string;
  disabled?: boolean;
  subItems?: MenuItem[];
  current?: boolean;
  className?: string;
}

export interface DropdownMenuItemClientProps {
  icon?: React.ReactElement;
  iconClasses: string;
  item: MenuItem;
  setLoading?: (loading: boolean) => void;
}
export const DropdownMenuItemClient: React.FC<DropdownMenuItemClientProps> = ({
  icon,
  item,
  iconClasses,
  setLoading,
}) => {
  const { toast } = useToast();

  const handleAction = async ({
    action,
    toastSuccess,
    toastError,
  }: HandleActionProps) => {
    if (setLoading) setLoading(true);
    try {
      let res: any = null;
      if (action) res = await action();
      if (toastSuccess) {
        const toastSuccessRes = await toastSuccess(res);
        toast(toastSuccessRes);
      }
    } catch (error) {
      if (toastError) {
        const toastErrorRes = await toastError({
          message: getErrorMessage(error),
        });
        toast(toastErrorRes);
      }
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      disabled={item.disabled}
      onSelect={() => handleAction(item)}
      wrapper={item.wrapper}
      className={item.className}
    >
      {icon && (
        <icon.type
          {...icon.props}
          className={cn(iconClasses, icon.props.className)}
        />
      )}
      <span>{item.text}</span>
      {item.shortcut && (
        <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
      )}
    </DropdownMenuItem>
  );
};
