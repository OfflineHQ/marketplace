'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardOverflow,
  CardContent,
  Button,
  ButtonSkeleton,
  CardOverlay,
  Text,
  CardDescription,
} from '@ui/components';
import { NoUserPassFooterClient } from './NoUserPassFooterClient';
import {
  NoPassPlaceholder,
  type NoPassPlaceholderProps,
} from '../../molecules/NoPassPlaceholder/NoPassPlaceholder';

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
  console.log({ activeTab });
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
        <CardOverlay />
        <CardFooter className="justify-center" variant="sticky">
          <NoUserPassFooterClient signInText={signInText} />
        </CardFooter>
      </Card>
    </section>
  );
};
