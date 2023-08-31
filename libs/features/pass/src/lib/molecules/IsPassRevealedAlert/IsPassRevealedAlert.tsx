import { Alert, AlertTitle, AlertDescription } from '@ui/components';
import { useTranslations } from 'next-intl';

type IsPassRevealedAlertProps = {
  isRevealed: boolean;
  isOwner: boolean;
};

export const IsPassRevealedAlert: React.FC<IsPassRevealedAlertProps> = ({
  isRevealed,
  isOwner,
}) => {
  const t = useTranslations('Pass.SinglePass.IsPassRevealedAlert');
  if (isOwner) {
    if (!isRevealed)
      return (
        <Alert variant="warning">
          <AlertTitle>{t('owner-unrevealed-title')}</AlertTitle>
          <AlertDescription>
            {t('owner-unrevealed-description')}
          </AlertDescription>
        </Alert>
      );
  } else {
    return isRevealed ? (
      <Alert variant="warning">
        <AlertTitle>{t('buyer-revealed-title')}</AlertTitle>
        <AlertDescription>{t('buyer-revealed-description')}</AlertDescription>
      </Alert>
    ) : (
      <Alert variant="success">
        <AlertTitle>{t('buyer-unrevealed-title')}</AlertTitle>
        <AlertDescription>{t('buyer-unrevealed-description')}</AlertDescription>
      </Alert>
    );
  }

  return null;
};
