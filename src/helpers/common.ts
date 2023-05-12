/*
 * Created on Tue Jan 31 2023
 *
 * Functions use common
 *
 * Copyright (c) 2023 - Novus Fintech
 */
import { lazy } from 'react';
import { IArticlesDataManagement, IArticlesFormData } from 'models/IArticles';
import { IFileUpload } from 'models/ICommon';
import { APPNAME } from 'features/Articles/ArticlesConstants';

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
  return data?.length === 1 && data[0] === APPNAME.ALL_APPS;
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
    app: typeof data.app === 'string' || checkSiteName(data.site_name) ? APPNAME.ALL_APPS : APPNAME.CUSTOM,
    appname_custom: data.app?.length && !checkSiteName(data.app) ? data.app : [],
    title: data.title,
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
  if (oldData.title !== newData.title) return true;
  if (oldData.content !== newData.content) return true;
  if (oldData.security_type !== newData.security_type) return true;
  if ((typeof oldData.site_name === 'string' || typeof newData.site_name === 'string') && oldData.site_name !== newData.site_name)
    return true;
  if (
    oldData.app === APPNAME.CUSTOM &&
    newData.app === APPNAME.CUSTOM &&
    oldData.appname_custom &&
    newData.appname_custom &&
    compareArray(oldData.appname_custom, newData.appname_custom)
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
 * Custom lazy load with retry and reload when error set timer
 * @param componentImport import function
 * @returns
 */
export const lazyWithRetry = (componentImport: any) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(window.localStorage.getItem('page-has-been-force-refreshed') || 'false');

    try {
      const component = await componentImport();

      window.localStorage.setItem('page-has-been-force-refreshed', 'false');

      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assuming that the user is not on the latest version of the application.
        // Let's refresh the page immediately.
        window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }

      // The page has already been reloaded
      // Assuming that user is already using the latest version of the application.
      // Let's let the application crash and raise the error.
      throw error;
    }
  });

function isValidUrl(url: string) {
  const pattern = /^https?:\/\/[a-z0-9]+(?:[-.][a-z0-9]+)*(?::[0-9]{1,5})?(?:\/[^/\r\n]+)*\.[a-z]{2,5}(?:[?#]\S*)?$/;
  return !!pattern.test(url);
}

/**
 *
 * @param url is sitename user enter to login
 * @returns url valid or invalid
 */
export const checkExistURL = async (url: string) => {
  try {
    const myURL = new URL(url);
    if (!['https:', 'http:'].includes(myURL.protocol)) return false;
    if (!isValidUrl(url)) return false;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Check token is expired or not when user do any action
 * @param timeBeginLogin time when login success
 * @param timeTokenExpired time when token expired
 * @returns time token remaining
 */
export function checkTimeExpired(timeBeginLogin: number, timeTokenExpired: number) {
  if (!timeBeginLogin || !timeTokenExpired) return 0;

  const timeTokenRemaining = timeBeginLogin + timeTokenExpired - Date.now();
  if (timeTokenRemaining < 0) return 0;
  return timeTokenRemaining;
}

/**
 * Get inner text from html string
 * @param s html string
 * @returns inner text
 */
export function extractContent(s: string) {
  var span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
}
