import { Alert, AlertTitle } from '@ui/components';
import Image, { StaticImageData } from 'next/image';

export interface NoPassPlaceholderProps {
  noPassText?: string;
  noPassImage: string | StaticImageData;
}

export const NoPassPlaceholder: React.FC<NoPassPlaceholderProps> = ({
  noPassText,
  noPassImage,
}) => (
  <div className="m-5 flex flex-col items-center">
    {noPassText && (
      <Alert variant="info" className="w-max">
        <AlertTitle>{noPassText}</AlertTitle>
      </Alert>
    )}
    <div className="relative size-80 grow">
      <Image fill src={noPassImage} alt={noPassText || ''} />
    </div>
  </div>
);
