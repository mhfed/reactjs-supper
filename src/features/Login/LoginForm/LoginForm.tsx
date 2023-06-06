/*
 * Created on Fri Jan 06 2023
 *
 * Login form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { loginIress, clearError } from 'actions/auth.action';
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
import { errorSelector, isLoadingSelector, iressTokenSelector } from 'selectors/auth.selector';

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
  const accessToken = useSelector(iressTokenSelector);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(false);

  const RESPONSE_TYPE = 'code';
  const redirectUrL = window.env?.REACT_APP_REDIRECT_URL || '';
  const clientId = window.env?.REACT_APP_CLIENT_ID || '';
  /**
   * Handle login by login Xpan Iress
   * @param values form data
   */
  const handleFormSubmit = async (values: ILoginValues, { setFieldError }: any) => {
    const sitename = (values.site_name + '').replace(/\s/g, '').toLocaleLowerCase();
    const loginXplanURl =
      sitename + '/oauth2/auth?client_id=' + clientId + '&response_type=' + RESPONSE_TYPE + '&redirect_uri=' + redirectUrL;

    const existURL = checkExistURL(sitename);
    if (existURL) {
      window.open(loginXplanURl, '_self');
    } else {
      setFieldError('site_name', t('lang_sitename_is_invalid'));
    }
  };

  /**
   * Handle if URI have code param => call api login
   */
  React.useEffect(() => {
    // Tạo một key debugger trong localStorage sẽ ko login => lấy code để DEVELOPMENT
    if (localStorage.getItem('debugger')) return;

    const url = new URL(window.location.href);
    const loginCode = url.searchParams.get('code') ?? '';

    const isLocalHost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
    const getSiteName = () => {
      // Fake sitename trong local để by pass login
      const sitenameLocal = localStorage.getItem('sitename');
      if (isLocalHost && sitenameLocal) return sitenameLocal;

      // Môi trường thật thì lấy sitename qua document.referrer
      return formatSitename(window.document.referrer ?? '');
    };

    const sitename = getSiteName();

    if (loginCode && sitename && !accessToken) {
      setFieldValue('site_name', sitename);
      dispatch(loginIress(loginCode, redirectUrL, sitename, navigate) as any);
    }
  }, []);

  /**
   * if error disabled button signin
   */
  React.useEffect(() => {
    setDisabled(!!error);
  }, [error]);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  const formatSitename = (sitename: string) => {
    if (!sitename.startsWith('https://')) return sitename;

    //regex remove special characters at the end sitename
    const regex = /[^\w\s]{1,}$/;
    const sitenameHandled = sitename.replace(regex, '');
    return sitenameHandled;
  };

  //handle change sitename field & auto remove last character if it = "/"
  const handleBlurSitename = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const value = formatSitename(e.target.value);
    setFieldValue('site_name', value);
  };

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
              !!error && dispatch(clearError());
              handleChange(e);
            }}
            onBlur={handleBlurSitename}
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
          {/* <div className={classes.termsContainer} style={{ marginTop: 16 }}>
            <Trans
              components={[
                <Link key="termsOfService" target="_blank" href={`/novus-fintech-privacy-policy.pdf?${+new Date()}`} />,
                <Link key="privacyPolicy" target="_blank" href={`/novus-fintech-privacy-policy.pdf?${+new Date()}`} />,
              ]}
            >
              lang_terms_of_service_and_privacy_policy
            </Trans>
          </div> */}
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
