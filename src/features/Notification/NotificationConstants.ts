/*
 * Created on Fri Jan 06 2023
 *
 * Notification common constants
 *
 * Copyright (c) 2023 - Novus Fintech
 */

export const FIELD = {
  CREATED_BY: 'created_by',
  APP_NAME: 'display_name',
  LAST_UPDATED_BY: 'last_updated_by',
  NOTIFICATION_ENABLED: 'notification_enabled',
  AUDIENCES: 'subscribers',
  NOTIFICATION_ID: 'notification_id',
  DELIVERY_TYPE: 'delivery_type',
  TITLE: 'title',
  SUBJECT: 'subject',
  MESSAGE: 'message',
  URL: 'url',
  CREATED_TIME: 'create_time',
  CREATED_DATE: 'created_date',
  ATTACHMENT_URL: 'attachment_url',
  ATTACHMENT_NAME: 'attachment_name',
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

  ARTICLES_ID: 'article_id',
};

export const NOTIFICATION_STATUS = {
  TRIGGERED: 'Triggered',
  PENDING: 'Pending',
};

export const ARTICLE_STATUS = {
  TRIGGERED: 'triggered',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  DRAFT: 'draft',
};

export const ARTICLE_STATUS_OPTIONS = [
  { label: 'lang_draft', value: ARTICLE_STATUS.DRAFT, color: 'warning' },
  { label: 'lang_scheduled', value: ARTICLE_STATUS.SCHEDULED, color: 'error' },
  { label: 'lang_completed', value: ARTICLE_STATUS.COMPLETED, color: 'success' },
];

export const NOTIFICATION_ENABLED = {
  YES: true,
  NO: false,
};

export const NOTIFICATION_ENABLED_OPTIONS = [
  { label: 'lang_yes', value: NOTIFICATION_ENABLED.YES, color: 'success' },
  { label: 'lang_no', value: NOTIFICATION_ENABLED.NO, color: 'error' },
];

export const NOTIFICATION_STATUS_OPTIONS = [
  { label: 'lang_triggered', value: NOTIFICATION_STATUS.TRIGGERED },
  { label: 'lang_pending', value: NOTIFICATION_STATUS.PENDING, color: 'warning' },
];

export const STEP_EDIT_NOTI = {
  EDIT_NOTI: 1,
  REVIEW_NOTI: 2,
};
