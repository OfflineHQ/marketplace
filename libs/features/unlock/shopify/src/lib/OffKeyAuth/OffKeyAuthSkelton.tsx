import { ButtonSkeleton } from '@ui/components';

export function OffKeyAuthSkelton() {
  return (
    <div className="flex w-full flex-1 flex-col justify-end space-y-3">
      <ButtonSkeleton className="w-full bg-primary" />
      <ButtonSkeleton className="w-full" />
    </div>
  );
}
