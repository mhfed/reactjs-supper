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
    label: 'lang_direct',
  },
  {
    value: Segment,
    label: 'lang_segment',
  },
  {
    value: Sitename,
    label: 'lang_sitename',
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

export const STATE_FORM = {
  CREATE: 'CREATE',
  PREVIEW: 'PREVIEW',
};
