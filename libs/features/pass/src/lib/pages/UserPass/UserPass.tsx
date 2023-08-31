'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardOverflow,
  CardContent,
} from '@ui/components';
import Link from 'next/link';
import React from 'react';

export interface UserPassProps {
  children: React.ReactNode;
  title: string;
  comingSoon: string;
  past: string;
}

export const UserPass: React.FC<UserPassProps> = ({
  children,
  title,
  comingSoon,
  past,
}) => {
  const activeTab = useSelectedLayoutSegment();
  return (
    <section className="container">
      <Card variant="stickyFooter" noBorder>
        <CardOverflow>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          {activeTab === 'organizer' ? (
            children
          ) : (
            <Tabs
              value={activeTab || 'coming-soon'}
              className="mx-auto flex h-full w-full flex-col md:max-w-[1420px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <Link href="/pass" legacyBehavior>
                  <TabsTrigger value="coming-soon">{comingSoon}</TabsTrigger>
                </Link>
                <Link href="/pass/past" legacyBehavior>
                  <TabsTrigger value="past">{past}</TabsTrigger>
                </Link>
              </TabsList>
              <TabsContent
                value={activeTab || 'coming-soon'}
                className="h-full overflow-auto"
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
