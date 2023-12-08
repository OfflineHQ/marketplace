import { FillInfo } from '@ui/icons';
import { cn } from '@ui/shared';
import { cva } from 'class-variance-authority';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../popover/Popover';

export const iconSizes = {
  sm: '-top-1 -right-1',
  default: '-top-2 -right-2',
  lg: '-top-3.5 -right-3.5',
};

export interface PopoverInfoProps {
  children: React.ReactNode;
  title: string;
  description: string;
  classname?: string;
  iconSize?: keyof typeof iconSizes;
}

const iconSizeVariantsCva = cva('absolute flex rounded-full bg-white', {
  variants: {
    iconSize: iconSizes,
  },
  defaultVariants: {
    iconSize: 'default',
  },
});

export const PopoverInfo = ({
  children,
  title,
  description,
  iconSize = 'default',
  classname,
}: PopoverInfoProps) => {
  const iconClasses = iconSizeVariantsCva({ iconSize });

  return (
    <div className="relative inline-flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative inline-block max-w-fit cursor-pointer select-none">
            {children}
            <FillInfo color="info" size={iconSize} className={iconClasses} />
          </div>
        </PopoverTrigger>
        <PopoverContent className={cn('w-64', classname)}>
          <PopoverHeader className="border-b">
            <PopoverTitle>{title}</PopoverTitle>
          </PopoverHeader>
          <PopoverDescription className="py-4">
            {description}
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  );
};
