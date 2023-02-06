/*
 * Created on Fri Jan 06 2023
 *
 * Login form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { useFormik } from 'formik';
import { yup } from 'helpers';
import { useDispatch, useSelector } from 'react-redux';
import { validate } from 'helpers';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Button from 'components/atoms/ButtonBase';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { clearError, login } from 'actions/auth.action';
import { isLoadingSelector, errorSelector } from 'selectors/auth.selector';
import { Trans } from 'react-i18next';
import ErrorCollapse from 'components/molecules/ErrorExpandable';
import { InputField, PasswordField } from 'components/fields';
import React from 'react';
import { ILoginValues } from 'models/ICommon';

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.background.default,
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

export default function SignIn() {
  const classes = useStyles();
  const error = useSelector(errorSelector);
  const dispatch = useDispatch();
  const isLoading = useSelector(isLoadingSelector);

  /**
   * Handle login with email and password
   * @param values form data
   */
  const handleFormSubmit = async (values: ILoginValues) => {
    dispatch(login((values.email + '').replace(/\s/g, '').toLocaleLowerCase(), values.password) as any);
  };

  /**
   * Save user stayed login status
   * @param e checkbox input event
   */
  const onStaySignedIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    window.staySignedin = e.target.checked;
  };

  const { values, errors, touched, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  /**
   * Preprocess email user input
   * @param e inputn change event
   */
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue('email', validate.removeSpace(e.target.value));
    if (error) {
      dispatch(clearError());
    }
  };
  return (
    <Paper className={classes.container}>
      <div className={classes.title}>
        <Typography variant="h5">
          <Trans>lang_sign_in_to_your_account</Trans>
        </Typography>
      </div>
      <Box className={classes.loginForm}>
        <ErrorCollapse error={error} />
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        >
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
            onChange={handleChangeEmail}
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
            onChange={(v: string) => setFieldValue('password', validate.removeSpace(v))}
            onBlur={handleBlur}
            error={(touched.password && Boolean(errors.password)) || !!error}
            helperText={touched.password && errors.password}
          />
          <FormControlLabel onChange={onStaySignedIn} control={<Checkbox />} label={<Trans>lang_stay_sign_in</Trans>} />
          <Button network type="submit" fullWidth variant="contained" color="primary" sx={{ my: 2 }} isLoading={!!isLoading}>
            <Trans>lang_sign_in</Trans>
          </Button>
          <div className={classes.termsContainer}>
            <Trans
              components={[
                <Link key="termsOfService" target="_blank" href={`/novus-fintech-privacy-policy.pdf?${+new Date()}`} />,
                <Link key="privacyPolicy" target="_blank" href={`/novus-fintech-privacy-policy.pdf?${+new Date()}`} />,
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
  email: yup.string().nullable(true).checkEmail('lang_email_invalid').required('lang_email_required'),
  password: yup.string().required('lang_password_required').matches(validate.getPasswordPattern(), 'lang_password_invalid'),
});
