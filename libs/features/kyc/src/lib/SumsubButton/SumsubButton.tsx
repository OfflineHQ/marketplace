import { Button, ButtonSkeleton } from '@ui/components';
import { UserIdentification } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { SumsubDialog, SumsubDialogProps } from '../SumsubDialog/SumsubDialog';

export interface SumsubButtonProps
  extends Pick<
    SumsubDialogProps,
    'confirmedIcon' | 'confirmedLink' | 'confirmedText'
  > {}

export const SumsubButton: React.FC<SumsubButtonProps> = ({
  ...dialogProps
}) => {
  const t = useTranslations('KYC.Button');
  return (
    <Suspense fallback={<ButtonSkeleton />}>
      <SumsubDialog title={t('title')} {...dialogProps}>
        <Button icon={<UserIdentification />} block className="w-full md:w-1/6">
          {t('text')}
        </Button>
      </SumsubDialog>
    </Suspense>
  );
};
