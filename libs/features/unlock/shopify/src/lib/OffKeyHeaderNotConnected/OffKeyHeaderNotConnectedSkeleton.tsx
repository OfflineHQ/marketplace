import { OffKeyHeader } from '../OffKeyHeader/OffKeyHeader';
import { TextSkeleton } from '@ui/components';

export function OffKeyHeaderNotConnectedSkeleton() {
  return <OffKeyHeader title={<TextSkeleton variant="h6" />} />;
}
