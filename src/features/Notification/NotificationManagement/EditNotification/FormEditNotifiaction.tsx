/*
 * Created on Mon Jan 30 2023
 *
 * This feature allow user edit notification status pending
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { Grid } from '@mui/material';
import { FormikProps } from 'formik';
import {
  DELIVERY_TYPE_OPTION,
  NOTIFICATION_TYPE_OPTION,
  DELIVERY_TYPE,
  NOTIFICATION_CATEGORY_OPTIONS,
  NOTIFICATION_TYPE,
  LINKED_SCREEN_OPTIONS,
} from 'features/Notification/CreateNewNotification/NotificationConstant';
import RadioGroupField from 'components/fields/RadioGroupField';
import { AutocompleteField, InputField, SelectField, DatePickerField } from 'components/fields';
import { isOptionEqualToValue } from './index';
import { ClassNameMap } from 'notistack';
import { initialValuesType } from 'features/Notification/CreateNewNotification/CreateNewNotification';
import { LooseObject } from 'models/ICommon';
import { getSearchAppNameUrl, getSearchClientCategoryUrl, getSearchUserGroupUrl } from 'apis/request.url';

interface FormCreateNotifiactionProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'wrapper' | 'radioField' | 'formContainer'>;
}

export const isOptionEqualToValueSiteName = (option: any, value: any) => {
  return option === value;
};

const FormCreateNotifiaction: React.FC<FormCreateNotifiactionProps> = ({ form, classes, ...rest }) => {
  const { values, handleChange, handleBlur, touched, errors, setFieldValue, setFieldTouched } = form || {};
  const { UserGroup, ClientCategory } = NOTIFICATION_TYPE;

  const renderAutocompleteField = () => {
    switch (values.notification_type) {
      default: {
        return (
          <React.Fragment>
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
          </React.Fragment>
        );
      }
    }
  };

  const leftSideContainer = () => {
    return (
      <Grid item container xs={12} md={6} spacing={2}>
        <Grid item xs={12} className="lineWidthField">
          <RadioGroupField
            name="notification_type"
            label="lang_notification_type"
            data={NOTIFICATION_TYPE_OPTION}
            required
            rowItems
            disabled
            value={values?.notification_type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched?.notification_type && Boolean(errors?.notification_type)}
            helperText={touched.notification_type && errors.notification_type}
          />
        </Grid>

        <Grid item xs={12}>
          <AutocompleteField
            name="bundle_id"
            label="lang_app_name"
            required
            getUrl={getSearchAppNameUrl}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={(option) => `${option.display_name}`}
            getChipLabel={(option) => option.display_name}
            value={values.bundle_id}
            onChange={(value) => setFieldValue('bundle_id', value)}
            onBlur={() => setFieldTouched('bundle_id', true, true)}
            error={touched.bundle_id && Boolean(errors.bundle_id)}
            helperText={(touched.bundle_id && errors.bundle_id) as string}
          />
        </Grid>
        {values.notification_type === UserGroup && (
          <Grid item xs={12} style={{ paddingBottom: 3 }}>
            <AutocompleteField
              name="user_group_id"
              label="lang_user_group"
              required
              multiple={false}
              getUrl={getSearchUserGroupUrl}
              isOptionEqualToValue={(option: LooseObject, value: LooseObject) => option?.name === value?.name}
              getOptionLabel={(option) => option?.name || ''}
              getChipLabel={(option) => option?.name || ''}
              value={values.user_group_id}
              onChange={(value) => setFieldValue('user_group_id', value)}
              onBlur={() => setFieldTouched('user_group_id', true, true)}
              error={touched.user_group_id && Boolean(errors.user_group_id)}
              helperText={(touched.user_group_id && errors.user_group_id) as string}
            />
          </Grid>
        )}
        {values.notification_type === ClientCategory && (
          <Grid item xs={12} style={{ paddingBottom: 3 }}>
            <AutocompleteField
              name="client_category_id"
              label="lang_client_category"
              required
              multiple={false}
              getUrl={getSearchClientCategoryUrl}
              isOptionEqualToValue={isOptionEqualToValueSiteName}
              getOptionLabel={(option) => `${option || ''}`}
              getChipLabel={(option: any) => option}
              value={values.client_category_id}
              formatData={(data = []) => data?.map((e: { client_category_id: string }) => e?.client_category_id)}
              onChange={(value) => setFieldValue('client_category_id', value)}
              onBlur={() => setFieldTouched('client_category_id', true, true)}
              error={touched.client_category_id && Boolean(errors.client_category_id)}
              helperText={(touched.client_category_id && errors.client_category_id) as string}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <InputField
            name="site_name"
            label="lang_sitename"
            fullWidth
            value={values.site_name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={true}
            error={touched.site_name && Boolean(errors.site_name)}
            helperText={touched.site_name && errors.site_name}
          />
        </Grid>

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
      </Grid>
    );
  };

  const rightSideContainer = () => {
    return (
      <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
        <React.Fragment>
          <Grid item xs={12}>
            <SelectField
              options={NOTIFICATION_CATEGORY_OPTIONS}
              name="notification_category"
              label="lang_notification_category"
              id="notification_category"
              fullWidth
              disabled={true}
              onBlur={handleBlur}
              value={values.notification_category}
              onChange={handleChange}
              error={touched.notification_category && Boolean(errors.notification_category)}
              helperText={touched.notification_category && errors.notification_category}
            />
          </Grid>

          <Grid item xs={12}>
            {values.article_id ? (
              <InputField name="article_id" label="lang_article_id" fullWidth value={values.article_id} disabled />
            ) : (
              <Grid item xs={12}>
                <SelectField
                  options={LINKED_SCREEN_OPTIONS}
                  name="url"
                  label="lang_linked_screen"
                  id="url"
                  fullWidth
                  disabled={true}
                  value={'Notifications'}
                />
              </Grid>
            )}
          </Grid>

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

          <Grid item xs={12}>
            {values?.delivery_type === DELIVERY_TYPE.Instant ? null : (
              <DatePickerField
                name="schedule"
                required
                value={values.schedule}
                label={'lang_schedule_time'}
                inputFormat={'DD/MM/YYYY HH:mm'}
                onChange={(v: string) => setFieldValue('schedule', v ? new Date(v) : v)}
                fullWidth
                onBlur={handleBlur}
                minDate={new Date()}
                error={touched.schedule && Boolean(errors.schedule)}
                helperText={touched.schedule && errors.schedule}
              />
            )}
          </Grid>
        </React.Fragment>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      {leftSideContainer()}
      {rightSideContainer()}
      <Grid item container xs={12} spacing={2}>
        {renderAutocompleteField()}
      </Grid>
    </Grid>
  );
};

export default FormCreateNotifiaction;
