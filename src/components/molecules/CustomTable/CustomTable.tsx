/*
 * Created on Fri Jan 06 2023
 *
 * Mui-datatables custom with column type, edit mode....
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import MUIDataTable, { MUIDataTableColumnDef, MUIDataTableState, MUIDataTableMeta } from 'mui-datatables';
import makeStyles from '@mui/styles/makeStyles';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { getFilterObj, formatDataBeforeExportCsv } from 'helpers';
import { Trans, useTranslation } from 'react-i18next';
import CustomFooter from './CustomFooter';
import CustomSearch from './CustomSearch';
import { IColumn, ResponseDataPaging, ITableData, ITableConfig, LooseObject } from 'models/ICommon';
import { TABLE_ACTION, COLUMN_TYPE, DATA_DEFAULT, ACTIONS } from './TableConstants';
import clsx from 'clsx';
import moment from 'moment-timezone';
import Kebab from 'components/atoms/Kebab';
import DropdownCell from './DropdownCell';
import InputCell from './InputCell';
import CustomChip from './CustomChip';
import CustomStack from './CustomStack';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from '../ConfirmEditModal';
import DropdownHeaderCell from './DropdownHeaderCell';
import { hideTooltip } from 'helpers';

const useStyles = (props: TableProps) =>
  makeStyles((theme) => ({
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
        background: theme.palette.background.main,
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
        overflow: 'hidden',
        padding: theme.spacing(1),
        border: 'none',
        '&:not(.MuiTableCell-footer)': {
          maxWidth: 600,
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
        background: theme.palette.background.headerCell,
        borderRight: '2px solid transparent',
        textAlign: props.textAlign || 'center',
        '& [class*="MUIDataTableHeadCell-data"]': {
          whiteSpace: 'nowrap',
        },
        '& *': {
          color: theme.palette.common.white,
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
          '& > span:first-child': {
            marginLeft: theme.spacing(3),
          },
        },
        '&:last-child': {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          border: 'none',
        },
      },
      '& .MuiTableRow-root': {
        '&:nth-child(odd)': {
          background: theme.palette.background.oddRow,
        },
        '&:nth-child(even)': {
          background: theme.palette.background.evenRow,
        },
        '&:hover': {
          background: theme.palette.hover.success,
        },
      },
      '& .MuiTable-root': {
        '& .MuiTablePagination-root': {
          padding: 0,
          paddingTop: 2,
        },
        '& .MuiTablePagination-actions': {
          flex: 'none !important',
        },
      },
    },
    centerContent: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputCell: {
      minWidth: 200,
      '& input': {
        padding: theme.spacing(0.5, 1),
      },
    },
    thCustomLabel: {
      marginLeft: theme.spacing(3),
    },
  }));

/**
 * Handle and convert custom column with user data to library readable column data
 * @param param0 data need to handle table column converter
 * @returns new column use for Mui datatables
 */
