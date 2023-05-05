/*
 * Created on Fri Jan 06 2023
 *
 * Common api url
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { ISortConfig } from 'models/ICommon';

// Auth - v1
export const getSessionUrl = (sessionId: string | number) => {
  return `/v1/auth/session?session_id=${sessionId}`;
};
export const getAuthUrl = () => {
  return '/v1/auth';
};
export const getDecodeUrl = () => {
  return '/v1/auth/decode';
};
export const getRefreshUrl = () => {
  return '/v1/auth/refresh';
};
export const getPinUrl = () => {
  return '/v1/auth/pin';
};
export const getCreatePasswordUrl = () => {
  return 'v1/auth/create-password';
};
export const getLogoutUrl = () => {
  return '/v1/auth/logout';
};

// User - v1
export const getSearchUserUrl = ({ page = 1, rowsPerPage = +process.env.REACT_APP_DEFAULT_PAGE_SIZE }) => {
  return `/v1/search/user?page_id=${page}&page_size=${rowsPerPage}`;
};
export function getResetUserPasswordUrl() {
  return '/v1/auth/send-verify-username';
}
export function getUserDetailByIdUrl(userId: string) {
  return `/v1/user/user-details/${userId}`;
}
export function getUserDetailByEmailUrl(email: string) {
  return `/v1/user/user-details?user_login_id=${email}`;
}
export function getUserDetailUrl(userId?: string) {
  return `/v1/user/user-details/${userId || ''}`;
}
export function postCreateSegment() {
  return '/v1/dynamic-push/segment/create';
}
export function getSearchSegment(text?: string) {
  return `/v1/dynamic-push/segment/query?search=${text}`;
}
export function postDirectSend() {
  return '/v1/dynamic-push/direct/send';
}

export function postAppNameSend() {
  return '/v1/dynamic-push/app/send';
}

export function postUserGroupSend() {
  return '/v1/dynamic-push/user-group/send';
}

export function postClientCategorySend(client_category_id: string) {
  return `/v1/dynamic-push/client-category/${client_category_id}/send`;
}

export function getUserGroupUrl(roleGroupId: string) {
  return `/v1/user/role-group/${roleGroupId}`;
}
export function getUserSubcriberByID(segmentID: string) {
  return `/v1/dynamic-push/segment/get/${segmentID}`;
}
export function putDataUpdateSegmentByID(segmentID: string) {
  return `/v1/dynamic-push/segment/${segmentID}/update`;
}
export function postDataUpdateSegmentByID(segmentID: string) {
  return `/v1/dynamic-push/segment/${segmentID}/send`;
}
export function postSiteNameSend() {
  return `/v1/dynamic-push/site-name/send`;
}
export function postLogin(baseUrl: string) {
  return `https://${baseUrl.replace(/\/cms/g, '')}/mobile/login?type=adviser`;
}

export function getReports() {
  return `/v1/reports`;
}

// Notification - v1
export const getListNotificationUrl = (
  {
    page = 1,
    rowsPerPage = +process.env.REACT_APP_DEFAULT_PAGE_SIZE,
    searchText = '',
    sort,
  }: {
    page: number;
    rowsPerPage: number;
    searchText: string | null;
    sort: ISortConfig | null;
  },
  filterObj?: any,
) => {
  let url = `/v1/dynamic-push/notifications/query?page_id=${page}&page_size=${rowsPerPage}`;
  if (searchText) url += `&search=${searchText}`;
  if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  if (sort?.sortType) url += `&sort_type=${sort.sortType}`;

  // filter advanced
  if (filterObj.from) url += `&from=${filterObj.from}`;
  if (filterObj.to) url += `&to=${filterObj.to}`;
  if (filterObj.date_search) url += `&date_search=${filterObj.date_search}`;
  if (filterObj.bundle_id) url += `&bundle_id=${filterObj.bundle_id}`;

  return url;
};
export function getListSegmentUrl({
  page = 1,
  rowsPerPage = +process.env.REACT_APP_DEFAULT_PAGE_SIZE,
  searchText = '',
  sort,
}: {
  page: number;
  rowsPerPage: number;
  searchText: string | null;
  sort: ISortConfig | null;
}) {
  let url = `v1/dynamic-push/segment/query?page_id=${page}&page_size=${rowsPerPage}`;
  if (searchText) url += `&search=${searchText}`;
  if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  if (sort?.sortType) url += `&sort_type=${sort.sortType}`;
  return url;
}
export function getListSubscribertUrl({
  page = 1,
  rowsPerPage = +process.env.REACT_APP_DEFAULT_PAGE_SIZE,
  searchText = '',
  sort,
}: {
  page: number;
  rowsPerPage: number;
  searchText: string | null;
  sort: ISortConfig | null;
}) {
  let url = `v1/subscriber/subscribers/query?page_id=${page}&page_size=${rowsPerPage}`;
  if (searchText) url += `&search=${searchText}`;
  if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  if (sort?.sortType) url += `&sort_type=${sort.sortType}`;
  return url;
}
export function getArticlesListUrl(
  {
    page = 1,
    rowsPerPage = +process.env.REACT_APP_DEFAULT_PAGE_SIZE,
    searchText = '',
    sort,
  }: {
    page: number;
    rowsPerPage: number;
    searchText: string | null;
    sort: ISortConfig | null;
  },
  listAppName = [],
) {
  let url = `v1/articles/query?page_id=${page}&page_size=${rowsPerPage}`;
  if (searchText) url += `&search=${searchText}`;
  if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  if (sort?.sortType) url += `&sort_type=${sort.sortType}`;
  if (listAppName?.length) url += listAppName.join(',');
  return url;
}
export function getSearchSubscribersUrl(searchText = '') {
  return `v1/subscriber/subscribers/query?page_id=1&page_size=50&search=${searchText}`;
}

export function getSearchUserGroupUrl(searchText = '') {
  return `v1/dynamic-push/user-group/search?search=${searchText}`;
}

export function getSearchClientCategoryUrl(searchText = '') {
  return `v1/dynamic-push/client-category/search?search=${searchText}`;
}

export function getListSubscriberSegmenttUrl({
  page = 1,
  rowsPerPage = 50,
  searchText = '',
}: {
  page?: number;
  rowsPerPage?: number;
  searchText?: string | null;
}) {
  let url = `v1/subscriber/subscribers/query?page_id=${page}&page_size=${rowsPerPage}`;
  if (searchText) url += `&search=${searchText}`;
  return url;
}
export function getSegmentUrl(segmentId?: string) {
  return `v1/dynamic-push/segment/${segmentId || ''}`;
}
export function getNotificationUrl(notificationId: string) {
  return `v1/dynamic-push/notifications/${notificationId || ''}`;
}

export function getListSiteNametUrl(searchText = '') {
  return `v1/dynamic-push/site-name/query?search=${searchText}`;
}

// Articles - v1
export function getSearchSitenameUrl(searchText: string) {
  return `v1/dynamic-push/site-name/query?search=${searchText}`;
}
export function getSearchSecurityCodeUrl(searchText: string) {
  return `v1/securities/query?search=${searchText}`;
}
export function getUploadUrl() {
  return 'v1/file/upload';
}
export function getArticlesUrl(articlesId = '') {
  return `v1/articles${articlesId ? '/' + articlesId : ''}`;
}

// Report - v1
export const getListReportUrl = ({
  page = 1,
  rowsPerPage = +process.env.REACT_APP_DEFAULT_PAGE_SIZE,
  searchText = '',
  sort,
}: {
  page: number;
  rowsPerPage: number;
  searchText: string | null;
  sort: ISortConfig | null;
}) => {
  let url = `/v1/reports?page_id=${page}&page_size=${rowsPerPage}`;
  if (searchText) url += `&search=${searchText}`;
  if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  if (sort?.sortType) url += `&sort_type=${sort.sortType}`;
  return url;
};

export const getReportUrl = (path = '') => {
  return `/v1/reports${path ? '/' + path : ''}`;
};

// Profolio - v1
export const getPPIndicatorUpdateUrl = () => {
  return `/v1/config/portfolio-performance-indicator`;
};
export const getPPIndicatorUrl = (sitename: string) => {
  return `/v1/config/portfolio-performance-indicator?site_name=${sitename}`;
};

// Auth - v2

export const getAuthUrlV2 = () => {
  return '/v2/auth';
};

export const getRefreshUrlV2 = () => {
  return '/v2/auth/refresh';
};

export const getLogoutUrlV2 = () => {
  return '/v2/auth/logout';
};

// Access Management

export function getAccessManagementSearchUrl({
  page = 1,
  rowsPerPage = +process.env.REACT_APP_DEFAULT_PAGE_SIZE,
  searchText = '',
  sort,
}: {
  page: number;
  rowsPerPage: number;
  searchText: string | null;
  sort: ISortConfig | null;
}) {
  let url = `v1/access-management?page_id=${page}&page_size=${rowsPerPage}`;
  if (searchText) url += `&search=${searchText}`;
  if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  if (sort?.sortType) url += `&sort_type=${sort.sortType}`;
  return url;
}

export function getAccessManagementUrl() {
  return 'v1/access-management';
}

export function getSearchAppNameUrl(searchText = '') {
  return `v1/search/app-name?search=${searchText}`;
}

// Audit Trail
export const getAuditTrailUrl = ({ page = 1, rowsPerPage = +process.env.REACT_APP_DEFAULT_PAGE_SIZE }) => {
  return `/v1/search/user?page_id=${page}&page_size=${rowsPerPage}`;
};
