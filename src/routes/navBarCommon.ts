/*
 * Created on Fri Jan 06 2023
 *
 * Side menu structure and constants
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import ArticleIcon from '@mui/icons-material/Article';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { PATH_NAME } from 'configs';

export const navBarTitle = {
  [PATH_NAME.CREATE_NEW_USER]: 'lang_create_new_user',
  // [PATH_NAME.USER_MANAGEMENT]: 'lang_user_management',
  [PATH_NAME.PORTFOLIO]: 'lang_portfolio',
  [PATH_NAME.CREATE_NEW_NOTIFICATION]: 'lang_create_new_notification',
  [PATH_NAME.NOTIFICATION_MANAGEMENT]: 'lang_notifications_management',
  [PATH_NAME.CREATE_NEW_SEGMENT]: 'lang_create_new_segments',
  [PATH_NAME.SEGMENT_MANAGEMENT]: 'lang_segments_management',
  [PATH_NAME.SUBSCRIBERS]: 'lang_subscribers',
  [PATH_NAME.CREATE_NEW_ARTICLES]: 'lang_create_new_article',
  [PATH_NAME.ARTICLES_MANAGEMENT]: 'lang_articles_management',
  [PATH_NAME.REPORT]: 'lang_report',
};

export const navBarCommon = [
  // {
  //   title: 'lang_user_management',
  //   href: PATH_NAME.USER,
  //   icon: PersonIcon,
  //   items: [
  //     {
  //       title: 'lang_create_new_user',
  //       href: PATH_NAME.CREATE_NEW_USER,
  //     },
  //     {
  //       title: 'lang_user_management',
  //       href: PATH_NAME.USER_MANAGEMENT,
  //     },
  //   ],
  // },
  {
    title: 'lang_configuration_management',
    href: PATH_NAME.PORTFOLIO,
    icon: SettingsIcon,
    items: [
      {
        title: 'lang_portfolio',
        href: PATH_NAME.PORTFOLIO,
      },
    ],
  },
  {
    title: 'lang_notifications',
    href: PATH_NAME.NOTIFICATION,
    icon: NotificationsIcon,
    items: [
      {
        title: 'lang_create_new_notification',
        href: PATH_NAME.CREATE_NEW_NOTIFICATION,
      },
      {
        title: 'lang_notifications_management',
        href: PATH_NAME.NOTIFICATION_MANAGEMENT,
      },
      {
        title: 'lang_create_new_segments',
        href: PATH_NAME.CREATE_NEW_SEGMENT,
      },
      {
        title: 'lang_segments_management',
        href: PATH_NAME.SEGMENT_MANAGEMENT,
      },
      {
        title: 'lang_subscribers',
        href: PATH_NAME.SUBSCRIBERS,
      },
    ],
  },
  {
    title: 'lang_articles',
    href: PATH_NAME.ARTICLE,
    icon: ArticleIcon,
    items: [
      {
        title: 'lang_create_new_article',
        href: PATH_NAME.CREATE_NEW_ARTICLES,
      },
      {
        title: 'lang_articles_management',
        href: PATH_NAME.ARTICLES_MANAGEMENT,
      },
    ],
  },
  {
    title: 'lang_report',
    icon: AssessmentIcon,
    href: PATH_NAME.REPORT,
  },
];
