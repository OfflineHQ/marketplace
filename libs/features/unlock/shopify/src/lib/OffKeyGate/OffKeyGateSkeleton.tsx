import { TextSkeleton } from '@ui/components';
import { OffKeyInfoSkeleton } from '../OffKeyInfo/OffKeyInfoSkeleton';

export function OffKeyGateSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col justify-between space-y-4 ${className}`}>
      <div className="flex flex-col space-y-4 px-2">
        <TextSkeleton variant="h6" />
        <TextSkeleton variant="p" />
      </div>
      <div className="flex flex-col justify-end">
        <OffKeyInfoSkeleton />
      </div>
    </div>
  );
}
