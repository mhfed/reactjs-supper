/*
 * Created on Fri Jan 06 2023
 *
 * Custom table helper functions
 *
 * Copyright (c) 2023 - Novus Fintech
 */

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
