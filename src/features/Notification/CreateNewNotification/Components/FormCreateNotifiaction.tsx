import React from 'react';
import { Grid } from '@mui/material';
import { FormikProps } from 'formik';
import {
  DELIVERY_TYPE_OPTION,
  NOTIFICATION_TYPE_OPTION,
  TYPE_URL_OPTIONS,
  NOTIFICATION_TYPE,
  EXPIRE_OPTION,
  DELIVERY_TYPE,
} from '../NotificationConstant';
import RadioGroupField from 'components/fields/RadioGroupField';
import { AutocompleteAsyncField, InputField, SelectField, DatePickerField, AutocompleteFreeSoloField } from 'components/fields';
import { initialValuesType, isOptionEqualToValue } from '../CreateNewNotification';
import { ClassNameMap } from 'notistack';
import SearchAsyncField from 'components/fields/SearchAsyncField';

interface FormCreateNotifiactionProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'wrapper' | 'radioField' | 'formContainer'>;
}

const FormCreateNotifiaction: React.FC<FormCreateNotifiactionProps> = ({ form, classes, ...rest }) => {
  const { values, handleChange, handleBlur, touched, errors, setFieldValue, setFieldTouched } = form || {};
  const { Segment, Sitename } = NOTIFICATION_TYPE;

  const renderAutocompleteField = () => {
    switch (values.notification_type) {
      case Segment: {
        return (
          <React.Fragment>
            <Grid item xs={12} style={{ paddingBottom: 3 }}>
              <SearchAsyncField
                name="segment"
                label="lang_segment"
                required
                fullWidth
                value={values.segment}
                onChange={(v: any) => setFieldValue('segment', v)}
                onBlur={handleBlur}
                error={touched.segment && Boolean(errors.segment)}
                helperText={touched.segment && errors.segment}
              />
            </Grid>
          </React.Fragment>
        );
      }
      case Sitename: {
        return (
          <React.Fragment>
            <Grid item xs={12} style={{ paddingBottom: 3 }}>
              <AutocompleteFreeSoloField
                name="sitename"
                label="lang_sitename"
                required
                fullWidth
                value={values.sitename}
                onChange={(v: any) => setFieldValue('sitename', v)}
                onBlur={(v) => {
                  setFieldTouched('sitename', true);
                  handleBlur(v);
                }}
                error={touched.sitename && Boolean(errors.sitename)}
                helperText={touched.sitename && errors.sitename}
              />
            </Grid>
          </React.Fragment>
        );
      }
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
                required
                label="lang_subscribers"
                defaultValue={[]}
                fullWidth
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
        <Grid item xs={12}>
          <RadioGroupField
            name="notification_type"
            label="lang_notification_type"
            data={NOTIFICATION_TYPE_OPTION}
            required
            rowItems
            value={values?.notification_type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched?.notification_type && Boolean(errors?.notification_type)}
            helperText={touched.notification_type && errors.notification_type}
          />
        </Grid>
        {renderAutocompleteField()}
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
        <Grid item xs={12}>
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
            multiline
            rows={5}
          />
        </Grid>
        <Grid item xs={12}>
          <SelectField
            options={TYPE_URL_OPTIONS}
            name="type_url"
            label="lang_type_url"
            id="type_url"
            fullWidth
            required
            onBlur={handleBlur}
            value={values.type_url}
            onChange={handleChange}
            error={touched.type_url && Boolean(errors.type_url)}
            helperText={touched.type_url && errors.type_url}
          />
        </Grid>
      </Grid>
      <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
        {[Segment, Sitename].includes(values.notification_type) ? (
          <React.Fragment>
            <Grid item xs={12}>
              <InputField
                name="expire"
                label="lang_expire"
                required
                fullWidth
                value={values.expire}
                style={{ visibility: 'hidden' }}
              />
            </Grid>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Grid item xs={12}>
              <Grid item container xs={12}>
                <Grid item xs={12}>
                  <RadioGroupField
                    name="delivery_type"
                    label="lang_delivery_type"
                    data={DELIVERY_TYPE_OPTION}
                    required
                    rowItems
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
                      required
                      fullWidth
                      value={values.expire}
                      onChange={(e) => {
                        if (/^[1-9]{1}[0-9]{0,2}$/.test(e.target.value) || e.target.value === '') handleChange(e);
                      }}
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
                    fullWidth
                    onBlur={handleBlur}
                    value={values.type_expired}
                    onChange={handleChange}
                    error={touched.type_expired && Boolean(errors.type_expired)}
                    helperText={touched.type_expired && errors.type_expired}
                  />
                </Grid>
                <Grid item xs={12} xl={6} style={{ paddingBottom: 16 }}>
                  {values?.delivery_type === DELIVERY_TYPE.Instant ? (
                    <></>
                  ) : (
                    <DatePickerField
                      name="schedule"
                      required
                      value={values.schedule}
                      label={'lang_schedule_time'}
                      inputFormat={'DD/MM/YYYY HH:mm'}
                      onChange={(v) => setFieldValue('schedule', v ? new Date(v) : v)}
                      fullWidth
                      onBlur={handleBlur}
                      minDate={new Date()}
                      error={touched.schedule && Boolean(errors.schedule)}
                      helperText={touched.schedule && errors.schedule}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    </Grid>
  );
};

export default FormCreateNotifiaction;
