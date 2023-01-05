import React from 'react';
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableState, MUIDataTableMeta } from 'mui-datatables';
import makeStyles from '@mui/styles/makeStyles';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { getFilterObj } from 'helpers';
import { Trans, useTranslation } from 'react-i18next';
import CustomFooter from './CustomFooter';
import CustomSearch from './CustomSearch';
import { IColumn, ResponseDataPaging, ITableData, ITableConfig, LooseObject } from 'models/ICommon';
import { TABLE_ACTION, COLUMN_TYPE, DATA_DEFAULT, ACTIONS } from './TableConstants';
import clsx from 'clsx';
import moment from 'moment';
import Kebab from 'components/atoms/Kebab';
import DropdownCell from './DropdownCell';
import CustomStack from './CustomStack';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: theme.palette.background.paper,
    minHeight: 0,
    '& .MuiSelect-select': {
      padding: theme.spacing(0.5, 4, 0.5, 1.5),
    },
    '& .MuiToolbar-root': {
      background: theme.palette.background.paper,
      padding: 0,
      justifyContent: 'flex-end',
      '& > div:last-child': {
        flex: 'initial',
      },
    },
    '& > div:first-child': {
      borderRadius: 8,
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      boxShadow: 'none',
      '& > div:nth-child(3)': {
        background: theme.palette.background.other1,
        borderRadius: 8,
        boxShadow: theme.shadows[1],
        flex: 1,
        overflowY: 'hidden',
      },
    },
    '& .MuiTableCell-footer': {
      background: theme.palette.background.paper,
      border: 'none',
    },
    '& .MuiTableCell-root': {
      padding: theme.spacing(1),
      border: 'none',
      '&:not(.MuiTableCell-footer)': {
        maxWidth: 600,
      },
      $uppercase: {
        textTransform: 'uppercase',
      },
      '& .warning': {
        '&.bg': {
          background: theme.palette.hover.warning,
        },
        color: theme.palette.warning.main,
      },
      '& .error': {
        '&.bg': {
          background: theme.palette.hover.error,
        },
        color: theme.palette.error.main,
      },
      '& .success': {
        '&.bg': {
          background: theme.palette.hover.success,
        },
        color: theme.palette.success.main,
      },
    },
    '& .MuiTableCell-head': {
      borderRadius: 8,
      overflow: 'hidden',
      background: theme.palette.background.default,
      borderRight: '2px solid transparent',
      '& *': {
        textTransform: 'uppercase !important',
      },
      '& button': {
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
      },
      '&:nth-last-child(2)': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        border: 'none',
      },
      '&:last-child': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        border: 'none',
      },
    },
    '& .MuiTableRow-root': {
      '&:nth-child(odd)': {
        background: theme.palette.background.other1,
      },
      '&:nth-child(even)': {
        background: theme.palette.background.other2,
      },
      '&:hover': {
        background: theme.palette.hover.success,
      },
    },
    '& .MuiTable-root': {
      '& .MuiTablePagination-root': {
        marginTop: 4,
      },
      '& .MuiTablePagination-actions': {
        flex: 'none !important',
      },
    },
  },
  noAction: {
    '& .MuiTableCell-head': {
      '&:nth-last-child(2)': {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderRight: '2px solid transparent',
      },
      '&:last-child': {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        border: '2px solid transparent',
      },
    },
  },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
  },
}));

