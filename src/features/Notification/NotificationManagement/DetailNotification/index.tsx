import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Stack, Typography, Box } from '@mui/material';
import { Trans } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { useGlobalModalContext } from 'containers/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { initialValuesType } from '../../CreateNewNotification/CreateNewNotification';
import { DELIVERY_TYPE, NOTIFICATION_TYPE } from '../../CreateNewNotification/NotificationConstant';
import FormDirectNotification from './FormDirectNotification';
import FormSegmentNotification from './FormSegmentNotification';

interface EditNotificationProps {
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
  },
  buttonWrapper: {
    marginTop: 'auto',
    paddingRight: 24,
    paddingBottom: 24,
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(2),
  },
  iconClose: {
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(1),
    background: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.paper,
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

const EditNotification: React.FC<EditNotificationProps> = ({ typePage, dataForm }) => {
  const classes = useStyles();
  const { hideModal } = useGlobalModalContext();
  const { Segment, Sitename, Direct } = NOTIFICATION_TYPE;
  const handleClose = () => {
    if (typePage === STATE_FORM.DETAIL) {
      hideModal();
    }
  };

  const renderHeader = () => {
    return (
      <Box className={classes.header}>
        <Typography>
          <Trans>{'lang_notifications_details'}</Trans>
        </Typography>
        <CloseIcon className={classes.iconClose} onClick={handleClose} />
      </Box>
    );
  };

  const renderContent = (form: FormikProps<initialValuesType>) => {
    const { values } = form;
    if (values.notification_type === Direct) {
      return <FormDirectNotification form={form} classes={classes} />;
    }
    if (values.notification_type === Segment) {
      return <FormSegmentNotification form={form} classes={classes} />;
    }
  };

  const submitButton = (form: FormikProps<initialValuesType>) => {
    return (
      <Stack direction="row" justifyContent="end" alignItems="center" spacing={3} className={classes.buttonWrapper}>
        {form.values.delivery_type === DELIVERY_TYPE.Instant ? null : (
          <Button variant="contained">
            <Trans>lang_edit</Trans>
          </Button>
        )}
      </Stack>
    );
  };

  return (
    <div className={classes.divCointainer}>
      {renderHeader()}
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

export default EditNotification;
