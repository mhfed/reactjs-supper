/*
 * Created on Fri Jan 06 2023
 *
 * Articles management screen
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { getAccessManagementUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import httpRequest from 'services/httpRequest';
import { ITableConfig } from 'models/ICommon';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { useGlobalModalContext } from 'containers/Modal';
import AppAccessSetup from './AppAccessSetup';
import ConfirmModal from 'components/molecules/ConfirmModal';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const FIELD = {
  USER_ID: 'user_id',
  LAST_ACTIVE: 'last_active',
  LAST_UPDATED: 'last_updated',
  APP_NAME: 'app_name',
};

type TableHandle = React.ElementRef<typeof CustomTable>;
type ArticlesManagementProps = {};

const AccessManagement: React.FC<ArticlesManagementProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);
  const { showModal } = useGlobalModalContext();
  const [notif, setNotif] = React.useState('');

  /**
   * Get list access management
   */
  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const response: any = await httpRequest.get(getAccessManagementUrl(config));
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
        name: FIELD.USER_ID,
        label: 'lang_user_id',
      },
      {
        name: FIELD.LAST_ACTIVE,
        label: 'lang_last_active',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.LAST_UPDATED,
        label: 'lang_last_updated',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.APP_NAME,
        label: 'lang_app_name',
        type: COLUMN_TYPE.BREAK_LINE,
      },
    ];
  }, []);

  /**
   * Get table row id
   * @param data row data
   * @returns id of row
   */
  const getRowId = (data: any) => {
    return data[FIELD.USER_ID];
  };

  const onEdit = () => {
    const selectedfdRows = gridRef.current?.getRowSelected();
    if (!selectedfdRows?.length) {
      setNotif('lang_please_select_at_least');
    } else {
      // const listHaveAppName = selectedfdRows.filter((e: any) => e.app_name)
      // compare app name
      const check = true;
      if (check) {
        setNotif('lang_cannot_edit_multiple_row_diff_user_id');
      } else {
        showModal({
          component: AppAccessSetup,
          props: {
            data: selectedfdRows,
            callback: onTableChange,
          },
        });
      }
    }
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
      <ConfirmModal open={!!notif} onSubmit={() => setNotif('')} alertContent={notif} textSubmit="lang_ok" />
    </div>
  );
};

export default AccessManagement;
