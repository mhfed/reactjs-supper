import { MUIDataTableState } from 'mui-datatables';
import { IGridConfig } from 'models/ICommon';

function getFilterObj(tableState: MUIDataTableState): IGridConfig {
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
