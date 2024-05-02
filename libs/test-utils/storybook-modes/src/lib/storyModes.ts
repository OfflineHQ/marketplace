import { allModes } from './allModes';

export const mobileMode = {
  viewport: {
    defaultViewport: allModes.mobile.viewport,
  },
  chromatic: {
    modes: {
      mobile: {
        viewport: allModes.mobile.viewport,
      },
    },
  },
};

export const darkMode = {
  darkMode: {
    isDark: true,
  },
};

export const mobileDarkMode = {
  ...mobileMode,
  ...darkMode,
};
