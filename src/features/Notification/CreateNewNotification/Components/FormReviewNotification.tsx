import React from 'react';
import { Grid, Autocomplete, TextField, Typography } from '@mui/material';
import { FormikProps } from 'formik';
import { NOTIFICATION_TYPE, NOTIFICATION_TYPE_OPTION_FILTER, EXPIRE_OPTION_FILTER, EXPIRE } from '../NotificationConstant';
import RadioGroupField from 'components/fields/RadioGroupField';
import { InputField } from 'components/fields';
import { Trans } from 'react-i18next';
import { initialValuesType } from '../CreateNewNotification';
import { ClassNameMap } from 'notistack';
import moment from 'moment';

interface FormReviewNotificationProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'wrapper' | 'radioField' | 'formContainer' | 'title'>;
}

const FormReviewNotification: React.FC<FormReviewNotificationProps> = ({ form, classes }) => {
  const { values, handleChange, handleBlur, touched, errors } = form || {};

  const delivery_type_preview = `${values?.delivery_type || ''} ${
    values?.schedule ? moment(values?.schedule || '').format('MM/DD/YYYY HH:MM') : ''
  }`;
  const expired_preview = values?.expire
    ? `${values?.expire} ${EXPIRE_OPTION_FILTER[values?.type_expired]}`
    : `4 ${EXPIRE_OPTION_FILTER[EXPIRE.Weeks]}`;

  let defaultArray = Array.isArray(values.subscribers) ? values.subscribers.map((x: any) => x?.username) : [];
  const { Segment, Sitename } = NOTIFICATION_TYPE;

  const renderField = () => {
    if (values.notification_type === Segment) {
      return (
        <React.Fragment>
          <InputField
            name="segment"
            label="lang_segment"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            variant={'standard'}
            value={(values.segment as any)?.name}
          />
        </React.Fragment>
      );
    }

    if (values.notification_type === Sitename) {
      return (
        <React.Fragment>
          <Autocomplete
            multiple
            id="tags-readOnly"
            // options={values.sitename}
            options={[]}
            value={values.sitename}
            readOnly
            freeSolo
            // renderOption={(props, option, { selected }) => <li {...props}>{option.title}</li>}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={
                  <Typography>
                    <Trans>lang_sitename</Trans>
                  </Typography>
                }
              ></TextField>
            )}
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Autocomplete
          multiple
          id="tags-readOnly"
          options={values.subscribers}
          defaultValue={defaultArray}
          readOnly
          freeSolo
          // renderOption={(props, option, { selected }) => <li {...props}>{option.title}</li>}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={
                <Typography>
                  <Trans>lang_subscribers</Trans>
                </Typography>
              }
            ></TextField>
          )}
        />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item container xs={12} md={6} spacing={2}>
          <Grid item xs={12}>
            <RadioGroupField
              name="notification_type"
              label="lang_notification_type"
              data={NOTIFICATION_TYPE_OPTION_FILTER[values.notification_type] || []}
              rowItems={true}
              value={values?.notification_type}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={true}
              error={touched?.notification_type && Boolean(errors?.notification_type)}
              helperText={touched.notification_type && errors.notification_type}
            />
          </Grid>
          <Grid item xs={12}>
            {renderField()}
          </Grid>
          <Grid item xs={12}>
            <InputField
              name="title"
              label="lang_title"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant={'standard'}
              value={values.title}
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              name="message"
              label="lang_message"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant={'standard'}
              value={values.message}
              multiline={true}
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              name="type_url"
              label="lang_type_url"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant={'standard'}
              value={values.type_url}
            />
          </Grid>
        </Grid>
        <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
          {[Segment, Sitename].includes(values.notification_type) ? (
            <React.Fragment>
              <Grid item xs={12} style={{ height: 81 }}>
                <InputField
                  // name="message"
                  label="lang_delivery_type"
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant={'standard'}
                  value={delivery_type_preview}
                  style={{ visibility: 'hidden' }}
                />
              </Grid>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Grid item xs={12} style={{ height: 81 }}>
                <InputField
                  // name="message"
                  label="lang_delivery_type"
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant={'standard'}
                  value={delivery_type_preview}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  // name="message"
                  label="lang_expire"
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant={'standard'}
                  value={expired_preview}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default FormReviewNotification;
