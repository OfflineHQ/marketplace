import { NavSection, type NavSectionProps } from '../NavSection/NavSection';
import { Cart } from '@ui/icons';

export interface CartNavProps extends NavSectionProps {
  text: string;
}

export function CartNav({ text, ...props }: CartNavProps) {
  return (
    <NavSection {...props}>
      <Cart size="lg" />
      <div className="font-semibold">{text}</div>
    </NavSection>
  );
}
