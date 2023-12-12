'use client';

import { AppContainer, AppContainerHeader } from '@features/app-nav';
import { Link } from '@next/navigation';
import {
  Badge,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ui/components';

import { useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';

export interface UserPassProps {
  children: React.ReactNode;
  title: string;
  comingSoon: string;
  past: string;
  textMintingOrdersBadge?: string;
}

export const UserPass: React.FC<UserPassProps> = ({
  children,
  title,
  comingSoon,
  past,
  textMintingOrdersBadge,
}) => {
  const activeTab = useSelectedLayoutSegment();

  return (
    <AppContainer>
      <AppContainerHeader>
        <CardTitle>
          <div className="flex items-center space-x-2">
            <span>{title} </span>
            {textMintingOrdersBadge ? (
              <Badge variant="green">{textMintingOrdersBadge}</Badge>
            ) : null}
          </div>
        </CardTitle>
      </AppContainerHeader>
      {activeTab === 'organizer' ? (
        children
      ) : (
        <Tabs
          value={activeTab || 'upcoming'}
          className="mx-auto h-full w-full flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <Link href="/pass" legacyBehavior>
              <TabsTrigger value="upcoming">{comingSoon}</TabsTrigger>
            </Link>
            <Link href="/pass/past" legacyBehavior>
              <TabsTrigger value="past">{past}</TabsTrigger>
            </Link>
          </TabsList>
          <TabsContent
            value={activeTab || 'upcoming'}
            className="h-full overflow-y-auto pb-40"
          >
            {children}
          </TabsContent>
        </Tabs>
      )}
    </AppContainer>
  );
};
