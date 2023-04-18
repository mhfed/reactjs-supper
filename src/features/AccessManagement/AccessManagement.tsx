/*
 * Created on Fri Jan 06 2023
 *
 * Articles management screen
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { getArticlesListUrl, getArticlesUrl, getAccessManagement } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import httpRequest from 'services/httpRequest';
import { ITableConfig } from 'models/ICommon';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { useGlobalModalContext } from 'containers/Modal';
import { FIELD } from '../Notification/NotificationConstants';
import AppAccessSetup from './AppAccessSetup';

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

const AccessManagement: React.FC<ArticlesManagementProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);
  const { showModal, hideModal } = useGlobalModalContext();

  /**
   * Get list articles
   */
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

  /**
   * Get new data when table change
   */
  const onTableChange = () => {
    getData();
  };

  React.useEffect(() => {
    getData();
  }, []);

  // table column schema
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

  const onEdit = () => {
    console.log('YOLO: ', gridRef.current?.getRowSelected());
    showModal({
      component: AppAccessSetup,
      props: {
        typePage: 'DETAIL',
        data: [],
        callback: onTableChange,
      },
    });
  };

  /**
   * List button of header table
   */
  const listBtnHeader = [
    {
      label: 'lang_edit',
      onClick: onEdit,
      isShow: true,
      disabledEditMode: true,
    },
  ];

  return (
    <div className={classes.container}>
      <CustomTable
        listBtn={listBtnHeader}
        name="articles"
        fnKey={getRowId}
        ref={gridRef}
        onTableChange={onTableChange}
        selectedRow={true}
        columns={columns}
        noDataText="lang_no_matching_records_found"
        showSitename
      />
    </div>
  );
};

export default AccessManagement;
