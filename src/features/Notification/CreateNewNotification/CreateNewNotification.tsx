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
import {
  STATE_FORM,
  NOTIFICATION_TYPE,
  DELIVERY_TYPE,
  EXPIRE,
  Notification_Type,
  NOTIFICATION_CATEGORY_TYPE,
} from './NotificationConstant';
import { LooseObject } from 'models/ICommon';
import { Trans } from 'react-i18next';
import moment from 'moment';
import { httpRequest } from 'services/initRequest';
import { postAppNameSend, postClientCategorySend, postUserGroupSend } from 'apis/request.url';
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

    const { title, message, site_name, url, notification_category } = values;

    bodySendNoti = {
      title,
      message,
      url,
      mobile_push: true,
      site_name,
      bundle_id: (values?.bundle_id || []).map((x) => x?.bundle_id || ''),
      notification_category: NOTIFICATION_CATEGORY_TYPE?.[notification_category] || '',
    };

    if (values.delivery_type === DELIVERY_TYPE.Schedule) {
      bodySendNoti = { ...bodySendNoti, schedule_time: moment(values?.schedule).toDate().getTime() };
    }

    //Body and url type App

    if (values.notification_type === NOTIFICATION_TYPE.App) {
      urlSendNoti = postAppNameSend();
    }

    //Body and url type User Group

    if (values.notification_type === NOTIFICATION_TYPE.UserGroup) {
      urlSendNoti = postUserGroupSend();
      bodySendNoti = {
        ...bodySendNoti,
        user_group_id: (values?.user_group_id || []).map((x) => x?.user_group_id || ''),
      };
    }

    //Body and url type Client Category

    if (values.notification_type === NOTIFICATION_TYPE.ClientCategory) {
      urlSendNoti = postClientCategorySend('');
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
  bundle_id: Array<any>;
  title: string;
  site_name: string;
  message: string;
  type_url: string;
  delivery_type: string;
  expire: string;
  type_expired: string;
  user_group_id?: Array<any>;
  schedule: string;
  expire_time?: string;
  schedule_time?: number;
  segment_id?: string;
  segment_name?: string;
  notification_category: string;
  url?: string;
  client_category_id: Array<any>;
}

const initialValues: initialValuesType = {
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
  site_name: localStorage.getItem('sitename') || '',
  notification_category: '',
  url: '',
  client_category_id: [],
};

const validationSchema = yup.object().shape({
  bundle_id: yup.array().min(1, 'lang_app_name_require').required('lang_app_name_require'),
  user_group_id: yup.array().when(['notification_type'], (value, schema) => {
    return value === NOTIFICATION_TYPE.UserGroup
      ? schema.min(1, 'lang_user_group_require').required('lang_user_group_require')
      : schema;
  }),
  client_category_id: yup.array().when(['notification_type'], (value, schema) => {
    return value === NOTIFICATION_TYPE.ClientCategory
      ? schema.min(1, 'lang_client_category_id_require').required('lang_client_category_id_require')
      : schema;
  }),
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
  notification_category: yup.string().required('lang_notification_category_require'),
  url: yup.string().required('lang_linked_screen_require'),
});

export default CreateNewNotification;
