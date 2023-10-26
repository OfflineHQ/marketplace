import { Locale } from '@gql/shared/types';
import { isUserKycValidated } from '@kyc/common';
import { redirect } from '@next/navigation';
import { getCurrentUser } from '@next/next-auth/user';
import { AppUser } from '@next/types';
import { StripeCheckoutSession } from '@payment/types';
import { Card, CardOverflow } from '@ui/components';
import { FC } from 'react';

interface CartSectionProps {
  params: {
    locale: Locale;
  };
}

interface CartSectionContentProps {
  user: AppUser;
  locale: Locale;
  session: StripeCheckoutSession;
}

const CartSectionContent: FC<CartSectionContentProps> = ({
  user,
  locale,
  session,
}) => {
  return <div>CartSectionContent</div>;
};

export default async function CartPurchase({
  params: { locale },
}: CartSectionProps) {
  const user = await getCurrentUser();
  if (!isUserKycValidated(user)) redirect('/');

  return (
    <section className="container">
      <Card variant="stickyFooter" noBorder>
        <CardOverflow></CardOverflow>
      </Card>
    </section>
  );
}
