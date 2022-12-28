import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArticleIcon from '@mui/icons-material/Article';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { PATH_NAME } from 'configs';

export const navBarCommon = [
  {
    title: 'lang_user_management',
    href: PATH_NAME.USER,
    icon: PeopleIcon,
    items: [
      {
        title: 'lang_create_new_user',
        href: PATH_NAME.CREATE_NEW_USER,
      },
      {
        title: 'lang_user_management',
        href: PATH_NAME.USER_MANAGEMENT,
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
        href: PATH_NAME.NOTIFICATIONS,
      },
      {
        title: 'lang_segments',
        href: PATH_NAME.SEGMENTS,
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
        href: PATH_NAME.CREATE_NEW_ARTICLE,
      },
      {
        title: 'lang_articles',
        href: PATH_NAME.ARTICLES,
      },
    ],
  },
  {
    title: 'lang_report',
    icon: AssessmentIcon,
    href: PATH_NAME.REPORT,
  },
];
