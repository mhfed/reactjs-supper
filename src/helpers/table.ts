/*
 * Created on Fri Jan 06 2023
 *
 * Custom table helper functions
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { MUIDataTableState, MUIDataTableColumn } from 'mui-datatables';
import { IGridConfig } from 'models/ICommon';
import { COLUMN_TYPE } from 'components/molecules/CustomTable';
import moment from 'moment-timezone';

/**
 * Get sort and filter state of table
 * @param tableState table current state
 * @returns object contain sort or filter state of table
 */
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

/**
 * Format data to export to csv file with correct format each column
 * @param curColumn current table columns
 * @param rawColumns original columns
 * @param curData current table data
 * @param rawData original table data
 * @param translate translate function
 * @returns list data formatted
 */
function formatDataBeforeExportCsv(curColumn: any, rawColumns: any, curData: any, rawData: any, translate: any) {
  const dicColumn = rawColumns.reduce((acc: any, cur: MUIDataTableColumn) => {
    acc[cur.name] = cur;
    return acc;
  }, {});
  const res = curData.map((e: any) => {
    const index = e.index;
    const obj: any = {
      index: e.index,
      data: [],
    };
    (curColumn || []).forEach((c: any) => {
      const column = dicColumn[c.name];
      const formatter = column?.formatter;
      let value = rawData[index][c.name] ?? process.env.REACT_APP_DEFAULT_VALUE;
      if (formatter && typeof formatter === 'function') {
        value = formatter(rawData[index]);
      }
      switch (column.type) {
        case COLUMN_TYPE.DATETIME:
          value =
            value && moment(value).isValid()
              ? moment(value).local().format('DD/MM/YYYY HH:mm:ss')
              : process.env.REACT_APP_DEFAULT_VALUE;
          break;
        case COLUMN_TYPE.DROPDOWN:
        case COLUMN_TYPE.DROPDOWN_WITH_BG:
          const option = column.dataOptions.find((e: any) => e.value === value);
          value = option?.label ? translate(option.label) : process.env.REACT_APP_DEFAULT_VALUE;
          break;
        case COLUMN_TYPE.MULTIPLE_TAG:
        case COLUMN_TYPE.BREAK_LINE:
          value = value.join('; ');
          break;
        default:
          break;
      }
      if (column.type !== COLUMN_TYPE.ACTION) obj.data.push(value);
    });
    return obj;
  });
  return res;
}

export { getFilterObj, formatDataBeforeExportCsv };
