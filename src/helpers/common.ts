/*
 * Created on Tue Jan 31 2023
 *
 * Functions use common
 *
 * Copyright (c) 2023 - Novus Fintech
 */
import React from 'react';
import { IArticlesDataManagement, IArticlesFormData } from 'models/IArticles';
import { IFileUpload } from 'models/ICommon';
import { SITENAME } from 'features/Articles/ArticlesConstants';

/**
 * clear all local storage but keep theme
 */
export const clearStorage = () => {
  const lastTheme = window.localStorage.getItem('lastTheme');
  window.localStorage.clear();
  window.localStorage.setItem('lastTheme', lastTheme + '');
};

/**
 * Check if sitename is all sites
 * @param data sitename data from backend
 * @returns if site name only contain all sites
 */
const checkSiteName = (data?: string[]) => {
  return data?.length === 1 && data[0] === SITENAME.ALL_SITES;
};

/**
 * Convert articles data to readable formik form
 * @param data articles data from backend
 * @returns converted data suitable with form data
 */
export const convertArticlesDataToDetailForm = (data: IArticlesDataManagement) => {
  return {
    article_id: data.article_id,
    file: {
      name: data.attachment_name,
      url: data.attachment_url,
    },
    content: data.content,
    image: {
      url: data.image,
    },
    securities: data?.securities?.map((e: string) => ({ securities: e })),
    security_type: data.security_type,
    site_name: typeof data.site_name === 'string' || checkSiteName(data.site_name) ? SITENAME.ALL_SITES : SITENAME.CUSTOM,
    sitename_custom:
      data.site_name?.length && !checkSiteName(data.site_name) ? data.site_name.map((e: string) => ({ site_name: e })) : [],
    subject: data.subject,
  };
};

/**
 * Compare two string array
 * @param arr1 array need compare
 * @param arr2 array need compare
 * @returns true if same array
 */
export const compareArray = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return true;
  for (let index = 0; index < arr1.length; index++) {
    const element = arr1[index];
    if (!arr2.includes(element)) return true;
  }
  return false;
};

/**
 * Check articles edited
 * @param oldData old articles data before edit
 * @param newData articles data after edit
 * @returns true if diff
 */
export const checkDiffArticlesEdit = (oldData: IArticlesFormData, newData: IArticlesFormData) => {
  if (oldData.subject !== newData.subject) return true;
  if (oldData.content !== newData.content) return true;
  if (oldData.security_type !== newData.security_type) return true;
  if ((typeof oldData.site_name === 'string' || typeof newData.site_name === 'string') && oldData.site_name !== newData.site_name)
    return true;
  if (
    oldData.site_name === SITENAME.CUSTOM &&
    newData.site_name === SITENAME.CUSTOM &&
    oldData.sitename_custom &&
    newData.sitename_custom &&
    compareArray(oldData.sitename_custom, newData.sitename_custom)
  ) {
    return true;
  }
  if (
    compareArray(
      (oldData.securities || []).map((e) => e.securities),
      (newData.securities || []).map((e) => e.securities),
    )
  ) {
    return true;
  }
  if (oldData.file?.name !== newData.file?.name) return true;
  if (oldData.image?.name !== newData.image?.name) return true;
  return false;
};

/**
 * Hide tooltip
 */
export const hideTooltip = () => {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) {
    tooltip.style.opacity = '0';
  }
};

/**
 * Check file is real url or blob file
 * @param file File need check
 * @returns true if local blob file
 */
export const isBlobFile = (file: IFileUpload) => {
  return file?.url?.includes('blob:http');
};

/**
 * Retry download chunk load error module
 * @param fn import lazy function
 * @param retriesLeft count max to retry
 * @param interval interval time
 * @returns a promise
 */
const retry = (fn: Function, retriesLeft = 5, interval = 1000) => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error: Error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }
          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};

/**
 * Custom lazy load module
 * @param fn import function
 * @returns a promise until import success
 */
// @ts-ignore
export const lazyLoad = (fn: Function) => React.lazy(() => retry(fn));
