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
import httpRequest from 'services/httpRequest';
import { ITableConfig } from 'models/ICommon';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import ArticlesDetail from '../CreateNewArticles/ArticlesDetail';
import { convertArticlesDataToDetailForm } from 'helpers';
import { FIELD } from '../../Notification/NotificationConstants';

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

const ArticlesManagement: React.FC<SegmentManagementProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);
  const { showModal, hideModal } = useGlobalModalContext();

  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const response: any = await httpRequest.get(getArticlesListUrl(config));
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

  const onTableChange = () => {
    getData();
  };

  React.useEffect(() => {
    getData();
  }, []);
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
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_delete_article_unsuccessfully',
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
        onClick: (data: any) => {
          showModal({
            component: ArticlesDetail,
            showBtnClose: true,
            fullScreen: true,
            props: {
              data: convertArticlesDataToDetailForm(data),
            },
          });
        },
      },
      {
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
            },
          });
        },
      },
      {
        label: 'lang_delete',
        onClick: (data: any) => {
          showModal({
            title: 'lang_confirm',
            component: ConfirmEditModal,
            props: {
              emailConfirm: true,
              title: 'lang_enter_your_email_to_delete_article',
              onSubmit: () => confirmDeleteArticles(data[FIELD.ARTICLES_ID]),
            },
          });
        },
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
        name: FIELD.SITENAME,
        label: 'lang_sitename',
        type: COLUMN_TYPE.BREAK_LINE,
        sort: false,
      },
      {
        name: FIELD.SUBJECT,
        label: 'lang_title',
      },
      {
        name: FIELD.ATTACHMENT_URL,
        label: 'lang_attachment',
        type: COLUMN_TYPE.LINK,
        sort: false,
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

  const onRowDbClick = () => {};

  const getRowId = (data: any) => {
    return data[FIELD.ARTICLES_ID];
  };

  return (
    <div className={classes.container}>
      <CustomTable
        name="articles"
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

export default ArticlesManagement;
