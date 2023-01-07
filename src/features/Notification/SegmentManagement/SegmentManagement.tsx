/*
 * Created on Fri Jan 06 2023
 *
 * Segment management screen
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { getListSegmentUrl, getUserSubcriberByID, getSegmentUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import httpRequest from 'services/httpRequest';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { FIELD } from '../NotificationConstants';
import { ITableConfig } from 'models/ICommon';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import EditSegment from './EditSegment';

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
  const { showModal, hideModal } = useGlobalModalContext();

  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const response: any = await httpRequest.get(getListSegmentUrl(config));
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

  const confirmDeleteSegment = React.useCallback(async (segmentId: string) => {
    try {
      await httpRequest.delete(getSegmentUrl(segmentId));
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_delete_segment_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      hideModal();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_delete_segment_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  }, []);

  const getActions = (data: any) => {
    return [
      {
        label: 'lang_view_detail',
        onClick: async (data: any) => {
          const response: any = await httpRequest.get(getUserSubcriberByID(data.segment_id));
          showModal({
            component: EditSegment,
            fullScreen: true,
            props: {
              typePage: 'DETAIL',
              dataForm: data,
              listSubscribers: response.subscribers,
            },
          });
        },
      },
      {
        label: 'lang_edit',
        onClick: async (data: any) => {
          const response: any = await httpRequest.get(getUserSubcriberByID(data.segment_id));
          showModal({
            component: EditSegment,
            fullScreen: true,
            props: {
              typePage: 'EDIT',
              dataForm: data,
              listSubscribers: response.subscribers,
            },
          });
        },
      },
      {
        label: 'lang_delete',
        onClick: (data: any) =>
          showModal({
            title: 'lang_confirm',
            component: ConfirmEditModal,
            props: {
              title: 'lang_confirm_delete_segment',
              titleTransValues: { segment: data[FIELD.SEGMENT_ID] },
              onSubmit: () => confirmDeleteSegment(data[FIELD.SEGMENT_ID]),
            },
          }),
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
        name: FIELD.LAST_UPDATED,
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
