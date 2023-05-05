/*
 * Created on Fri Jan 06 2023
 *
 * User detail and edit user
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { Box, Grid, Paper, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { enqueueSnackbarAction } from 'actions/app.action';
import Button from 'components/atoms/ButtonBase';
import HeaderModal from 'components/atoms/HeaderModal';
import { DatePickerField, InputField, RadioGroupField } from 'components/fields';
import { useGlobalModalContext } from 'containers/Modal';
import { NOTIFICATION_TYPE } from 'features/Notification/CreateNewNotification/NotificationConstant';
import { Notification_Type } from 'features/Notification/CreateNewNotification/NotificationConstant';
import { DELIVERY_TYPE } from 'features/Notification/CreateNewNotification/NotificationConstant';
import { DELIVERY_TYPE_OPTION } from 'features/Notification/CreateNewNotification/NotificationConstant';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import moment from 'moment';
import React from 'react';
import { Trans } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { httpRequest } from 'services/initRequest';

const useStyles = makeStyles((theme) => ({
  content: {
    margin: theme.spacing(3, 0),
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
  },
  form: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    '& .MuiGrid-item': {
      paddingTop: theme.spacing(3),
    },
  },
  iconClose: {
    cursor: 'pointer',
  },
}));

type NotificationSetupProps = {
  callback: () => void;
};

const NotificationSetup: React.FC<NotificationSetupProps> = ({ dataForm, callback }: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = React.useState(true);
  const { showSubModal, hideModal, hideSubModal } = useGlobalModalContext();

  const initialValues = {
    title: '',
    message: '',
    delivery_type: DELIVERY_TYPE.Instant,
    schedule: '',
  };

  /**
   * Handle submit update user
   */
  const handleFormSubmit = async () => {
    try {
      const body = {
        data: {
          title: values.title,
          message: values.message,
          schedule: values.schedule,
        },
      };
      // await httpRequest.put(getNotificationSetupUrl(), body);

      dispatch(
        enqueueSnackbarAction({
          message: 'lang_send_notification_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      hideModal();
      callback?.();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error?.errorCodeLang || 'lang_send_notification_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
      hideModal();
      console.error('Update user handleFormSubmit error: ', error);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues: { ...initialValues },
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  const delivery_type_preview = `${values?.delivery_type || ''} ${
    values?.delivery_type === DELIVERY_TYPE.Schedule
      ? moment(values?.schedule || '')
          .local()
          .format('DD/MM/YYYY HH:mm')
      : ''
  }`;

  const renderEditScreen = () => {
    //==============Edit Screen=============//
    return (
      <>
        <Box className={classes.content}>
          <Grid container spacing={4} rowSpacing={1}>
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
                name="message"
                label="lang_message"
                required
                fullWidth
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                multiline
                rows={5}
              />
            </Grid>
            <Grid item xs={12} style={{ minHeight: '200px' }}>
              <RadioGroupField
                name="delivery_type"
                label="lang_delivery_type"
                data={DELIVERY_TYPE_OPTION}
                required
                rowItems
                value={values?.delivery_type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched?.delivery_type && Boolean(errors?.delivery_type)}
                helperText={touched.delivery_type && errors.delivery_type}
              />

              <Grid item container xs={12} spacing={2}>
                <Grid item xs={4} xl={6} style={{ paddingBottom: 16 }}>
                  {values?.delivery_type === DELIVERY_TYPE.Instant ? (
                    <></>
                  ) : (
                    <DatePickerField
                      name="schedule"
                      required
                      value={values.schedule}
                      label={'lang_schedule_time'}
                      inputFormat={'DD/MM/YYYY HH:mm'}
                      onChange={(v) => setFieldValue('schedule', v ? new Date(v) : v)}
                      fullWidth
                      onBlur={handleBlur}
                      minDate={new Date()}
                      error={touched.schedule && Boolean(errors.schedule)}
                      helperText={touched.schedule && errors.schedule}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
          <Button variant="outlined" onClick={() => hideModal()} scrollToTop>
            <Trans>lang_cancel</Trans>
          </Button>
          <Button variant="contained" onClick={() => setEditMode(false)}>
            <Trans>lang_create</Trans>
          </Button>
        </Stack>
      </>
    );
  };
  const renderPreviewScreen = () => {
    //==============Preview Screen=============//
    return (
      <>
        <Box className={classes.content}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <InputField id="title" preview label="lang_title" fullWidth value={values.title} />
            </Grid>
            <Grid item xs={12}>
              <InputField id="message" preview label="lang_message" fullWidth value={values.message} />
            </Grid>
            <Grid item xs={12}>
              <InputField id="delivery_type" preview label="lang_delivery_type" fullWidth value={delivery_type_preview} />
            </Grid>
          </Grid>
        </Box>
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
          <Button variant="outlined" onClick={() => setEditMode(true)} scrollToTop>
            <Trans>lang_return</Trans>
          </Button>
          <Button variant="contained" type="submit">
            <Trans>lang_confirm</Trans>
          </Button>
        </Stack>
      </>
    );
  };

  return (
    <>
      <HeaderModal title={editMode ? 'lang_notification_setup' : 'lang_preview_notification_setup'} onClose={hideModal} />
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        {editMode ? renderEditScreen() : renderPreviewScreen()}
      </form>
    </>
  );
};

const validationSchema = yup.object().shape({
  title: yup.string().trim().required('lang_please_enter_title').max(64, 'lang_validate_title'),
  message: yup.string().trim().required('lang_please_enter_message').max(192, 'lang_validate_message'),
  schedule: yup.string().when(['delivery_type', 'notification_type'], {
    is: (delivery_type: 'Instant' | 'Schedule', notification_type: Notification_Type) => {
      return delivery_type === DELIVERY_TYPE.Schedule && notification_type === NOTIFICATION_TYPE.App;
    },
    then: yup
      .string()
      .required('lang_please_select_schedule_time')
      .checkValidField('lang_schedule_time_invalid')
      .compareTimesLocal()
      .compareTimes('error_code_INVALID_TIME'),
  }),
});

export default NotificationSetup;
