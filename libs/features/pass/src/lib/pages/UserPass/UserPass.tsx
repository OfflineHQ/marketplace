'use client';

import { Link } from '@next/navigation';
import {
  Alert,
  Card,
  CardHeader,
  CardOverflow,
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
    <section className="container">
      <Card noBorder className="mb-16 h-full">
        <CardOverflow>
          <CardHeader>
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
              className="mx-auto flex h-full w-full flex-col md:max-w-[1420px]"
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
                className="h-full overflow-y-auto"
              >
                {children}
              </TabsContent>
            </Tabs>
          )}
        </CardOverflow>
      </Card>
    </section>
  );
};
