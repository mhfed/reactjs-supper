import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { IValidator } from 'models/ICommon';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { login } from 'actions/auth.action';
import { isLoadingSelector, errorSelector } from 'selectors/auth.selector';
import { Trans } from 'react-i18next';
import ErrorCollapse from 'components/molecules/ErrorExpandable';
import { InputField, PasswordField } from 'components/fields';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(2),
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginForm: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    padding: theme.spacing(8, 4, 4, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  termsContainer: {
    textAlign: 'center',
  },
}));

interface ILoginValues {
  email: string;
  password: string;
}
export default function SignIn() {
  const classes = useStyles();
  const error = useSelector(errorSelector);
  const dispatch = useDispatch();
  const isLoading = useSelector(isLoadingSelector);

  const handleFormSubmit = async (values: ILoginValues) => {
    dispatch(login((values.email + '').trim().toLocaleLowerCase(), values.password) as any);
  };

  const onStaySignedIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    window.localStorage.setItem('isStaySignedIn', e.target.checked + '');
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Paper className={classes.container}>
      <div className={classes.title}>
        <Typography variant="h5">
          <Trans>lang_sign_in_to_your_account</Trans>
        </Typography>
      </div>
      <Box className={classes.loginForm}>
        <ErrorCollapse error={error} />
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <InputField
            id="email"
            name="email"
            sx={{ mb: 2 }}
            label="lang_email"
            required
            fullWidth
            autoComplete="email"
            autoFocus
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={(touched.email && Boolean(errors.email)) || !!error}
            helperText={touched.email && errors.email}
          />
          <PasswordField
            id="password"
            name="password"
            sx={{ mb: 2 }}
            label="lang_password"
            required
            fullWidth
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={(touched.password && Boolean(errors.password)) || !!error}
            helperText={touched.password && errors.password}
          />
          <FormControlLabel onChange={onStaySignedIn} control={<Checkbox />} label={<Trans>lang_stay_sign_in</Trans>} />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
            <Trans>lang_sign_in</Trans>
            {isLoading && <CircularProgress color="secondary" size={24} sx={{ position: 'absolute' }} />}
          </Button>
          <div className={classes.termsContainer}>
            <Trans
              components={[
                <Link
                  key="termsOfService"
                  className="link"
                  color="secondary"
                  target="_blank"
                  href={`/novus-fintech-privacy-policy.pdf?${+new Date()}`}
                />,
                <Link
                  key="privacyPolicy"
                  className="link"
                  color="secondary"
                  target="_blank"
                  href={`/novus-fintech-privacy-policy.pdf?${+new Date()}`}
                />,
              ]}
            >
              lang_terms_of_service_and_privacy_policy
            </Trans>
          </div>
        </form>
      </Box>
    </Paper>
  );
}

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = yup.object().shape({
  email: yup.string().nullable(true).email('lang_email_invalid').required('lang_email_required'),
  password: yup.string().required('lang_password_required').matches(IValidator.PASSWORD, 'lang_password_required'),
});
