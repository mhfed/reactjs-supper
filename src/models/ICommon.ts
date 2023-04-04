/*
 * Created on Fri Jan 06 2023
 *
 * Common type and interface
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { MUIDataTableState } from 'mui-datatables';

export type HeadCell = {
  id: string;
  label: string;
};

export type IOrder = 'asc' | 'desc';

export type IPagination = {
  perPage: number;
  totalPage: number;
  pageIndex: number;
  order: IOrder;
  orderBy: string;
  handleRequestSort: (property: string) => () => void;
  changePage: (value: number) => void;
  changePerPage: (value: number) => void;
};

export type LooseObject = {
  [key: string]: any;
};

export type DropdownOption = {
  label: string;
  value: string | number;
  color?: 'semantic';
};

export type IKebabItem = {
  onClick: (data: any) => void;
  label: string;
};

export type IColumn = {
  name: string;
  label: string;
  type?: string;
  dataOptions?: DropdownOption[];
  dataOptionsHeader?: DropdownOption[];
  actions?: IKebabItem[];
  formatter?: (data: any) => string;
  getActions?: (data: any) => any;
  minWidth?: number;
  textTransform?: string;
  sort?: boolean;
};

export type ISortConfig = {
  sortField: string;
  sortType: string;
};

export type IGridConfig = {
  sort: ISortConfig | null;
};

export type ITableConfig = MUIDataTableState & IGridConfig;

export type ResponseDataPaging = {
  current_page: number;
  total_count: number;
  total_pages: number;
  data: LooseObject[];
};

export type ITableData = {
  data: object[];
  isLoading: boolean;
  page: number;
  count: number;
  rowsPerPage: number;
};

export type IHistory = {
  push(url: string): void;
  replace(url: string): void;
};

export type ILoginValues = {
  site_name: string;
};

export type IChangePassValues = {
  password: string;
  re_password: string;
};

export type IModalProps = {
  title?: string;
  component?: any;
  props: LooseObject;
  fullScreen?: boolean;
  showBtnClose?: boolean;
  styleModal?: React.CSSProperties;
};

export type IFileUpload = {
  file?: File;
  url?: string;
  name?: string;
  size?: number;
  extension?: string;
};
