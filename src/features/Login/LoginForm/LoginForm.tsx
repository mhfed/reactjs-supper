/*
 * Created on Fri Jan 06 2023
 *
 * Login form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { loginIress } from 'actions/auth.action';
import Button from 'components/atoms/ButtonBase';
import { InputField } from 'components/fields';
import ErrorCollapse from 'components/molecules/ErrorExpandable';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import { checkExistURL } from 'helpers/common';
import { ILoginValues } from 'models/ICommon';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { errorSelector, isLoadingSelector } from 'selectors/auth.selector';

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontWeight: 700,
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
    padding: theme.spacing(5, 4, 4, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  termsContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  buttonSignin: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(4),
    fontWeight: 700,
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const error = useSelector(errorSelector);
  const dispatch = useDispatch();
  const isLoading = useSelector(isLoadingSelector);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(false);

  // fixed CLIENT_ID & RESPONSE_TYPE
  const CLIENT_ID = 'swq7xlOvB8qD4iPqxpNn';
  const RESPONSE_TYPE = 'code';
  const redirectUrL = process.env.REACT_APP_REDIRECT_URL ?? '';
  /**
   * Handle login by login Xpan Iress
   * @param values form data
   */
  const handleFormSubmit = async (values: ILoginValues, { setFieldError }: any) => {
    const sitename = (values.site_name + '').replace(/\s/g, '').toLocaleLowerCase();
    const loginXplanURl =
      sitename + '/oauth2/auth?client_id=' + CLIENT_ID + '&response_type=' + RESPONSE_TYPE + '&redirect_uri=' + redirectUrL;

    const existURL = await checkExistURL(sitename);
    if (existURL) {
      localStorage.setItem('sitename', sitename);
      window.open(loginXplanURl, '_self');
    } else {
      setFieldError('site_name', t('lang_sitename_is_invalid'));
    }
  };

  /**
   * Handle if URI have code param => call api login
   */
  React.useEffect(() => {
    const sitename = localStorage.getItem('sitename') ?? '';
    const loginCode = localStorage.getItem('loginCode') ?? '';
    const oldUrl = localStorage.getItem('oldUrl') ?? '';
    if (oldUrl?.includes('code=')) {
      setFieldValue('site_name', sitename);
      dispatch(loginIress(loginCode, redirectUrL, sitename, navigate) as any);
    }
  }, []);

  /**
   * if error disabled button signin
   */
  React.useEffect(() => {
    setDisabled(true);
  }, [error]);

  const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Paper className={classes.container}>
      <div className={classes.title}>
        <Typography variant="h5" className={classes.heading}>
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
          <div className={classes.termsContainer}>
            <Trans>lang_sign_in_to_access_to_Iress_CMS_portal</Trans>
          </div>
          <InputField
            id="site_name"
            name="site_name"
            label="lang_sitename"
            required
            fullWidth
            autoFocus
            inputProps={{ maxLength: 255 }}
            value={values.site_name}
            onChange={(e) => {
              setDisabled(false);
              handleChange(e);
            }}
            onBlur={handleBlur}
            error={(touched.site_name && Boolean(errors.site_name)) || !!error}
            helperText={touched.site_name && errors.site_name}
          />
          <Button
            network
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={disabled || Boolean(errors.site_name)}
            isLoading={!!isLoading}
            className={classes.buttonSignin}
          >
            <Trans>lang_sign_in</Trans>
          </Button>
        </form>
      </Box>
    </Paper>
  );
}

const initialValues = {
  site_name: '',
};

const validationSchema = yup.object().shape({
  site_name: yup.string().required('lang_site_name_required'),
});
