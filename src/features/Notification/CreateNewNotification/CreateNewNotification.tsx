/*
 * Created on Fri Jan 06 2023
 *
 * Create new notification
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, Stack, Typography } from '@mui/material';
import Button from 'components/atoms/ButtonBase';
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
import useConfirmEdit from 'hooks/useConfirmEdit';
import { diff } from 'deep-diff';

interface CreateNewNotificationProps {}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: theme.spacing(3),
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
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const { showModal, hideModal } = useGlobalModalContext();
  const valuesClone = React.useRef(initialValues);
  const confirmEdit = useConfirmEdit(() => !!diff(initialValues, valuesClone.current)); // eslint-disable-line

  const submitForm = (values: initialValuesType, formikHelpers: FormikHelpers<{}>) => {
    if (stateForm === STATE_FORM.CREATE) return setStateForm(STATE_FORM.PREVIEW);
    setLoading(true);
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

      let expireTime = Number(expire);
      if (expireTime) bodySendNoti = { ...bodySendNoti, expire_time: `${expireTime}${type_expired}` };

      if (delivery_type === DELIVERY_TYPE.Schedule) {
        bodySendNoti = { ...bodySendNoti, schedule_time: moment(values?.schedule).toDate().getTime() };
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
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          enqueueSnackbarAction({
            message: err?.errorCodeLang || 'lang_send_notification_unsuccessfully',
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
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
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
          <Button variant="outlined" onClick={onReturnPreviousPage} scrollToTop>
            <Trans>lang_return</Trans>
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => handleClearData(form)}>
            <Trans>lang_clear</Trans>
          </Button>
        )}

        <Button network variant="contained" type="submit" isLoading={loading}>
          <Trans>{stateForm === STATE_FORM.PREVIEW ? 'lang_confirm' : 'lang_create'}</Trans>
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
          valuesClone.current = { ...form.values };
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
  expire: '4',
  type_expired: EXPIRE.Weeks,
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
  title: yup.string().trim().required('lang_please_enter_title').max(64, 'lang_validate_title'),
  message: yup.string().trim().required('lang_please_enter_message').max(192, 'lang_validate_message'),
  expire: yup.string().trim().required('lang_enter_expire'),
  schedule: yup.string().when(['delivery_type', 'notification_type'], {
    is: (delivery_type: 'Instant' | 'Schedule', notification_type: Notification_Type) => {
      return delivery_type === DELIVERY_TYPE.Schedule && notification_type === NOTIFICATION_TYPE.Direct;
    },
    then: yup
      .string()
      .required('lang_please_select_schedule_time')
      .checkValidField('lang_please_select_schedule_time')
      .compareTimesLocal()
      .compareTimes('error_code_INVALID_TIME'),
  }),
  segment: yup.mixed().when('notification_type', (value, schema) => {
    return value === NOTIFICATION_TYPE.Segment ? schema.required('lang_please_select_segment') : schema;
  }),
  sitename: yup.array().when('notification_type', (value, schema) => {
    return value === NOTIFICATION_TYPE.Sitename
      ? schema.min(1, 'lang_please_select_sitename').required('lang_please_select_sitename')
      : schema;
  }),
  type_url: yup.string().required('lang_url_require'),
});

export default CreateNewNotification;
