/*
 * Created on Fri Jan 06 2023
 *
 * Edit new notification
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, Stack, Typography, Box } from '@mui/material';
import Button from 'components/atoms/ButtonBase';
import { Form, Formik, FormikProps } from 'formik';
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
import { httpRequest } from 'services/initRequest';
import { getNotificationUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { useGlobalModalContext } from 'containers/Modal';
import FormCreateNotifiaction from './FormEditNotifiaction';
import CloseIcon from '@mui/icons-material/Close';
import { diff } from 'deep-diff';
import DetailNotification from '../DetailNotification';
import { Inotifiaction, ISubscriber } from 'models/INotification';

interface EditNotificationProps {
  dataForm: Inotifiaction;
  typePage: 'DETAIL' | 'EDIT';
  listSubscribers?: ISubscriber;
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
    // marginBottom: theme.spacing(1),
    width: '100%',
    fontWeight: 700,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(1),
  },
  iconClose: {
    cursor: 'pointer',
  },
}));

/**
 * Compare function to check selected subscriber at multiple select
 * @param option option data
 * @param value selected data
 * @returns true if selected
 */
export const isOptionEqualToValue = (option: LooseObject, value: LooseObject) => {
  return option.username === value.username;
};

const EditNotification: React.FC<EditNotificationProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { showModal, hideModal, showSubModal, hideSubModal } = useGlobalModalContext();
  const formRef = React.useRef<any>();
  let initialValues: any = initialValuesDefault;

  if (props.dataForm) {
    initialValues = props.dataForm || {};
    initialValues.type_url = 'Article';
    const valueExpire = (initialValues?.expire_time || '').replace(/[A-z]/g, '');
    const typeExpire = (initialValues?.expire_time || '').replace(/[0-9]/g, '');
    initialValues.expire = valueExpire;
    initialValues.type_expired = typeExpire;
    initialValues.schedule = initialValues.schedule_time as any;
  }

  /**
   * Check diff and show popup confirm close modal
   */
  const handleClose = () => {
    const { values } = formRef?.current;
    if (diff(values, initialValues))
      return showSubModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
          emailConfirm: false,
          onSubmit: () => hideModal(),
        },
      });
    hideModal();
  };

  /**
   * Handle submit form
   * @param values form data
   */
  const submitForm = (values: initialValuesType) => {
    let urlSendNoti = '';
    let bodySendNoti = {};
    if (!diff(values, initialValues)) {
      dispatch(
        enqueueSnackbarAction({
          message: 'Lang_there_is_no_change_in_the_notification',
          key: new Date().getTime() + Math.random(),
          variant: 'warning',
        }),
      );
    }

    //Body and url type Direct
    else {
      if (values.notification_type === NOTIFICATION_TYPE.App) {
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
        let expireTime = Number(expire);
        if (expireTime) bodySendNoti = { ...bodySendNoti, expire_time: `${expireTime}${type_expired}` };

        if (delivery_type === DELIVERY_TYPE.Schedule) {
          bodySendNoti = { ...bodySendNoti, schedule_time: moment(values?.schedule).toDate().getTime() };
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
                    message: 'lang_update_notification_successfully',
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
              .catch(async (err) => {
                hideSubModal();
                if (err?.errorCode === 'INVALID_NOTIFICATION_STATUS') {
                  dispatch(
                    enqueueSnackbarAction({
                      message: 'lang_noti_has_been_sent',
                      key: new Date().getTime() + Math.random(),
                      variant: 'error',
                    }),
                  );
                  const response: any = await httpRequest.get(getNotificationUrl(props.dataForm.notification_id));
                  onBack(response);
                } else {
                  dispatch(
                    enqueueSnackbarAction({
                      message: err?.errorCodeLang || 'lang_update_notification_unsuccessfully',
                      key: new Date().getTime() + Math.random(),
                      variant: 'error',
                    }),
                  );
                }
              });
          },
        },
      });
    }
  };

  /**
   * Back to detail preview mode
   * @param dataForm form data
   */
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

  /**
   * Close modal at edit page or back to detail view only when user cancel
   * @param form formik form
   */
  const onCancel = (form: FormikProps<initialValuesType>) => {
    const { values } = form;
    if (diff(values, initialValues))
      return showSubModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
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

  /**
   * render footer buttons
   * @param form formik form
   * @returns HTML
   */
  const submitButton = (form: FormikProps<initialValuesType>) => {
    return (
      <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
        <Button variant="outlined" onClick={() => onCancel(form)} scrollToTop>
          <Trans>{props.typePage === 'EDIT' ? 'lang_cancel' : 'lang_back'}</Trans>
        </Button>
        <Button network variant="contained" type="submit">
          <Trans>lang_save</Trans>
        </Button>
      </Stack>
    );
  };

  return (
    <React.Fragment>
      <Box className={classes.header}>
        <Typography className={classes.title} variant="h6">
          <Trans>{'lang_edit_notification'}</Trans>
        </Typography>
        <CloseIcon className={classes.iconClose} onClick={handleClose} />
      </Box>
      <Paper className={classes.wrapper}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitForm}>
          {(form: FormikProps<initialValuesType>) => {
            formRef.current = form;
            // console.log(form.values);
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
  notification_type: NOTIFICATION_TYPE.App,
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
    return value === NOTIFICATION_TYPE.App
      ? schema.min(1, 'lang_select_segment_subcriber').required('lang_select_segment_subcriber')
      : schema;
  }),
  title: yup.string().required('lang_please_enter_title').max(64, 'lang_validate_title'),
  message: yup.string().required('lang_please_enter_message').max(192, 'lang_validate_message'),
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
    // .checkValidField('lang_schedule_time_required'),
  }),
  segment: yup.mixed().when('notification_type', (value, schema) => {
    return value === NOTIFICATION_TYPE.UserGroup ? schema.required('lang_please_select_segment') : schema;
  }),
  sitename: yup.array().when('notification_type', (value, schema) => {
    return value === NOTIFICATION_TYPE.ClientCategory
      ? schema.min(1, 'lang_please_select_sitename').required('lang_please_select_sitename')
      : schema;
  }),
  type_url: yup.string().required('lang_url_require'),
});

export default EditNotification;
