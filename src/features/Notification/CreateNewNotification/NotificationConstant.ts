/*
 * Created on Fri Jan 06 2023
 *
 * Notification common constants
 *
 * Copyright (c) 2023 - Novus Fintech
 */

export type Notification_Type = 'Direct' | 'Segment' | 'Sitename';

export const NOTIFICATION_TYPE = { Direct: 'Direct', Segment: 'Segment', Sitename: 'Sitename' };
export const DELIVERY_TYPE = { Instant: 'Instant', Schedule: 'Schedule' };
export const EXPIRE = { Hours: 'H', Days: 'D', Weeks: 'W' };

const { Direct, Segment, Sitename } = NOTIFICATION_TYPE;

export const NOTIFICATION_TYPE_OPTION = [
  {
    value: Direct,
    label: 'lang_app',
  },
  {
    value: Segment,
    label: 'lang_user_group',
  },
  {
    value: Sitename,
    label: 'lang_client_category',
  },
];

export const NOTIFICATION_TYPE_OPTION_FILTER = {
  [Direct]: [
    {
      value: Direct,
      label: 'lang_direct',
    },
  ],
  [Segment]: [
    {
      value: Segment,
      label: 'lang_segment',
    },
  ],
  [Sitename]: [
    {
      value: Sitename,
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
    value: 'lang_others',
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
