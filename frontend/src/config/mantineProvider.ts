import { MantineThemeOverride } from '@mantine/core';

// https://mantine.dev/theming/mantine-provider/
const mantineThemeConfig: MantineThemeOverride = {
  // default theme config
  colors: {
    dark: [
      '#fff',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
};

export const mantineTheme = (mantineCustom: MantineThemeOverride): MantineThemeOverride => {
  return { ...mantineThemeConfig, ...mantineCustom };
};
