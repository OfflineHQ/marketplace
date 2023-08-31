'use client';

import * as React from 'react';
import Link, { type LinkProps } from 'next/link';
import { ChevronBack } from '@ui/icons';
import { Button, ButtonSkeleton } from '../button/Button';
import { backClasses } from '../shared/back';

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
  <Link {...href}>
    <Button size="sm" variant={variant} icon={ChevronBack}>
      {text}
    </Button>
  </Link>
);

export const CardNavBackSkeleton: React.FC = () => {
  return <ButtonSkeleton size="sm" className={`${backClasses}`} />;
};
