'use client';

import * as React from 'react';
import Link, { type LinkProps } from 'next/link';
import { ChevronBack } from '@ui/icons';
import { Button } from '../button/Button';

export interface CardNavBackProps {
  text: string;
  href: LinkProps;
}

export const CardNavBack: React.FC<CardNavBackProps> = ({ text, href }) => (
  <Link {...href}>
    <Button variant="ghost" icon={ChevronBack}>
      {text}
    </Button>
  </Link>
);
