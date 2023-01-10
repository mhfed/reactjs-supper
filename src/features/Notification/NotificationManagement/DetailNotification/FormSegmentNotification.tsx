import React from 'react';
import { Grid } from '@mui/material';
import { InputField } from 'components/fields';
import { FormikProps } from 'formik';
import { initialValuesType } from '../../CreateNewNotification/CreateNewNotification';
import { ClassNameMap } from '@mui/styles';

interface FormDirectNotificationProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'divCointainer' | 'containerForm' | 'buttonWrapper' | 'title' | 'iconClose' | 'header' | 'formContainer'>;
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
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant={'standard'}
              value={values.notification_type}
            />
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
        </Grid>
        <Grid item container xs={12} md={6} spacing={3} style={{ height: 'fit-content' }}>
          <Grid item xs={12}>
            <InputField
              name="type_url"
              label="lang_type_url"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant={'standard'}
              value={values?.type_url}
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              name="segment_name"
              label="lang_message"
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant={'standard'}
              value={values.segment_name}
            />
          </Grid>
        </Grid>
        <Grid item container xs={12} spacing={3}>
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
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default FormDirectNotification;
