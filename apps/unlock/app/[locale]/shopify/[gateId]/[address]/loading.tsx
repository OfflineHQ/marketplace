import {
  OffKeyGateSkeleton,
  OffKeyHeaderConnectedSkeleton,
  OffKeyLayout,
} from '@features/unlock/shopify';

export default function Page() {
  return (
    <OffKeyLayout className="h-full" header={<OffKeyHeaderConnectedSkeleton />}>
      <div className="flex h-full flex-1 flex-col">
        <OffKeyGateSkeleton className="h-full" />
      </div>
    </OffKeyLayout>
  );
}
