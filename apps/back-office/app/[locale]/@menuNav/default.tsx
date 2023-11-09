import { MenuNav, MenuNavSkeleton } from '@features/back-office/app-nav';
import { getCurrentUser } from '@next/next-auth/user';
import { Suspense } from 'react';

interface MenuNavSectionProps {
  params: {
    locale: string;
  };
}

export default async function MenuNavSection({
  params: { locale },
}: MenuNavSectionProps) {
  return (
    <Suspense fallback={<MenuNavSkeleton />}>
      <MenuNavSectionContent locale={locale} />
    </Suspense>
  );
}

async function MenuNavSectionContent({ locale }: { locale: string }) {
  const user = await getCurrentUser();
  return <MenuNav user={user} />;
}
