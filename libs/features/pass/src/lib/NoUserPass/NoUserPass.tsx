import { useTranslations } from 'next-intl';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardOverflow,
  CardContent,
  Button,
  ButtonSkeleton,
  CardOverlay,
  Text,
  CardDescription,
} from '@ui/components';
import { NoUserPassFooterClient } from './NoUserPassFooterClient';

export const NoUserPass: React.FC = () => {
  const t = useTranslations('Pass.NoUserPass');
  // getLocalCart();
  return (
    <section className="container">
      <Card variant="stickyFooter" noBorder>
        <CardOverflow>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO add image or animation in lieu of passes */}
          </CardContent>
        </CardOverflow>
        <CardOverlay />
        <CardFooter className="justify-center" variant="sticky">
          <NoUserPassFooterClient signInText={t('sign-in-text')} />
        </CardFooter>
      </Card>
    </section>
  );
};
