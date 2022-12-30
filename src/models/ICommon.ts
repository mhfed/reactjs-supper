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

export type IColumn = {
  name: string;
  label: string;
  type?: string;
  dataOptions?: DropdownOption[];
};

type SortConfig = {
  sortField: string;
  sortType: string;
};

export type IGridConfig = {
  sort: SortConfig | null;
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
  page: number;
  count: number;
  rowsPerPage: number;
};

export type IHistory = {
  push(url: string): void;
  replace(url: string): void;
};

export const IValidator = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
};

export type ILoginValues = {
  email: string;
  password: string;
};

export type IChangePassValues = {
  password: string;
  re_password: string;
};
