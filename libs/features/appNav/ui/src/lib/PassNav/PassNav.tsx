import { NavSection, type NavSectionProps } from '../NavSection/NavSection';
import { QrCode } from '@ui/icons';

export interface PassNavProps extends NavSectionProps {
  text: string;
}

export function PassNav({ text, ...props }: PassNavProps) {
  return (
    <NavSection {...props}>
      <QrCode size="lg" />
      <div className="font-semibold">{text}</div>
    </NavSection>
  );
}
