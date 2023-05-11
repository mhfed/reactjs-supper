/*
 * Created on Fri Jan 06 2023
 *
 * Audit Trail Screen
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import { enqueueSnackbarAction } from 'actions/app.action';
import { getAuditTrailUrl, getSearchAppNameUrl } from 'apis/request.url';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import { ITableConfig, LooseObject } from 'models/ICommon';
import React from 'react';
import { useDispatch } from 'react-redux';
import { httpRequest } from 'services/initRequest';
import { useFormik } from 'formik';
import { InputField, SelectField, AutocompleteField, RangeDate } from 'components/fields';
import { Trans } from 'react-i18next';
import Button from 'components/atoms/ButtonBase';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    display: 'flex',
    width: '100%',
  },
  filterContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
}));
type TableHandle = React.ElementRef<typeof CustomTable>;
type ReportProps = {};

const FIELD = {
  DATETIME: 'datetime',
  ACTION: 'action',
  FUNCTION: 'function',
  DESCRIPTION: 'description',
  MODIFIED_BY: 'modified_by',
  STATUS: 'status',
};

const AUDIT_TRAIL_STATUS = {
  SUCCESSFUL: 'successful',
  UNSUCCESSFUL: 'unsuccessful',
};
const AUDIT_TRAIL_STATUS_OPTIONS = [
  { label: 'lang_successful', value: AUDIT_TRAIL_STATUS.SUCCESSFUL, color: 'success' },
  { label: 'lang_unsuccessful', value: AUDIT_TRAIL_STATUS.UNSUCCESSFUL, color: 'warning' },
];

const FUNCTION = {
  NOTIFICATIONS: 'notifications',
  ARTICLES: 'articles',
  REPORTS: 'reports',
  ACCESS_MANAGEMENT: 'access_management',
  PORTFOLIO: 'portfolio',
  LOGIN: 'login',
};

const FUNCTION_OPTIONS = [
  { label: 'lang_notifications', value: FUNCTION.NOTIFICATIONS },
  { label: 'lang_articles', value: FUNCTION.ARTICLES },
  { label: 'lang_reports', value: FUNCTION.REPORTS },
  { label: 'lang_access_management', value: FUNCTION.ACCESS_MANAGEMENT },
  { label: 'lang_portfolio', value: FUNCTION.PORTFOLIO },
  { label: 'lang_login', value: FUNCTION.LOGIN },
];

const ACTION = {
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  LOGIN: 'login',
};

const ACTION_OPTIONS = [
  { label: 'lang_create', value: ACTION.CREATE },
  { label: 'lang_edit', value: ACTION.EDIT },
  { label: 'lang_delete', value: ACTION.DELETE },
  { label: 'lang_login', value: ACTION.LOGIN },
];

const initialValues = {
  app_name: window.apps?.[0] || '',
  sitename: localStorage.getItem('sitename'),
  function: FUNCTION_OPTIONS[0].value,
  fromDate: moment().add(-7, 'days').startOf('day'),
  toDate: moment().endOf('day'),
};

const AuditTrail: React.FC<ReportProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);

  /**
   * Handle submit form
   * @param values form data
   */
  const handleFormSubmit = (values: any) => {};

  /**
   * Register formik form handle
   */
  const {
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    setValues,
    setTouched,
    handleChange,
    handleBlur,
  } = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
  });

  /**
   * get elastic search query
   */
  const getQueryBody = (config: ITableConfig) => {
    try {
      const requestBody: any = { query: { bool: { must: [] } } };
      if (config?.sort?.sortField) {
        requestBody.sort = { [config.sort.sortField]: config.sort.sortType };
      }
      requestBody.query.bool.must.push({ term: { function: values.function } });
      if (values.function !== FUNCTION.ACCESS_MANAGEMENT && values.app_name) {
        requestBody.query.bool.must.push({ term: { bundle_id: values.app_name?.bundle_id || values.app_name } });
      }
      requestBody.query.bool.must.push({ range: { datetime: { gte: +moment(values.fromDate), lte: +moment(values.toDate) } } });
      if (config.searchText) {
        requestBody.query.bool.must.push({ query_string: { query: `*${config.searchText}*` } });
      }
      console.log('YOLO: ', requestBody);
      return requestBody;
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  /**
   * Get list audit trail
   */
  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const url = getAuditTrailUrl(config);
      const response: any = await httpRequest.post(url, getQueryBody(config));
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
      gridRef?.current?.setLoading?.(false);
    }
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
        name: FIELD.DATETIME,
        label: 'lang_datetime',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.ACTION,
        label: 'lang_action',
        dataOptions: ACTION_OPTIONS,
        textTransform: 'capitalize',
        type: COLUMN_TYPE.DROPDOWN,
      },
      {
        name: FIELD.FUNCTION,
        label: 'lang_function',
        sort: false,
        textTransform: 'capitalize',
        dataOptions: FUNCTION_OPTIONS,
        type: COLUMN_TYPE.DROPDOWN,
      },
      {
        name: FIELD.DESCRIPTION,
        label: 'lang_description',
      },
      {
        name: FIELD.MODIFIED_BY,
        label: 'lang_modified_by',
      },
      {
        name: FIELD.STATUS,
        label: 'lang_status',
        dataOptions: AUDIT_TRAIL_STATUS_OPTIONS,
        type: COLUMN_TYPE.DROPDOWN_WITH_BG,
      },
      {
        name: 'ACTION_COLUMN',
        type: COLUMN_TYPE.ACTION,
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
    return data[FIELD.DATETIME];
  };

  /**
   * Handle reset filter and recall data
   */
  const onReset = () => {
    setValues(initialValues, false).then(() => {
      getData();
    });
  };

  /**
   * Get data at first load
   */
  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div className={classes.container}>
      <form className={classes.formContainer} noValidate onSubmit={handleSubmit}>
        <div className={classes.filterContainer}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InputField name="sitename" label="lang_sitename" fullWidth disabled maxLength={255} value={values.sitename} />
            </Grid>
            <Grid item xs={6}>
              <AutocompleteField
                name="app_name"
                label="lang_app_name"
                multiple={false}
                getUrl={getSearchAppNameUrl}
                isOptionEqualToValue={(option: LooseObject, value: LooseObject) => {
                  return option.bundle_id === value.bundle_id;
                }}
                getOptionLabel={(option) => option.display_name || ''}
                value={values.app_name}
                onChange={(value) => setFieldValue('app_name', value || '')}
                onBlur={() => setFieldTouched('app_name', true, true)}
                error={touched.app_name && Boolean(errors.app_name)}
                helperText={(touched.app_name && errors.app_name) as string}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectField
                options={FUNCTION_OPTIONS}
                name="function"
                label="lang_function"
                fullWidth
                value={values?.function}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched?.function && Boolean(errors?.function)}
                helperText={touched.function && errors.function}
              />
            </Grid>
            <Grid item xs={6}>
              <RangeDate
                name="datetime"
                label="lang_date"
                from={values.fromDate}
                to={values.toDate}
                fullWidth
                onChange={(e: any) => {
                  setFieldValue('fromDate', e.from, false);
                  setFieldValue('toDate', e.to, false);
                }}
                error={touched.date && Boolean(errors.date)}
                helperText={touched.date && errors.date}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.buttonContainer}>
          <Button variant="outlined" sx={{ ml: 2 }} network onClick={onReset}>
            <Trans>lang_reset</Trans>
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={getData} network>
            <Trans>lang_apply</Trans>
          </Button>
        </div>
      </form>
      <CustomTable editable name="audit_trail" fnKey={getRowId} ref={gridRef} onTableChange={onTableChange} columns={columns} />
    </div>
  );
};

export default AuditTrail;
