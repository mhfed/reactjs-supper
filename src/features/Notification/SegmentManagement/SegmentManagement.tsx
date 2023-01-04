import React from 'react';
import { getListSegmentUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import httpRequest from 'services/httpRequest';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { FIELD } from '../NotificationConstants';
import { ITableConfig } from 'models/ICommon';
import { useGlobalModalContext } from 'containers/Modal';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

type TableHandle = React.ElementRef<typeof CustomTable>;
type SegmentManagementProps = {};

const SegmentManagement: React.FC<SegmentManagementProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);
  const { showModal } = useGlobalModalContext();

  const getData = async () => {
    try {
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const response: any = await httpRequest.get(
        getListSegmentUrl({
          pageId: config.page,
          pageSize: config.rowsPerPage,
          searchText: config.searchText,
          sort: config.sort,
        }),
      );
      response.current_page -= 1;
      gridRef?.current?.setData?.(response);
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error?.errorCodeLang,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  };

  const onTableChange = () => {
    getData();
  };

  React.useEffect(() => {
    getData();
  }, []);

  const getActions = (data: any) => {
    return [
      {
        label: 'lang_view_detail',
        onClick: () => console.log('YOLO: lang_view_detail'),
      },
      {
        label: 'lang_edit',
        onClick: (data: any) => {},
      },
      {
        label: 'lang_delete',
        onClick: (data: any) => {},
      },
    ];
  };

  const columns = React.useMemo(() => {
    return [
      {
        name: FIELD.ACTOR,
        label: 'lang_actor',
      },
      {
        name: FIELD.SEGMENT_ID,
        label: 'lang_segment_id',
      },
      {
        name: FIELD.SEGMENT_NAME,
        label: 'lang_segment_name',
      },
      {
        name: FIELD.NUMBER_OF_SUBSCRIBERS,
        label: 'lang_number_of_subscribers',
      },
      {
        name: FIELD.LAST_UPDATE,
        label: 'lang_last_update',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.ACTION,
        type: COLUMN_TYPE.ACTION,
        getActions,
        label: ' ',
      },
    ];
  }, []);

  const onRowDbClick = () => {};

  const getRowId = (data: any) => {
    return data[FIELD.SEGMENT_ID];
  };

  return (
    <div className={classes.container}>
      <CustomTable fnKey={getRowId} ref={gridRef} onTableChange={onTableChange} onRowDbClick={onRowDbClick} columns={columns} />
    </div>
  );
};

export default SegmentManagement;
