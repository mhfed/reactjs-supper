/*
 * Created on Mon May 08 2023
 *
 * Setup notification for publist with article
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import { Box, Grid, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { enqueueSnackbarAction } from 'actions/app.action';
import Button from 'components/atoms/ButtonBase';
import HeaderModal from 'components/atoms/HeaderModal';
import { DatePickerField, InputField, RadioGroupField } from 'components/fields';
import { useGlobalModalContext } from 'containers/Modal';
import { DELIVERY_TYPE } from 'features/Notification/CreateNewNotification/NotificationConstant';
import { DELIVERY_TYPE_OPTION } from 'features/Notification/CreateNewNotification/NotificationConstant';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import { IBundle, LooseObject } from 'models/ICommon';
import moment from 'moment';
import React from 'react';
import { Trans } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { httpRequest } from 'services/initRequest';
import { postAppNameSend, getSearchAppNameUrl } from 'apis/request.url';

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
    overflow: 'auto',
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
  data: LooseObject;
  callback: () => void;
  beforeSubmit?: (
    isPublish?: boolean,
    successCb?: (articleId?: string, bundleId?: string[]) => void,
    errorCb?: () => void,
  ) => void;
};

const NotificationSetup: React.FC<NotificationSetupProps> = ({ data, beforeSubmit, callback }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const { hideModal } = useGlobalModalContext();

  const initialValues = {
    title: data?.title ? data.title.slice(0, 64) : '',
    message: data?.message ? data.message.slice(0, 191) : '',
    delivery_type: DELIVERY_TYPE.Instant,
    schedule: '',
  };

  /**
   * Handle publish notification after create article success or resend noti
   */
  const handleFormSubmit = async () => {
    setLoading(true);
    const onPublishNotification = async (articleId: string, bundleId: string[]) => {
      try {
        const body: any = {
          mobile_push: true,
          bundle_id: bundleId,
          title: values.title,
          message: values.message,
          site_name: localStorage.getItem('sitename'),
          url: `${window.location.origin}?type=insights&article_id=${articleId}`,
          notification_category: 'insights',
        };
        if (values.delivery_type === DELIVERY_TYPE.Schedule) {
          body.schedule_time = +moment(values.schedule);
        }
        await httpRequest.post(postAppNameSend(), body);

        dispatch(
          enqueueSnackbarAction({
            message: 'lang_send_notification_successfully',
            key: new Date().getTime() + Math.random(),
            variant: 'success',
          }),
        );
        setLoading(false);
        callback?.();
        hideModal();
      } catch (error) {
        setLoading(false);
        callback?.();
        hideModal();
        dispatch(
          enqueueSnackbarAction({
            message: error?.errorCodeLang || 'lang_send_notification_unsuccessfully',
            key: new Date().getTime() + Math.random(),
            variant: 'error',
          }),
        );
      }
    };
    if (beforeSubmit) {
      beforeSubmit(true, onPublishNotification);
    } else {
      const { data: allAppAccess } = await httpRequest.get(getSearchAppNameUrl());
      onPublishNotification(
        data.article_id,
        data.app?.map((e: IBundle) => e.bundle_id),
      );
    }
  };

  /**
   * register formik form
   */
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    setFieldValue,
    setTouched,
    setFieldTouched,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  // get delivery type display
  const delivery_type_preview =
    values?.delivery_type === DELIVERY_TYPE.Schedule
      ? `Scheduled ${moment(values?.schedule || '')
          .local()
          .format('DD/MM/YYYY HH:mm')}`
      : 'Instant';

  /**
   * onCreate noti, validate form before switch to preview form
   */
  const onCreate = () => {
    validateForm().then((errors) => {
      if (errors && Object.keys(errors).length) {
        setTouched(errors as any);
      } else {
        setEditMode(false);
      }
    });
  };

  /**
   *
   * @returns Notification setup form
   */
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
            <Grid item xs={12}>
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

              {values?.delivery_type === DELIVERY_TYPE.Instant ? (
                <></>
              ) : (
                <Grid item xs={6} lg={4} style={{ paddingBottom: 16 }}>
                  <DatePickerField
                    name="schedule"
                    required
                    value={values.schedule}
                    label={'lang_schedule_time'}
                    inputFormat={'DD/MM/YYYY HH:mm'}
                    onChange={(v) => {
                      setFieldTouched('schedule', true);
                      setFieldValue('schedule', v ? new Date(v) : v);
                    }}
                    disablePast
                    fullWidth
                    onBlur={handleBlur}
                    error={touched.schedule && Boolean(errors.schedule)}
                    helperText={touched.schedule && errors.schedule}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => {
              callback?.();
              hideModal();
            }}
            scrollToTop
          >
            <Trans>lang_cancel</Trans>
          </Button>
          <Button variant="contained" onClick={onCreate}>
            <Trans>lang_create</Trans>
          </Button>
        </Stack>
      </>
    );
  };

  /**
   *
   * @returns Notification setup preview form
   */
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
          <Button variant="contained" type="submit" network isLoading={loading}>
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

/**
 * Formik validate schema
 */
const validationSchema = yup.object().shape({
  title: yup.string().trim().required('lang_please_enter_title').max(64, 'lang_validate_title'),
  message: yup.string().trim().required('lang_please_enter_message').max(192, 'lang_validate_message'),
  schedule: yup.string().when(['delivery_type'], {
    is: (delivery_type: 'Instant' | 'Schedule') => {
      return delivery_type === DELIVERY_TYPE.Schedule;
    },
    then: yup
      .string()
      .required('lang_please_select_schedule_time')
      .checkValidField('lang_schedule_time_invalid')
      .compareTimesLocal('lang_schedule_time_invalid'),
  }),
});

export default NotificationSetup;
