// Auth - v1

export const getSessionUrl = (sessionId: string | number) => {
  return `/v1/auth/session?session_id=${sessionId}`;
};
export const getAuthUrl = () => {
  return `/v1/auth`;
};
export const getDecodeUrl = () => {
  return `/v1/auth/decode`;
};
export const getRefreshUrl = () => {
  return `/v1/auth/refresh`;
};
export const getPinUrl = () => {
  return `/v1/auth/pin`;
};
export function getCreatePasswordUrl() {
  return `v1/auth/create-password`;
}

// User - v1
export function getSearchUserUrl(pageId = 1, pageSize = 50) {
  return `v1/search/user?page_id=${pageId}&page_size=${pageSize}`;
}
