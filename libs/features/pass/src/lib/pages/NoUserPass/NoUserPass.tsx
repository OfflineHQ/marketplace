'use client';

import {
  AppContainer,
  AppContainerFooter,
  AppContainerOverflow,
} from '@features/app-nav';
import {
  CardContent,
  CardDescription,
  CardHeader,
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
    <AppContainer>
      <AppContainerOverflow variant="stickyFooter">
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
      </AppContainerOverflow>
      <AppContainerFooter>
        <NoUserPassFooterClient signInText={signInText} />
      </AppContainerFooter>
    </AppContainer>
  );
};
