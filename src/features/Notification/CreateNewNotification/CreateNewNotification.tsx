/*
 * Created on Fri Jan 06 2023
 *
 * Create new notification
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, Stack, Button, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yup } from 'helpers';
import { STATE_FORM, NOTIFICATION_TYPE, DELIVERY_TYPE, EXPIRE, Notification_Type } from './NotificationConstant';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
import moment from 'moment';
import httpRequest from 'services/httpRequest';
import { postDataUpdateSegmentByID, postDirectSend, postSiteNameSend } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { useGlobalModalContext } from 'containers/Modal';
import FormCreateNotifiaction from './Components/FormCreateNotifiaction';
import FormReviewNotification from './Components/FormReviewNotification';

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
  title: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
    width: '100%',
    fontWeight: 700,
  },
}));

export const isOptionEqualToValue = (option: LooseObject, value: LooseObject) => {
  return option.username === value.username;
};

const CreateNewNotification: React.FC<CreateNewNotificationProps> = (props) => {
  const classes = useStyles();
  const [stateForm, setStateForm] = React.useState(STATE_FORM.CREATE);
  const dispatch = useDispatch();
  const { showModal, hideModal } = useGlobalModalContext();

  const submitForm = (values: initialValuesType, formikHelpers: FormikHelpers<{}>) => {
    if (stateForm === STATE_FORM.CREATE) return setStateForm(STATE_FORM.PREVIEW);
    let urlSendNoti = '';
    let bodySendNoti = {};

    //Body and url type Direct

    if (values.notification_type === NOTIFICATION_TYPE.Direct) {
      const { title, message, expire, type_expired, delivery_type } = values;
      urlSendNoti = postDirectSend();
      bodySendNoti = {
        title,
        message,
        url: 'https://abc.com/',
        mobile_push: true,
        subscribers: (values?.subscribers || []).map((x) => {
          const { username, site_name } = x || {};
          return {
            username,
            site_name,
          };
        }),
      };

      if (delivery_type === DELIVERY_TYPE.Schedule) {
        bodySendNoti = { ...bodySendNoti, schedule_time: moment(values?.schedule).toDate().getTime() };
      } else {
        let expireTime = Number(expire);
        if (expireTime) bodySendNoti = { ...bodySendNoti, expire_time: `${expireTime}${type_expired}` };
      }
    }

    //Body and url type Segment

    if (values.notification_type === NOTIFICATION_TYPE.Segment) {
      const { title, message } = values;
      urlSendNoti = postDataUpdateSegmentByID((values?.segment as any)?.segment_id || '');
      bodySendNoti = {
        title,
        message,
        url: 'https://abc.com/',
        icon: 'https://media.istockphoto.com/photos/hand-touching-virtual-world-with-connection-network-global-data-and-picture-id1250474241',
        mobile_push: true,
      };
    }

    //Body and url type sitename

    if (values.notification_type === NOTIFICATION_TYPE.Sitename) {
      const { title, message, sitename } = values;
      urlSendNoti = postSiteNameSend();
      bodySendNoti = {
        title,
        message,
        url: 'https://abc.com/',
        // icon: 'https://media.istockphoto.com/photos/hand-touching-virtual-world-with-connection-network-global-data-and-picture-id1250474241',
        mobile_push: true,
        site_name: sitename,
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
        formikHelpers.resetForm();
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

  const renderContent = (form: FormikProps<initialValuesType>) => {
    switch (stateForm) {
      case STATE_FORM.PREVIEW: {
        return <FormReviewNotification classes={classes} form={form} />;
      }
      default: {
        return <FormCreateNotifiaction classes={classes} form={form} />;
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

  const HeaderTitle = () => {
    if (stateForm !== STATE_FORM.PREVIEW) return null;

    return (
      <Typography className={classes.title}>
        <Trans>lang_preview_new_notifications</Trans>
      </Typography>
    );
  };
  return (
    <Paper className={classes.wrapper}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitForm}>
        {(form: FormikProps<initialValuesType>) => {
          console.log(form.values);
          return (
            <React.Fragment>
              {HeaderTitle()}
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

export interface initialValuesType {
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
  sitename?: Array<any>;
  expire_time?: string;
  schedule_time?: number;
  segment_id?: string;
  segment_name?: string;
}

const initialValues: initialValuesType = {
  notification_type: NOTIFICATION_TYPE.Direct,
  subscribers: [],
  title: '',
  message: '',
  type_url: 'Article',
  delivery_type: DELIVERY_TYPE.Instant,
  expire: '',
  type_expired: EXPIRE.Hours,
  segment: '',
  schedule: '',
  sitename: [],
};

const validationSchema = yup.object().shape({
  subscribers: yup.array().when(['notification_type'], (value, schema) => {
    return value === NOTIFICATION_TYPE.Direct
      ? schema.min(1, 'lang_select_segment_subcriber').required('lang_select_segment_subcriber')
      : schema;
  }),
  title: yup.string().required('lang_title_required').max(64, 'lang_validate_title'),
  message: yup.string().required('lang_message_required').max(192, 'lang_validate_message'),
  schedule: yup.string().when(['delivery_type', 'notification_type'], {
    is: (delivery_type: 'Instant' | 'Schedule', notification_type: Notification_Type) => {
      return delivery_type === DELIVERY_TYPE.Schedule && notification_type === NOTIFICATION_TYPE.Direct;
    },
    then: yup
      .string()
      .required('lang_schedule_time_required')
      .test('checkValidField', '', function (value) {
        const { path, createError } = this;
        const date = moment(value);
        if (date.isValid()) {
          return true;
        } else {
          return createError({ path, message: 'lang_schedule_time_required' });
        }
      }),
  }),
  segment: yup.mixed().when('notification_type', (value, schema) => {
    return value === NOTIFICATION_TYPE.Segment ? schema.required('lang_field_required') : schema;
  }),
  sitename: yup.array().when('notification_type', (value, schema) => {
    return value === NOTIFICATION_TYPE.Sitename ? schema.min(1, 'lang_field_required').required('lang_field_required') : schema;
  }),
  type_url: yup.string().required('lang_url_require'),
});

export default CreateNewNotification;