function convertColumn({
  data, // current table data
  column, // custom column data
  isEditMode, // edit mode status
  translate, // translate function to translate text
  classes, // style with mateial ui classes
  onChange, // Handle change data with editable cell at edit mode
  onChangeAll, // Apply all change for one column with new data select from header dropdown
  fnKey, // Function to find row id
  curData, // Table changed data
  editId, // id of edit session
}: {
  editId: number;
  data: LooseObject[];
  curData: LooseObject;
  column: IColumn;
  isEditMode?: boolean;
  translate?: any;
  classes?: any;
  onChange?: (name: string, value: string | number, rowIndex: number) => void;
  onChangeAll?: (data: any, name: string, value: string | number) => void;
  fnKey: (data: any) => string;
}): MUIDataTableColumnDef {
  // Common column data
  const res: MUIDataTableColumnDef = {
    name: column.name,
    label: translate ? translate(column.label) : column.label,
    options: {
      sort: isEditMode ? false : !(column.sort === false),
      sortThirdClickReset: true,
    },
  };
  switch (column.type) {
    // render dropdown cell with bacjground color at edit mode
    case COLUMN_TYPE.DROPDOWN_WITH_BG:
      res.options = {
        ...res.options,
        customBodyRender: (value, tableMeta: MUIDataTableMeta) => {
          if (isEditMode) {
            const rowData = data[tableMeta.rowIndex];
            const cellId = fnKey(rowData);
            const curValue =
              curData?.[cellId]?.[tableMeta.columnData.name] !== undefined
                ? curData?.[cellId]?.[tableMeta.columnData.name]
                : value;
            return (
              <DropdownCell
                id={editId + cellId}
                style={{ textTransform: column.textTransform || 'uppercase' }}
                value={curValue}
                options={column.dataOptions!}
                onChange={(v) => onChange?.(tableMeta.columnData.name, v, tableMeta.rowIndex)}
              />
            );
          }
          const option = column.dataOptions?.find((e) => e.value === value);
          return (
            <Chip
              className={clsx(option?.color || '', 'bg')}
              sx={{ textTransform: column.textTransform || 'uppercase' }}
              label={<Trans>{option?.label}</Trans>}
            />
          );
        },
      };
      // if have apply all option at header
      if (column.dataOptionsHeader) {
        res.options.customHeadLabelRender = (columnMeta) => {
          return (
            <div className={classes.thCustomLabel}>
              {isEditMode ? (
                <DropdownHeaderCell
                  id={editId + ''}
                  label={columnMeta.label}
                  options={column.dataOptionsHeader!}
                  onChange={(v) => onChangeAll?.(data, columnMeta.name, v)}
                />
              ) : (
                <Trans>{columnMeta.label}</Trans>
              )}
            </div>
          );
        };
      }
      break;

    // Render cell with dropdown at edit mode
    case COLUMN_TYPE.DROPDOWN:
      res.options = {
        ...res.options,
        customBodyRender: (value, tableMeta: MUIDataTableMeta) => {
          if (isEditMode) {
            const rowData = data[tableMeta.rowIndex];
            const cellId = fnKey(rowData);
            const curValue =
              curData?.[cellId]?.[tableMeta.columnData.name] !== undefined
                ? curData?.[cellId]?.[tableMeta.columnData.name]
                : value;
            return (
              <DropdownCell
                id={editId + cellId}
                style={{ textTransform: column.textTransform || 'uppercase' }}
                value={curValue}
                options={column.dataOptions!}
                onChange={(v) => onChange?.(tableMeta.columnData.name, v, tableMeta.rowIndex)}
              />
            );
          }
          const option = column.dataOptions?.find((e) => e.value === value);
          return (
            <Typography
              component="span"
              noWrap
              className={clsx(option?.color || '')}
              sx={{ textTransform: column.textTransform || 'uppercase' }}
            >
              <Trans>{option?.label}</Trans>
            </Typography>
          );
        },
      };
      break;

    // Render cell with input at edit mode
    case COLUMN_TYPE.INPUT:
      res.options = {
        ...res.options,
        customBodyRender: (value, tableMeta: MUIDataTableMeta) => {
          if (isEditMode) {
            const rowData = data[tableMeta.rowIndex];
            const cellId = fnKey(rowData);
            const curValue =
              curData?.[cellId]?.[tableMeta.columnData.name] !== undefined
                ? curData?.[cellId]?.[tableMeta.columnData.name]
                : value;
            return (
              <InputCell
                id={editId + cellId}
                classeName={classes.inputCell}
                value={curValue}
                onChange={(v) => onChange?.(tableMeta.columnData.name, v, tableMeta.rowIndex)}
              />
            );
          }
          return (
            <Typography component="span" noWrap>
              {value}
            </Typography>
          );
        },
      };
      break;

    // Render cell with date time formatted
    case COLUMN_TYPE.DATETIME:
      res.options = {
        ...res.options,
        customBodyRender: (value) => {
          return (
            <Typography component="span" noWrap>
              {value ? moment(value).local().format('DD/MM/YY HH:mm:ss') : process.env.REACT_APP_DEFAULT_VALUE}
            </Typography>
          );
        },
      };
      break;

    // render cell with a clickable link will open new window at browser
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

    // Render cell with data as array and each element one line
    case COLUMN_TYPE.BREAK_LINE:
      res.options = {
        ...res.options,
        customBodyRender: (value = []) => {
          return value.length ? (
            <CustomStack data={value} />
          ) : (
            <Typography component="span" sx={{ minWidth: 360 }} noWrap>
              {process.env.REACT_APP_DEFAULT_VALUE}
            </Typography>
          );
        },
      };
      break;

    // Render cell with data as array and each element is a chip tag
    case COLUMN_TYPE.MULTIPLE_TAG:
      res.options = {
        ...res.options,
        customBodyRender: (value = []) => {
          return value.length ? (
            <CustomChip data={value} />
          ) : (
            <Typography component="span" sx={{ minWidth: 360 }} noWrap>
              {process.env.REACT_APP_DEFAULT_VALUE}
            </Typography>
          );
        },
      };
      break;

    // Render action column with a kebab icon and user can choose action from kebab icon dropdown
    case COLUMN_TYPE.ACTION:
      res.options = {
        ...res.options,
        setCellProps: () => ({ style: { width: 30, position: 'sticky', right: 0, padding: 0 } }),
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowData = data[tableMeta.rowIndex];
          const actions = column.getActions ? column.getActions(rowData) : column.actions;
          if (isEditMode || !actions?.length) return <></>;
          return <Kebab items={actions} data={rowData} />;
        },
      };
      break;

    // default render cell as display text cell
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
  getQuery: any;
  getConfig: any;
  checkChange: () => boolean;
};
type TypeButtonHeader = {
  label: string;
  onClick: () => void;
  variant?: 'contained' | 'outlined' | 'text' | string;
  isShow?: boolean;
  sx?: any;
  disabledEditMode?: boolean;
};

