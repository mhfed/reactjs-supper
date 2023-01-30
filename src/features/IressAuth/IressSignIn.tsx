/*
 * Created on Fri Jan 06 2023
 *
 * Iress Sign In
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { makeStyles } from '@mui/styles';
import { Stack, Typography } from '@mui/material';
import Button from 'components/atoms/ButtonBase';
import { Form, Formik, FormikProps } from 'formik';
import { validate, yup } from 'helpers';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
import { useGlobalModalContext } from 'containers/Modal';
import { Grid } from '@mui/material';
import { PasswordField, InputField } from 'components/fields';
import httpRequest from 'services/httpRequest';
import { postLogin } from 'apis/request.url';
import ConfirmCode from './ConfirmCode';
import { useDispatch } from 'react-redux';
import { IAuthActionTypes } from 'models/IAuthState';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    background: theme.palette.background.paper,
    padding: 16,
    justifyContent: 'space-between',
    maxWidth: 460,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
  },
  messageError: {
    textAlign: 'center',
    color: theme.palette.error.main,
  },
}));

interface IressSignInProps {
  cbAfterSignIn?: (token?: string, sitename?: string) => void;
  title: string;
}

export const isOptionEqualToValue = (option: LooseObject, value: LooseObject) => {
  return option.username === value.username;
};

const IressSignIn: React.FC<IressSignInProps> = (props) => {
  const classes = useStyles();
  const { hideSubModal, showSubModal } = useGlobalModalContext();
  const dispatch = useDispatch();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  /**
   * Handle iress login
   * @param values form data
   */
  const submitForm = (values: initialValuesType) => {
    const body = {
      password: values.password,
      username: values.username,
    };
    setLoading(true);
    httpRequest
      .post(postLogin(), body, { headers: { 'site-name': values.site_name } })
      .then(async (res) => {
        const bodyPayload = {
          iressAccessToken: res.data.access_token,
          iressExpiredTime: moment().local().add(58, 'minutes'),
          sitename: values.site_name,
        };
        dispatch({ type: IAuthActionTypes.IRESS_LOGIN, payload: { ...bodyPayload } });
        hideSubModal();
        if (props?.cbAfterSignIn) props?.cbAfterSignIn(res.data.access_token, values.site_name);
      })
      .catch((err) => {
        // 401
        setLoading(false);
        if (err.error === 100005) {
          return showSubModal({
            title: 'lang_confirm_code',
            component: ConfirmCode,
            styleModal: { minWidth: 440 },
            props: {
              title: 'lang_confirm_cancel_text',
              cancelText: 'lang_no',
              confirmText: 'lang_yes',
              emailConfirm: false,
              cbAfterSignInCode: props?.cbAfterSignIn,
              values: values,
            },
          });
        }
        err.error && setError(`error_code_${err.error}`);
      });
  };

  /**
   * close iress signin popup
   */
  const handleClearData = () => {
    hideSubModal();
  };

  const renderContent = (form: FormikProps<initialValuesType>) => {
    const { values, handleChange, handleBlur, touched, errors, setFieldValue } = form || {};

    return (
      <React.Fragment>
        <Grid item xs={12}>
          <InputField
            name="site_name"
            label="lang_sitename"
            required
            fullWidth
            inputProps={{ maxLength: 255 }}
            value={values.site_name}
            onChange={handleChange}
            onBlur={handleBlur}
            clearValue={setFieldValue}
            error={touched.site_name && Boolean(errors.site_name)}
            helperText={touched.site_name && errors.site_name}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            name="username"
            label="lang_iress_account"
            required
            fullWidth
            inputProps={{ maxLength: 50 }}
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            clearValue={setFieldValue}
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
          />
        </Grid>
        <Grid item xs={12}>
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
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
        </Grid>
      </React.Fragment>
    );
  };

  const submitButton = (form: FormikProps<initialValuesType>) => {
    const { isValid, touched } = form;
    return (
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
          <Button variant="outlined" onClick={() => handleClearData()}>
            <Trans>lang_cancel</Trans>
          </Button>

          <Button
            variant="contained"
            network
            isLoading={loading}
            type="submit"
            disabled={!isValid || !Object.keys(touched).length}
          >
            <Trans>lang_sign_in</Trans>
          </Button>
        </Stack>
      </Grid>
    );
  };

  const HeaderTitle = () => {
    return (
      <Grid item xs={12}>
        <Typography>
          <Trans>{props.title}</Trans>
        </Typography>
      </Grid>
    );
  };
  return (
    <div className={classes.wrapper}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitForm}>
        {(form: FormikProps<initialValuesType>) => {
          return (
            <React.Fragment>
              <Form noValidate className={classes.formContainer}>
                <Grid container spacing={2}>
                  {error ? (
                    <Grid item xs={12}>
                      <Typography className={classes.messageError}>
                        <Trans>{error}</Trans>
                      </Typography>
                    </Grid>
                  ) : null}

                  {HeaderTitle()}
                  {renderContent(form)}
                  {submitButton(form)}
                </Grid>
              </Form>
            </React.Fragment>
          );
        }}
      </Formik>
    </div>
  );
};

export interface initialValuesType {
  site_name: string;
  username: string;
  password: string;
}

const initialValues: initialValuesType = {
  site_name: '',
  username: '',
  password: '',
};

const validationSchema = yup.object().shape({
  site_name: yup.string().required('lang_please_enter_sitename'),
  username: yup.string().required('lang_please_enter_email'),
  password: yup.string().required('lang_please_enter_password'),
});

export default IressSignIn;
