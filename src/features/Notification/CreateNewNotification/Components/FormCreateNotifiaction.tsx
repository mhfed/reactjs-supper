/*
 * Created on Mon Jan 30 2023
 *
 * This is first step to create notification
 *
 * Copyright (c) 2023 - Novus Fintech
 */

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
  NOTIFICATION_CATEGORY_OPTIONS,
  LINKED_SCREEN_OPTIONS,
} from '../NotificationConstant';
import RadioGroupField from 'components/fields/RadioGroupField';
import { AutocompleteField, InputField, SelectField, DatePickerField } from 'components/fields';
import { initialValuesType, isOptionEqualToValue } from '../CreateNewNotification';
import { ClassNameMap } from 'notistack';
import { getListSiteNametUrl, getSearchSegment, getSearchSubscribersUrl } from 'apis/request.url';
import { LooseObject } from 'models/ICommon';

interface FormCreateNotifiactionProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'wrapper' | 'radioField' | 'formContainer'>;
}

export const isOptionEqualToValueSiteName = (option: any, value: any) => {
  return option === value;
};

const FormCreateNotifiaction: React.FC<FormCreateNotifiactionProps> = ({ form, classes, ...rest }) => {
  const { values, handleChange, handleBlur, touched, errors, setFieldValue, setFieldTouched } = form || {};
  const { Segment, Sitename, Direct } = NOTIFICATION_TYPE;

  const leftSideContainer = () => {
    return (
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
        {values.notification_type === Segment && (
          <Grid item xs={12} style={{ paddingBottom: 3 }}>
            <AutocompleteField
              name="segment"
              label="lang_segment"
              required
              multiple={false}
              getUrl={getSearchSegment}
              isOptionEqualToValue={(option: LooseObject, value: LooseObject) => option?.name === value?.name}
              getOptionLabel={(option) => option?.name || ''}
              getChipLabel={(option) => option?.name || ''}
              value={values.segment}
              onChange={(value) => setFieldValue('segment', value)}
              onBlur={() => setFieldTouched('segment', true, true)}
              error={touched.segment && Boolean(errors.segment)}
              helperText={(touched.segment && errors.segment) as string}
            />
          </Grid>
        )}
        {values.notification_type === Sitename && (
          <Grid item xs={12} style={{ paddingBottom: 3 }}>
            <AutocompleteField
              name="site_name"
              label="lang_sitename"
              required
              getUrl={getListSiteNametUrl}
              isOptionEqualToValue={isOptionEqualToValueSiteName}
              getOptionLabel={(option) => `${option || ''}`}
              getChipLabel={(option: any) => option}
              value={values.site_name}
              formatData={(data = []) => data?.map((e: { site_name: string }) => e.site_name)}
              onChange={(value) => setFieldValue('site_name', value)}
              onBlur={() => setFieldTouched('site_name', true, true)}
              error={touched.site_name && Boolean(errors.site_name)}
              helperText={(touched.site_name && errors.site_name) as string}
            />
          </Grid>
        )}
        {values.notification_type === Direct && (
          <Grid item xs={12} style={{ paddingBottom: 3 }}>
            <AutocompleteField
              name="subscribers"
              label="lang_app_name"
              required
              getUrl={getSearchSubscribersUrl}
              isOptionEqualToValue={isOptionEqualToValue}
              getOptionLabel={(option) => `${option.username} (${option.site_name})`}
              getChipLabel={(option) => option.username}
              value={values.subscribers}
              onChange={(value) => setFieldValue('subscribers', value)}
              onBlur={() => setFieldTouched('subscribers', true, true)}
              error={touched.subscribers && Boolean(errors.subscribers)}
              helperText={(touched.subscribers && errors.subscribers) as string}
            />
          </Grid>
        )}
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
      </Grid>
    );
  };

  const rightSideContainer = () => {
    return (
      <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
        <Grid item xs={12}>
          <InputField
            name="site_name"
            label="lang_sitename"
            required
            fullWidth
            value={values.site_name}
            onChange={handleChange}
            onBlur={handleBlur}
            readOnly={true}
            error={touched.site_name && Boolean(errors.site_name)}
            helperText={touched.site_name && errors.site_name}
          />
        </Grid>
        {/* 123 */}
        <Grid item xs={12}>
          <SelectField
            options={NOTIFICATION_CATEGORY_OPTIONS}
            name="notification_category"
            label="lang_notification_category"
            id="notification_category"
            fullWidth
            required
            onBlur={handleBlur}
            value={values.notification_category}
            onChange={handleChange}
            error={touched.notification_category && Boolean(errors.notification_category)}
            helperText={touched.notification_category && errors.notification_category}
          />
        </Grid>
        {/* 123 */}
        <Grid item xs={12}>
          <SelectField
            options={LINKED_SCREEN_OPTIONS}
            name="url"
            label="lang_linked_screen"
            id="url"
            fullWidth
            required
            onBlur={handleBlur}
            value={values.url}
            onChange={handleChange}
            error={touched.url && Boolean(errors.url)}
            helperText={touched.url && errors.url}
          />
        </Grid>

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
      </Grid>
    );
  };
  return (
    <Grid container spacing={2}>
      {leftSideContainer()}
      {rightSideContainer()}
    </Grid>
  );
};

export default FormCreateNotifiaction;
