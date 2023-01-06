/*
 * Created on Fri Jan 06 2023
 *
 * Notification common constants
 *
 * Copyright (c) 2023 - Novus Fintech
 */

export const NOTIFICATION_TYPE = { Direct: 'Direct', Segment: 'Segment' };
export const DELIVERY_TYPE = { Instant: 'Instant', Schedule: 'Schedule' };
export const EXPIRE = { Hours: 'H', Days: 'D', Weeks: 'W' };

const { Direct, Segment } = NOTIFICATION_TYPE;

export const NOTIFICATION_TYPE_OPTION = [
  {
    value: Direct,
    label: Direct,
  },
  {
    value: Segment,
    label: Segment,
  },
];

export const NOTIFICATION_TYPE_OPTION_FILTER = {
  [Direct]: [
    {
      value: Direct,
      label: Direct,
    },
  ],
  [Segment]: [
    {
      value: Segment,
      label: Segment,
    },
  ],
};

const { Instant, Schedule } = DELIVERY_TYPE;

export const DELIVERY_TYPE_OPTION = [
  {
    value: Instant,
    label: Instant,
  },
  {
    value: Schedule,
    label: Schedule,
  },
];

const { Hours, Days, Weeks } = EXPIRE;

export const EXPIRE_OPTION = [
  {
    value: Hours,
    label: 'Hours',
  },
  {
    value: Days,
    label: 'Days',
  },
  {
    value: Weeks,
    label: 'Weeks',
  },
];

export const EXPIRE_OPTION_FILTER = {
  [Hours]: 'Hours',
  [Days]: 'Days',
  [Weeks]: 'Weeks',
};

export const TYPE_URL_OPTIONS = [
  {
    label: 'Article',
    value: 'Article',
  },
];

export const STATE_FORM = {
  CREATE: 'CREATE',
  PREVIEW: 'PREVIEW',
};
