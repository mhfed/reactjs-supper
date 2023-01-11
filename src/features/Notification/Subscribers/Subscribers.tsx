/*
 * Created on Fri Jan 06 2023
 *
 * List subscriber
 *
 * Copyright (c) 2023 - Novus Fintech
 */

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
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const response: any = await httpRequest.get(getListSubscribertUrl(config));
      gridRef?.current?.setData?.(response);
    } catch (error) {
      gridRef?.current?.setData?.();
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
        sort: false,
      },
      {
        name: 'ACTION_COLUMN',
        type: COLUMN_TYPE.ACTION,
        actions: [],
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
      <CustomTable
        name="subscribers"
        fnKey={getRowId}
        ref={gridRef}
        onTableChange={onTableChange}
        onRowDbClick={onRowDbClick}
        columns={columns}
        noDataText="lang_no_matching_records_found"
      />
    </div>
  );
};

export default Subscribers;
