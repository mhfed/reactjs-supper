/*
 * Created on Fri Jan 06 2023
 *
 * Report screen
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { FIELD, STATUS_OPTIONS, STATUS_OPTIONS_HEADER } from './ReportConstants';
import { ITableConfig } from 'models/ICommon';
import { enqueueSnackbarAction } from 'actions/app.action';
import httpRequest from 'services/httpRequest';
import { getListReportUrl } from 'apis/request.url';

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

  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const response: any = await httpRequest.get(getListReportUrl(config));
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
    //do something
    console.log('handle fetch report');
    getData();
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

  const listBtn = React.useMemo(() => {
    return [
      {
        label: 'lang_fetch_report',
        onClick: handleFetch,
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

  return (
    <div className={classes.container}>
      <CustomTable
        editable
        listBtn={listBtn}
        name="user_management"
        fnKey={getRowId}
        ref={gridRef}
        onRowDbClick={onRowDbClick}
        onTableChange={onTableChange}
        columns={columns}
        // noDataText="lang_no_matching_records_found"
      />
    </div>
  );
};

export default Report;
