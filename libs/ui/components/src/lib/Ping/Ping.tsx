import { cn } from '@ui/shared';

export interface PingProps {
  isActive?: boolean;
  number?: number;
  children?: React.ReactNode;
  className?: string;
}

export const Ping: React.FC<PingProps> = ({
  isActive,
  children,
  number,
  className,
}) => {
  const isDoubleDigit = number && number > 9;
  const numberSize = isDoubleDigit ? 'size-4' : 'h-3.5 w-3.5';
  const size = number ? numberSize : 'h-2.5 w-2.5';
  const position = number ? 'top-0.5 right-0.5' : 'top-1 right-1';

  return (
    <div className={cn('relative inline-block max-w-fit', className)}>
      {((number && number > 0) || isActive) && (
        <span
          className={cn(
            `absolute z-10 ${position} flex ${size} pointer-events-none items-center justify-center`,
          )}
        >
          <span
            className={cn(
              `absolute inline-flex size-full rounded-full bg-primary opacity-75 ${
                isActive ? 'animate-ping' : ''
              }`,
            )}
          ></span>
          <span
            className={cn(
              `relative inline-flex ${size} items-center justify-center rounded-full bg-primary`,
            )}
          >
            <span className="text-xs text-primary-foreground">{number}</span>
          </span>
        </span>
      )}
      {children}
    </div>
  );
};
