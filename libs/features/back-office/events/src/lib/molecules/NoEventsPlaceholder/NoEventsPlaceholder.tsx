import { Alert } from '@ui/components';
import Image, { StaticImageData } from 'next/image';

export interface NoEventsPlaceholderProps {
  noEventsText?: string;
  noEventsImage: string | StaticImageData;
}

export const NoEventsPlaceholder: React.FC<NoEventsPlaceholderProps> = ({
  noEventsText,
  noEventsImage,
}) => (
  <div className="m-5 flex flex-col items-center">
    {noEventsText && (
      <Alert variant="info" className="w-max">
        {noEventsText}
      </Alert>
    )}
    <div className="relative h-80 w-80 grow">
      <Image fill src={noEventsImage} alt={noEventsText || ''} />
    </div>
  </div>
);
