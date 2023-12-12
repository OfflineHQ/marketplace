import { NavSection, type NavSectionProps } from '../NavSection/NavSection';
import { QrCode } from '@ui/icons';
import { Spinner, AutoAnimate } from '@ui/components';

export interface PassNavProps extends NavSectionProps {
  text: string;
  isLoading?: boolean;
}

export function PassNav({ text, isLoading, ...props }: PassNavProps) {
  return (
    <NavSection {...props}>
      <AutoAnimate className="flex items-center">
        {isLoading ? (
          <Spinner size="xl" variant="link" className="md:mr-2" />
        ) : (
          <QrCode size="lg" />
        )}
      </AutoAnimate>
      <div className="font-semibold">{text}</div>
    </NavSection>
  );
}
