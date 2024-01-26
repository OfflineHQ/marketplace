// import {
//   ContentSpaceSheet,
//   ContentSpaceSheetSkeleton,
// } from '@features/back-office/content-spaces';
import { getContentSpaceWithPassesOrganizer } from '@features/back-office/content-spaces-api';
import { getCurrentUser } from '@next/next-auth/user';
import { SheetContent } from '@ui/components';
import { notFound } from 'next/navigation';

interface ContentSpaceSheetPageContentProps {
  contentSpaceSlug: string;
  locale: string;
}

async function ContentSpaceSheetPageContent({
  contentSpaceSlug,
  locale,
}: ContentSpaceSheetPageContentProps) {
  const user = await getCurrentUser();
  if (!user || !user?.role) return notFound();
  const contentSpace = await getContentSpaceWithPassesOrganizer({
    slug: contentSpaceSlug,
    locale,
  });
  if (!contentSpace) return notFound();
  return (
    <div>ContentSpaceSheetPageContent</div>
    // <ContentSpaceSheet
    //   contentSpace={contentSpace}
    //   organizerId={user.role.organizerId}
    // />
  );
}

interface ContentSpaceSheetPageProps {
  params: {
    locale: string;
    contentSpaceSlug: string;
  };
}

export default function ContentSpaceSheetPage({
  params: { locale, contentSpaceSlug },
}: ContentSpaceSheetPageProps) {
  return (
    <SheetContent size={'full'}>
      {/* <Suspense fallback={<ContentSpaceSheetSkeleton />}> */}
      <ContentSpaceSheetPageContent
        contentSpaceSlug={contentSpaceSlug}
        locale={locale}
      />
      {/* </Suspense> */}
    </SheetContent>
  );
}
