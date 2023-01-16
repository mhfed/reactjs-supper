import React from 'react';
import { Typography, Grid, Chip, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import { InputField } from 'components/fields';
import { FormikProps } from 'formik';
import { Autocomplete, TextField } from '@mui/material';
import { initialValuesType } from '../../CreateNewNotification/CreateNewNotification';
import { EXPIRE_OPTION_FILTER, NOTIFICATION_TYPE } from '../../CreateNewNotification/NotificationConstant';
import moment from 'moment';
import { ClassNameMap } from '@mui/styles';
import clsx from 'clsx';

interface FormDirectNotificationProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'divCointainer' | 'containerForm' | 'buttonWrapper' | 'title' | 'iconClose' | 'header' | 'formContainer'>;
}

const FormDirectNotification: React.FC<FormDirectNotificationProps> = ({ form, classes }) => {
  const { values } = form;
  const theme = useTheme();
  const { Segment, Sitename, Direct } = NOTIFICATION_TYPE;

  let delivery_type_preview = `${values?.delivery_type || ''}`;

  if (values.notification_type === Direct) {
    delivery_type_preview += ` ${
      values?.schedule_time
        ? moment(values?.schedule_time || '')
            .local()
            .format('DD/MM/YYYY HH:mm')
        : ''
    }`;
  }
  const valueExpire = (values?.expire_time || '').replace(/[A-z]/g, '');
  const typeExpire = (values?.expire_time || '').replace(/[0-9]/g, '');
  const expired_preview = `${valueExpire || '0'} ${EXPIRE_OPTION_FILTER[typeExpire]}`;
  values.type_url = 'Articles';

  let defaultArray = Array.isArray(values.subscribers) ? values.subscribers.map((x: any) => x?.subscriber) : [];
  return (
    <React.Fragment>
      <Grid container spacing={3} className={classes.containerForm}>
        <Grid item container xs={12} md={6} spacing={3}>
          <Grid item xs={12}>
            <InputField
              name="notification_type"
              label="lang_notification_type"
              preview
              fullWidth
              variant={'standard'}
              value={values.notification_type}
            />
          </Grid>
          <Grid item xs={12}>
            <InputField name="title" label="lang_title" preview fullWidth multiline variant={'standard'} value={values.title} />
          </Grid>
          <Grid item xs={12}>
            <InputField name="type_url" label="lang_type_url" preview fullWidth variant={'standard'} value={values?.type_url} />
          </Grid>
        </Grid>
        <Grid item container xs={12} md={6} spacing={3} style={{ height: 'fit-content' }}>
          {[Segment, Sitename].includes(values.notification_type) ? (
            <React.Fragment>
              <Grid item xs={12} style={{ height: 81 }}>
                <InputField
                  // name="message"
                  label="lang_delivery_type"
                  preview
                  fullWidth
                  variant={'standard'}
                  value={delivery_type_preview}
                  style={{ visibility: 'hidden' }}
                />
              </Grid>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Grid item xs={12}>
                <InputField
                  // name="message"
                  label="lang_delivery_type"
                  preview
                  fullWidth
                  variant={'standard'}
                  value={delivery_type_preview}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  // name="message"
                  label="lang_expire"
                  preview
                  fullWidth
                  variant={'standard'}
                  value={expired_preview}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <Grid item container xs={12} spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="tags-readOnly"
              options={[]}
              value={defaultArray}
              readOnly
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: any, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    style={{ marginRight: theme.spacing(2) }}
                    title={`${option} (${values.subscribers[index].site_name})`}
                    className="customTitle"
                    key={index}
                  />
                ))
              }
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
          </Grid>
        </Grid>
        <Grid item container xs={12} spacing={3}>
          <Grid item xs={12}>
            <InputField
              name="message"
              label="lang_message"
              preview
              fullWidth
              variant={'standard'}
              value={values.message}
              multiline
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default FormDirectNotification;
