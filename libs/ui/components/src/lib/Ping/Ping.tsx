import { cn } from '@ui/shared';

export interface PingProps {
  isActive?: boolean;
  number?: number;
  children?: React.ReactNode;
}

export const Ping: React.FC<PingProps> = ({ isActive, children, number }) => {
  const isDoubleDigit = number && number > 9;
  const numberSize = isDoubleDigit ? 'h-4 w-4' : 'h-3.5 w-3.5';
  const size = number ? numberSize : 'h-2.5 w-2.5';
  const position = number ? 'top-0.5 right-0.5' : 'top-1 right-1';
  return (
    <>
      <span
        className={cn(
          `absolute ${position} ${isActive ? 'flex' : 'hidden'} ${size}`
        )}
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
        <span
          className={cn(
            `relative inline-flex ${size} items-center justify-center rounded-full bg-primary`
          )}
        >
          {!!number && (
            <span className="text-xs text-primary-foreground">{number}</span>
          )}
        </span>
      </span>
      {children}
    </>
  );
};
