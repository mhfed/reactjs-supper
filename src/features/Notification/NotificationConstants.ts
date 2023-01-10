/*
 * Created on Fri Jan 06 2023
 *
 * Notification common constants
 *
 * Copyright (c) 2023 - Novus Fintech
 */

export const FIELD = {
  AUDIENCES: 'subscribers',
  NOTIFICATION_ID: 'notification_id',
  DELIVERY_TYPE: 'delivery_type',
  TITLE: 'title',
  MESSAGE: 'message',
  URL: 'url',
  CREATED_TIME: 'create_time',
  EXPIRATION_TIME: 'expire_time',
  SCHEDULE: 'schedule_time',
  TRIGGER_TIME: 'trigger_time',
  STATUS: 'status',
  ATTEMPTED: 'attempted',
  DELIVERED: 'delivered',
  CLICKED: 'clicked',
  ACTOR: 'actor',
  LAST_UPDATED: 'last_updated',

  SEGMENT_ID: 'segment_id',
  SEGMENT_NAME: 'name',
  NUMBER_OF_SUBSCRIBERS: 'total_subscribers',
  LAST_UPDATE: 'last_update',

  USERNAME: 'username',
  ENTITY_ID: 'entity_id',
  FULL_NAME: 'full_name',
  SITENAME: 'site_name',
  SEGMENT_REGISTER: 'segment_register',
};

export const NOTIFICATION_STATUS = {
  TRIGGERED: 'Triggered',
  PENDING: 'Pending',
};

export const NOTIFICATION_STATUS_OPTIONS = [
  { label: 'lang_triggered', value: NOTIFICATION_STATUS.TRIGGERED },
  { label: 'lang_pending', value: NOTIFICATION_STATUS.PENDING, color: 'warning' },
];
