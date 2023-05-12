/*
 * Created on Fri Jan 06 2023
 *
 * Articles management screen
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { getArticlesListUrl, getArticlesUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import { httpRequest } from 'services/initRequest';
import { ITableConfig, IBundle } from 'models/ICommon';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmModal from 'components/molecules/ConfirmModal';
import ArticlesDetail from '../CreateNewArticles/ArticlesDetail';
import { convertArticlesDataToDetailForm } from 'helpers';
import {
  FIELD,
  ARTICLE_STATUS,
  ARTICLE_STATUS_OPTIONS,
  NOTIFICATION_ENABLED_OPTIONS,
} from '../../Notification/NotificationConstants';
import ArticleAdvancedFilter from './ArticleAdvancedFilter';
import NotificationSetup from './NotificationSetup';
import { extractContent } from 'helpers/common';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

type TableHandle = React.ElementRef<typeof CustomTable>;
type ArticlesManagementProps = {};

const ArticlesManagement: React.FC<ArticlesManagementProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);
  const filterObj = React.useRef<any>({});
  const { showModal, hideModal } = useGlobalModalContext();

  /**
   * Get list articles
   */
  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const listBundleId = filterObj.current?.app_name?.length ? filterObj.current.app_name.map((e: IBundle) => e.bundle_id) : [];
      const response: any = await httpRequest.get(getArticlesListUrl(config, listBundleId));
      gridRef?.current?.setData?.(response.data);
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
   * Get new data when table change
   */
  const onTableChange = () => {
    getData();
  };

  React.useEffect(() => {
    getData();
  }, []);

  /**
   * Handle delete articles
   */
  const confirmDeleteArticles = React.useCallback(async (articlesId: string) => {
    try {
      await httpRequest.delete(getArticlesUrl(articlesId));
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_delete_article_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      onTableChange();
      hideModal();
    } catch (error) {
      const message = [120004].includes(error?.errorCode) ? error?.errorCodeLang : 'lang_delete_article_unsuccessfully';
      dispatch(
        enqueueSnackbarAction({
          message,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  }, []);

  /**
   * Get action for table row
   * @returns action list
   */
  const getActions = (data: any) => {
    const isLinkedNotification = data[FIELD.NOTIFICATION_ENABLED];
    const actions = [
      {
        label: 'lang_view_detail',
        onClick: async (data: any) => {
          const { data: response } = await httpRequest.get(getArticlesUrl(data[FIELD.ARTICLES_ID]));
          showModal({
            component: ArticlesDetail,
            showBtnClose: true,
            fullScreen: true,
            props: {
              data: convertArticlesDataToDetailForm(response),
              successCb: () => getData(),
            },
          });
        },
      },
      {
        label: 'lang_delete',
        onClick: (data: any) => {
          showModal({
            title: 'lang_confirm',
            component: ConfirmModal,
            props: {
              open: true,
              alertTitle: 'lang_confirm',
              alertContent: 'lang_ask_confirm_delete_article',
              onClose: () => hideModal(),
              onSubmit: () => confirmDeleteArticles(data[FIELD.ARTICLES_ID]),
              textSubmit: 'lang_delete',
              textCancel: 'lang_cancel',
            },
          });
        },
      },
    ];
    if (data.status !== ARTICLE_STATUS.COMPLETED && data.editable) {
      const editAction = {
        label: 'lang_edit',
        onClick: async (data: any) => {
          showModal({
            component: ArticlesDetail,
            showBtnClose: true,
            fullScreen: true,
            props: {
              isEdit: true,
              editFirst: true,
              data: convertArticlesDataToDetailForm(data),
              successCb: () => getData(),
            },
          });
        },
      };
      actions.splice(1, 0, editAction);
    }
    if (data.status !== ARTICLE_STATUS.DRAFT) {
      if (data.status === ARTICLE_STATUS.SCHEDULED && isLinkedNotification) return actions;
      actions.push({
        label: isLinkedNotification ? 'lang_resend_notification' : 'lang_setup_notification',
        onClick: (data: any) => {
          const message = extractContent(data?.content);
          showModal({
            component: NotificationSetup,
            showBtnClose: true,
            fullScreen: true,
            props: {
              data: { ...data, message },
            },
          });
        },
      });
    }
    return actions;
  };

  // table column schema
  const columns = React.useMemo(() => {
    return [
      {
        name: FIELD.CREATED_BY,
        label: 'lang_created_by',
      },
      {
        name: FIELD.APP_NAME,
        label: 'lang_app_name',
        type: COLUMN_TYPE.BREAK_LINE,
        formatter: (data: any) => data?.app?.map((e: IBundle) => e.display_name).filter((x: string) => x),
        sort: false,
        translate: false,
      },
      {
        name: FIELD.TITLE,
        label: 'lang_title',
      },
      {
        name: FIELD.ATTACHMENT_URL,
        label: 'lang_attachment',
        type: COLUMN_TYPE.LINK,
        sort: false,
      },
      {
        name: FIELD.ARTICLES_ID,
        label: 'lang_article_id',
      },
      {
        name: FIELD.LAST_UPDATED_BY,
        label: 'lang_last_updated_by',
      },
      {
        name: FIELD.NOTIFICATION_ENABLED,
        label: 'lang_notification_enabled',
        dataOptions: NOTIFICATION_ENABLED_OPTIONS,
        type: COLUMN_TYPE.DROPDOWN_WITH_BG,
      },
      {
        name: FIELD.STATUS,
        label: 'lang_status',
        dataOptions: ARTICLE_STATUS_OPTIONS,
        type: COLUMN_TYPE.DROPDOWN_WITH_BG,
      },
      {
        name: FIELD.CREATED_DATE,
        label: 'lang_created_time',
        type: COLUMN_TYPE.DATETIME,
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
   * Get table row id
   * @param data row data
   * @returns id of row
   */
  const getRowId = (data: any) => {
    return data[FIELD.ARTICLES_ID];
  };

  /**
   * Apply new advanced filter
   */
  const onApplyFilter = (values: any) => {
    filterObj.current = values;
    getData();
  };

  return (
    <div className={classes.container}>
      <CustomTable
        name="articles"
        fnKey={getRowId}
        ref={gridRef}
        onTableChange={onTableChange}
        columns={columns}
        noDataText="lang_no_matching_records_found"
        showSitename
        advancedFilter={ArticleAdvancedFilter}
        onApplyFilter={onApplyFilter}
      />
    </div>
  );
};

export default ArticlesManagement;
