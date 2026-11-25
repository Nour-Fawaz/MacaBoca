import { createTheme } from '@mantine/core';

// Keep this minimal: Mantine's defaults already look clean.
// Tweak primaryColor / fontFamily here to restyle the whole POC.
export const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'sm',
});
