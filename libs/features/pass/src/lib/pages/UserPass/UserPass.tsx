'use client';

import { AppContainer } from '@features/app-nav';
import { Link } from '@next/navigation';
import {
  Alert,
  CardHeader,
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
  textMintingOrders?: string;
}

export const UserPass: React.FC<UserPassProps> = ({
  children,
  title,
  comingSoon,
  past,
  textMintingOrders,
}) => {
  const activeTab = useSelectedLayoutSegment();

  return (
    <AppContainer>
      <CardHeader className="md:pt-16">
        <CardTitle>{title}</CardTitle>
        {textMintingOrders && textMintingOrders !== '' ? (
          <Alert variant="success" className="">
            {textMintingOrders}
          </Alert>
        ) : null}
      </CardHeader>
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
