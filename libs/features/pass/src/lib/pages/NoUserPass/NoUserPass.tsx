'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardOverflow,
  CardTitle,
} from '@ui/components';
import { useSelectedLayoutSegment } from 'next/navigation';
import {
  NoPassPlaceholder,
  type NoPassPlaceholderProps,
} from '../../molecules/NoPassPlaceholder/NoPassPlaceholder';
import { NoUserPassFooterClient } from './NoUserPassFooterClient';

export interface NoUserPassProps
  extends Pick<NoPassPlaceholderProps, 'noPassImage'> {
  children: React.ReactNode;
  title: string;
  description: string;
  signInText: string;
}

export const NoUserPass: React.FC<NoUserPassProps> = ({
  children,
  title,
  description,
  signInText,
  noPassImage,
}) => {
  const activeTab = useSelectedLayoutSegment();
  // getLocalCart();
  return (
    <section className="container">
      <Card variant="stickyFooter" noBorder>
        <CardOverflow>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {!!activeTab && activeTab === 'organizer' ? (
              children
            ) : (
              <NoPassPlaceholder noPassImage={noPassImage} />
            )}
          </CardContent>
        </CardOverflow>
        <CardFooter className="justify-center" variant="sticky">
          <NoUserPassFooterClient signInText={signInText} />
        </CardFooter>
      </Card>
    </section>
  );
};
