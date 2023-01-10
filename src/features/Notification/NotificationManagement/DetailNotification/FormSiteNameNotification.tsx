import React from 'react';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import { InputField } from 'components/fields';
import { FormikProps } from 'formik';
import { initialValuesType } from '../../CreateNewNotification/CreateNewNotification';
import { ClassNameMap } from '@mui/styles';
import { Trans } from 'react-i18next';

interface FormDirectNotificationProps {
  form: FormikProps<initialValuesType>;
  classes: ClassNameMap<'divCointainer' | 'containerForm' | 'buttonWrapper' | 'title' | 'iconClose' | 'header' | 'formContainer'>;
}

const FormDirectNotification: React.FC<FormDirectNotificationProps> = ({ form, classes }) => {
  const { values } = form;
  values.type_url = 'Articles';
  let defaultArray = Array.isArray(values.subscribers) ? values.subscribers.map((x: any) => x?.site_name) : [];

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
        </Grid>
        <Grid item xs={12} spacing={3}>
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
          <Autocomplete
            multiple
            id="tags-readOnly"
            options={[]}
            value={defaultArray}
            readOnly
            freeSolo
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
        </Grid>
        <Grid item xs={12} spacing={3}>
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
    </React.Fragment>
  );
};

export default FormDirectNotification;
