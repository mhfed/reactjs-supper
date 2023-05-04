/*
 * Created on Fri Jan 06 2023
 *
 * Login screen, contain Login form, pin form, set password form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { responsiveFontSizes, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Footer from 'layouts/MainLayout/Footer';
import { Trans } from 'react-i18next';
import themes from 'themes';
import LoginForm from './LoginForm';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    flexDirection: 'column',
    overflow: 'auto',
  },
  loginContainer: {
    display: 'flex',
    margin: 'auto 0',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
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

  // Login screen always use dark mode
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={responsiveFontSizes(themes(1))}>
        <div id="loginBackground">
          <Container component="main" className={classes.container} maxWidth="md">
            <CssBaseline />
            <Box className={classes.loginContainer}>
              <LoginForm />
              <div className={classes.loginLogo}>
                <img alt="loginLogo" src="/assets/images/login-logo.svg" />
                <Typography variant="h3" sx={{ pt: 2 }}>
                  <Trans>lang_cms_portal</Trans>
                </Typography>
              </div>
            </Box>
            {/* <Footer /> */}
          </Container>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
