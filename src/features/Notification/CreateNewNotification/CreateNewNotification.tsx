import React from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, Grid, Stack, Button } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import {
  DELIVERY_TYPE_OPTION,
  NOTIFICATION_TYPE_OPTION,
  STATE_FORM,
  TYPE_URL_OPTIONS,
  NOTIFICATION_TYPE,
  DELIVERY_TYPE,
  EXPIRE_OPTION,
  EXPIRE,
} from './NotificationConstant';
import RadioGroupField from 'components/fields/RadioGroupField';
import { AutocompleteAsyncField, InputField, SelectField } from 'components/fields';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';

interface CreateNewNotificationProps {}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    background: theme.palette.background.paper,
    padding: 40,
    justifyContent: 'space-between',
  },
  radioField: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const CreateNewNotification: React.FC<CreateNewNotificationProps> = (props) => {
  const classes = useStyles();
  const [stateForm] = React.useState(STATE_FORM.CREATE);

  const submitForm = (values: {}, formikHelpers: FormikHelpers<{}>) => {
    console.log('xin chao');
  };

  const handleClearData = () => {};

  const isOptionEqualToValue = React.useCallback((option: LooseObject, value: LooseObject) => {
    return option.username === value.username;
  }, []);

  const renderContent = (form: FormikProps<initialValuesType>) => {
    const { values, handleChange, handleBlur, touched, errors, setFieldValue } = form;
    console.log(values);
    // FormikProps
    switch (stateForm) {
      default: {
        return (
          <Grid container spacing={2}>
            <Grid item container xs={12} md={6} spacing={2}>
              <Grid item xs={12}>
                <RadioGroupField
                  name="notification_type"
                  label="Notification type"
                  data={NOTIFICATION_TYPE_OPTION}
                  required={true}
                  rowItems={true}
                  value={values?.notification_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched?.notification_type && Boolean(errors?.notification_type)}
                  helperText={touched.notification_type && errors.notification_type}
                />
              </Grid>
              <Grid item xs={12}>
                <AutocompleteAsyncField
                  onBlur={handleBlur}
                  isOptionEqualToValue={isOptionEqualToValue}
                  onChange={(v: string) => setFieldValue('subscribers', v)}
                  error={touched.subscribers && Boolean(errors.subscribers)}
                  helperText={touched.subscribers && errors.subscribers}
                  value={values.subscribers}
                  required={true}
                  defaultValue={[]}
                  fullWidth={true}
                  id="subscribers"
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="title"
                  label="title"
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
                  label="message"
                  required
                  fullWidth
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.message && Boolean(errors.message)}
                  helperText={touched.message && errors.message}
                />
              </Grid>
              <Grid item xs={12}>
                <SelectField
                  options={TYPE_URL_OPTIONS}
                  name="type_url"
                  label="Type URL"
                  id="type_url"
                  fullWidth={true}
                  onBlur={handleBlur}
                  value={values.type_url}
                  onChange={handleChange}
                  error={touched.type_url && Boolean(errors.type_url)}
                  helperText={touched.type_url && errors.type_url}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
              <Grid item xs={12}>
                <Grid item container xs={12}>
                  <Grid item xs={6}>
                    <RadioGroupField
                      name="delivery_type"
                      label="Delivery type"
                      data={DELIVERY_TYPE_OPTION}
                      required={true}
                      rowItems={true}
                      value={values?.delivery_type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched?.delivery_type && Boolean(errors?.delivery_type)}
                      helperText={touched.delivery_type && errors.delivery_type}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    date picker
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid item container xs={12} spacing={2}>
                  <Grid item xs={4}>
                    <Grid item xs={12}>
                      <InputField
                        name="expire"
                        label="Expire"
                        required
                        fullWidth
                        value={values.expire}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.expire && Boolean(errors.expire)}
                        helperText={touched.expire && errors.expire}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={8} className={classes.radioField}>
                    <RadioGroupField
                      name="type_expired"
                      data={EXPIRE_OPTION}
                      required={true}
                      rowItems={true}
                      value={values?.type_expired}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched?.type_expired && Boolean(errors?.type_expired)}
                      helperText={touched.type_expired && errors.type_expired}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      }
    }
  };

  const submitButton = () => {
    return (
      <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
        <Button variant="outlined" onClick={handleClearData}>
          <Trans>lang_clear</Trans>
        </Button>
        <Button variant="contained" type="submit">
          <Trans>lang_create</Trans>
        </Button>
      </Stack>
    );
  };

  return (
    <Paper className={classes.wrapper}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitForm}>
        {(form: FormikProps<initialValuesType>) => {
          return (
            <React.Fragment>
              {renderContent(form)}
              {submitButton()}
            </React.Fragment>
          );
        }}
      </Formik>
    </Paper>
  );
};

interface initialValuesType {
  notification_type: string;
  subscribers: Array<any>;
  title: string;
  message: string;
  type_url: string;
  delivery_type: string;
  expire: string;
  type_expired: string;
}

const initialValues: initialValuesType = {
  notification_type: NOTIFICATION_TYPE.Direct,
  subscribers: [],
  title: '',
  message: '',
  type_url: '',
  delivery_type: DELIVERY_TYPE.Instant,
  expire: '0',
  type_expired: EXPIRE.Hours,
};

const validationSchema = yup.object().shape({});

export default CreateNewNotification;
