import { OffKeyLogo } from '@features/unlock/app-nav';
import { TextSkeleton } from '@ui/components';

export const OffKeyInfoSkeleton: React.FC = () => {
  return (
    <div className="off-key-info flex justify-between border pl-4">
      <div className="flex items-center py-2">
        <OffKeyLogo className="size-auto" />
        <TextSkeleton className="mx-4" />
      </div>
      <div className="flex h-full w-32 animate-pulse bg-skeleton" />
    </div>
  );
};
