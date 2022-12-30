// material core
import { createTheme } from '@mui/material';

import light from './light';
import dark from './dark';
import typography from './typography';

// Override Mui's theme typings to include the new theme property
// declare module '@mui/material/styles/createPalette' {
//   interface Palette {
//     ascend: Palette['primary'];
//   }
//   interface PaletteOptions {
//     ascend: PaletteOptions['primary'];
//   }
// }

const typeTheme = [light, dark];

const themes = (type: number) =>
  createTheme({
    ...typeTheme[type],
    typography: { ...typography },
  });

export default themes;
