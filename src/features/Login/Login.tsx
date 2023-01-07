/*
 * Created on Fri Jan 06 2023
 *
 * Login screen, contain Login form, pin form, set password form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import { stepSelector } from 'selectors/auth.selector';
import Footer from 'layouts/MainLayout/Footer';
import LoginForm from './LoginForm';
import PinForm from './PinForm';
import SetPassword from './SetPassword';
import { Trans } from 'react-i18next';
import { IAuthStep } from 'models/IAuthState';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  loginContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    backgroundColor: '#1F2332',
    padding: theme.spacing(1.5),
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginForm: {
    borderRadius: 12,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#272B3B',
  },
  loginLogo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    padding: theme.spacing(4, 3, 3, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const step = useSelector(stepSelector);
  const password = useRef('');

  return (
    <Container component="main" className={classes.container} maxWidth="md">
      <CssBaseline />
      <Box className={classes.loginContainer}>
        {step === IAuthStep.LOGIN ? (
          <LoginForm />
        ) : step === IAuthStep.ENTER_PIN ? (
          <PinForm />
        ) : [IAuthStep.SET_PIN, IAuthStep.FORCE_SET_PIN].includes(step) ? (
          <PinForm isSetPin isFirstTime={step === IAuthStep.SET_PIN} password={password.current} />
        ) : step === IAuthStep.SET_PASSWORD ? (
          <SetPassword setNewPassord={(pw) => (password.current = pw)} />
        ) : (
          <Typography>Page not found</Typography>
        )}
        <div className={classes.loginLogo}>
          <img alt="loginLogo" src="/assets/images/login-logo.svg" />
          <Typography variant="h3" sx={{ pt: 2 }}>
            <Trans>lang_cms_portal</Trans>
          </Typography>
        </div>
      </Box>
      <Footer />
    </Container>
  );
}
