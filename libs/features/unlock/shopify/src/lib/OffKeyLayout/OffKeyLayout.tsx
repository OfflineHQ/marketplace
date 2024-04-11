import { cn } from '@ui/shared';

export interface OffKeyLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const OffKeyLayout: React.FC<OffKeyLayoutProps> = ({
  header,
  children,
  className,
}) => {
  return (
    <div className={cn('flex min-h-[220px] w-full flex-col', className)}>
      {header}
      {children}
    </div>
  );
};
