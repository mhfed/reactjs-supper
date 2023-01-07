/*
 * Created on Fri Jan 06 2023
 *
 * Custom table constants
 *
 * Copyright (c) 2023 - Novus Fintech
 */

export const TABLE_ACTION = {
  SORT: 'sort',
  FILTER_CHANGE: 'filterChange',
  PAGE_CHANGE: 'changePage',
  SEARCH: 'search',
  SEARCH_CLOSE: 'onSearchClose',
  PAGE_SIZE_CHANGE: 'changeRowsPerPage',
};

export const COLUMN_TYPE = {
  DROPDOWN: 'dropdown',
  DROPDOWN_WITH_BG: 'dropdown_with_bg',
  DATETIME: 'datetime',
  LINK: 'link',
  MULTIPLE_TAG: 'multiple_tag',
  INPUT: 'input',
  ACTION: 'action',
};

export const DATA_DEFAULT = {
  data: [],
  isLoading: true,
  page: 1,
  count: 0,
  rowsPerPage: +process.env.REACT_APP_DEFAULT_PAGE_SIZE,
};

export const ACTIONS = {
  EDIT: 'edit',
  CANCEL: 'cancel',
  SAVE: 'save',
};
