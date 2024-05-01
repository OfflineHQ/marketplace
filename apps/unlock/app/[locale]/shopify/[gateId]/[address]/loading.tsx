import {
  OffKeyGateSkeleton,
  OffKeyHeaderConnectedSkeleton,
  OffKeyLayout,
} from '@features/unlock/shopify';

export default function Page() {
  return (
    <OffKeyLayout className="h-full" header={<OffKeyHeaderConnectedSkeleton />}>
      <OffKeyGateSkeleton className="h-full" />
    </OffKeyLayout>
  );
}
