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
  NOTIFICATION_CATEGORY_TYPE,
} from 'features/Notification/CreateNewNotification/NotificationConstant';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
import moment from 'moment';
import { httpRequest } from 'services/initRequest';
import { getNotificationUrl, putNotificationUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { useGlobalModalContext } from 'containers/Modal';
import FormEditNotifiaction from './FormEditNotifiaction';
import FormReviewNotifiaction from './FormReviewNotifiaction';
import CloseIcon from '@mui/icons-material/Close';
import { diff } from 'deep-diff';
import DetailNotification from '../DetailNotification';
import { Inotifiaction, ISubscriber } from 'models/INotification';
import { initialValuesType } from 'features/Notification/CreateNewNotification/CreateNewNotification';
import { STEP_EDIT_NOTI } from 'features/Notification/NotificationConstants';

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
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: theme.spacing(3),
    justifyContent: 'space-between',
    overflowY: 'auto',
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
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    gap: theme.spacing(2),
    '& > buttom': {
      margin: 0,
    },
  },
  alertProcess: {
    color: theme.palette.success.main,
    paddingTop: theme.spacing(3),
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
  const [step, setStep] = React.useState(STEP_EDIT_NOTI.EDIT_NOTI);

  let initialValues: any = initialValuesDefault;

  if (props.dataForm) {
    initialValues = props.dataForm || {};

    initialValues.schedule = initialValues.schedule_time as any;
    if (!initialValues.client_category_id) {
      initialValues = { ...initialValues, client_category_id: '' };
    } else {
      initialValues = { ...initialValues, client_category_id: initialValues?.client_category?.[0] || {} };
    }

    initialValues = { ...initialValues, user_group_id: initialValues.user_group, bundle_id: initialValues.app };
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
    if (step === STEP_EDIT_NOTI.EDIT_NOTI) return setStep(STEP_EDIT_NOTI.REVIEW_NOTI);

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
      const { title, message, delivery_type, site_name, notification_category, url } = values;
      urlSendNoti = putNotificationUrl(props.dataForm.notification_id);
      bodySendNoti = {
        title,
        message,
        url,
        mobile_push: true,
        site_name,
        bundle_id: (values?.bundle_id || []).map((x) => x?.bundle_id || x),
        notification_category: NOTIFICATION_CATEGORY_TYPE?.[notification_category] || notification_category || '',
      };

      if (delivery_type === DELIVERY_TYPE.Schedule) {
        bodySendNoti = { ...bodySendNoti, schedule_time: moment(values?.schedule).toDate().getTime() };
      }

      //Body and url type User Group

      if (values.notification_type === NOTIFICATION_TYPE.UserGroup) {
        bodySendNoti = {
          ...bodySendNoti,
          user_group: (values?.user_group_id || []).map((x) => x?.id || ''),
        };
      }

      if (values.notification_type === NOTIFICATION_TYPE.ClientCategory) {
        bodySendNoti = {
          ...bodySendNoti,
          client_category: (values.client_category_id as any)?.id || values?.client_category_id,
        };
      }

      httpRequest
        .put(urlSendNoti, bodySendNoti)
        .then(() => {
          dispatch(
            enqueueSnackbarAction({
              message: 'lang_update_notification_successfully',
              key: new Date().getTime() + Math.random(),
              variant: 'success',
            }),
          );
          setTimeout(async () => {
            props.reCallChangeTable && props.reCallChangeTable();
            if (props.typePage === 'EDIT') {
              hideSubModal();
              hideModal();
            } else {
              const response = await httpRequest.get(getNotificationUrl(props.dataForm.notification_id));
              let converData = { ...response.data };
              converData.bundle_id && (converData.bundle_id = JSON.parse(converData.bundle_id));

              onBack(converData);
            }
          }, 500);
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
            const response = await httpRequest.get(getNotificationUrl(props.dataForm.notification_id));
            let converData = { ...response.data };
            converData.bundle_id && (converData.bundle_id = JSON.parse(converData.bundle_id));

            onBack(converData);
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
    switch (step) {
      case STEP_EDIT_NOTI.EDIT_NOTI: {
        return <FormEditNotifiaction classes={classes} form={form} />;
      }
      case STEP_EDIT_NOTI.REVIEW_NOTI: {
        return <FormReviewNotifiaction classes={classes} form={form} />;
      }
      default:
        return <>not found</>;
    }
  };

  /**
   * render footer buttons
   * @param form formik form
   * @returns HTML
   */
  const submitButton = (form: FormikProps<initialValuesType>) => {
    if (step === STEP_EDIT_NOTI.REVIEW_NOTI) {
      return (
        <div>
          <Typography className={classes.alertProcess}>
            <Trans>lang_do_you_want_to_process</Trans>
          </Typography>
          <Stack className={classes.footer}>
            <Button variant="outlined" onClick={() => setStep(STEP_EDIT_NOTI.EDIT_NOTI)} scrollToTop>
              <Trans>lang_no</Trans>
            </Button>
            <Button network variant="contained" type="submit">
              <Trans>lang_yes</Trans>
            </Button>
          </Stack>
        </div>
      );
    }

    return (
      <Stack className={classes.footer}>
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
          <Trans>{step === STEP_EDIT_NOTI.REVIEW_NOTI ? 'lang_review_edit_notification' : 'lang_edit_notification'}</Trans>
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

const initialValuesDefault: initialValuesType = {
  notification_type: NOTIFICATION_TYPE.App,
  bundle_id: [],
  title: '',
  message: '',
  type_url: 'Article',
  delivery_type: DELIVERY_TYPE.Instant,
  expire: '4',
  type_expired: EXPIRE.Weeks,
  user_group_id: [],
  schedule: '',
  site_name: '',
  notification_category: '',
  url: '',
  client_category_id: '',
};

const validationSchema = yup.object().shape({
  bundle_id: yup.array().min(1, 'lang_app_name_require').required('lang_app_name_require'),
  user_group_id: yup.array().when(['notification_type'], (value, schema) => {
    return value === NOTIFICATION_TYPE.UserGroup
      ? schema.min(1, 'lang_user_group_require').required('lang_user_group_require')
      : schema;
  }),
  client_category_id: yup.mixed().when(['notification_type'], (value, schema) => {
    return value === NOTIFICATION_TYPE.ClientCategory ? schema.required('lang_client_category_id_require') : schema;
  }),
  title: yup.string().trim().required('lang_please_enter_title').max(64, 'lang_validate_title'),
  message: yup.string().trim().required('lang_please_enter_message').max(192, 'lang_validate_message'),
  schedule: yup.string().when(['delivery_type', 'notification_type'], {
    is: (delivery_type: 'Instant' | 'Schedule', notification_type: Notification_Type) => {
      return delivery_type === DELIVERY_TYPE.Schedule;
    },
    then: yup
      .string()
      .required('lang_please_select_schedule_time')
      .checkValidField('lang_schedule_time_invalid')
      .compareTimesLocal('lang_schedule_time_invalid'),
    // .compareTimes('error_code_INVALID_TIME'),
  }),
  // notification_category: yup.string().required('lang_notification_category_require'),
  url: yup.string().required('lang_linked_screen_require'),
});

export default EditNotification;
