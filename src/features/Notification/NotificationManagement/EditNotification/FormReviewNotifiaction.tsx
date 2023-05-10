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
  DELIVERY_TYPE,
  NOTIFICATION_CATEGORY_TYPE_LABEL,
  NOTIFICATION_TYPE,
  NOTIFICATION_TYPE_OPTION_FILTER,
} from 'features/Notification/CreateNewNotification/NotificationConstant';
import { AutocompleteField, InputField } from 'components/fields';
import { ClassNameMap } from 'notistack';
import { initialValuesType } from 'features/Notification/CreateNewNotification/CreateNewNotification';
import moment from 'moment';
import { LooseObject } from 'models/ICommon';
import { changeLabel } from 'features/Notification/CreateNewNotification/Components/FormReviewNotification';
import { t } from 'i18next';

interface FormReviewNotifiactionProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'wrapper' | 'radioField' | 'formContainer'>;
}

export const isOptionEqualToValueSiteName = (option: any, value: any) => {
  return option === value;
};

const FormReviewNotifiaction: React.FC<FormReviewNotifiactionProps> = ({ form, classes, ...rest }) => {
  const { values } = form || {};
  const { UserGroup, ClientCategory } = NOTIFICATION_TYPE;

  let defaultArray = Array.isArray(values.bundle_id) ? values.bundle_id.map((x: any) => x?.display_name || x) : [];

  const delivery_type_preview = `${changeLabel(values?.delivery_type)} ${
    values?.delivery_type === DELIVERY_TYPE.Schedule
      ? moment(values?.schedule || '')
          .local()
          .format('DD/MM/YYYY HH:mm')
      : ''
  }`;

  const renderAutocompleteField = () => {
    switch (values.notification_type) {
      default: {
        return (
          <React.Fragment>
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
          </React.Fragment>
        );
      }
    }
  };

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
          <InputField
            name="notification_type"
            label="lang_notification_type"
            preview
            fullWidth
            variant={'standard'}
            value={t(NOTIFICATION_TYPE_OPTION_FILTER[values.notification_type][0].label) || ''}
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
            isOptionEqualToValue={(opt, select) => opt.bundle_id === select.bundle_id}
            getOptionLabel={(opt: any | string) => opt.display_name}
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
      <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
        <React.Fragment>
          <Grid item xs={12}>
            <InputField
              name="notification_category"
              label="lang_notification_category"
              preview
              fullWidth
              variant={'standard'}
              value={NOTIFICATION_CATEGORY_TYPE_LABEL[values.notification_category]}
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
          ) : (
            <Grid item xs={12}>
              <InputField name="url" label="lang_linked_screen" preview fullWidth variant={'standard'} value={'Notifications'} />
            </Grid>
          )}

          <Grid item xs={12}>
            <InputField label="lang_delivery_type" preview fullWidth variant={'standard'} value={delivery_type_preview} />
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

export default FormReviewNotifiaction;
