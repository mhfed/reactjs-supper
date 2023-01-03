import React from 'react';
import { getListSubscribertUrl } from 'apis/request.url';
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
type SubscribersProps = {};

const Subscribers: React.FC<SubscribersProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);
  const { showModal } = useGlobalModalContext();

  const getData = async () => {
    try {
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const response: any = await httpRequest.get(
        getListSubscribertUrl({
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
          message: error,
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

  const columns = React.useMemo(() => {
    return [
      {
        name: FIELD.USERNAME,
        label: 'lang_username',
      },
      {
        name: FIELD.ENTITY_ID,
        label: 'lang_entity_id',
      },
      {
        name: FIELD.FULL_NAME,
        label: 'lang_full_name',
      },
      {
        name: FIELD.SITENAME,
        label: 'lang_sitename',
      },
      {
        name: FIELD.SEGMENT_REGISTER,
        label: 'lang_segment_id',
        type: COLUMN_TYPE.MULTIPLE_TAG,
      },
    ];
  }, []);

  const onRowDbClick = () => {};

  const getRowId = (data: any) => {
    return data[FIELD.SEGMENT_ID];
  };

  return (
    <div className={classes.container}>
      <CustomTable
        noAction
        fnKey={getRowId}
        ref={gridRef}
        onTableChange={onTableChange}
        onRowDbClick={onRowDbClick}
        columns={columns}
      />
    </div>
  );
};

export default Subscribers;
