'use client';

import React, { useMemo } from 'react';

import { Dark, DarkLight, Light } from '@ui/icons';
import { useTheme } from 'next-themes';
import { DisplayDropdown, type DisplayDropdownProps } from './DisplayDropdown';

export interface DisplayDropdownClientProps {
  displaySelectText: {
    light: string;
    dark: string;
    system: string;
  };
  displayText: string;
  className?: string;
}

export const DisplayDropdownClient: React.FC<DisplayDropdownClientProps> = ({
  displaySelectText,
  displayText,
  className,
}) => {
  const { setTheme, theme } = useTheme();
  const displays: DisplayDropdownProps['items'] = useMemo(
    () => [
      {
        type: 'item',
        text: displaySelectText['light'],
        icon: <Light />,
        action: () => setTheme('light'),
        disabled: theme === 'light',
      },
      {
        type: 'item',
        text: displaySelectText['dark'],
        action: () => setTheme('dark'),
        icon: <Dark />,
        disabled: theme === 'dark',
      },
      {
        type: 'item',
        text: displaySelectText['system'],
        action: () => setTheme('system'),
        icon: <DarkLight />,
        disabled: theme === 'system',
      },
    ],
    [displaySelectText, theme, setTheme]
  );

  return (
    <DisplayDropdown items={displays} className={className}>
      {displayText}
    </DisplayDropdown>
  );
};
