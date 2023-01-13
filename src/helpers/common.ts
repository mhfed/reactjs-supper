import { IArticlesDataManagement, IArticlesFormData } from 'models/IArticles';
import { SITENAME } from 'features/Articles/ArticlesConstants';

export const clearStorage = () => {
  const lastTheme = window.localStorage.getItem('lastTheme');
  window.localStorage.clear();
  window.localStorage.setItem('lastTheme', lastTheme + '');
};

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
    site_name: typeof data.site_name === 'string' ? data.site_name : SITENAME.CUSTOM,
    sitename_custom: data.site_name?.length ? data.site_name.map((e: string) => ({ site_name: e })) : [],
    subject: data.subject,
  };
};

export const compareArray = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return true;
  for (let index = 0; index < arr1.length; index++) {
    const element = arr1[index];
    if (!arr2.includes(element)) return true;
  }
  return false;
};

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
