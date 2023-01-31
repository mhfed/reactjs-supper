/*
 * Created on Tue Jan 31 2023
 *
 * Detail notification screen with notification type is direct
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import Grid from '@mui/material/Grid';
import { InputField, AutocompleteField } from 'components/fields';
import { FormikProps } from 'formik';
import { initialValuesType } from '../../CreateNewNotification/CreateNewNotification';
import { EXPIRE_OPTION_FILTER, NOTIFICATION_TYPE } from '../../CreateNewNotification/NotificationConstant';
import moment from 'moment';
import { ClassNameMap } from '@mui/styles';

interface FormDirectNotificationProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'divCointainer' | 'containerForm' | 'buttonWrapper' | 'iconClose' | 'formContainer'>;
}

const FormDirectNotification: React.FC<FormDirectNotificationProps> = ({ form, classes }) => {
  const { values } = form;
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
            <Grid item xs={12}>
              <AutocompleteField
                preview
                name="sitename_custom"
                label="lang_subscribers"
                required
                isOptionEqualToValue={(opt, select) => opt.subscriber === select.subscriber}
                getOptionLabel={(opt) => opt.subscriber}
                value={values.subscribers}
              />
            </Grid>
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
