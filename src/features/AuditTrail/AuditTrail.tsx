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
import { yup } from 'helpers';
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

const STATUS_OPTIONS = {
  SUCCESSFUL: 'successful',
  UNSUCCESSFUL: 'unsuccessful',
};

const FUNCTION_OPTIONS = [
  { label: 'lang_notifications', value: 'notifications' },
  { label: 'lang_articles', value: 'articles' },
  { label: 'lang_reports', value: 'reports' },
  { label: 'lang_access_management', value: 'access_management' },
  { label: 'lang_portfolio', value: 'portfolio' },
  { label: 'lang_login', value: 'login' },
];

const initialValues = {
  app_name: '',
  sitename: localStorage.getItem('sitename'),
  function: '',
  from_date: moment().add(-7, 'days').startOf('day'),
  to_date: moment().endOf('day'),
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
    validationSchema: {},
    onSubmit: handleFormSubmit,
  });

  /**
   * Get list audit trail
   */
  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      let url = getAuditTrailUrl(config);
      const response: any = await httpRequest.post(url, {});
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
      },
      {
        name: FIELD.FUNCTION,
        label: 'lang_function',
        sort: false,
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
        dataOptions: STATUS_OPTIONS,
        type: COLUMN_TYPE.DROPDOWN_WITH_BG,
      },
      {
        name: 'ACTION_COLUMN',
        type: COLUMN_TYPE.ACTION,
        label: '',
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
              <InputField
                name="sitename"
                label="lang_sitename"
                required
                fullWidth
                disabled
                maxLength={255}
                value={values.sitename}
              />
            </Grid>
            <Grid item xs={6}>
              <AutocompleteField
                name="app_name"
                label="lang_app_name"
                required
                getUrl={getSearchAppNameUrl}
                isOptionEqualToValue={(option: LooseObject, value: LooseObject) => {
                  return option.bundle_id === value.bundle_id;
                }}
                getOptionLabel={(option) => option.display_name}
                getChipLabel={(option) => option.display_name}
                value={values.app_name}
                onChange={(value) => setFieldValue('app_name', value)}
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
                required
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
                name="date"
                required
                label="lang_date"
                from={values.from_date}
                to={values.to_date}
                fullWidth
                onChange={(e: any) => {
                  setFieldValue('from_date', e.from, false);
                  setFieldValue('to_date', e.to, false);
                }}
                error={touched.date && Boolean(errors.date)}
                helperText={touched.date && errors.date}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.buttonContainer}>
          <Button variant="outlined" sx={{ ml: 2 }}>
            <Trans>lang_reset</Trans>
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} network>
            <Trans>lang_apply</Trans>
          </Button>
        </div>
      </form>
      <CustomTable editable name="audit_trail" fnKey={getRowId} ref={gridRef} onTableChange={onTableChange} columns={columns} />
    </div>
  );
};

export default AuditTrail;
