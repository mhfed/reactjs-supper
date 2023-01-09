/*
 * Created on Fri Jan 06 2023
 *
 * Create new user form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { yup } from 'helpers';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import { InputField, PasswordField, PreviewField, SelectField } from 'components/fields';
import { useFormik } from 'formik';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Trans } from 'react-i18next';
import { validate } from 'helpers';
import { USER_STATUS_OPTIONS, SITE_NAME_OPTIONS } from '../UserConstants';
import httpRequest from 'services/httpRequest';
import { getUserDetailUrl } from 'apis/request.url';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    background: theme.palette.mode === 'dark' ? theme.palette.background.other2 : theme.palette.background.default,
    padding: theme.spacing(5),
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& .MuiGrid-item': {
      paddingTop: theme.spacing(2),
    },
  },
}));
type CreateNewUserProps = {};

const STATE_FORM = {
  CREATE: 'CREATE',
  PREVIEW: 'PREVIEW',
};

const CreateNewUser: React.FC<CreateNewUserProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [stateForm, setStateForm] = React.useState(STATE_FORM.CREATE);

  const handleShowPreSubmit = async (values: any) => {
    setStateForm(STATE_FORM.PREVIEW);
  };

  // Handle Submit Form
  const handleFormSubmit = async () => {
    try {
      console.log('values', values);
      const body = {
        data: {
          status: values.status,
          site_name: values.site_name,
          full_name: values.full_name,
          note: values.note,
          password: values.password,
          user_login_id: values.user_login,
        },
      };

      await httpRequest.post(getUserDetailUrl(), body);
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_create_user_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      setStateForm(STATE_FORM.CREATE);
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error?.errorCodeLang,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
      console.error('Create user handleFormSubmit error: ', error);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleShowPreSubmit,
  });

  const handleClearData = () => {
    resetForm();
  };

  const handleReturn = () => {
    setStateForm(STATE_FORM.CREATE);
  };

  React.useEffect(() => {}, []);

  const renderContent = (stateForm: string) => {
    switch (stateForm) {
      case STATE_FORM.PREVIEW:
        return (
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Box>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography className={classes.title}>
                    <Trans>lang_preview_create_new_user</Trans>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <PreviewField label="lang_full_name" value={values.full_name} />
                </Grid>
                <Grid item xs={6}>
                  <PreviewField label="lang_sitename" value={values.site_name} options={SITE_NAME_OPTIONS} />
                </Grid>
                <Grid item xs={6}>
                  <PreviewField label="lang_user_login" value={values.user_login} />
                </Grid>
                <Grid item xs={6}>
                  <PreviewField label="lang_status" value={values.status} options={USER_STATUS_OPTIONS} />
                </Grid>
                <Grid item xs={6}>
                  <PreviewField label="lang_password" value={values.password} />
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                  <PreviewField label="lang_notes" value={values.note} multiline={true} />
                </Grid>
              </Grid>
            </Box>
            <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
              <Button variant="outlined" onClick={handleReturn}>
                <Trans>lang_return</Trans>
              </Button>
              <Button variant="contained" onClick={handleFormSubmit}>
                <Trans>lang_confirm</Trans>
              </Button>
            </Stack>
          </form>
        );

      default:
        return (
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Box>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography className={classes.title}>
                    <Trans>lang_user_details</Trans>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <InputField
                    id="full_name"
                    name="full_name"
                    label="lang_full_name"
                    required
                    fullWidth
                    value={values.full_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.full_name && Boolean(errors.full_name)}
                    helperText={touched.full_name && errors.full_name}
                    inputProps={{ maxLength: 64 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <SelectField
                    required
                    options={SITE_NAME_OPTIONS}
                    name="site_name"
                    label="lang_sitename"
                    id="site_name"
                    fullWidth={true}
                    onBlur={handleBlur}
                    value={values.site_name}
                    onChange={handleChange}
                    error={touched.site_name && Boolean(errors.site_name)}
                    helperText={touched.site_name && errors.site_name}
                    textTransform="uppercase"
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputField
                    id="user_login"
                    name="user_login"
                    label="lang_user_login"
                    required
                    fullWidth
                    value={values.user_login}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('user_login', validate.removeSpace(e.target.value))}
                    onBlur={handleBlur}
                    error={touched.user_login && Boolean(errors.user_login)}
                    helperText={touched.user_login && errors.user_login}
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <SelectField
                    required
                    options={USER_STATUS_OPTIONS}
                    name="status"
                    label="lang_status"
                    id="status"
                    fullWidth={true}
                    onBlur={handleBlur}
                    value={values.status}
                    onChange={handleChange}
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
                    textTransform="uppercase"
                  />
                </Grid>
                <Grid item xs={6}>
                  <PasswordField
                    id="password"
                    name="password"
                    label="lang_password"
                    required
                    fullWidth
                    value={values.password}
                    onChange={(p: string) => setFieldValue('password', validate.removeSpace(p))}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    generate
                    helperText={touched.password && errors.password}
                  />
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                  <InputField
                    id="note"
                    name="note"
                    label="lang_notes"
                    fullWidth
                    value={values.note}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.note && Boolean(errors.note)}
                    helperText={touched.note && errors.note}
                    multiline
                    rows={4}
                    inputProps={{ maxLength: 255 }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
              <Button variant="outlined" onClick={handleClearData}>
                <Trans>lang_clear</Trans>
              </Button>
              <Button variant="contained" type="submit">
                <Trans>lang_create</Trans>
              </Button>
            </Stack>
          </form>
        );
    }
  };

  return <Paper className={classes.wrapper}>{renderContent(stateForm)}</Paper>;
};
const initialValues = {
  full_name: '',
  site_name: '',
  user_login: '',
  status: '',
  password: '',
  note: '',
};

const validationSchema = yup.object().shape({
  full_name: yup.string().required('lang_please_enter_full_name').max(64, 'lang_full_name_max_length'),
  site_name: yup.string().required('lang_please_select_sitename'),
  user_login: yup
    .string()
    .required('lang_please_enter_user_login')
    .matches(validate.getEmailPattern(), 'lang_user_login_is_invalid'),
  status: yup.string().required('lang_please_select_status'),
  password: yup
    .string()
    .required('lang_please_generate_password')
    .matches(validate.getPasswordPattern(), 'lang_password_invalid'),
  note: yup.string().max(255, 'lang_note_max_length'),
});

export default CreateNewUser;
