/*
 * Created on Fri Jan 06 2023
 *
 * Create new notification
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, Grid, Stack, Button, Autocomplete, TextField, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yup } from 'helpers';
import {
  DELIVERY_TYPE_OPTION,
  NOTIFICATION_TYPE_OPTION,
  STATE_FORM,
  TYPE_URL_OPTIONS,
  NOTIFICATION_TYPE,
  DELIVERY_TYPE,
  EXPIRE_OPTION,
  EXPIRE,
  NOTIFICATION_TYPE_OPTION_FILTER,
  EXPIRE_OPTION_FILTER,
} from './NotificationConstant';
import RadioGroupField from 'components/fields/RadioGroupField';
import { AutocompleteAsyncField, InputField, SelectField, DatePickerField } from 'components/fields';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
import moment from 'moment';
import httpRequest from 'services/httpRequest';
import { postDataUpdateSegmentByID, postDirectSend } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { useGlobalModalContext } from 'containers/Modal';

interface CreateNewNotificationProps {}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    background: theme.palette.background.paper,
    padding: 40,
    justifyContent: 'space-between',
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

const CreateNewNotification: React.FC<CreateNewNotificationProps> = (props) => {
  const classes = useStyles();
  const [stateForm, setStateForm] = React.useState(STATE_FORM.CREATE);
  const dispatch = useDispatch();
  const { showModal, hideModal } = useGlobalModalContext();

  const submitForm = (values: initialValuesType, formikHelpers: FormikHelpers<{}>) => {
    if (stateForm === STATE_FORM.CREATE) return setStateForm(STATE_FORM.PREVIEW);
    let urlSendNoti =
      values.notification_type === NOTIFICATION_TYPE.Direct ? postDirectSend() : postDataUpdateSegmentByID(values?.segment || '');
    let bodySendNoti = {};

    if (values.notification_type === NOTIFICATION_TYPE.Direct) {
      const { title, message, expire, type_expired } = values;
      bodySendNoti = {
        title,
        message,
        url: 'https://abc.com/',
        mobile_push: true,
        subscribers: (values?.subscribers || []).map((x) => x.username),
        schedule_time: moment(values?.schedule).toDate().getTime(),
        environment: 'iress-wealth-app',
        expire_time: `${Number(expire)}${type_expired}`,
      };
    } else {
      const { title, message } = values;
      bodySendNoti = {
        title,
        message,
        url: 'https://abc.com/',
        icon: 'https://media.istockphoto.com/photos/hand-touching-virtual-world-with-connection-network-global-data-and-picture-id1250474241',
        mobile_push: true,
        desktop_push: true,
        email_push: true,
        environment: 'iress-wealth-app',
      };
    }

    httpRequest
      .post(urlSendNoti, bodySendNoti)
      .then(() => {
        dispatch(
          enqueueSnackbarAction({
            message: 'lang_send_notification_successfully',
            key: new Date().getTime() + Math.random(),
            variant: 'success',
          }),
        );
        // handleClearData();
        setStateForm(STATE_FORM.CREATE);
      })
      .catch((err) => {
        dispatch(
          enqueueSnackbarAction({
            message: 'lang_send_notification_unsuccessfully',
            key: new Date().getTime() + Math.random(),
            variant: 'error',
          }),
        );
        console.log(err);
      });
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

  const onReturnPreviousPage = () => setStateForm(STATE_FORM.CREATE);

  const isOptionEqualToValue = React.useCallback((option: LooseObject, value: LooseObject) => {
    return option.username === value.username;
  }, []);

  const renderContent = (form: FormikProps<initialValuesType>) => {
    const { values, handleChange, handleBlur, touched, errors, setFieldValue } = form;
    // FormikProps
    let defaultArray = Array.isArray(values.subscribers) ? values.subscribers.map((x: any) => x?.username) : [];
    switch (stateForm) {
      case STATE_FORM.PREVIEW: {
        const delivery_type_preview = `${values?.delivery_type || ''} ${moment(values?.schedule || '').format(
          'MM/DD/YYYY HH:MM',
        )}`;
        const expired_preview = `${values?.expire || ''} ${EXPIRE_OPTION_FILTER[values?.type_expired]}`;

        return (
          <Grid container spacing={2}>
            <Grid item container xs={12} md={6} spacing={2}>
              <Grid item xs={12}>
                <RadioGroupField
                  name="notification_type"
                  label="Notification type"
                  data={NOTIFICATION_TYPE_OPTION_FILTER[values.notification_type] || []}
                  rowItems={true}
                  value={values?.notification_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                  error={touched?.notification_type && Boolean(errors?.notification_type)}
                  helperText={touched.notification_type && errors.notification_type}
                />
              </Grid>
              <Grid item xs={12}>
                {values.notification_type === NOTIFICATION_TYPE.Segment ? (
                  <React.Fragment>
                    <InputField
                      name="segment"
                      label="Segment"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant={'standard'}
                      value={values.segment}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Autocomplete
                      multiple
                      id="tags-readOnly"
                      options={values.subscribers}
                      defaultValue={defaultArray}
                      readOnly
                      freeSolo
                      // renderOption={(props, option, { selected }) => <li {...props}>{option.title}</li>}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label={
                            <Typography>
                              <Trans>lang_subscribers</Trans>
                            </Typography>
                          }
                        ></TextField>
                      )}
                    />
                  </React.Fragment>
                )}
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="title"
                  label="title"
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant={'standard'}
                  value={values.title}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="message"
                  label="message"
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant={'standard'}
                  value={values.message}
                  multiline={true}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  name="type_url"
                  label="Type URL"
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant={'standard'}
                  value={values.type_url}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
              {values.notification_type === NOTIFICATION_TYPE.Segment ? (
                <React.Fragment>
                  <Grid item xs={12} style={{ height: 81 }}>
                    <InputField
                      // name="message"
                      label="Delivery type"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant={'standard'}
                      value={delivery_type_preview}
                      style={{ visibility: 'hidden' }}
                    />
                  </Grid>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Grid item xs={12} style={{ height: 81 }}>
                    <InputField
                      // name="message"
                      label="Delivery type"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant={'standard'}
                      value={delivery_type_preview}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputField
                      // name="message"
                      label="Expire"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant={'standard'}
                      value={expired_preview}
                    />
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        );
      }
      default: {
        return (
          <Grid container spacing={2}>
            <Grid item container xs={12} md={6} spacing={2}>
              <Grid item xs={12}>
                <RadioGroupField
                  name="notification_type"
                  label="Notification type"
                  data={NOTIFICATION_TYPE_OPTION}
                  required={true}
                  rowItems={true}
                  value={values?.notification_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched?.notification_type && Boolean(errors?.notification_type)}
                  helperText={touched.notification_type && errors.notification_type}
                />
              </Grid>
              {values.notification_type === NOTIFICATION_TYPE.Segment ? (
                <React.Fragment>
                  <Grid item xs={12}>
                    <InputField
                      name="segment"
                      label="Segment"
                      required
                      fullWidth
                      value={values.segment}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.segment && Boolean(errors.segment)}
                      helperText={touched.segment && errors.segment}
                    />
                  </Grid>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Grid item xs={12} style={{ paddingBottom: 3 }}>
                    <AutocompleteAsyncField
                      onBlur={handleBlur}
                      isOptionEqualToValue={isOptionEqualToValue}
                      onChange={(v: string) => setFieldValue('subscribers', v)}
                      error={touched.subscribers && Boolean(errors.subscribers)}
                      helperText={touched.subscribers && errors.subscribers}
                      value={values.subscribers}
                      required={true}
                      label="lang_subscribers"
                      defaultValue={[]}
                      fullWidth={true}
                      id="subscribers"
                    />
                  </Grid>
                </React.Fragment>
              )}

              <Grid item xs={12}>
                <InputField
                  name="title"
                  label="Title"
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
                  name="message"
                  label="Message"
                  required
                  fullWidth
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.message && Boolean(errors.message)}
                  helperText={touched.message && errors.message}
                  multiline={true}
                  rows={5}
                />
              </Grid>
              <Grid item xs={12}>
                <SelectField
                  options={TYPE_URL_OPTIONS}
                  name="type_url"
                  label="Type URL"
                  id="type_url"
                  fullWidth={true}
                  onBlur={handleBlur}
                  value={values.type_url}
                  onChange={handleChange}
                  error={touched.type_url && Boolean(errors.type_url)}
                  helperText={touched.type_url && errors.type_url}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
              {values.notification_type === NOTIFICATION_TYPE.Segment ? (
                <React.Fragment>
                  <Grid item xs={12}>
                    <InputField
                      name="expire"
                      label="Expire"
                      required
                      fullWidth
                      value={values.expire}
                      style={{ visibility: 'hidden' }}
                    />
                  </Grid>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Grid item xs={12}>
                    <Grid item container xs={12}>
                      <Grid item xs={4}>
                        <RadioGroupField
                          name="delivery_type"
                          label="Delivery type"
                          data={DELIVERY_TYPE_OPTION}
                          required={true}
                          rowItems={true}
                          value={values?.delivery_type}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched?.delivery_type && Boolean(errors?.delivery_type)}
                          helperText={touched.delivery_type && errors.delivery_type}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <DatePickerField
                          name="schedule"
                          value={values.schedule}
                          onChange={(v: string) => setFieldValue('schedule', new Date(v))}
                          onBlur={handleBlur}
                          error={touched.schedule && Boolean(errors.schedule)}
                          helperText={touched.schedule && errors.schedule}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid item container xs={12} spacing={2}>
                      <Grid item xs={4}>
                        <Grid item xs={12}>
                          <InputField
                            name="expire"
                            label="Expire"
                            required
                            fullWidth
                            value={values.expire}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.expire && Boolean(errors.expire)}
                            helperText={touched.expire && errors.expire}
                            dir="rtl"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={8} className={classes.radioField}>
                        <RadioGroupField
                          name="type_expired"
                          data={EXPIRE_OPTION}
                          required={true}
                          rowItems={true}
                          value={values?.type_expired}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched?.type_expired && Boolean(errors?.type_expired)}
                          helperText={touched.type_expired && errors.type_expired}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        );
      }
    }
  };

  const submitButton = (form: FormikProps<initialValuesType>) => {
    return (
      <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
        {stateForm === STATE_FORM.PREVIEW ? (
          <Button variant="outlined" onClick={onReturnPreviousPage}>
            <Trans>lang_return</Trans>
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => handleClearData(form)}>
            <Trans>lang_clear</Trans>
          </Button>
        )}

        <Button variant="contained" type="submit">
          <Trans>lang_create</Trans>
        </Button>
      </Stack>
    );
  };

  return (
    <Paper className={classes.wrapper}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitForm}>
        {(form: FormikProps<initialValuesType>) => {
          console.log(form.values);
          return (
            <React.Fragment>
              <Form noValidate className={classes.formContainer}>
                {renderContent(form)}
                {submitButton(form)}
              </Form>
            </React.Fragment>
          );
        }}
      </Formik>
    </Paper>
  );
};

interface initialValuesType {
  notification_type: string;
  subscribers: Array<any>;
  title: string;
  message: string;
  type_url: string;
  delivery_type: string;
  expire: string;
  type_expired: string;
  segment?: string;
  schedule: string;
}

const initialValues: initialValuesType = {
  notification_type: NOTIFICATION_TYPE.Direct,
  subscribers: [],
  title: '',
  message: '',
  type_url: '',
  delivery_type: DELIVERY_TYPE.Instant,
  expire: '0',
  type_expired: EXPIRE.Hours,
  segment: '',
  schedule: '',
};

const validationSchema = yup.object().shape({});

export default CreateNewNotification;
