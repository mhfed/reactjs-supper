import React from 'react';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import { InputField, PasswordField, PreviewField, SelectField } from 'components/fields';
import { useFormik } from 'formik';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Trans } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    background: theme.palette.background.paper,
    padding: 40,
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
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

  const getData = async () => {
    try {
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  };

  const handleShowPreSubmit = async (values: any) => {
    setStateForm(STATE_FORM.PREVIEW);
  };

  // Handle Submit Form
  const handleFormSubmit = () => {
    console.log('values', values);
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
    console.log('stateForm', stateForm);

    switch (stateForm) {
      case STATE_FORM.PREVIEW:
        return (
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <div className={classes.title}>
              <Typography variant="h4">
                <Trans>lang_user_details</Trans>
              </Typography>
            </div>
            <Stack direction="row" sx={{ margin: '12px 0' }}>
              <PreviewField sx={{ mb: 2, mr: 4 }} label="lang_full_name" value={values.full_name} />
              <PreviewField label="lang_site_name" value={values.site_name} />
            </Stack>
            <Stack direction="row" sx={{ margin: '12px 0' }}>
              <PreviewField sx={{ mb: 2, mr: 4 }} label="lang_user_login" value={values.user_login} />
              <PreviewField label="lang_status" value={values.status} />
            </Stack>
            <Stack direction="row" sx={{ margin: '12px 0', width: '50%' }}>
              <PreviewField sx={{ mb: 2, mr: 2 }} label="lang_password" value={values.user_login} />
            </Stack>
            <div className={classes.title}>
              <Typography variant="h4">
                <Trans>lang_notes</Trans>
              </Typography>
            </div>
            <Stack direction="row" sx={{ margin: '12px 0', width: '50%' }}>
              <PreviewField
                sx={{ mb: 2, mr: 2 }}
                variant="outlined"
                label="lang_description"
                value={values.description}
                multiline
                rows={4}
              />
            </Stack>
            <Stack direction="row" justifyContent="end" alignItems="center" spacing={2} sx={{ margin: '12px 0' }}>
              <Button variant="outlined" onClick={handleReturn}>
                Return
              </Button>
              <Button variant="contained" onClick={handleFormSubmit}>
                Confirm
              </Button>
            </Stack>
          </form>
        );

      default:
        return (
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <div className={classes.title}>
              <Typography variant="h4">
                <Trans>lang_user_details</Trans>
              </Typography>
            </div>
            <Stack direction="row" sx={{ margin: '12px 0' }}>
              <InputField
                id="full_name"
                name="full_name"
                sx={{ mb: 2, mr: 4 }}
                label="lang_full_name"
                required
                fullWidth
                value={values.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.full_name && Boolean(errors.full_name)}
                helperText={touched.full_name && errors.full_name}
              />
              <SelectField
                options={[
                  { label: 'sitename A', value: 'sitename A' },
                  { label: 'sitename B', value: 'sitename B' },
                ]}
                name="site_name"
                label="lang_sitename"
                id="site_name"
                fullWidth={true}
                onBlur={handleBlur}
                value={values.site_name}
                onChange={handleChange}
                error={touched.site_name && Boolean(errors.site_name)}
                helperText={touched.site_name && errors.site_name}
              />
            </Stack>
            <Stack direction="row" sx={{ margin: '12px 0' }}>
              <InputField
                id="user_login"
                name="user_login"
                sx={{ mb: 2, mr: 4 }}
                label="lang_user_login"
                required
                fullWidth
                value={values.user_login}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.user_login && Boolean(errors.user_login)}
                helperText={touched.user_login && errors.user_login}
              />
              <SelectField
                options={[
                  { label: 'status aa', value: 'status aa' },
                  { label: 'status bb', value: 'status bb' },
                ]}
                name="status"
                label="lang_status"
                id="status"
                fullWidth={true}
                onBlur={handleBlur}
                value={values.status}
                onChange={handleChange}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
              />
            </Stack>
            <Stack direction="row" sx={{ margin: '12px 0', width: '50%' }}>
              <PasswordField
                id="password"
                name="password"
                sx={{ mb: 2, mr: 2 }}
                label="lang_password"
                required
                fullWidth
                value={values.password}
                onChange={(p: string) => setFieldValue('password', p)}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                generate
                helperText={touched.password && errors.password}
              />
            </Stack>
            <div className={classes.title}>
              <Typography variant="h4">
                <Trans>lang_notes</Trans>
              </Typography>
            </div>
            <Stack direction="row" sx={{ margin: '12px 0', width: '50%' }}>
              <InputField
                id="description"
                name="description"
                sx={{ mb: 2, mr: 2 }}
                label="lang_description"
                required
                fullWidth
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.password && errors.password}
                multiline
                rows={4}
              />
            </Stack>
            <Stack direction="row" justifyContent="end" alignItems="center" spacing={2} sx={{ margin: '12px 0' }}>
              <Button variant="outlined" onClick={handleClearData}>
                Clear Data
              </Button>
              <Button variant="contained" type="submit">
                Create
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
  description: '',
};

const validationSchema = yup.object().shape({
  full_name: yup.string().required('lang_full_name_required').max(64, 'Must be 15 characters or less'),
  site_name: yup.string().required('lang_full_name_required'),
  user_login: yup.string().required('lang_full_name_required'),
  status: yup.string().required('lang_full_name_required'),
  password: yup.string().required('lang_full_name_required'),
});

export default CreateNewUser;
