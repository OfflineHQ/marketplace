import { useState } from 'react';

export const useIsDarkMode = () => {
  const isDark = useState<boolean>(() =>
    document.documentElement.classList.contains('dark')
  );
  return isDark[0];
};
