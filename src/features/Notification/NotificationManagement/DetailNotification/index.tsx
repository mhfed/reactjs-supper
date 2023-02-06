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
import FormSegmentNotification from './FormSegmentNotification';
import FormSiteNameNotification from './FormSiteNameNotification';
import httpRequest from 'services/httpRequest';
import { getNotificationUrl } from 'apis/request.url';
import EditNotification from '../EditNotification';
import EditIcon from '@mui/icons-material/Edit';

interface DetailNotificationProps {
  dataForm: any;
  typePage: 'DETAIL' | 'EDIT';
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
    paddingRight: 24,
    paddingBottom: 24,
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

const STATE_FORM = {
  DETAIL: 'DETAIL',
  EDIT: 'EDIT',
};

const DetailNotification: React.FC<DetailNotificationProps> = ({ typePage, dataForm }) => {
  const classes = useStyles();
  const { hideModal, showModal } = useGlobalModalContext();
  const { Segment, Direct } = NOTIFICATION_TYPE;
  const handleClose = () => {
    if (typePage === STATE_FORM.DETAIL) {
      hideModal();
    }
  };

  const renderContent = (form: FormikProps<initialValuesType>) => {
    const { values } = form;
    switch (values.notification_type) {
      case Direct: {
        return <FormDirectNotification form={form} classes={classes} />;
      }
      case Segment: {
        return <FormSegmentNotification form={form} classes={classes} />;
      }
      default: {
        return <FormSiteNameNotification form={form} classes={classes} />;
      }
    }
  };

  const onEdit = async () => {
    const response: any = await httpRequest.get(getNotificationUrl(dataForm?.notification_id));

    const formatData = (response?.subscribers || []).map((e: any) => ({ ...e, username: e.subscriber }));

    showModal({
      component: EditNotification,
      fullScreen: true,
      props: {
        typePage: 'DETAIL',
        dataForm: { ...dataForm, subscribers: formatData },
        defaultValue: dataForm,
      },
    });
  };

  const submitButton = (form: FormikProps<initialValuesType>) => {
    return (
      <Stack direction="row" justifyContent="end" alignItems="center" spacing={3} className={classes.buttonWrapper}>
        {form.values.delivery_type === DELIVERY_TYPE.Instant || dataForm?.status === NOTIFICATION_STATUS.TRIGGERED ? null : (
          <Button variant="contained" startIcon={<EditIcon />} network onClick={onEdit}>
            <Trans>lang_edit</Trans>
          </Button>
        )}
      </Stack>
    );
  };

  return (
    <div className={classes.divCointainer}>
      <HeaderModal title="lang_notifications_details" onClose={handleClose} />
      <Formik initialValues={dataForm} onSubmit={() => {}}>
        {(form: FormikProps<initialValuesType>) => {
          return (
            <React.Fragment>
              {renderContent(form)}
              {submitButton(form)}
            </React.Fragment>
          );
        }}
      </Formik>
    </div>
  );
};

export default DetailNotification;
