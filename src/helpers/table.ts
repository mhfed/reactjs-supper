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
    curColumn.map((c: any) => {
      const column = dicColumn[c.name];
      const formatter = column?.formatter;
      const rawValue = rawData[index][c.name] || ` ${process.env.REACT_APP_DEFAULT_VALUE}`;
      let value = rawValue;
      if (formatter && typeof formatter === 'function') {
        value = formatter(rawData[index]);
      } else {
        switch (column.type) {
          case COLUMN_TYPE.DATETIME:
            value =
              rawValue && moment(rawValue).isValid()
                ? moment(rawValue).format('DD/MM/YY HH:mm:ss')
                : ` ${process.env.REACT_APP_DEFAULT_VALUE}`;
            break;
          case COLUMN_TYPE.DROPDOWN:
          case COLUMN_TYPE.DROPDOWN_WITH_BG:
            const option = column.dataOptions.find((e: any) => e.value === rawValue);
            value = option?.label ? translate(option.label) : ` ${process.env.REACT_APP_DEFAULT_VALUE}`;
            break;
          case COLUMN_TYPE.MULTIPLE_TAG:
            value = rawData.replace(/,/g, ';');
            break;
          default:
            break;
        }
      }
      obj.data.push(value);
    });
    return obj;
  });
  return res;
}

export { getFilterObj, formatDataBeforeExportCsv };
