import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogProps,
} from '@ui/components';

import { useTranslations } from 'next-intl';
import { SumsubDialogClient, SumsubWebSdkProps } from './SumsubDialogClient';

export interface SumsubDialogProps extends DialogProps, SumsubWebSdkProps {
  children?: React.ReactNode;
}

export const SumsubDialog: React.FC<SumsubDialogProps> = ({
  children,
  accessToken,
  expirationHandler,
  config,
  options,
  confirmedIcon,
  confirmedLink,
  confirmedText,
  ...dialogProps
}) => {
  const t = useTranslations('KYC.Dialog');
  return (
    <Dialog {...dialogProps}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t.rich('description', { br: () => <br /> })}
          </DialogDescription>
        </DialogHeader>
        <SumsubDialogClient
          accessToken={accessToken}
          expirationHandler={expirationHandler}
          config={config}
          options={options}
          confirmedIcon={confirmedIcon}
          confirmedLink={confirmedLink}
          confirmedText={confirmedText}
        />
      </DialogContent>
    </Dialog>
  );
};
