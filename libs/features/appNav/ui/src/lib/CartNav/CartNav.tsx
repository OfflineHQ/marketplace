import { NavSection, type NavSectionProps } from '../NavSection/NavSection';
import { Cart } from '@ui/icons';
import { Spinner, AutoAnimate } from '@ui/components';

export interface CartNavProps extends NavSectionProps {
  text: string;
  isLoading?: boolean;
}

export function CartNav({ text, isLoading, ...props }: CartNavProps) {
  return (
    <NavSection {...props}>
      <AutoAnimate className="flex items-center">
        {isLoading ? (
          <Spinner size="xl" variant="link" className="md:mr-2" />
        ) : (
          <Cart size="lg" />
        )}
      </AutoAnimate>
      <div className="font-semibold">{text}</div>
    </NavSection>
  );
}