type TableProps = {
  onTableChange: () => void;
  onRowDbClick?: (index: number) => void;
  columns: MUIDataTableColumnDef[];
  rowsPerPageOptions?: number[];
  data?: ITableData;
  editable?: boolean;
  listBtn?: Array<TypeButtonHeader>;
  textAlign?: string;
  onSave?: (dataChanged: LooseObject, cb: any) => void;
  fnKey: (data: any) => string;
  noChangeKey?: string;
  name: string;
  noDataText?: string;
  defaultSort?: LooseObject;
};

const Table: React.ForwardRefRenderFunction<TableHandle, TableProps> = (props, ref) => {
  const classes = useStyles(props)();
  const {
    name,
    noChangeKey,
    columns = [],
    onTableChange,
    onRowDbClick = null,
    onSave,
    rowsPerPageOptions = [15, 25, 50, 100],
    editable = false,
    listBtn = [],
    fnKey,
    defaultSort,
  } = props;
  const [data, setData] = React.useState<ITableData>(props.data || DATA_DEFAULT);
  const [isEditMode, setEditMode] = React.useState(false);
  const timeoutId = React.useRef<number | null>(null);
  const config = React.useRef<ITableConfig | null>(null);
  const tempDataByKey = React.useRef<LooseObject>({});
  const editId = React.useRef<number>(0);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showSubModal, hideSubModal } = useGlobalModalContext();

  /**
   * Handle user action at table toolbar button group
   * @param action action name
   */
  const handleEdit = (action: string) => {
    switch (action) {
      // Turn on edit mode
      case ACTIONS.EDIT:
        editId.current = +new Date();
        setEditMode(true);
        break;
      // Cancel edit mode, reset data to normal, show confirm when have user data changed
      case ACTIONS.CANCEL:
        if (Object.keys(tempDataByKey.current).length && editable) {
          showSubModal({
            title: 'lang_confirm_cancel',
            component: ConfirmEditModal,
            props: {
              title: 'lang_confirm_cancel_text',
              emailConfirm: false,
              cancelText: 'lang_no',
              confirmText: 'lang_yes',
              onSubmit: () => {
                tempDataByKey.current = {};
                setEditMode(false);
                hideSubModal();
                setEditMode(false);
              },
            },
          });
        } else {
          tempDataByKey.current = {};
          setEditMode(false);
        }
        break;
      // Handle save new data user changed
      case ACTIONS.SAVE:
        if (!Object.keys(tempDataByKey.current).length) {
          dispatch(
            enqueueSnackbarAction({
              message: noChangeKey || 'lang_there_is_nothing_to_change',
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

  /**
   * Get table config data as page id, sort field....to request new data at parent component
   * @returns config data
   */
  const getConfig = () => {
    return {
      ...(config.current || {}),
      page: typeof config.current?.page === 'number' ? config.current.page + 1 : 1,
      sort: config.current?.sort?.sortType !== 'NONE' ? { ...config.current?.sort } : null,
    };
  };

  /**
   * Get elastic search query body with search text, sort column and can extend both filter
   * @returns elastic search query body use for parent component request
   */
  const getQuery = () => {
    const query: any = { query: { bool: { must: [] } }, sort: [] };
    if (config.current?.searchText) query.query.bool.must.push({ query_string: { query: `*${config.current.searchText}*` } });
    if (config.current?.sort) {
      const { sortField, sortType } = config.current.sort || {};
      if (sortType && sortType !== 'NONE') {
        query.sort = [{ [sortField]: { order: sortType.toLowerCase() } }];
      }
    }
    if (!query.sort.length && defaultSort) {
      query.sort = [{ ...defaultSort }];
    }
    return query;
  };

  /**
   * Set new data for table
   * @param response data receiver from backend with pagination data
   */
  const setDataTable = (response: ResponseDataPaging) => {
    setData((old) => ({
      data: response ? response.data : [],
      isLoading: false,
      page: response ? response.current_page - 1 : data.page,
      count: response ? response.total_count : data.count,
      rowsPerPage: config.current?.rowsPerPage || +process.env.REACT_APP_DEFAULT_PAGE_SIZE,
    }));
  };

  /**
   * Set table loading
   * @param isLoading loading status
   */
  const setLoading = (isLoading: boolean) => {
    setData((old) => ({ ...old, isLoading }));
  };

  /**
   * Check table change data at edit mode
   * @returns true if has changed
   */
  const checkChange = () => {
    return !!Object.keys(tempDataByKey.current).length;
  };

  /**
   * Regis some function to use from parent component
   */
  React.useImperativeHandle(
    ref,
    () => ({
      setEditMode: setEditMode,
      setData: setDataTable,
      setLoading: setLoading,
      getConfig: getConfig,
      getQuery: getQuery,
      checkChange: checkChange,
    }),
    [],
  );

  /**
   * Handle table action as page change, page size change, search, sort...
   * @param action table action name
   * @param tableState current table state
   */
  const _onTableChange = (action: string, tableState: MUIDataTableState) => {
    if (['propsUpdate', 'onFilterDialogOpen', 'onFilterDialogClose'].includes(action)) return;
    timeoutId.current && window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      hideTooltip();
      const filterObj = getFilterObj(tableState);
      config.current = { ...tableState, ...filterObj };
      switch (action) {
        case TABLE_ACTION.SEARCH:
          if (!tableState.searchText || tableState.searchText.length > 1) {
            config.current.page = 0;
            onTableChange();
          }
          break;
        case TABLE_ACTION.SORT:
          config.current.page = 0;
          onTableChange();
          break;
        case TABLE_ACTION.PAGE_CHANGE:
        case TABLE_ACTION.PAGE_SIZE_CHANGE:
          window.scrollTo(0, 0);
          onTableChange();
          break;
        default:
          break;
      }
    }, 500);
  };

  // list column after convert from user schema to readable column schema for mui datatable library
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
    const onChangeAll = (data: any, name: string, value: string | number) => {
      data.forEach((e: any, i: number) => {
        const row: any = data[i];
        const key = fnKey(row);
        if (!tempDataByKey.current[key]) tempDataByKey.current[key] = {};
        Object.assign(tempDataByKey.current[key], { [name]: value });
      });
      const updatedData = data?.map((e: any) => {
        const key = fnKey(e);
        const newData = tempDataByKey.current[key];
        return { ...e, ...newData };
      });
      setData((old) => ({ ...old, data: updatedData }));
    };
    return columns.reduce((acc: MUIDataTableColumnDef[], cur: IColumn) => {
      const columnConvert = convertColumn({
        data: data.data,
        column: cur,
        isEditMode,
        translate: t,
        classes,
        onChange,
        onChangeAll,
        fnKey,
        curData: tempDataByKey.current,
        editId: editId.current,
      });
      acc.push(columnConvert);
      return acc;
    }, []);
  }, [columns, isEditMode, data]);

  /**
   * Handle file download with corect cell data by column type
   * @param buildHead library function to handle download csv file
   * @param buildBody library function to handle download csv file
   * @param curColumns current table column
   * @param arrData current table data
   * @returns file data handled
   */
  const onDownload = (buildHead: (columns: any) => string, buildBody: (data: any) => string, curColumns: any, arrData: any) => {
    const formatData = formatDataBeforeExportCsv(curColumns, columns, arrData, data.data, t);
    const columnNoAction = curColumns.filter((e: any) => e.name !== 'ACTION_COLUMN');
    return '\uFEFF' + buildHead(columnNoAction) + buildBody(formatData);
  };

  const isNodata = !data?.data?.length;
  return (
    <div className={classes.container}>
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
          searchAlwaysOpen: true,
          onTableChange: _onTableChange,
          customSearchRender: (searchText: string, handleSearch, hideSearch, options) => {
            return (
              <CustomSearch
                isNodata={isNodata}
                editable={editable}
                searchText={searchText}
                handleSearch={handleSearch}
                isEditMode={isEditMode}
                listBtn={listBtn}
                handleEdit={handleEdit}
              />
            );
          },
          filter: false,
          search: false,
          searchOpen: true,
          count: data.count || 0,
          page: data.page || 0,
          rowsPerPageOptions,
          rowsPerPage: data.rowsPerPage || +process.env.REACT_APP_DEFAULT_PAGE_SIZE,
          filterType: 'textField',
          fixedHeader: false,
          draggableColumns: {
            enabled: true,
          },
          downloadOptions: {
            filename: `${name}_${moment().local().format('DD_MM_YY_HH_mm_ss')}`,
            filterOptions: {
              useDisplayedColumnsOnly: true,
            },
          },
          onDownload: onDownload,
          selectableRows: 'single',
          selectableRowsOnClick: false,
          selectableRowsHideCheckboxes: true,
          responsive: 'standard',
          textLabels: {
            body: {
              noMatch: '',
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
      {data.isLoading && <CircularProgress className={classes.centerContent} size={24} />}
      {!data.isLoading && !data.data?.length && (
        <div className={classes.centerContent}>
          {props.noDataText ? <Trans>{props.noDataText}</Trans> : <Trans>lang_no_matching_record</Trans>}
        </div>
      )}
    </div>
  );
};

export default React.forwardRef(Table);
