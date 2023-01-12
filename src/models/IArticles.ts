export type ICreateArticlesBody = {
  subject: string;
  content: string;
  image: string;
  attachment_url?: string;
  attachment_name?: string;
  site_name: string[];
  securities: string[];
  security_type: string;
};
