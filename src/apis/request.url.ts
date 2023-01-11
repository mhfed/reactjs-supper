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
export function getSearchSegment(query?: string) {
  return `/v1/dynamic-push/segment/query${query}`;
}
export function postDirectSend() {
  return '/v1/dynamic-push/direct/send';
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
export function postLogin() {
  return `https://iress-wealth-dev-api.equix.app/mobile/login`;
}

export function getReports() {
  return `/v1/reports`;
}

// Notification - v1
export const getListNotificationUrl = ({
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
  let url = `/v1/dynamic-push/notifications/query?page_id=${page}&page_size=${rowsPerPage}`;
  if (searchText) url += `&search=${searchText}`;
  if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  if (sort?.sortType) url += `&sort_type=${sort.sortType}`;
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
export function getArticlesListUrl({
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
  let url = `v1/articles/query?page_id=${page}&page_size=${rowsPerPage}`;
  if (searchText) url += `&search=${searchText}`;
  // if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  // if (sort?.sortType) url += `&sort_type=${sort.sortType}`;
  return url;
}
export function getListSubscriberSegmenttUrl({
  page = 1,
  rowsPerPage = 50,
  searchText = '',
}: {
  page: number;
  rowsPerPage: number;
  searchText: string | null;
}) {
  let url = `v1/subscriber/subscribers/query?page_id=${page}&page_size=${rowsPerPage}`;
  if (searchText) url += `&search=${searchText}`;
  return url;
}
export function getSegmentUrl(segmentId?: string) {
  return `v1/dynamic-push/segment/${segmentId || ''}`;
}
export function getArticlesUrl(articlesId?: string) {
  return `v1//articles/${articlesId || ''}`;
}
export function getNotificationUrl(notificationId: string) {
  return `v1/dynamic-push/notifications/${notificationId || ''}`;
}
export function getSearchSitenameUrl(searchText: string) {
  return `v1/dynamic-push/site-name/query?search=${searchText}`;
}
