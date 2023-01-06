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
import { AutocompleteAsyncField, InputField, SelectField, DatePickerField } from 'components/fields';
import { initialValuesType, isOptionEqualToValue } from '../CreateNewNotification'
import { ClassNameMap } from 'notistack';


interface FormCreateNotifiactionProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<"wrapper" | "radioField" | "formContainer">
}

const FormCreateNotifiaction: React.FC<FormCreateNotifiactionProps> = ({ form, classes, ...rest }) => {
  const { values, handleChange, handleBlur, touched, errors, setFieldValue } = form || {};
  return (
    <Grid container spacing={2}>
      <Grid item container xs={12} md={6} spacing={2}>
        <Grid item xs={12}>
          <RadioGroupField
            name="notification_type"
            label="Notification type"
            data={NOTIFICATION_TYPE_OPTION}
            required={true}
            rowItems={true}
            value={values?.notification_type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched?.notification_type && Boolean(errors?.notification_type)}
            helperText={touched.notification_type && errors.notification_type}
          />
        </Grid>
        {values.notification_type === NOTIFICATION_TYPE.Segment ? (
          <React.Fragment>
            <Grid item xs={12}>
              <InputField
                name="segment"
                label="Segment"
                required
                fullWidth
                value={values.segment}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.segment && Boolean(errors.segment)}
                helperText={touched.segment && errors.segment}
              />
            </Grid>
          </React.Fragment>
        ) : (
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
        )}

        <Grid item xs={12}>
          <InputField
            name="title"
            label="Title"
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
            label="Message"
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
        </Grid>
        <Grid item xs={12}>
          <SelectField
            options={TYPE_URL_OPTIONS}
            name="type_url"
            label="Type URL"
            id="type_url"
            fullWidth={true}
            onBlur={handleBlur}
            value={values.type_url}
            onChange={handleChange}
            error={touched.type_url && Boolean(errors.type_url)}
            helperText={touched.type_url && errors.type_url}
          />
        </Grid>
      </Grid>
      <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
        {values.notification_type === NOTIFICATION_TYPE.Segment ? (
          <React.Fragment>
            <Grid item xs={12}>
              <InputField
                name="expire"
                label="Expire"
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
                <Grid item xs={4}>
                  <RadioGroupField
                    name="delivery_type"
                    label="Delivery type"
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
                <Grid item xs={8}>
                  {values?.delivery_type === DELIVERY_TYPE.Instant ? null :
                    <DatePickerField
                      name="schedule"
                      required={true}
                      value={values.schedule}
                      inputFormat={'MM/DD/YYYY HH:mm'}
                      onChange={(v: string) => setFieldValue('schedule', v ? (new Date(v)) : v)}
                      onBlur={handleBlur}
                      error={touched.schedule && Boolean(errors.schedule)}
                      helperText={touched.schedule && errors.schedule}
                    />}

                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid item container xs={12} spacing={2}>
                <Grid item xs={4}>
                  <Grid item xs={12}>
                    <InputField
                      name="expire"
                      label="Expire"
                      required
                      fullWidth
                      value={values.expire}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.expire && Boolean(errors.expire)}
                      helperText={touched.expire && errors.expire}
                      dir="rtl"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={8} className={classes.radioField}>
                  <RadioGroupField
                    name="type_expired"
                    data={EXPIRE_OPTION}
                    required={true}
                    rowItems={true}
                    value={values?.type_expired}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched?.type_expired && Boolean(errors?.type_expired)}
                    helperText={touched.type_expired && errors.type_expired}
                  />
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    </Grid>
  )
}

export default FormCreateNotifiaction