import React from 'react';
import MUIDataTable, { debounceSearchRender, MUIDataTableColumnDef } from 'mui-datatables';
import makeStyles from '@mui/styles/makeStyles';

export const TABLE_ACTION = {
  SORT: 'sort',
  FILTER_CHANGE: 'filterChange',
  PAGE_CHANGE: 'changePage',
  SEARCH: 'search',
  SEARCH_CLOSE: 'onSearchClose',
  PAGE_SIZE_CHANGE: 'changeRowsPerPage',
};

const useStyles = makeStyles((theme) => ({
  dataTableContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    '& > div:first-child': {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
    },
    '& thead tr th': {
      borderRight: '2px solid white',
    },
    '& tbody tr:nth-child(even)': {
      background: '#f3f4f6 !important',
    },
    '& tbody tr:nth-child(even) td:first-child': {
      background: '#f3f4f6 !important',
    },
  },
}));

type TableProps = {
  onTableChange: () => void;
  onRowDbClick: (index: number) => void;
  columns: MUIDataTableColumnDef[];
  data: object[];
  rowCount: number;
  pageId: number;
  pageSize: number;
  rowsPerPageOptions: number[];
};

type TableHandle = {
  setEditMode: (state: boolean) => void;
};

const Table: React.ForwardRefRenderFunction<TableHandle, TableProps> = (props, ref) => {
  const classes = useStyles();
  const {
    data = [],
    columns = [],
    rowsPerPageOptions = [10, 20, 50],
    rowCount = 0,
    pageSize = 10,
    pageId = 0,
    onTableChange,
    onRowDbClick = null,
  } = props;
  const [isEditMode, setEditMode] = React.useState(false);

  React.useImperativeHandle(
    ref,
    () => ({
      setEditMode: setEditMode,
    }),
    [],
  );

  const listColumn = React.useMemo(() => {
    return columns.reduce((acc, cur) => {
      if (isEditMode) return acc;
      return acc;
    }, []);
  }, [columns, isEditMode]);

  return (
    <div className={classes.dataTableContainer}>
      <MUIDataTable
        title=""
        data={data}
        columns={listColumn}
        options={{
          serverSide: true,
          pagination: true,
          setRowProps: (row, dataIndex) => ({
            onDoubleClick: () => {
              onRowDbClick?.(dataIndex);
            },
          }),
          customSearchRender: debounceSearchRender(500),
          onTableChange: onTableChange,
          count: rowCount,
          page: pageId - 1,
          rowsPerPageOptions: rowsPerPageOptions,
          rowsPerPage: pageSize,
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
