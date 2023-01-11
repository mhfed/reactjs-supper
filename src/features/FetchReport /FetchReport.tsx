/*
 * Created on Fri Jan 06 2023
 *
 * Fetch report
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, Stack, Button, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yup } from 'helpers';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { useGlobalModalContext } from 'containers/Modal';
import { Grid } from '@mui/material';
import { AutocompleteAsyncField, InputField, SelectField, DatePickerField, AutocompleteFreeSoloField } from 'components/fields';

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
  title: {
    // textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
    width: '100%',
    // fontWeight: 700,
  },
}));

export const isOptionEqualToValue = (option: LooseObject, value: LooseObject) => {
  return option.username === value.username;
};

const FetchReport: React.FC<FetchReportProps> = (props) => {
  const classes = useStyles();
  // const [stateForm, setStateForm] = React.useState(STATE_FORM.CREATE);
  const { showModal, hideModal } = useGlobalModalContext();

  const submitForm = (values: initialValuesType, formikHelpers: FormikHelpers<{}>) => {
    console.log('xin chao');
  };

  const handleClearData = (form: FormikProps<initialValuesType>) => {
    const { resetForm, values } = form;
    if (JSON.stringify(values) !== JSON.stringify(initialValues))
      showModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          isCancelPage: true,
          emailConfirm: false,
          onSubmit: () => {
            resetForm();
            hideModal();
          },
        },
      });
  };

  const renderContent = (form: FormikProps<initialValuesType>) => {
    const { values, handleChange, handleBlur, touched, errors } = form || {};
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <InputField
            name="title"
            label="lang_title"
            required
            fullWidth
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            name="title"
            label="lang_title"
            required
            fullWidth
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            name="title"
            label="lang_title"
            required
            fullWidth
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
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
            <Trans>lang_clear</Trans>
          </Button>

          <Button variant="contained" type="submit">
            <Trans>lang_create</Trans>
          </Button>
        </Stack>
      </Grid>
    );
  };

  const HeaderTitle = () => {
    // if (stateForm !== STATE_FORM.PREVIEW) return null;

    return (
      <Typography className={classes.title}>
        <Trans>lang_title_fetch_report</Trans>
      </Typography>
    );
  };
  return (
    <div className={classes.wrapper}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitForm}>
        {(form: FormikProps<initialValuesType>) => {
          console.log(form.values);
          return (
            <React.Fragment>
              {HeaderTitle()}
              <Form noValidate className={classes.formContainer}>
                <Grid container spacing={2}>
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
  title: string;
}

const initialValues: initialValuesType = {
  title: '',
};

const validationSchema = yup.object().shape({});

export default FetchReport;
