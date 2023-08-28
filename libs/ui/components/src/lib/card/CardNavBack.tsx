'use client';

import * as React from 'react';
import Link, { type LinkProps } from 'next/link';
import { ChevronBack } from '@ui/icons';
import { Button } from '../button/Button';

export interface CardNavBackProps {
  text: string;
  href: LinkProps;
  variant?: 'default' | 'ghost' | 'secondary';
}

export const CardNavBack: React.FC<CardNavBackProps> = ({
  text,
  href,
  variant = 'ghost',
}) => (
  <Link {...href} legacyBehavior>
    <Button variant={variant} icon={ChevronBack}>
      {text}
    </Button>
  </Link>
);
