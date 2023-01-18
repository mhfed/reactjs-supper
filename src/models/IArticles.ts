import { IFileUpload, LooseObject } from './ICommon';

export type ICreateArticlesBody = {
  subject: string;
  content: string;
  image?: string;
  attachment_url?: string;
  attachment_name?: string;
  site_name: string[];
  securities: string[];
  security_type: string;
};

export type IArticlesDataManagement = {
  actor?: string;
  article_id?: string;
  attachment_name?: string;
  attachment_url?: string;
  content?: string;
  created_date?: number;
  image?: string;
  last_updated?: number;
  number_of_views?: number;
  securities?: string[];
  security_type?: string;
  site_name?: string[];
  sitename_custom?: string[];
  subject?: string;
  [key: string]: any;
};

export type IArticlesFormData = {
  article_id?: string;
  file?: {
    name?: string;
    url?: string;
    extension?: string;
    file?: File;
  };
  image?: {
    name?: string;
    url?: string;
    extension?: string;
    file?: File;
  };
  content?: string;
  securities?: { securities: string }[];
  security_type?: string;
  site_name?: string;
  sitename_custom?: string[];
  subject?: string;
  [key: string]: any;
};
