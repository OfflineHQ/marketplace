import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogProps,
} from '@ui/components';

import type { Locale } from '@gql/shared/types';
import { useLocale } from 'next-intl';
import { SumsubDialogClient, SumsubWebSdkProps } from './SumsubDialogClient';
export interface SumsubDialogProps
  extends DialogProps,
    Pick<
      SumsubWebSdkProps,
      'confirmedIcon' | 'confirmedLink' | 'confirmedText'
    > {
  children?: React.ReactNode;
  title: string;
}

export const SumsubDialog: React.FC<SumsubDialogProps> = ({
  children,
  title,
  confirmedIcon,
  confirmedText,
  confirmedLink,
  ...dialogProps
}) => {
  const locale = useLocale() as Locale;
  return (
    <Dialog {...dialogProps}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <SumsubDialogClient
          confirmedIcon={confirmedIcon}
          confirmedLink={confirmedLink}
          confirmedText={confirmedText}
          locale={locale}
        />
      </DialogContent>
    </Dialog>
  );
};
