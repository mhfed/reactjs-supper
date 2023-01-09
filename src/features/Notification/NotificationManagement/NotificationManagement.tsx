/*
 * Created on Fri Jan 06 2023
 *
 * Notification management
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { getListNotificationUrl, getNotificationUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import httpRequest from 'services/httpRequest';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { FIELD, NOTIFICATION_STATUS, NOTIFICATION_STATUS_OPTIONS } from '../NotificationConstants';
import { ITableConfig } from 'models/ICommon';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import EditNotification from './DetailNotification/DetailNotification';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

type TableHandle = React.ElementRef<typeof CustomTable>;
type NotificationManagementProps = {};

const NotificationManagement: React.FC<NotificationManagementProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);
  const { showModal } = useGlobalModalContext();

  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const response: any = await httpRequest.get(getListNotificationUrl(config));
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

  const confirmDeleteNotification = React.useCallback(async (notificationId: string) => {
    try {
      await httpRequest.delete(getNotificationUrl(notificationId));
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_delete_notification_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_delete_notification_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  }, []);

  const getActions = (data: any) => {
    const actions = [];
    actions.push({
      label: 'lang_view_detail',
      onClick: (data: any) => {
        showModal({
          component: EditNotification,
          fullScreen: true,
          props: {
            typePage: 'DETAIL',
            dataForm: data,
          },
        });
      },
    });
    if (data[FIELD.STATUS] !== NOTIFICATION_STATUS.TRIGGERED) {
      actions.push({
        label: 'lang_edit',
        onClick: (data: any) => {},
      });
    }
    actions.push({
      label: 'lang_delete',
      onClick: (data: any) =>
        showModal({
          title: 'lang_confirm',
          component: ConfirmEditModal,
          props: {
            title: 'lang_confirm_delete_notification',
            titleTransValues: { notification: data[FIELD.NOTIFICATION_ID] },
            onSubmit: () => confirmDeleteNotification(data[FIELD.NOTIFICATION_ID]),
          },
        }),
    });
    return actions;
  };

  const columns = React.useMemo(() => {
    return [
      {
        name: FIELD.AUDIENCES,
        label: 'lang_audiences',
        formatter: (data: any) => data?.['segment_name'] || data?.[FIELD.AUDIENCES]?.[0]?.['subscriber'] || '',
      },
      {
        name: FIELD.DELIVERY_TYPE,
        label: 'lang_delivery_type',
      },
      {
        name: FIELD.TITLE,
        label: 'lang_title',
      },
      {
        name: FIELD.MESSAGE,
        label: 'lang_message',
      },
      {
        name: FIELD.URL,
        label: 'lang_url',
        type: COLUMN_TYPE.LINK,
      },
      {
        name: FIELD.CREATED_TIME,
        label: 'lang_create_time',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.EXPIRATION_TIME,
        label: 'lang_expiration_time',
      },
      {
        name: FIELD.SCHEDULE,
        label: 'lang_schedule',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.TRIGGER_TIME,
        label: 'lang_trigger_time',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.STATUS,
        label: 'lang_status',
        dataOptions: NOTIFICATION_STATUS_OPTIONS,
        type: COLUMN_TYPE.DROPDOWN,
        textTransform: 'unset',
      },
      {
        name: FIELD.ATTEMPTED,
        label: 'lang_attempted',
      },
      {
        name: FIELD.DELIVERED,
        label: 'lang_delivered',
      },
      {
        name: FIELD.CLICKED,
        label: 'lang_clicked',
      },
      {
        name: FIELD.ACTOR,
        label: 'lang_actor',
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
    return data[FIELD.NOTIFICATION_ID];
  };

  return (
    <div className={classes.container}>
      <CustomTable
        name="notification"
        fnKey={getRowId}
        ref={gridRef}
        onTableChange={onTableChange}
        onRowDbClick={onRowDbClick}
        columns={columns}
      />
    </div>
  );
};

export default NotificationManagement;
