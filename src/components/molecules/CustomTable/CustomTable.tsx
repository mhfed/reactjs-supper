import React from 'react';
import MUIDataTable, { debounceSearchRender, MUIDataTableColumnDef, MUIDataTableState } from 'mui-datatables';
import makeStyles from '@mui/styles/makeStyles';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { getFilterObj, GridConfig } from 'helpers';
import { Trans, useTranslation } from 'react-i18next';
import CustomFooter from './CustomFooter';
import { IColumn, ResponseDataPaging, ITableData } from 'models/ICommon';
import { TABLE_ACTION, COLUMN_TYPE, DATA_DEFAULT } from './TableConstants';
import clsx from 'clsx';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: theme.palette.primary.light,
    minHeight: 0,
    '& .MuiToolbar-root': {
      background: theme.palette.background.paper,
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
      background: theme.palette.background.paper,
    },
    '& .MuiTableCell-footer': {
      background: theme.palette.background.paper,
      border: 'none',
    },
    '& .MuiTableCell-root': {
      padding: theme.spacing(1),
      border: 'none',
    },
    '& .MuiTableCell-head': {
      borderRadius: 8,
      overflow: 'hidden',
      background: theme.palette.background.default,
      borderRight: '2px solid transparent',
      '& button': {
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
      },
    },
    '& .MuiTableRow-root': {
      '&:nth-child(odd)': {
        background: theme.palette.primary.dark,
      },
      '&:nth-child(even)': {
        background: theme.palette.primary.light,
      },
    },
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  warning: {
    background: theme.palette.warning.light,
    color: theme.palette.warning.main,
  },
  error: {
    background: theme.palette.error.light,
    color: theme.palette.error.main,
  },
  success: {
    background: theme.palette.success.light,
    color: theme.palette.success.main,
  },
}));

type TableHandle = {
  setEditMode: (state: boolean) => void;
  setData: (data: ResponseDataPaging) => void;
  getPaginate: any;
  getQuery: any;
};

type TableProps = {
  onTableChange: (state: any, config: object) => void;
  onRowDbClick: (index: number) => void;
  columns: MUIDataTableColumnDef[];
  rowsPerPageOptions?: number[];
  data?: ITableData;
  editable?: boolean;
};

const Table: React.ForwardRefRenderFunction<TableHandle, TableProps> = (props, ref) => {
  const classes = useStyles();
  const { columns = [], onTableChange, onRowDbClick = null, rowsPerPageOptions = [10, 25, 100], editable = false } = props;
  const [data, setData] = React.useState<ITableData>(props.data || DATA_DEFAULT);
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
    return columns.reduce((acc: MUIDataTableColumnDef[], cur: IColumn) => {
      if (isEditMode) {
        acc.push(cur);
        return acc;
      } else {
        const columnConvert = convertColumn(cur, isEditMode, t, classes);
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
          customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
            return (
              <CustomFooter
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                changeRowsPerPage={changeRowsPerPage}
                changePage={changePage}
              />
            );
          },
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

function convertColumn(column: IColumn, isEditMode?: boolean, translate?: any, classes?: any): MUIDataTableColumnDef {
  const res: MUIDataTableColumnDef = {
    name: column.name,
    label: translate ? translate(column.label) : column.label,
    options: {},
  };
  switch (column.type) {
    case COLUMN_TYPE.DROPDOWN_WITH_BG:
      res.options = {
        customBodyRender: (value) => {
          const option = column.dataOptions?.find((e) => e.value === value);
          return (
            <Chip className={clsx(classes[option?.color || ''], classes.uppercase)} label={<Trans>{option?.label}</Trans>} />
          );
        },
      };
      break;
    case COLUMN_TYPE.DROPDOWN:
      res.options = {
        customBodyRender: (value) => {
          const option = column.dataOptions?.find((e) => e.value === value);
          return (
            <Typography component="span" noWrap>
              <Trans>{option?.label}</Trans>
            </Typography>
          );
        },
      };
      break;
    case COLUMN_TYPE.DATETIME:
      res.options = {
        customBodyRender: (value) => {
          const displayValue = moment(value).format('DD/MMM/YYYY HH:mm:ss');
          return (
            <Typography component="span" noWrap>
              <Trans>{displayValue}</Trans>
            </Typography>
          );
        },
      };
      break;
    case COLUMN_TYPE.ACTION:
      res.options = {
        customBodyRender: (value) => {
          return '';
        },
      };
      break;
    default:
      res.options = {
        customBodyRender: (value) => {
          return (
            <Typography component="span" noWrap>
              {[null, undefined].includes(value) ? process.env.REACT_APP_DEFAULT_VALUE : value}
            </Typography>
          );
        },
      };
      break;
  }
  return res;
}
