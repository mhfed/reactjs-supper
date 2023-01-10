/*
 * Created on Fri Jan 06 2023
 *
 * Theme config
 *
 * Copyright (c) 2023 - Novus Fintech
 */

// material core
import { createTheme } from '@mui/material';
import light from './light';
import dark from './dark';
import typography from './typography';

// Override Mui's theme typings to include the new theme property
declare module '@mui/material/styles' {
  interface TypeBackground {
    other1: string;
    other2: string;
    other3: string;
    other4: string;
  }
  interface PaletteColor {
    success: string;
    warning: string;
    error: string;
    info: string;
  }
}
declare module '@mui/material/styles/createPalette' {
  interface PaletteColor {
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  }
  interface Palette {
    hover: Palette['primary'];
  }
  interface SimplePaletteColorOptions {
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  }
  interface PaletteOptions {
    hover: PaletteOptions['primary'];
  }
}

const typeTheme = [light, dark];

const themes = (type: number) =>
  createTheme({
    ...typeTheme[type],
    typography: { ...typography },
  });

export default themes;
