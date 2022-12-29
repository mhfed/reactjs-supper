import { MUIDataTableState } from 'mui-datatables';

type SortConfig = {
  sortField: string;
  sortType: string;
};
export type GridConfig = {
  sort: SortConfig | null;
};
function getFilterObj(tableState: MUIDataTableState): GridConfig {
  const sortObj = {
    sortField: tableState.sortOrder?.name,
    sortType: tableState.sortOrder?.direction?.toUpperCase(),
  };
  const res = {
    sort: Object.keys(tableState.sortOrder).length ? sortObj : null,
  };
  return res;
}

export { getFilterObj };
