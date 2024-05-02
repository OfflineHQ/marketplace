import { TextSkeleton } from '@ui/components';

export function OffKeyGateNotConnectedSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={`flex flex-col justify-between space-y-4 ${className}`}>
      <div className="flex flex-col space-y-4 px-2">
        <TextSkeleton variant="h6" />
        <TextSkeleton variant="p" />
      </div>
    </div>
  );
}
