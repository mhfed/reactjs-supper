import { PATH_NAME } from './pathName';
import { USER_ROLE } from './userRole';

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

export { PATH_NAME, VERSION_PROJECT, USER_ROLE };
