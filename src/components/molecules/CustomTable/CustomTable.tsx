import React from 'react';
import MUIDataTable, { debounceSearchRender, MUIDataTableColumnDef, MUIDataTableState } from 'mui-datatables';
import makeStyles from '@mui/styles/makeStyles';
// import { ExportCSV } from 'assets/icons/';
import { getFilterObj, GridConfig } from 'helpers';
import { Trans, useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    minHeight: 0,
    '& .MuiToolbar-root': {
      background: theme.palette.primary.light,
      padding: 0,
    },
    '& > div:first-child': {
      background: 'transparent',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      boxShadow: 'none',
      '& > div:nth-child(3)': {
        boxShadow: theme.shadows[1],
      },
    },
    '& .MuiTablePagination-root': {
      background: theme.palette.primary.light,
    },
    '& .MuiTableCell-footer': {
      background: theme.palette.primary.light,
      border: 'none',
    },
    '& .MuiTableCell-root': {
      padding: theme.spacing(1),
      border: 'none',
    },
    '& .MuiTableCell-head': {
      borderRadius: 8,
      background: theme.palette.background.default,
      borderRight: `2px solid ${theme.palette.primary.light}`,
      '& button': {
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
      },
    },
    '& .MuiTableRow-root': {
      '&:nth-child(odd)': {
        background: theme.palette.primary.light,
      },
      '&:nth-child(even)': {
        background: theme.palette.primary.dark,
      },
    },
  },
}));

export const TABLE_ACTION = {
  SORT: 'sort',
  FILTER_CHANGE: 'filterChange',
  PAGE_CHANGE: 'changePage',
  SEARCH: 'search',
  SEARCH_CLOSE: 'onSearchClose',
  PAGE_SIZE_CHANGE: 'changeRowsPerPage',
};

export const COLUMN_TYPE = {
  DROPDOWN: 'dropdown',
};

export type TableData = {
  data: object[];
  page: number;
  count: number;
  rowsPerPage: number;
};

type TableHandle = {
  setEditMode: (state: boolean) => void;
  setData: (data: ResponseDataPaging) => void;
  getPaginate: any;
  getQuery: any;
};

export type ResponseDataPaging = {
  current_page: number;
  total_count: number;
  total_pages: number;
  data: object[];
};

const DATA_DEFAULT = {
  data: [],
  page: 1,
  count: 0,
  rowsPerPage: 25,
};

type TableProps = {
  onTableChange: (state: any, config: object) => void;
  onRowDbClick: (index: number) => void;
  columns: MUIDataTableColumnDef[];
  rowsPerPageOptions?: number[];
  data?: TableData;
};

const Table: React.ForwardRefRenderFunction<TableHandle, TableProps> = (props, ref) => {
  const classes = useStyles();
  const { columns = [], onTableChange, onRowDbClick = null, rowsPerPageOptions = [10, 25, 100] } = props;
  const [data, setData] = React.useState<TableData>(props.data || DATA_DEFAULT);
  const [isEditMode, setEditMode] = React.useState(false);
  const timeoutId = React.useRef<number | null>(null);
  const config = React.useRef<(MUIDataTableState & GridConfig) | null>(null);
  const { t } = useTranslation();

  const getPaginate = () => {
    return {
      page: data.page - 1,
      rowsPerPage: data.rowsPerPage,
    };
  };

  const getQuery = () => {
    const query: any = { query: { bool: { must: [] } }, sort: [] };
    if (config.current?.searchText) query.query.bool.must.push({ query_string: { query: `*${config.current.searchText}*` } });
    if (config.current?.sort) {
      const { sortField, sortType } = config.current.sort || {};
      query.sort = [{ [sortField]: { order: sortType.toLowerCase() } }];
    }
    return query;
  };

  const setDataTable = (response: ResponseDataPaging) => {
    setData((old) => ({
      data: response.data || [],
      page: response.current_page,
      count: response.total_count,
      rowsPerPage: old.rowsPerPage,
    }));
  };

  React.useImperativeHandle(
    ref,
    () => ({
      setEditMode: setEditMode,
      setData: setDataTable,
      getPaginate: getPaginate,
      getQuery: getQuery,
    }),
    [],
  );

  const _onTableChange = (action: string, tableState: MUIDataTableState) => {
    if (['propsUpdate', 'onFilterDialogOpen', 'onFilterDialogClose'].includes(action)) return;
    timeoutId.current && window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      const filterObj = getFilterObj(tableState);
      config.current = { ...tableState, ...filterObj };
      switch (action) {
        case TABLE_ACTION.SEARCH:
        case TABLE_ACTION.SORT:
          onTableChange({ ...config.current, page: 0 }, filterObj);
          break;
        case TABLE_ACTION.PAGE_SIZE_CHANGE:
        case TABLE_ACTION.PAGE_CHANGE:
          onTableChange(config.current, filterObj);
          break;
        case TABLE_ACTION.SEARCH_CLOSE:
          if (!tableState.searchText) return;
          onTableChange(config.current, filterObj);
          break;
        default:
          break;
      }
    }, 500);
  };

  const listColumn: MUIDataTableColumnDef[] = React.useMemo(() => {
    return columns.reduce((acc: MUIDataTableColumnDef[], cur: ColumnSchema) => {
      if (isEditMode) {
        acc.push(cur);
        return acc;
      } else {
        const columnConvert = convertColumn(cur, isEditMode, t);
        acc.push(columnConvert);
        return acc;
      }
    }, []);
  }, [columns, isEditMode]);

  return (
    <div className={classes.container}>
      <MUIDataTable
        title=""
        data={data.data}
        columns={listColumn}
        components={{}}
        options={{
          serverSide: true,
          pagination: true,
          setRowProps: (row, dataIndex) => ({
            onDoubleClick: () => {
              onRowDbClick?.(dataIndex);
            },
          }),
          customSearchRender: debounceSearchRender(500),
          onTableChange: _onTableChange,
          filter: false,
          count: data.count,
          page: data.page,
          rowsPerPageOptions,
          rowsPerPage: data.rowsPerPage,
          filterType: 'textField',
          fixedHeader: false,
          draggableColumns: {
            enabled: true,
          },
          selectableRows: 'single',
          selectableRowsOnClick: false,
          selectableRowsHideCheckboxes: true,
          responsive: 'standard',
        }}
      />
    </div>
  );
};

export default React.forwardRef(Table);

type Option = {
  label: string;
  value: string | number;
};
export type ColumnSchema = {
  name: string;
  label: string;
  type?: string;
  dataOptions?: Option[];
};

function convertColumn(column: ColumnSchema, isEditMode?: boolean, translate?: any): MUIDataTableColumnDef {
  const res: MUIDataTableColumnDef = {
    name: column.name,
    label: translate ? translate(column.label) : column.label,
  };
  switch (column.type) {
    case COLUMN_TYPE.DROPDOWN:
    default:
      break;
  }
  return res;
}
