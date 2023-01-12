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
import { iressSitenameSelector, iressTokenSelector } from 'selectors/auth.selector';
import { iressLogout } from 'actions/auth.action';
import ConfirmModal from 'components/molecules/ConfirmModal';

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
  const dicReport = React.useRef<any>({});
  const iressToken = useSelector(iressTokenSelector);
  const sitename = useSelector(iressSitenameSelector);
  const { showSubModal } = useGlobalModalContext();
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);

  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();

      const response: any = await httpRequest.get(getListReportUrl(config), {
        headers: { 'token-app': iressToken, 'site-name': sitename },
      });

      response.data.map((e: any) => {
        dicReport.current[e[FIELD.TEMPLATE_ID]] = e;
      }, {});

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

  const handleFetch = () => {
    // do something
    console.log('handle fetch report');
    if (iressToken) {
      getData();
    } else {
      showSubModal({
        title: 'lang_sign_in',
        component: IressSignIn,
        styleModal: { minWidth: 440 },
        props: {
          cbAfterSignIn: getData,
        },
      });
    }
  };

  const onTableChange = () => {
    // getData();
  };
  const getActions = () => {};
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
      },

      {
        name: FIELD.SITE_NAME,
        label: 'lang_sitename',
      },
      {
        name: FIELD.STATUS,
        label: 'lang_status',
        dataOptions: STATUS_OPTIONS,
        dataOptionsHeader: STATUS_OPTIONS_HEADER,
        type: COLUMN_TYPE.DROPDOWN_WITH_BG,
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
    return data[FIELD.TEMPLATE_ID];
  };

  React.useEffect(() => {
    gridRef?.current?.setData?.();
  });

  const confirmEditReport = React.useCallback(async (data: any, callback: () => void) => {
    try {
      await httpRequest.put(getReportUrl(), data);
      callback?.();
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_user_information_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_user_information_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  }, []);
  const onSaveReport = (dicDataChanged: LooseObject, cb: any) => {
    const data = Object.keys(dicDataChanged).map((k) => ({
      ...dicDataChanged[k],
      [FIELD.SITE_NAME]: dicReport.current[k][FIELD.SITE_NAME] || 'iress.com.vn',
      [FIELD.TEMPLATE_ID]: k,
    }));
    confirmEditReport(data, cb);
  };
  const onCloseLogout = () => {
    setLogoutModalOpen(false);
  };
  const handleSignOut = () => {
    setLogoutModalOpen(true);
  };
  const onConfirmLogout = async () => {
    dispatch(iressLogout());
  };

  const listBtnHeader = [
    {
      label: 'lang_fetch_report',
      onClick: handleFetch,
      isShow: true,
    },
    {
      label: 'lang_sign_out',
      onClick: handleSignOut,
      variant: 'outlined',
      isShow: iressToken ? true : false,
      sx: { color: '#FF435F', borderColor: '#FF435F' },
    },
  ];
  return (
    <div className={classes.container}>
      <CustomTable
        editable
        listBtn={listBtnHeader}
        name="user_management"
        fnKey={getRowId}
        ref={gridRef}
        onSave={onSaveReport}
        onRowDbClick={onRowDbClick}
        onTableChange={onTableChange}
        columns={columns}
        // noDataText="lang_no_matching_records_found"
      />
      <ConfirmModal
        open={logoutModalOpen}
        alertTitle="lang_sign_out"
        alertContent="lang_confirm_logout"
        onClose={onCloseLogout}
        onSubmit={onConfirmLogout}
      />
    </div>
  );
};

export default Report;
