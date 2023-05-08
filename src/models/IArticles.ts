export type ICreateArticlesBody = {
  title: string;
  content: string;
  image?: string;
  attachment_url?: string;
  attachment_name?: string;
  bundle_id?: string[];
  securities?: string[];
  security_type: string;
  article_type: string;
  notification_enabled: boolean;
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
  appname_custom?: string[];
  title?: string;
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
  appname_custom?: string[];
  title?: string;
  [key: string]: any;
};
