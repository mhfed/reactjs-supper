import React from 'react';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { InputField, AutocompleteField } from 'components/fields';
import { FormikProps } from 'formik';
import { initialValuesType } from '../../CreateNewNotification/CreateNewNotification';
import { ClassNameMap } from '@mui/styles';
import { Trans } from 'react-i18next';

interface FormDirectNotificationProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'divCointainer' | 'containerForm' | 'buttonWrapper' | 'iconClose' | 'formContainer'>;
}

const FormDirectNotification: React.FC<FormDirectNotificationProps> = ({ form, classes }) => {
  const { values } = form;
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
        </Grid>
        <Grid item container xs={12} md={6} spacing={3} style={{ height: 'fit-content' }}>
          <Grid item xs={12}>
            <InputField name="type_url" label="lang_type_url" preview fullWidth variant={'standard'} value={values?.type_url} />
          </Grid>
        </Grid>
        <Grid item xs={12} spacing={3}>
          <InputField name="title" label="lang_title" preview fullWidth multiline variant={'standard'} value={values.title} />
        </Grid>
        <Grid item xs={12}>
          <AutocompleteField
            preview
            name="sitename_custom"
            label="lang_sitename"
            required
            isOptionEqualToValue={(opt, select) => opt.site_name === select.site_name}
            getOptionLabel={(opt) => opt.site_name}
            value={values.subscribers}
          />
        </Grid>
        <Grid item xs={12} spacing={3}>
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
    </React.Fragment>
  );
};

export default FormDirectNotification;
