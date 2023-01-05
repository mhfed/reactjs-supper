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

// User - v1
export const getSearchUserUrl = ({ pageId = 1, pageSize = process.env.REACT_APP_DEFAULT_PAGE_SIZE }) => {
  return `/v1/search/user?page_id=${pageId}&page_size=${pageSize}`;
};
export function getResetUserPasswordUrl() {
  return '/v1/auth/send-verify-username';
}
export function getUserDetailByIdUrl(userId: string) {
  return `/v1/user/${userId}`;
}
export function getUserDetailByEmailUrl(email: string) {
  return `/v1/user/user-details?user_login_id=${email}`;
}
export function getUserDetailUrl(userId?: string) {
  return `/v1/user/user-details/${userId || ''}`;
}
export function getUserDetailByUserIdUrl(userId: string) {
  return `/v1/user/user-details/${userId}`;
}
export function postCreateSegment() {
  return '/v1/dynamic-push/segment/create';
}
export function getUserGroupUrl(roleGroupId: string) {
  return `/v1/user/role-group/${roleGroupId}`;
}

// Notification - v1
export const getListNotificationUrl = ({
  pageId = 1,
  pageSize = process.env.REACT_APP_DEFAULT_PAGE_SIZE,
  searchText = '',
  sort,
}: {
  pageId: number;
  pageSize: number;
  searchText: string | null;
  sort: ISortConfig | null;
}) => {
  let url = `/v1/dynamic-push/notifications/query?page_id=${pageId}&page_size=${pageSize}`;
  if (searchText) url += `&search=${searchText}`;
  if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  if (sort?.sortType) url += `&sort_type=${sort.sortType}`;
  return url;
};
export function getListSegmentUrl({
  pageId = 1,
  pageSize = process.env.REACT_APP_DEFAULT_PAGE_SIZE,
  searchText = '',
  sort,
}: {
  pageId: number;
  pageSize: number;
  searchText: string | null;
  sort: ISortConfig | null;
}) {
  let url = `v1/dynamic-push/segment/query?page_id=${pageId}&page_size=${pageSize}`;
  if (searchText) url += `&search=${searchText}`;
  if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  if (sort?.sortType) url += `&sort_type=${sort.sortType}`;
  return url;
}
export function getListSubscribertUrl({
  pageId = 1,
  pageSize = process.env.REACT_APP_DEFAULT_PAGE_SIZE,
  searchText = '',
  sort,
}: {
  pageId: number;
  pageSize: number;
  searchText: string | null;
  sort: ISortConfig | null;
}) {
  let url = `v1/subscriber/subscribers/query?page_id=${pageId}&page_size=${pageSize}`;
  if (searchText) url += `&search=${searchText}`;
  if (sort?.sortField) url += `&sort_field=${sort.sortField}`;
  if (sort?.sortType) url += `&sort_type=${sort.sortType}`;
  return url;
}
export function getListSubscriberSegmenttUrl({
  pageId = 1,
  pageSize = 50,
  searchText = '',
}: {
  pageId: number;
  pageSize: number;
  searchText: string | null;
}) {
  let url = `v1/subscriber/subscribers/query?page_id=${pageId}&page_size=${pageSize}`;
  if (searchText) url += `&search=${searchText}`;
  return url;
}
export function getSegmentUrl(segmentId?: string) {
  return `v1/dynamic-push/segment/${segmentId || ''}`;
}
export function getNotificationUrl(notificationId: string) {
  return `v1/dynamic-push/notifications/${notificationId || ''}`;
}
