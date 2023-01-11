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
import { validate, yup } from 'helpers';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { useGlobalModalContext } from 'containers/Modal';
import { Grid } from '@mui/material';
import { PasswordField, InputField } from 'components/fields';
import httpRequest from 'services/httpRequest';
import { postLogin } from 'apis/request.url';
import ConfirmCode from './ConfirmCode';
import { useDispatch } from 'react-redux';
import { IAuthActionTypes } from 'models/IAuthState';

interface FetchReportProps {}

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

const FetchReport: React.FC<FetchReportProps> = (props) => {
  const classes = useStyles();
  const { hideSubModal, showSubModal } = useGlobalModalContext();
  const dispatch = useDispatch();
  const submitForm = (values: initialValuesType, formikHelpers: FormikHelpers<{}>) => {
    const body = {
      ...values,
    };
    httpRequest
      .post(postLogin(), body, { headers: { 'site-name': values.site_name } })
      .then(async (res) => {
        // console.log(res.data);
        dispatch({ type: IAuthActionTypes.LOGIN_FETCH_REPORT, payload: { dataUser: res.data, statusLoginDataUser: true } });
        hideSubModal();
      })
      .catch((err) => {
        showSubModal({
          title: 'lang_confirm_code',
          component: ConfirmCode,
          styleModal: { minWidth: 440 },
          props: {
            title: 'lang_confirm_cancel_text',
            isCancelPage: true,
            emailConfirm: false,
            onSubmit: () => {
              console.log('xin chao');
            },
            values: values,
          },
        });
      });
  };

  const handleClearData = (form: FormikProps<initialValuesType>) => {
    // const { resetForm, values } = form;
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
    return (
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
          <Button variant="outlined" onClick={() => handleClearData(form)}>
            <Trans>lang_cancel</Trans>
          </Button>

          <Button variant="contained" type="submit">
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
          <Trans>lang_title_fetch_report</Trans>
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
  site_name: yup.string().required('lang_please_enter_sitename').max(255),
  username: yup.string().required('lang_please_enter_email'),
  password: yup.string().required('lang_please_enter_password'),
});

export default FetchReport;
