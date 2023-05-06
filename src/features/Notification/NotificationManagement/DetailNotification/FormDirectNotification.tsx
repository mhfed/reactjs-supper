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
import { DELIVERY_TYPE, EXPIRE_OPTION_FILTER, NOTIFICATION_TYPE } from '../../CreateNewNotification/NotificationConstant';
import moment from 'moment';
import { ClassNameMap } from '@mui/styles';

interface FormDirectNotificationProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'divCointainer' | 'containerForm' | 'buttonWrapper' | 'iconClose' | 'formContainer'>;
}

const FormDirectNotification: React.FC<FormDirectNotificationProps> = ({ form, classes }) => {
  const { values } = form;
  const { UserGroup, ClientCategory, App } = NOTIFICATION_TYPE;

  const delivery_type_preview = `${values?.delivery_type || ''} ${
    values?.delivery_type === DELIVERY_TYPE.Schedule
      ? moment(values?.schedule_time || '')
          .local()
          .format('DD/MM/YYYY HH:mm')
      : ''
  }`;

  const renderField = () => {
    if (values.notification_type === UserGroup) {
      return (
        <Grid item xs={12}>
          <AutocompleteField
            multiple
            name="user_group_id"
            options={values.user_group_id}
            defaultValue={[]}
            preview
            label="lang_user_group"
            isOptionEqualToValue={(opt, select) => opt === select}
            getOptionLabel={(opt: any | string) => opt}
            changeDisplayInput={true}
          />
        </Grid>
      );
    }

    if (values.notification_type === ClientCategory) {
      return (
        <Grid item xs={12}>
          <AutocompleteField
            multiple
            name="client_category_id"
            options={values.client_category_id}
            defaultValue={[]}
            preview
            label="lang_client_category"
            isOptionEqualToValue={(opt, select) => opt === select}
            getOptionLabel={(opt: any | string) => opt}
            changeDisplayInput={true}
          />
        </Grid>
      );
    }
    return null;
  };

  const leftSideContainer = () => {
    return (
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
          <AutocompleteField
            multiple
            name="bundle_id"
            options={values.bundle_id}
            defaultValue={values.bundle_id}
            preview
            label="lang_app_name"
            isOptionEqualToValue={(opt, select) => opt === select}
            getOptionLabel={(opt: any | string) => opt}
            changeDisplayInput={true}
          />
        </Grid>
        {renderField()}
        <Grid item xs={12}>
          <InputField name="site_name" label="lang_sitename" preview fullWidth variant={'standard'} value={values.site_name} />
        </Grid>
        <Grid item xs={12}>
          <InputField name="title" label="lang_title" preview multiline fullWidth variant={'standard'} value={values.title} />
        </Grid>
      </Grid>
    );
  };

  const rightSideContainer = () => {
    return (
      <Grid item container xs={12} md={6} spacing={3} style={{ height: 'fit-content' }}>
        <Grid item xs={12}>
          <InputField
            name="notification_category"
            label="lang_notification_category"
            preview
            fullWidth
            variant={'standard'}
            value={values.notification_category}
          />
        </Grid>
        {values.article_id ? (
          <Grid item xs={12}>
            <InputField
              name="article_id"
              label="lang_article_id"
              preview
              fullWidth
              variant={'standard'}
              value={values.article_id}
            />
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <InputField label="lang_delivery_type" preview fullWidth variant={'standard'} value={delivery_type_preview} />
        </Grid>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <Grid container spacing={3} className={classes.containerForm}>
        {leftSideContainer()}
        {rightSideContainer()}
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
