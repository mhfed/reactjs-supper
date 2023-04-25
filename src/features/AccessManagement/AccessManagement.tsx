/*
 * Created on Fri Jan 06 2023
 *
 * Articles management screen
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { getAccessManagementSearchUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import { httpRequest } from 'services/initRequest';
import { ITableConfig } from 'models/ICommon';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { useGlobalModalContext } from 'containers/Modal';
import AppAccessSetup from './AppAccessSetup';
import ConfirmModal from 'components/molecules/ConfirmModal';
import { IBundle } from 'models/ICommon';
import { compareArray } from 'helpers/common';

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
  LAST_UPDATED: 'last_update',
  APP_NAME: 'display_name',
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
      const response: any = await httpRequest.get(getAccessManagementSearchUrl(config));
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
        formatter: (data: any) => data?.app?.map((e: IBundle) => e.display_name).filter((x: string) => x),
      },
      {
        name: 'ACTION_COLUMN',
        type: COLUMN_TYPE.ACTION,
        getActions: () => {},
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
    return data[FIELD.USER_ID];
  };

  const onEdit = () => {
    const selectedRows = gridRef.current?.getRowSelected();
    if (!selectedRows?.length) {
      setNotif('lang_please_select_at_least');
    } else {
      let check = false;
      let listFull: string[] = [];
      let max = selectedRows[0].app.length;
      let min = max;
      const listHaveAppName = selectedRows.filter((e: any) => {
        if (e?.app?.length) {
          if (e.app.length >= max) {
            max = e.app.length;
            listFull = [...e.app];
          }
          if (e.app.length < min) min = e.app.length;
        }
        return e?.app?.length;
      });
      if (min !== max) check = true;
      else {
        const listCheck = listHaveAppName.map((e: any) => e.app.map((e: IBundle) => e.bundle_id));
        for (let index = 1; index < listCheck.length; index++) {
          const element = listCheck[index];
          if (compareArray(element, listCheck[0])) {
            check = true;
            break;
          }
        }
      }
      // compare app name
      if (check && selectedRows.length > 1) {
        setNotif('lang_cannot_edit_multiple_row_diff_user_id');
      } else {
        showModal({
          component: AppAccessSetup,
          props: {
            data: selectedRows,
            listFull,
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
        name="access_management"
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
