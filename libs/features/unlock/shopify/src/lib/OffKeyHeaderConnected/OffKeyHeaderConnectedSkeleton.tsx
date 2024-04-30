import { TextSkeleton } from '@ui/components';
import { OffKeyHeader } from '../OffKeyHeader/OffKeyHeader';
import { OffKeyProfileSkeleton } from '../OffKeyProfile/OffKeyProfile';

export function OffKeyHeaderConnectedSkeleton() {
  return (
    <OffKeyHeader
      profile={<OffKeyProfileSkeleton />}
      title={<TextSkeleton variant="h6" />}
    />
  );
}
