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
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import { useGlobalModalContext } from 'containers/Modal';
import useConfirmEdit from 'hooks/useConfirmEdit';
import { ITableConfig, LooseObject } from 'models/ICommon';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { iressSitenameSelector } from 'selectors/auth.selector';
import { httpRequest } from 'services/initRequest';
import { FIELD, STATUS_OPTIONS, REPORT_STATUS } from './ReportConstants';
import EditReport, { ReportParam } from './EditReport';

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
type DicDataReport = {
  [key: string]: LooseObject;
};

const Report: React.FC<ReportProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);
  const dicData = React.useRef<DicDataReport>({});
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
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      let url = getListReportUrl(config);
      if (config.customSearch?.bundle_id) {
        url += `&bundle_id=${config.customSearch.bundle_id}`;
      }
      const response: any = await httpRequest.get(url);
      if (response.data?.data?.length) {
        dicData.current = response.data.data.reduce((acc: LooseObject, cur: LooseObject) => {
          acc[cur[FIELD.ID]] = cur;
          return acc;
        }, {});
      }
      gridRef?.current?.setData?.(response.data);
    } catch (error) {
      dicData.current = {};
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
   * recall data when table change
   */
  const onTableChange = () => {
    getData();
  };

  /**
   * Update status for report
   * @param data row data
   */
  const updateStatusReport = async (data: LooseObject, newStatus: string) => {
    try {
      gridRef?.current?.setLoading?.(true);
      await httpRequest.put(getReportUrl('status'), {
        [FIELD.ID]: data[FIELD.ID],
        [FIELD.STATUS]: newStatus,
        [FIELD.BUNDLE_ID]: data?.application_user?.bundle_id,
      });
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_report_updated_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      if (dicData.current[data[FIELD.ID]]) {
        dicData.current[data[FIELD.ID]][FIELD.STATUS] = newStatus;
        gridRef?.current?.setData?.(Object.values(dicData.current));
      }
    } catch (error) {
      gridRef?.current?.setLoading?.(false);
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
   * Get action row by row data
   * @param data row data
   */
  const getActions = (data: any) => {
    const isEnabled = data[FIELD.STATUS] === REPORT_STATUS.ENABLED;
    const actions = [
      {
        label: 'lang_edit',
        onClick: (data: any) => {
          showModal({
            component: EditReport,
            fullScreen: true,
            props: {
              data,
              callback: onTableChange,
            },
          });
        },
      },
      {
        label: isEnabled ? 'lang_disabled' : 'lang_enabled',
        onClick: (data: any) => updateStatusReport(data, isEnabled ? REPORT_STATUS.DISABLED : REPORT_STATUS.ENABLED),
      },
    ];
    return actions;
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
      },
      {
        name: FIELD.APP_NAME,
        label: 'lang_app_name',
        formatter: (data: any) => data?.application_user?.display_name,
      },
      {
        name: FIELD.PARAMETERS,
        label: 'lang_parameters',
        formatter: (data: any) =>
          data?.params.map((e: ReportParam) => `[${e.title || process.env.REACT_APP_DEFAULT_VALUE}]`).join(', '),
        sort: false,
      },
      {
        name: FIELD.STATUS,
        label: 'lang_status',
        dataOptions: STATUS_OPTIONS,
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

  /**
   * Get row id by row data
   * @param data row data
   * @returns row id
   */
  const getRowId = (data: any) => {
    return data[FIELD.ID];
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
        onTableChange={onTableChange}
        columns={columns}
        showSitename
        searchAppName
      />
    </div>
  );
};

export default Report;
