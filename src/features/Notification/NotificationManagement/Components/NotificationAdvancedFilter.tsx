import React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from 'components/atoms/ButtonBase';
import { Trans } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import { AutocompleteField, DatePickerField, SelectField } from 'components/fields';
import { getSearchAppNameUrl } from 'apis/request.url';
import { LooseObject } from 'models/ICommon';
import { Typography } from '@mui/material';
import { SEARCH_BY_DROPDOWN, SEARCH_BY_TYPE } from 'features/Notification/CreateNewNotification/NotificationConstant';
import { diff } from 'deep-diff';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  container: {
    maxWidth: 400,
  },
  labelField: {
    fontSize: 14,
    color: theme.palette.background.disabled,
  },
}));

type NotificationAdvancedFilterProps = {
  initialValues?: LooseObject;
  onClose: () => void;
  onApply: (values: LooseObject, isNoChange: boolean) => void;
};

const defaultValues = {
  app_name: [],
  notification_category: SEARCH_BY_TYPE.created_by,
  from: '',
  to: '',
};

const NotificationAdvancedFilter: React.FC<NotificationAdvancedFilterProps> = ({
  onClose,
  onApply,
  initialValues = defaultValues,
}) => {
  const classes = useStyles();

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
    handleBlur,
    setFieldValue,
    handleChange,
    setFieldTouched,
    setValues,
    setTouched,
  } = useFormik({
    initialValues: Object.values(initialValues || {})?.length ? initialValues : defaultValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  /**
   * Clear all advanced filter
   */
  const onClearAll = () => {
    setValues(defaultValues, false);
    setTouched({});
  };

  /**
   * Apply new advanced filter
   */
  const onApplyFilter = () => {
    let filterValues = { ...values };
    if (values?.app_name?.length === 0 && !values.from && !values.to) filterValues = {};
    onApply(filterValues, !diff(values, defaultValues));
  };

  const isCreateBy = values.notification_category === SEARCH_BY_TYPE.created_by;

  return (
    <div>
      <form className={classes.container} noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item container xs={12} spacing={1}>
            <Grid item xs={6} display={'flex'} alignItems={'center'}>
              <Typography className={classes.labelField}>
                <Trans>lang_search_by</Trans>:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <SelectField
                options={SEARCH_BY_DROPDOWN}
                name="notification_category"
                id="notification_category"
                fullWidth
                onBlur={handleBlur}
                value={values.notification_category}
                onChange={handleChange}
                customSelect={true}
              />
            </Grid>
          </Grid>

          <Grid item container xs={12} spacing={1}>
            <Grid item xs={6}>
              <DatePickerField
                name="from"
                value={values.from}
                placeholder={'lang_from'}
                inputFormat={'DD/MM/YYYY'}
                onChange={(v) => setFieldValue('from', v ? new Date(v) : v)}
                onBlur={handleBlur}
                maxDate={isCreateBy ? values.to || new Date() : values.to}
                hideTabs={true}
                size="small"
                typeDatePicker="DatePicker"
              />
            </Grid>
            <Grid item xs={6}>
              <DatePickerField
                name="to"
                value={values.to}
                placeholder={'lang_to'}
                inputFormat={'DD/MM/YYYY'}
                onChange={(v) => setFieldValue('to', v ? new Date(v) : v)}
                onBlur={handleBlur}
                minDate={values.from}
                maxDate={isCreateBy ? new Date() : undefined}
                hideTabs={true}
                size="small"
                typeDatePicker="DatePicker"
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography className={classes.labelField} style={{ paddingBottom: 12 }}>
              <Trans>lang_search_by_app_name</Trans>
            </Typography>
            <AutocompleteField
              name="app_name"
              required
              customSearch={true}
              placeholder="lang_app_name"
              getUrl={getSearchAppNameUrl}
              isOptionEqualToValue={(option: LooseObject, value: LooseObject) => {
                return option.bundle_id === value.bundle_id;
              }}
              InputProps={{
                style: { minHeight: 112 },
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
        </Grid>
      </form>
      <Stack className={classes.buttonWrapper} direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="text"
          color="error"
          className="buttonClear"
          disabled={!diff(defaultValues, values)}
          sx={{ textTransform: 'uppercase !important' }}
          scrollToTop
          onClick={onClearAll}
        >
          <Trans>lang_clear_all</Trans>
        </Button>
        <Button variant="outlined" scrollToTop onClick={onClose}>
          <Trans>lang_cancel</Trans>
        </Button>
        <Button network variant="contained" onClick={onApplyFilter}>
          <Trans>lang_apply</Trans>
        </Button>
      </Stack>
    </div>
  );
};

const validationSchema = yup.object().shape({});

export default NotificationAdvancedFilter;
