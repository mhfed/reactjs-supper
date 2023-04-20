/*
 * Created on Wed Jan 11 2023
 *
 * use for project
 *
 * Copyright (c) 2023 - Novus Fintech
 */
export const STATUS_OPTIONS_HEADER = [
  {
    label: 'lang_enabled_for_all',
    value: 1,
  },
  {
    label: 'lang_disabled_for_all',
    value: 0,
  },
];
export const REPORT_STATUS = {
  DISABLED: 'DISABLED',
  ENABLED: 'ENABLED',
};
export const STATUS_OPTIONS = [
  {
    label: 'lang_enabled',
    value: REPORT_STATUS.ENABLED,
    color: 'success',
  },
  {
    label: 'lang_disabled',
    value: REPORT_STATUS.DISABLED,
    color: 'warning',
  },
];
export const FIELD = {
  REPORT_NAME: 'description',
  REPORT_TYPE: 'report_type',
  ID: 'id',
  TEMPLATE_ID: 'template_id',
  SITE_NAME: 'site_name',
  APP_NAME: 'app_name',
  PARAMETERS: 'params',
  STATUS: 'status',
  BUNDLE_ID: 'bundle_id',
};