function convertColumn({
  data,
  column,
  isEditMode,
  translate,
  classes,
  onChange,
}: {
  data: LooseObject[];
  column: IColumn;
  isEditMode?: boolean;
  translate?: any;
  classes?: any;
  onChange?: (name: string, value: string | number, rowIndex: number) => void;
}): MUIDataTableColumnDef {
  const res: MUIDataTableColumnDef = {
    name: column.name,
    label: translate ? translate(column.label) : column.label,
    options: {
      sortThirdClickReset: true,
    },
  };
  switch (column.type) {
    case COLUMN_TYPE.DROPDOWN_WITH_BG:
      res.options = {
        ...res.options,
        customBodyRender: (value, tableMeta: MUIDataTableMeta) => {
          if (isEditMode) {
            return (
              <DropdownCell
                value={value}
                options={column.dataOptions!}
                onChange={(v) => onChange?.(tableMeta.columnData.name, v, tableMeta.rowIndex)}
              />
            );
          }
          const option = column.dataOptions?.find((e) => e.value === value);
          return <Chip className={clsx(option?.color || '', 'bg', 'uppercase')} label={<Trans>{option?.label}</Trans>} />;
        },
      };
      break;
    case COLUMN_TYPE.DROPDOWN:
      res.options = {
        ...res.options,
        customBodyRender: (value, tableMeta: MUIDataTableMeta) => {
          if (isEditMode) {
            return (
              <DropdownCell
                value={value}
                options={column.dataOptions!}
                onChange={(v) => onChange?.(tableMeta.columnData.name, v, tableMeta.rowIndex)}
              />
            );
          }
          const option = column.dataOptions?.find((e) => e.value === value);
          return (
            <Typography component="span" noWrap className={classes[option?.color || '']}>
              <Trans>{option?.label}</Trans>
            </Typography>
          );
        },
      };
      break;
    case COLUMN_TYPE.DATETIME:
      res.options = {
        ...res.options,
        customBodyRender: (value) => {
          return (
            <Typography component="span" noWrap>
              <Trans>{value ? moment(value).format('DD/MMM/YYYY HH:mm:ss') : process.env.REACT_APP_DEFAULT_VALUE}</Trans>
            </Typography>
          );
        },
      };
      break;
    case COLUMN_TYPE.LINK:
      res.options = {
        ...res.options,
        customBodyRender: (value) => {
          return (
            <Link noWrap target="_blank" href={`${value}`}>
              <Trans>{value}</Trans>
            </Link>
          );
        },
      };
      break;
    case COLUMN_TYPE.MULTIPLE_TAG:
      res.options = {
        ...res.options,
        customBodyRender: (value = []) => {
          return value.length ? (
            <CustomStack data={value} />
          ) : (
            <Typography component="span" noWrap>
              {process.env.REACT_APP_DEFAULT_VALUE}
            </Typography>
          );
        },
      };
      break;
    case COLUMN_TYPE.ACTION:
      res.options = {
        ...res.options,
        setCellProps: () => ({ style: { width: 30, position: 'sticky', right: 0, padding: 0 } }),
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowData = data[tableMeta.rowIndex];
          const actions = column.getActions ? column.getActions(rowData) : column.actions;
          return <Kebab items={actions} data={rowData} />;
        },
      };
      break;
    default:
      res.options = {
        ...res.options,
        customBodyRender: (value, tableMeta) => {
          let formatValue = value;
          const rowData = data[tableMeta.rowIndex];
          if (column.formatter) formatValue = column.formatter(rowData);
          return (
            <Typography component="span" noWrap>
              {[null, undefined].includes(value) ? process.env.REACT_APP_DEFAULT_VALUE : formatValue}
            </Typography>
          );
        },
      };
      break;
  }
  return res;
}

type TableHandle = {
  setEditMode: (state: boolean) => void;
  setLoading: (state: boolean) => void;
  setData: (data?: ResponseDataPaging) => void;
  getPaginate: any;
  getQuery: any;
  getConfig: any;
};

type TableProps = {
  onTableChange: () => void;
  onRowDbClick: (index: number) => void;
  columns: MUIDataTableColumnDef[];
  rowsPerPageOptions?: number[];
  data?: ITableData;
  editable?: boolean;
  noAction?: boolean;
  onSave?: (dataChanged: LooseObject, cb: any) => void;
  fnKey: (data: any) => string;
};

