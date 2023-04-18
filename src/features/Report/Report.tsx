/*
 * Created on Fri Jan 06 2023
 *
 * Report screen
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import makeStyles from '@mui/styles/makeStyles';
import { enqueueSnackbarAction } from 'actions/app.action';
import { getListReportUrl, getReportUrl } from 'apis/request.url';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import { useGlobalModalContext } from 'containers/Modal';
import useConfirmEdit from 'hooks/useConfirmEdit';
import { ITableConfig, LooseObject } from 'models/ICommon';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { iressSitenameSelector } from 'selectors/auth.selector';
import httpRequest from 'services/httpRequest';
import { FIELD, STATUS_OPTIONS, STATUS_OPTIONS_HEADER } from './ReportConstants';

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
  const { showModal, hideModal } = useGlobalModalContext();
  const confirmEdit = useConfirmEdit(() => !!gridRef?.current?.checkChange?.()); // eslint-disable-line
  const sitename = useSelector(iressSitenameSelector);
  /**
   * Get list report byb default or with iress auth
   * @param token iress token
   * @param sn sitename
   */
  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const headerConfig: { headers?: LooseObject } = {};
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      if (config.customSearch) {
        // handle search by app name
      }
      headerConfig.headers = { 'site-name': sitename };
      config.page = 1;
      const response: any = await httpRequest.get(getListReportUrl(config), headerConfig);

      (response.data.data || [])?.forEach((e: any) => {
        dicReport.current[e[FIELD.TEMPLATE_ID]] = e;
      }, {});

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
      gridRef?.current?.setLoading?.(false);
    }
  };

  /**
   * Handle fetch report or show iress login popup when not login yet
   */
  const handleFetch = () => {
    showModal({
      component: ConfirmEditModal,
      props: {
        emailConfirm: false,
        title: 'lang_fetch_report_for_sitename',
        titleTransValues: { sitename: sitename },
        isTitleValuesBold: false,
        cancelText: 'lang_cancel',
        confirmText: 'lang_fetch_report',
        centerTitle: true,
        centerButton: true,
        onSubmit: () => {
          getData();
          hideModal();
        },
      },
    });
  };

  /**
   * recall data when table change
   */
  const onTableChange = () => {
    getData();
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
   * Get data at first load
   */
  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div className={classes.container}>
      <CustomTable
        editable
        name="report"
        fnKey={getRowId}
        ref={gridRef}
        noChangeKey="lang_there_is_no_change_in_the_report_information"
        onSave={onSaveReport}
        onTableChange={onTableChange}
        columns={columns}
        showSitename
        searchAppName
      />
    </div>
  );
};

export default Report;
