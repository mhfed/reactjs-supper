import { PATH_NAME } from './pathName';

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const LANGUAGE = {
  ENGLISH: 'en',
  VIETNAMESE: 'vn',
};

const VERSION_PROJECT = {
  // eslint-disable-next-line global-require
  version: require('../../package.json').version,
};

export { PATH_NAME, VERSION_PROJECT };
