/*
 * Created on Fri Jan 06 2023
 *
 * Notification common constants
 *
 * Copyright (c) 2023 - Novus Fintech
 */

export type Notification_Type = 'App' | 'UserGroup' | 'ClientCategory';

export const NOTIFICATION_TYPE = { App: 'App', UserGroup: 'UserGroup', ClientCategory: 'ClientCategory' };
export const DELIVERY_TYPE = { Instant: 'Instant', Schedule: 'Schedule' };
export const EXPIRE = { Hours: 'H', Days: 'D', Weeks: 'W' };

const { App, UserGroup, ClientCategory } = NOTIFICATION_TYPE;

export const NOTIFICATION_TYPE_OPTION = [
  {
    value: App,
    label: 'lang_app',
  },
  {
    value: UserGroup,
    label: 'lang_user_group',
  },
  {
    value: ClientCategory,
    label: 'lang_client_category',
  },
];

export const NOTIFICATION_TYPE_OPTION_FILTER = {
  [App]: [
    {
      value: App,
      label: 'lang_direct',
    },
  ],
  [UserGroup]: [
    {
      value: UserGroup,
      label: 'lang_segment',
    },
  ],
  [ClientCategory]: [
    {
      value: ClientCategory,
      label: 'lang_sitename',
    },
  ],
};

const { Instant, Schedule } = DELIVERY_TYPE;

export const DELIVERY_TYPE_OPTION = [
  {
    value: Instant,
    label: 'lang_instant',
  },
  {
    value: Schedule,
    label: 'lang_schedule',
  },
];

const { Hours, Days, Weeks } = EXPIRE;

export const EXPIRE_OPTION = [
  {
    value: Hours,
    label: 'lang_hours',
  },
  {
    value: Days,
    label: 'lang_days',
  },
  {
    value: Weeks,
    label: 'lang_weeks',
  },
];

export const EXPIRE_OPTION_FILTER = {
  [Hours]: 'Hours',
  [Days]: 'Days',
  [Weeks]: 'Weeks',
};

export const TYPE_URL_OPTIONS = [
  {
    label: 'lang_article',
    value: 'Article',
  },
];

// Linked Screen

export const LINKED_SCREEN_OPTIONS = [
  {
    label: 'lang_notifications',
    value: 'Notifications',
  },
];

export const NOTIFICATION_CATEGORY_TYPE: any = {
  Insights: 'insights',
  'Site Maintenance': 'site_maintenance',
  'Client Events': 'client_events',
  Products: 'products',
  Others: 'others',
};

export const NOTIFICATION_CATEGORY_OPTIONS = [
  {
    label: 'lang_insights',
    value: 'Insights',
  },
  {
    label: 'lang_site_maintenance',
    value: 'Site Maintenance',
  },
  {
    label: 'lang_client_events',
    value: 'Client Events',
  },
  {
    label: 'lang_products',
    value: 'Products',
  },
  {
    label: 'lang_others',
    value: 'Others',
  },
];

export const STATE_FORM = {
  CREATE: 'CREATE',
  PREVIEW: 'PREVIEW',
};

export const NOTIFICATION_STATUS = {
  TRIGGERED: 'Triggered',
  PENDING: 'Pending',
};
