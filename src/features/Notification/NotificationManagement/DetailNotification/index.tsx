/*
 * Created on Mon Jan 30 2023
 *
 * This Form allow user can see detail noti
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Button from 'components/atoms/ButtonBase';
import Stack from '@mui/material/Stack';
import { Trans } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { useGlobalModalContext } from 'containers/Modal';
import HeaderModal from 'components/atoms/HeaderModal';
import { initialValuesType } from '../../CreateNewNotification/CreateNewNotification';
import { DELIVERY_TYPE, NOTIFICATION_STATUS, NOTIFICATION_TYPE } from '../../CreateNewNotification/NotificationConstant';
import FormDirectNotification from './FormDirectNotification';
import { httpRequest } from 'services/initRequest';
import { getNotificationUrl } from 'apis/request.url';
import EditNotification from '../EditNotification';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';

interface DetailNotificationProps {
  dataForm: any;
  typePage: 'DETAIL' | 'EDIT';
  reCallChangeTable?: () => void;
}

const useStyles = makeStyles((theme) => ({
  divCointainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflowY: 'auto',
  },
  containerForm: {
    marginTop: 0,
    width: '100%',
    marginLeft: 0,
    paddingRight: 24,
    overflowY: 'auto',
  },
  buttonWrapper: {
    marginTop: 'auto',
    padding: '24px 24px 24px 0px',
  },
  iconClose: {
    cursor: 'pointer',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
  },
}));

const DetailNotification: React.FC<DetailNotificationProps> = ({ typePage, dataForm, reCallChangeTable }) => {
  const classes = useStyles();
  const { hideModal, showModal } = useGlobalModalContext();
  const dispatch = useDispatch();
  const { UserGroup, App } = NOTIFICATION_TYPE;

  let initialValues: any = {};

  if (dataForm) {
    initialValues = { ...dataForm };
    initialValues = { ...initialValues, user_group_id: dataForm.user_group, bundle_id: initialValues.app };
    initialValues.client_category_id =
      (initialValues?.client_category || []).find((e: any) => e.id === initialValues.client_category_id)?.name || '';
  }

  const onEdit = async () => {
    const response: any = await httpRequest.get(getNotificationUrl(initialValues?.notification_id));
    const formatData = (response?.subscribers || []).map((e: any) => ({ ...e, username: e.subscriber }));
    if (response.status === NOTIFICATION_STATUS.TRIGGERED) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_noti_has_been_sent',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    } else {
      showModal({
        component: EditNotification,
        fullScreen: true,
        props: {
          typePage: 'DETAIL',
          dataForm: { ...dataForm, subscribers: formatData },
          defaultValue: dataForm,
          reCallChangeTable: reCallChangeTable,
        },
      });
    }
  };

  const submitButton = (form: FormikProps<initialValuesType>) => {
    return (
      <Stack direction="row" justifyContent="end" alignItems="center" spacing={3} className={classes.buttonWrapper}>
        {form.values.status === NOTIFICATION_STATUS.TRIGGERED ? null : (
          <Button variant="contained" startIcon={<EditIcon />} network onClick={onEdit}>
            <Trans>lang_edit</Trans>
          </Button>
        )}
      </Stack>
    );
  };

  return (
    <div className={classes.divCointainer}>
      <HeaderModal title="lang_notifications_details" onClose={hideModal} />
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(form: FormikProps<initialValuesType>) => {
          return (
            <React.Fragment>
              <FormDirectNotification form={form} classes={classes} />
              {submitButton(form)}
            </React.Fragment>
          );
        }}
      </Formik>
    </div>
  );
};

export default DetailNotification;
