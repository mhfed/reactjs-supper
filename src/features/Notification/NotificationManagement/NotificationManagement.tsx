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
import { httpRequest } from 'services/initRequest';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { FIELD, NOTIFICATION_STATUS, NOTIFICATION_STATUS_OPTIONS } from '../NotificationConstants';
import { IBundle, ITableConfig } from 'models/ICommon';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import DetailNotification from './DetailNotification';
import EditNotification from './EditNotification';
import { Inotifiaction } from 'models/INotification';
import NotificationAdvancedFilter from './Components/NotificationAdvancedFilter';
import moment from 'moment';

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
  const { showModal, hideModal } = useGlobalModalContext();
  const filterObjApi = React.useRef<any>({});

  /**
   * Get list notification
   */
  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const response: any = await httpRequest.get(getListNotificationUrl(config, filterObjApi.current));

      if (response.data) {
        response.data = (response?.data || []).map((e: any) => {
          return { ...e, display_name: e?.app?.map((e: any) => e.display_name) || '' };
        });
      }

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

  /**
   * recall data when table changed
   */
  const onTableChange = () => {
    getData();
  };

  /**
   * get data at first load
   */
  React.useEffect(() => {
    getData();
  }, []);

  /**
   * Handle delete notification
   */
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
      hideModal();
      onTableChange && onTableChange();
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

  /**
   * Get action row by row data
   * @param data row data
   */
  const getActions = (data: any) => {
    const actions = [];
    actions.push({
      label: 'lang_view_detail',
      onClick: (data: Inotifiaction) => {
        //
        httpRequest
          .get(getNotificationUrl(data.notification_id))
          .then((res) => {
            const currentRes: any = res.data;
            //
            const parseArr = currentRes.bundle_id ? JSON.parse(currentRes.bundle_id) : [];
            showModal({
              component: DetailNotification,
              fullScreen: true,
              showBtnClose: true,
              props: {
                typePage: 'DETAIL',
                dataForm: { ...data, bundle_id: parseArr },
                reCallChangeTable: onTableChange,
              },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      },
    });
    if (data[FIELD.STATUS] !== NOTIFICATION_STATUS.TRIGGERED) {
      actions.push({
        label: 'lang_edit',
        onClick: async (data: Inotifiaction) => {
          const response: any = await httpRequest.get(getNotificationUrl(data?.notification_id));
          const formatData = (response?.subscribers || []).map((e: any) => ({ ...e, username: e.subscriber }));
          if (response.status === NOTIFICATION_STATUS.TRIGGERED) {
            dispatch(
              enqueueSnackbarAction({
                message: 'lang_noti_has_been_sent',
                key: new Date().getTime() + Math.random(),
                variant: 'error',
              }),
            );
            showModal({
              component: DetailNotification,
              fullScreen: true,
              showBtnClose: true,
              props: {
                typePage: 'DETAIL',
                dataForm: data,
                reCallChangeTable: onTableChange,
              },
            });
          } else {
            const currentRes: any = response?.data;
            const parseArr = currentRes.bundle_id ? JSON.parse(currentRes.bundle_id) : [];

            showModal({
              component: EditNotification,
              fullScreen: true,
              props: {
                typePage: 'EDIT',
                dataForm: { ...data, subscribers: formatData, bundle_id: parseArr },
                reCallChangeTable: onTableChange,
              },
            });
          }
        },
      });
    }
    actions.push({
      label: 'lang_recall',
      onClick: (data: any) =>
        showModal({
          title: 'lang_confirm',
          component: ConfirmEditModal,
          props: {
            emailConfirm: false,
            confirmText: 'lang_recall',
            colorButtonConfirm: 'error',
            title: 'lang_confirm_delete_notification',
            titleTransValues: { notification: data[FIELD.NOTIFICATION_ID] },
            onSubmit: () => confirmDeleteNotification(data[FIELD.NOTIFICATION_ID]),
          },
        }),
    });
    return actions;
  };

  /**
   * table column
   */
  const columns = React.useMemo(() => {
    return [
      // {
      //   name: FIELD.AUDIENCES,
      //   label: 'lang_audiences',
      //   formatter: (data: any) => data?.['segment_name'] || data?.[FIELD.AUDIENCES]?.[0]?.['subscriber'] || '',
      // },
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
        sort: false,
      },
      {
        name: FIELD.CREATED_TIME,
        label: 'lang_create_time',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.APP_NAME,
        label: 'lang_app_name',
        type: COLUMN_TYPE.BREAK_LINE,
      },
      {
        name: FIELD.ARTICLES_ID,
        label: 'lang_article_id',
      },
      {
        name: FIELD.SCHEDULE,
        label: 'lang_scheduled',
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
        name: FIELD.CREATED_BY,
        label: 'lang_created_by',
      },
      // {
      //   name: FIELD.ATTEMPTED,
      //   label: 'lang_attempted',
      // },
      // {
      //   name: FIELD.DELIVERED,
      //   label: 'lang_delivered',
      // },
      // {
      //   name: FIELD.CLICKED,
      //   label: 'lang_clicked',
      // },
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
        name: 'ACTION_COLUMN',
        type: COLUMN_TYPE.ACTION,
        getActions,
        label: ' ',
      },
    ];
  }, []);

  /**
   * get row id by row data
   * @param data row data
   * @returns row id
   */
  const getRowId = (data: any) => {
    return data[FIELD.NOTIFICATION_ID];
  };

  const onApplyFilter = (filterObj: any) => {
    let currentFilter: any = {
      date_search: filterObj.notification_category,
    };

    if (filterObj.from) {
      currentFilter = {
        ...currentFilter,
        from: moment(filterObj.from).format('DDMMYYYY'),
      };
    }

    if (filterObj.to) {
      currentFilter = {
        ...currentFilter,
        to: moment(filterObj.to).format('DDMMYYYY'),
      };
    }

    //  If only [To] is selected then click Apply button => Filter date from the newest date to selected [To]

    if (!filterObj.from && filterObj.to) {
      currentFilter = {
        ...currentFilter,
        from: moment().startOf('year').format('DDMMYYYY'),
      };
    }

    // If only [From] is selected then click Apply button => Filter date from selected [From] to the latest date

    if (!filterObj.to && filterObj.from) {
      currentFilter = {
        ...currentFilter,
        to: moment().format('DDMMYYYY'),
      };
    }

    if (filterObj.app_name?.length) {
      const listBundleId = filterObj.app_name?.length ? filterObj.app_name.map((e: IBundle) => e.bundle_id).join(',') : [];
      currentFilter = { ...currentFilter, bundle_id: listBundleId };
    }

    filterObjApi.current = currentFilter;
    getData();
  };

  return (
    <div className={classes.container}>
      <CustomTable
        name="notification"
        fnKey={getRowId}
        ref={gridRef}
        onTableChange={onTableChange}
        columns={columns}
        showSitename
        advancedFilter={NotificationAdvancedFilter}
        onApplyFilter={onApplyFilter}
      />
    </div>
  );
};

export default NotificationManagement;
