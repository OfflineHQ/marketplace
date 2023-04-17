import { ElementType, HTMLAttributes } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface Props extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  className?: string;
}

export const AutoAnimate: React.FC<Props> = ({
  as: Tag = 'div',
  children,
  className,
  ...rest
}) => {
  const [ref] = useAutoAnimate<HTMLElement>();
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
};
