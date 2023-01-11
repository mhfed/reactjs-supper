/*
 * Created on Fri Jan 06 2023
 *
 * Fetch report
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { makeStyles } from '@mui/styles';
import { Stack, Button, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yup } from 'helpers';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
// import { useGlobalModalContext } from 'containers/Modal';
import { Grid } from '@mui/material';
import { InputCodeField } from 'components/fields';
import { useTheme } from '@mui/styles';
import httpRequest from 'services/httpRequest';
import { postLogin } from 'apis/request.url';

interface FetchReportProps {
  values?: any;
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

const FetchReport: React.FC<FetchReportProps> = (props) => {
  const classes = useStyles();
  const pinRef = React.useRef<any[]>();
  const theme = useTheme();

  React.useEffect(() => {
    const inputField = pinRef.current as any;
    if (inputField.textInput[0]) inputField.textInput[0].focus();
  }, []);

  const submitForm = (values: initialValuesType, formikHelpers: FormikHelpers<{}>) => {
    // clearPin();
    const previousForm = props.values;
    const body = {
      ...previousForm,
      '2fa_code': values.inputCode,
    };
    httpRequest
      .post(postLogin(), body, { headers: { 'site-name': previousForm.site_name } })
      .then(async (res) => {})
      .catch((err) => {
        console.log(err);
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
    const { values, handleChange, handleBlur, touched, errors, setFieldValue } = form || {};

    return (
      <React.Fragment>
        <Grid item xs={12}>
          <InputCodeField
            onChangeOTP={(e: string) => {
              setFieldValue('inputCode', e);
            }}
            pinRef={pinRef}
            error={errors.inputCode}
            OTP_LENGTH={6}
            theme={theme}
            // onResendOTP={onResendOTP}
          />
        </Grid>
      </React.Fragment>
    );
  };

  const submitButton = (form: FormikProps<initialValuesType>) => {
    return (
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
          {/* <Button variant="outlined" onClick={() => handleClearData(form)}>
            <Trans>lang_cancel</Trans>
          </Button> */}

          <Button variant="contained" type="submit" style={{ textTransform: 'uppercase' }}>
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

export default FetchReport;
