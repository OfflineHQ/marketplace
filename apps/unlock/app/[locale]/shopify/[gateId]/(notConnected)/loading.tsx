import {
  OffKeyAuthSkelton,
  OffKeyGateNotConnectedSkeleton,
  OffKeyHeaderNotConnectedSkeleton,
  OffKeyLayout,
} from '@features/unlock/shopify';

export default function Page() {
  return (
    <OffKeyLayout header={<OffKeyHeaderNotConnectedSkeleton />}>
      <OffKeyGateNotConnectedSkeleton />
      <OffKeyAuthSkelton />
    </OffKeyLayout>
  );
}
