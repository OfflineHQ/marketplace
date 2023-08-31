import Image, { StaticImageData } from 'next/image';
import { Alert } from '@ui/components';

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
        {noPassText}
      </Alert>
    )}
    <div className="relative h-80 w-80 grow">
      <Image fill src={noPassImage} alt={noPassText || ''} />
    </div>
  </div>
);