const Table: React.ForwardRefRenderFunction<TableHandle, TableProps> = (props, ref) => {
  const classes = useStyles();
  const {
    columns = [],
    onTableChange,
    onRowDbClick = null,
    onSave,
    rowsPerPageOptions = [15, 25, 50, 100],
    editable = false,
    noAction = false,
    fnKey,
  } = props;
  const [data, setData] = React.useState<ITableData>(props.data || DATA_DEFAULT);
  const [isEditMode, setEditMode] = React.useState(false);
  const timeoutId = React.useRef<number | null>(null);
  const config = React.useRef<ITableConfig | null>(null);
  const tempDataByKey = React.useRef<LooseObject>({});
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleEdit = (action: string) => {
    switch (action) {
      case ACTIONS.EDIT:
        setEditMode(true);
        break;
      case ACTIONS.CANCEL:
        tempDataByKey.current = {};
        setEditMode(false);
        break;
      case ACTIONS.SAVE:
        if (!Object.keys(tempDataByKey.current).length) {
          dispatch(
            enqueueSnackbarAction({
              message: 'lang_there_is_nothing_to_change',
              key: new Date().getTime() + Math.random(),
              variant: 'warning',
            }),
          );
          setEditMode(false);
        } else {
          onSave?.(tempDataByKey.current, () => {
            const updatedData = data?.data.map((e) => {
              const key = fnKey(e);
              const newData = tempDataByKey.current[key];
              return { ...e, ...newData };
            });
            tempDataByKey.current = {};
            setData((old) => ({ ...old, data: updatedData }));
            setEditMode(false);
          });
        }
        break;
    }
  };

  const getPaginate = () => {
    return {
      page: data.page,
      rowsPerPage: data.rowsPerPage,
    };
  };

  const getConfig = () => {
    return config.current || {};
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
      data: response ? response.data : [],
      isLoading: false,
      page: response ? response.current_page : data.page,
      count: response ? response.total_count : data.count,
      rowsPerPage: old?.rowsPerPage,
    }));
  };

  const setLoading = (isLoading: boolean) => {
    setData((old) => ({ ...old, isLoading }));
  };

  React.useImperativeHandle(
    ref,
    () => ({
      setEditMode: setEditMode,
      setData: setDataTable,
      setLoading: setLoading,
      getPaginate: getPaginate,
      getConfig: getConfig,
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
          if (!tableState.searchText || tableState.searchText.length > 1) {
            config.current.page = 1;
            onTableChange();
          }
          break;
        case TABLE_ACTION.SORT:
          config.current.page = 1;
          onTableChange();
          break;
        case TABLE_ACTION.PAGE_CHANGE:
          onTableChange();
          break;
        default:
          break;
      }
    }, 500);
  };

  const listColumn: MUIDataTableColumnDef[] = React.useMemo(() => {
    const onChange = (name: string, value: string | number, rowIndex: number) => {
      const row: any = data.data[rowIndex];
      const key = fnKey(row);
      if (!tempDataByKey.current[key]) tempDataByKey.current[key] = {};
      if (row[name] === value) {
        delete tempDataByKey.current[key][name];
        if (!Object.keys(tempDataByKey.current[key]).length) delete tempDataByKey.current[key];
      } else {
        Object.assign(tempDataByKey.current[key], { [name]: value });
      }
    };
    return columns.reduce((acc: MUIDataTableColumnDef[], cur: IColumn) => {
      const columnConvert = convertColumn({ data: data.data, column: cur, isEditMode, translate: t, classes, onChange });
      acc.push(columnConvert);
      return acc;
    }, []);
  }, [columns, isEditMode, data]);

  const isNodata = !data.data.length;
  return (
    <div className={clsx(classes.container, noAction && classes.noAction)}>
      <MUIDataTable
        title=" "
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
          customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
            return (
              <CustomFooter
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                changeRowsPerPage={changeRowsPerPage}
                changePage={changePage}
              />
            );
          },
          onTableChange: _onTableChange,
          customSearchRender: (searchText: string, handleSearch, hideSearch, options) => {
            return (
              <CustomSearch
                isNodata={isNodata}
                editable={editable}
                searchText={searchText}
                handleSearch={handleSearch}
                isEditMode={isEditMode}
                handleEdit={handleEdit}
              />
            );
          },
          filter: false,
          search: false,
          searchOpen: true,
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
          textLabels: {
            body: {
              noMatch: data.isLoading ? '' : <Trans>lang_no_data</Trans>,
            },
            toolbar: {
              downloadCsv: t('lang_download_csv') as string,
              print: t('lang_print') as string,
              viewColumns: t('lang_view_columns') as string,
            },
            viewColumns: {
              title: t('lang_show_columns') as string,
              titleAria: t('lang_show_hide_table_columns') as string,
            },
          },
        }}
      />
      {data.isLoading && <CircularProgress className={classes.spinner} size={24} />}
    </div>
  );
};

export default React.forwardRef(Table);
