import { getSumSubAccessToken } from '@features/kyc-api';
import { Locale } from '@gql/shared/types';
import { AppUser } from '@next/types';
import { Button, ButtonSkeleton } from '@ui/components';
import { UserIdentification } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { SumsubDialog, SumsubDialogProps } from '../SumsubDialog/SumsubDialog';
import { useKyc } from '../hooks/useKyc';

export interface SumsubButtonProps
  extends Pick<
    SumsubDialogProps,
    'confirmedIcon' | 'confirmedLink' | 'confirmedText'
  > {
  locale: Locale;
}

export const SumsubButton: React.FC<SumsubButtonProps> = async ({
  locale,
  ...dialogProps
}) => {
  const { user, accessToken } = await useKyc(locale);
  if (!user) return null;
  return (
    <Suspense fallback={<ButtonSkeleton />}>
      <SumsubButtonContent
        user={user}
        accessToken={accessToken}
        locale={locale}
        {...dialogProps}
      />
    </Suspense>
  );
};

export interface SumsubButtonContentProps extends SumsubButtonProps {
  user: AppUser;
  accessToken: string;
}

const SumsubButtonContent: React.FC<SumsubButtonContentProps> = ({
  locale,
  ...props
}) => {
  const t = useTranslations('KYC.Button');
  return (
    <SumsubDialog
      expirationHandler={getSumSubAccessToken}
      config={{ lang: locale }}
      {...props}
    >
      <Button icon={<UserIdentification />} block className="w-full md:w-1/6">
        {t('text')}
      </Button>
    </SumsubDialog>
  );
};
