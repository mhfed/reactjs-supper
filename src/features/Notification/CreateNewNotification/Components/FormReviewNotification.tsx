/*
 * Created on Mon Jan 30 2023
 *
 * This is step allow user can review theirs notification before submit
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { Grid } from '@mui/material';
import { FormikProps } from 'formik';
import { NOTIFICATION_TYPE, NOTIFICATION_TYPE_OPTION_FILTER, DELIVERY_TYPE } from '../NotificationConstant';
import RadioGroupField from 'components/fields/RadioGroupField';
import { AutocompleteField, InputField } from 'components/fields';
import { initialValuesType } from '../CreateNewNotification';
import { ClassNameMap } from 'notistack';
import moment from 'moment';
import { LooseObject } from 'models/ICommon';

interface FormReviewNotificationProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'wrapper' | 'radioField' | 'formContainer' | 'title'>;
}

const FormReviewNotification: React.FC<FormReviewNotificationProps> = ({ form, classes }) => {
  const { values, handleChange, handleBlur, touched, errors } = form || {};

  const delivery_type_preview = `${values?.delivery_type || ''} ${
    values?.delivery_type === DELIVERY_TYPE.Schedule
      ? moment(values?.schedule || '')
          .local()
          .format('DD/MM/YYYY HH:mm')
      : ''
  }`;

  let defaultArray = Array.isArray(values.bundle_id) ? values.bundle_id.map((x: any) => x?.display_name) : [];
  const { UserGroup, ClientCategory } = NOTIFICATION_TYPE;

  const renderField = () => {
    if (values.notification_type === UserGroup) {
      return (
        <Grid item xs={12}>
          <AutocompleteField
            multiple
            name="user_group_id"
            formatData={(data = []) => data.user_group}
            options={values.user_group_id}
            defaultValue={[]}
            preview
            label="lang_user_group"
            isOptionEqualToValue={(option: LooseObject, value: LooseObject) => option?.id === value?.id}
            getOptionLabel={(option) => option?.name || ''}
            getChipLabel={(option) => option?.name || ''}
            value={values.user_group_id}
            changeDisplayInput={true}
          />
        </Grid>
      );
    }

    if (values.notification_type === ClientCategory) {
      return (
        <Grid item xs={12}>
          <InputField
            name="client_category_id"
            label="lang_client_category"
            preview
            fullWidth
            variant={'standard'}
            value={(values.client_category_id as any)?.name}
          />
        </Grid>
      );
    }
    return null;
  };

  const leftSideContainer = () => {
    return (
      <Grid item container xs={12} md={6} spacing={2}>
        <Grid item xs={12}>
          <RadioGroupField
            name="notification_type"
            label="lang_notification_type"
            data={NOTIFICATION_TYPE_OPTION_FILTER[values.notification_type] || []}
            rowItems
            value={values?.notification_type}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
            error={touched?.notification_type && Boolean(errors?.notification_type)}
            helperText={touched.notification_type && errors.notification_type}
          />
        </Grid>
        <Grid item xs={12}>
          <AutocompleteField
            multiple
            name="bundle_id"
            options={values.bundle_id}
            defaultValue={defaultArray}
            preview
            label="lang_app_name"
            isOptionEqualToValue={(opt, select) => opt.bundle_id === select.bundle_id}
            getOptionLabel={(opt: any | string) => opt}
            changeDisplayInput={true}
          />
        </Grid>
        {renderField()}
        <Grid item xs={12}>
          <InputField name="title" label="lang_title" preview multiline fullWidth variant={'standard'} value={values.title} />
        </Grid>
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
    );
  };

  const rightSideContainer = () => {
    return (
      <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
        <Grid item xs={12} style={{ height: 81 }}>
          <InputField name="site_name" label="lang_sitename" preview fullWidth variant={'standard'} value={values.site_name} />
        </Grid>
        <Grid item xs={12} style={{ height: 68 }}>
          <InputField
            name="notification_category"
            label="lang_notification_category"
            preview
            fullWidth
            variant={'standard'}
            value={values.notification_category}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField name="url" label="lang_linked_screen" preview fullWidth variant={'standard'} value={values.url} />
        </Grid>
        <Grid item xs={12}>
          <InputField label="lang_delivery_type" preview fullWidth variant={'standard'} value={delivery_type_preview} />
        </Grid>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {leftSideContainer()}
        {rightSideContainer()}
      </Grid>
    </React.Fragment>
  );
};

export default FormReviewNotification;
