'use client';

import { Link } from '@next/navigation';
import { PropsFrom } from '@next/types';
import { ChevronBack } from '@ui/icons';
import * as React from 'react';
import { Button, ButtonSkeleton } from '../button/Button';
import { backClasses } from '../shared/back';

export interface CardNavBackProps {
  text: string;
  href: PropsFrom<typeof Link>;
  variant?: 'default' | 'ghost' | 'secondary';
}

export const CardNavBack: React.FC<CardNavBackProps> = ({
  text,
  href,
  variant = 'ghost',
}) => (
  <Link {...href}>
    <Button
      size="sm"
      variant={variant}
      icon={<ChevronBack />}
      className="md:hidden"
    >
      {text}
    </Button>
  </Link>
);

export const CardNavBackSkeleton: React.FC = () => {
  return <ButtonSkeleton size="sm" className={`${backClasses}`} />;
};
