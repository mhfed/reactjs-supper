import React from 'react';
import { Grid } from '@mui/material';
import { FormikProps } from 'formik';
import {
  DELIVERY_TYPE_OPTION,
  NOTIFICATION_TYPE_OPTION,
  TYPE_URL_OPTIONS,
  EXPIRE_OPTION,
  DELIVERY_TYPE,
} from 'features/Notification/CreateNewNotification/NotificationConstant';
import RadioGroupField from 'components/fields/RadioGroupField';
import { AutocompleteAsyncField, InputField, SelectField, DatePickerField } from 'components/fields';
import { initialValuesType, isOptionEqualToValue } from './index';
import { ClassNameMap } from 'notistack';

interface FormCreateNotifiactionProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'wrapper' | 'radioField' | 'formContainer'>;
}

const FormCreateNotifiaction: React.FC<FormCreateNotifiactionProps> = ({ form, classes, ...rest }) => {
  const { values, handleChange, handleBlur, touched, errors, setFieldValue } = form || {};

  const renderAutocompleteField = () => {
    switch (values.notification_type) {
      default: {
        return (
          <React.Fragment>
            <Grid item xs={12} style={{ paddingBottom: 3 }}>
              <AutocompleteAsyncField
                onBlur={handleBlur}
                isOptionEqualToValue={isOptionEqualToValue}
                onChange={(v: string) => setFieldValue('subscribers', v)}
                error={touched.subscribers && Boolean(errors.subscribers)}
                helperText={touched.subscribers && errors.subscribers}
                value={values.subscribers}
                required={true}
                label="lang_subscribers"
                defaultValue={[]}
                fullWidth={true}
                id="subscribers"
              />
            </Grid>
          </React.Fragment>
        );
      }
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12} md={6} spacing={2}>
        <Grid item xs={12} className="lineWidthField">
          <RadioGroupField
            name="notification_type"
            label="lang_notification_type"
            data={NOTIFICATION_TYPE_OPTION}
            required={true}
            rowItems={true}
            disabled={true}
            value={values?.notification_type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched?.notification_type && Boolean(errors?.notification_type)}
            helperText={touched.notification_type && errors.notification_type}
          />
        </Grid>
        {/* {renderAutocompleteField()} */}
        <Grid item xs={12}>
          <InputField
            name="title"
            label="lang_title"
            required
            fullWidth
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <InputField
            name="message"
            label="lang_message"
            required
            fullWidth
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.message && Boolean(errors.message)}
            helperText={touched.message && errors.message}
            multiline={true}
            rows={5}
          />
        </Grid> */}
        <Grid item xs={12}>
          <SelectField
            options={TYPE_URL_OPTIONS}
            name="type_url"
            label="lang_type_url"
            id="type_url"
            fullWidth={true}
            required={true}
            onBlur={handleBlur}
            value={values.type_url}
            onChange={handleChange}
            error={touched.type_url && Boolean(errors.type_url)}
            helperText={touched.type_url && errors.type_url}
          />
        </Grid>
      </Grid>
      <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
        <React.Fragment>
          <Grid item xs={12}>
            <Grid item container xs={12}>
              <Grid item xs={12}>
                <RadioGroupField
                  name="delivery_type"
                  label="lang_delivery_type"
                  data={DELIVERY_TYPE_OPTION}
                  required={true}
                  rowItems={true}
                  value={values?.delivery_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched?.delivery_type && Boolean(errors?.delivery_type)}
                  helperText={touched.delivery_type && errors.delivery_type}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid item container xs={12} spacing={2}>
              <Grid item xs={6} xl={3}>
                <Grid item xs={12}>
                  <InputField
                    name="expire"
                    label="lang_expire"
                    fullWidth
                    value={values.expire}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.expire && Boolean(errors.expire)}
                    helperText={touched.expire && errors.expire}
                  />
                </Grid>
              </Grid>
              <Grid item xs={6} xl={3}>
                <SelectField
                  options={EXPIRE_OPTION}
                  name="type_expired"
                  label="lang_type"
                  id="type_expired"
                  fullWidth={true}
                  onBlur={handleBlur}
                  value={values.type_expired}
                  onChange={handleChange}
                  error={touched.type_expired && Boolean(errors.type_expired)}
                  helperText={touched.type_expired && errors.type_expired}
                />
              </Grid>
              <Grid item xs={12} xl={6}>
                {values?.delivery_type === DELIVERY_TYPE.Instant ? (
                  <></>
                ) : (
                  <DatePickerField
                    name="schedule"
                    required={true}
                    value={values.schedule}
                    label={'lang_schedule_time'}
                    inputFormat={'MM/DD/YYYY HH:mm'}
                    onChange={(v: string) => setFieldValue('schedule', v ? new Date(v) : v)}
                    onBlur={handleBlur}
                    fullWidth={true}
                    minDate={new Date()}
                    error={touched.schedule && Boolean(errors.schedule)}
                    helperText={touched.schedule && errors.schedule}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      </Grid>
      <Grid item container xs={12} spacing={2}>
        {renderAutocompleteField()}
      </Grid>
    </Grid>
  );
};

export default FormCreateNotifiaction;
