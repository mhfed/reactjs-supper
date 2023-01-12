/*
 * Created on Fri Jan 06 2023
 *
 * Fetch report
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { makeStyles } from '@mui/styles';
import { Stack, Button, Typography, FormHelperText } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yup } from 'helpers';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
import { useGlobalModalContext } from 'containers/Modal';
import { Grid } from '@mui/material';
import { InputCodeField } from 'components/fields';
import { useTheme } from '@mui/styles';
import httpRequest from 'services/httpRequest';
import { postLogin } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { IAuthActionTypes } from 'models/IAuthState';
import moment from 'moment';

interface ConfirmCodeProps {
  values?: any;
  cbAfterSignInCode?: () => void;
}

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
  radioField: {
    display: 'flex',
    alignItems: 'center',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
  },
}));

export const isOptionEqualToValue = (option: LooseObject, value: LooseObject) => {
  return option.username === value.username;
};

const STATE_FORM = {
  LOGIN: 'LOGIN',
  CONFIRM_CODE: 'CONFIRM_CODE',
};

const ConfirmCode: React.FC<ConfirmCodeProps> = (props) => {
  const classes = useStyles();
  const pinRef = React.useRef<any[]>();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { hideSubModal } = useGlobalModalContext();
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const inputField = pinRef.current as any;
    if (inputField.textInput[0]) inputField.textInput[0].focus();
  }, []);

  const submitForm = (values: initialValuesType, formikHelpers: FormikHelpers<{}>) => {
    // clearPin();
    const previousForm = props?.values || {};
    const body = {
      password: previousForm.password,
      username: previousForm.username,
      '2fa_code': values.inputCode,
    };
    httpRequest
      .post(postLogin(), body, { headers: { 'site-name': previousForm.site_name } })
      .then(async (res) => {
        // IAuthActionTypes
        const bodyPayload = {
          iressAccessToken: res.data.access_token,
          iressExpiredTime: moment().local().add(58, 'minutes'),
          sitename: previousForm.site_name,
        };
        dispatch({ type: IAuthActionTypes.IRESS_LOGIN, payload: { ...bodyPayload } });
        hideSubModal();
        if (props?.cbAfterSignInCode) props?.cbAfterSignInCode();
      })
      .catch((err) => {
        // console.log(err.error);
        setErrorMessage(`error_code_${err.error}`);
        clearPin();
      });
  };

  const clearPin = () => {
    const inputField = pinRef.current as any;
    if (inputField.textInput[0]) inputField.textInput[0].focus();
    inputField.state.input[0] = '';
    inputField.state.input[1] = '';
    inputField.state.input[2] = '';
    inputField.state.input[3] = '';
    inputField.state.input[4] = '';
    inputField.state.input[5] = '';
  };

  const renderContent = (form: FormikProps<initialValuesType>) => {
    const { setFieldValue, setFieldTouched } = form || {};

    return (
      <React.Fragment>
        <Grid item xs={12}>
          <InputCodeField
            onChangeOTP={(e: string) => {
              setFieldValue('inputCode', e);
              setFieldTouched('inputCode', true);
            }}
            pinRef={pinRef}
            error={errorMessage}
            OTP_LENGTH={6}
            theme={theme}
            // onResendOTP={onResendOTP}
          />
          <Grid item xs={12} sm={12} textAlign="left">
            <FormHelperText error style={{ textAlign: 'left' }}>
              <Trans>{errorMessage}</Trans>
            </FormHelperText>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  const submitButton = (form: FormikProps<initialValuesType>) => {
    const { values } = form;
    return (
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
          {/* <Button variant="outlined" onClick={() => handleClearData(form)}>
            <Trans>lang_cancel</Trans>
          </Button> */}

          <Button
            variant="contained"
            type="submit"
            style={{ textTransform: 'uppercase' }}
            disabled={values.inputCode.length !== 6}
          >
            <Trans>lang_verify</Trans>
          </Button>
        </Stack>
      </Grid>
    );
  };

  const HeaderTitle = () => {
    return (
      <Grid item xs={12}>
        <Typography>
          <Trans>lang_a_verification_code</Trans>
        </Typography>
      </Grid>
    );
  };

  return (
    <div className={classes.wrapper}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitForm}>
        {(form: FormikProps<initialValuesType>) => {
          console.log(form.values);
          return (
            <React.Fragment>
              <Form noValidate className={classes.formContainer}>
                <Grid container spacing={2}>
                  {HeaderTitle()}
                  {renderContent(form)}
                  {submitButton(form)}
                  {/* <button onClick={clearPin}>clear field</button> */}
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
  inputCode: string;
}

const initialValues: initialValuesType = {
  inputCode: '',
};

const validationSchema = yup.object().shape({});

export default ConfirmCode;
