'use client';

import React, { useMemo } from 'react';

import { DisplayDropdown, type DisplayDropdownProps } from '@ui/components';
import { Dark, Light, DarkLight } from '@ui/icons';
import { useTheme } from 'next-themes';

export interface DisplayDropdownClientProps {
  displaySelectText: {
    light: string;
    dark: string;
    auto: string;
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
        text: displaySelectText['auto'],
        action: () => setTheme('auto'),
        icon: <DarkLight />,
        disabled: theme === 'auto',
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
