/*
 * Created on Fri Jan 06 2023
 *
 * Report screen
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { FIELD, STATUS_OPTIONS, STATUS_OPTIONS_HEADER } from './ReportConstants';
import { ITableConfig, LooseObject } from 'models/ICommon';
import { enqueueSnackbarAction } from 'actions/app.action';
import httpRequest from 'services/httpRequest';
import { getListReportUrl, getReportUrl } from 'apis/request.url';
import IressSignIn from 'features/IressAuth';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { iressSitenameSelector, iressTokenSelector } from 'selectors/auth.selector';
import { iressLogout } from 'actions/auth.action';
import authService from 'services/authService';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
type TableHandle = React.ElementRef<typeof CustomTable>;
type ReportProps = {};

const Report: React.FC<ReportProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);
  const callWithIress = React.useRef<boolean>(false);
  const dicReport = React.useRef<any>({});
  const iressToken = useSelector(iressTokenSelector);
  const sitename = useSelector(iressSitenameSelector);
  const { showSubModal, hideSubModal } = useGlobalModalContext();

  /**
   * Get list report byb default or with iress auth
   * @param token iress token
   * @param sn sitename
   */
  const getData = async (token?: string, sn?: string) => {
    try {
      if (token) callWithIress.current = true;
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();

      const headerConfig: { headers?: LooseObject } = {};
      // if have iress auth data get report by iress
      if (token && sn) {
        config.page = 1;
        headerConfig.headers = {
          'token-app': token || iressToken,
          'site-name': sn || sitename,
        };
      }
      const response: any = await httpRequest.get(getListReportUrl(config), headerConfig);

      (response.data.data || [])?.forEach((e: any) => {
        dicReport.current[e[FIELD.TEMPLATE_ID]] = e;
      }, {});

      gridRef?.current?.setData?.(response.data);
    } catch (error) {
      if (authService.checkIressSessionLogout(error.errorCode)) {
        dispatch(iressLogout());
        dispatch(
          enqueueSnackbarAction({
            message: `error_code_${error?.errorCode}`,
            key: new Date().getTime() + Math.random(),
            variant: 'error',
          }),
        );
        showSubModal({
          title: 'lang_sign_in',
          component: IressSignIn,
          styleModal: { minWidth: 440 },
          props: {
            title: 'lang_please_sign_in_to_fetch_report',
            cbAfterSignIn: getData,
          },
        });
      } else {
        gridRef?.current?.setData?.();
        dispatch(
          enqueueSnackbarAction({
            message: error?.errorCodeLang,
            key: new Date().getTime() + Math.random(),
            variant: 'error',
          }),
        );
      }
      gridRef?.current?.setLoading?.(false);
    }
  };

  /**
   * Handle fetch report or show iress login popup when not login yet
   */
  const handleFetch = () => {
    if (iressToken) {
      getData(iressToken, sitename + '');
    } else {
      showSubModal({
        title: 'lang_sign_in',
        component: IressSignIn,
        styleModal: { minWidth: 440 },
        props: {
          title: 'lang_please_sign_in_to_fetch_report',
          cbAfterSignIn: getData,
        },
      });
    }
  };

  /**
   * recall data when table change
   */
  const onTableChange = () => {
    if (callWithIress.current) {
      getData(iressToken + '', sitename + '');
    } else {
      getData();
    }
  };

  // table columns
  const columns = React.useMemo(() => {
    return [
      {
        name: FIELD.REPORT_NAME,
        label: 'lang_report_name',
      },
      {
        name: FIELD.REPORT_TYPE,
        label: 'lang_report_type',
      },
      {
        name: FIELD.TEMPLATE_ID,
        label: 'lang_template_id',
        sort: false,
      },
      {
        name: FIELD.SITE_NAME,
        label: 'lang_sitename',
        sort: false,
      },
      {
        name: FIELD.STATUS,
        label: 'lang_status',
        dataOptions: STATUS_OPTIONS,
        dataOptionsHeader: STATUS_OPTIONS_HEADER,
        type: COLUMN_TYPE.DROPDOWN_WITH_BG,
        sort: false,
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
   * Get row id by row data
   * @param data row data
   * @returns row id
   */
  const getRowId = (data: any) => {
    return data[FIELD.TEMPLATE_ID];
  };

  /**
   * Handle show edit report modal
   */
  const confirmEditReport = React.useCallback(async (data: any, callback: () => void) => {
    try {
      await httpRequest.put(getReportUrl(), data);
      callback?.();
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_report_information_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_report_information_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  }, []);

  /**
   * Handle save edited reports
   * @param dicDataChanged list row changed
   * @param cb success callback when save success
   */
  const onSaveReport = (dicDataChanged: LooseObject, cb: any) => {
    const data = Object.keys(dicDataChanged).map((k) => ({
      ...dicDataChanged[k],
      [FIELD.SITE_NAME]: dicReport.current[k][FIELD.SITE_NAME],
      [FIELD.TEMPLATE_ID]: k,
    }));
    confirmEditReport(data, cb);
  };

  /**
   * Handle iress signout
   */
  const handleSignOut = () => {
    showSubModal({
      title: 'lang_confirm',
      component: ConfirmEditModal,
      props: {
        title: 'lang_confirm_logout',
        emailConfirm: false,
        onSubmit: () => {
          dispatch(iressLogout());
          hideSubModal();
          getData();
        },
      },
    });
  };

  /**
   * List button of header table
   */
  const listBtnHeader = [
    {
      label: 'lang_fetch_report',
      onClick: handleFetch,
      isShow: true,
      disabledEditMode: true,
    },
    {
      label: 'lang_sign_out',
      onClick: handleSignOut,
      variant: 'outlined',
      isShow: iressToken ? true : false,
      color: 'error',
    },
  ];

  /**
   * Get data at first load
   */
  React.useEffect(() => {
    getData();
    window.confirmEdit = (cb: () => void) => {
      const hasChanged = gridRef?.current?.checkChange?.();
      if (hasChanged) {
        showSubModal({
          title: 'lang_confirm_cancel',
          component: ConfirmEditModal,
          props: {
            title: 'lang_confirm_cancel_text',
            cancelText: 'lang_no',
            confirmText: 'lang_yes',
            emailConfirm: false,
            onSubmit: () => {
              hideSubModal();
              cb?.();
            },
          },
        });
      } else {
        cb?.();
      }
    };
    return () => {
      window.confirmEdit = null;
    };
  }, []);

  return (
    <div className={classes.container}>
      <CustomTable
        editable
        listBtn={listBtnHeader}
        name="report"
        fnKey={getRowId}
        ref={gridRef}
        noChangeKey="lang_there_is_no_change_in_the_report_information"
        onSave={onSaveReport}
        onTableChange={onTableChange}
        columns={columns}
        noDataText="lang_no_data"
      />
    </div>
  );
};

export default Report;
