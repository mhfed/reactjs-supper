import { IFileUpload, LooseObject } from './ICommon';

export type ICreateArticlesFormValues = {
  subject: string;
  content: string;
  image: IFileUpload;
  file?: IFileUpload;
  site_name: LooseObject[];
  securities: LooseObject[];
  security_type: string;
};

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
