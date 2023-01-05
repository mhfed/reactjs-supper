export const NOTIFICATION_TYPE = { Direct: 'Direct', Segment: 'Segment' };
export const DELIVERY_TYPE = { Instant: 'Instant', Schedule: 'Schedule' };
export const EXPIRE = { Hours: 'Hours', Days: 'Days', Weeks: 'Weeks' };

const { Direct, Segment } = NOTIFICATION_TYPE;

const { Instant, Schedule } = DELIVERY_TYPE;

const { Hours, Days, Weeks } = EXPIRE;

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

export const EXPIRE_OPTION = [
  {
    value: Hours,
    label: Hours,
  },
  {
    value: Days,
    label: Days,
  },
  {
    value: Weeks,
    label: Weeks,
  },
];

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
