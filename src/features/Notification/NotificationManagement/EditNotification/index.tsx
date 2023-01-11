/*
 * Created on Fri Jan 06 2023
 *
 * Edit new notification
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, Stack, Button, Typography, Box } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { yup } from 'helpers';
import {
  NOTIFICATION_TYPE,
  DELIVERY_TYPE,
  EXPIRE,
  Notification_Type,
} from 'features/Notification/CreateNewNotification/NotificationConstant';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
import moment from 'moment';
import httpRequest from 'services/httpRequest';
import { getNotificationUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { useGlobalModalContext } from 'containers/Modal';
import FormCreateNotifiaction from './FormEditNotifiaction';
import CloseIcon from '@mui/icons-material/Close';
import { diff } from 'deep-diff';
import DetailNotification from '../DetailNotification';

interface CreateNewNotificationProps {
  dataForm: any;
  typePage: 'DETAIL' | 'EDIT';
  listSubscribers?: any;
  defaultValue: any;
  reCallChangeTable?: () => {};
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(1),
    background: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.other4,
  },
  iconClose: {
    cursor: 'pointer',
  },
}));

export const isOptionEqualToValue = (option: LooseObject, value: LooseObject) => {
  return option.username === value.username;
};

const CreateNewNotification: React.FC<CreateNewNotificationProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { showModal, hideModal, showSubModal, hideSubModal } = useGlobalModalContext();
  let initialValues: initialValuesType = initialValuesDefault;

  if (props.dataForm) {
    initialValues = props.dataForm || {};
    initialValues.type_url = 'Article';
    const valueExpire = (initialValues?.expire_time || '').replace(/[A-z]/, '');
    const typeExpire = (initialValues?.expire_time || '').replace(/[0-9]/, '');
    initialValues.expire = valueExpire;
    initialValues.type_expired = typeExpire;
    initialValues.schedule = initialValues.schedule_time as any;
  }

  const handleClose = () => {
    hideModal();
  };
  const renderHeader = () => {
    return (
      <Box className={classes.header}>
        <Typography>
          <Trans>{'lang_edit_notification'}</Trans>
        </Typography>
        <CloseIcon className={classes.iconClose} onClick={handleClose} />
      </Box>
    );
  };

  const submitForm = (values: initialValuesType, formikHelpers: FormikHelpers<{}>) => {
    let urlSendNoti = '';
    let bodySendNoti = {};

    //Body and url type Direct

    if (values.notification_type === NOTIFICATION_TYPE.Direct) {
      const { title, message, expire, type_expired, delivery_type } = values;
      urlSendNoti = getNotificationUrl(props.dataForm.notification_id);
      bodySendNoti = {
        title,
        message,
        url: 'https://abc.com/',
        mobile_push: true,
        desktop_push: true,
        email_push: true,
        sms_push: true,
        subscribers: (values?.subscribers || []).map((x) => {
          const { subscriber, site_name, username } = x || {};
          return {
            username: subscriber || username,
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

    showSubModal({
      title: 'lang_confirm',
      component: ConfirmEditModal,
      props: {
        title: 'lang_describe_confirm_edit',
        titleTransValues: { segment: values.segment_id },
        onSubmit: () => {
          httpRequest
            .put(urlSendNoti, bodySendNoti)
            .then(async () => {
              dispatch(
                enqueueSnackbarAction({
                  message: 'lang_send_notification_successfully',
                  key: new Date().getTime() + Math.random(),
                  variant: 'success',
                }),
              );
              props.reCallChangeTable && props.reCallChangeTable();
              if (props.typePage === 'EDIT') {
                hideSubModal();
                hideModal();
              } else {
                const response: any = await httpRequest.get(getNotificationUrl(props.dataForm.notification_id));
                onBack(response);
              }
            })
            .catch((err) => {
              dispatch(
                enqueueSnackbarAction({
                  message: 'lang_send_notification_unsuccessfully',
                  key: new Date().getTime() + Math.random(),
                  variant: 'error',
                }),
              );
              hideSubModal();
              console.log(err);
            });
        },
      },
    });
  };

  const onBack = (dataForm?: any) => {
    showModal({
      component: DetailNotification,
      fullScreen: true,
      showBtnClose: true,
      props: {
        typePage: 'DETAIL',
        dataForm: dataForm || props.defaultValue,
      },
    });
  };

  const onCancel = (form: FormikProps<initialValuesType>) => {
    const { values } = form;
    if (diff(values, initialValues))
      return showSubModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          isCancelPage: true,
          emailConfirm: false,
          onSubmit: () => {
            if (props.typePage === 'EDIT') {
              hideSubModal();
              return hideModal();
            }
            onBack();
          },
        },
      });
    if (props.typePage === 'EDIT') return hideModal();
    onBack();
  };

  const renderContent = (form: FormikProps<initialValuesType>) => {
    return <FormCreateNotifiaction classes={classes} form={form} />;
  };

  const submitButton = (form: FormikProps<initialValuesType>) => {
    return (
      <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
        <Button variant="outlined" onClick={() => onCancel(form)}>
          <Trans>{props.typePage === 'EDIT' ? 'lang_cancel' : 'lang_back'}</Trans>
        </Button>

        <Button variant="contained" type="submit">
          <Trans>lang_save</Trans>
        </Button>
      </Stack>
    );
  };

  return (
    <React.Fragment>
      {renderHeader()}
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
    </React.Fragment>
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
}

const initialValuesDefault: initialValuesType = {
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
    then: yup.string().required('lang_schedule_time_required').checkValidField('lang_schedule_time_required'),
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
