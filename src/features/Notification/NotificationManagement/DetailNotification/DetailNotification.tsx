import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Stack, Typography, Grid, Box } from '@mui/material';
import { Trans } from 'react-i18next';
import { InputField } from 'components/fields';
import { Formik, FormikProps } from 'formik';
import { Autocomplete, TextField } from '@mui/material';
import { useGlobalModalContext } from 'containers/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { initialValuesType } from '../../CreateNewNotification/CreateNewNotification';
import { DELIVERY_TYPE, EXPIRE_OPTION_FILTER, NOTIFICATION_TYPE } from '../../CreateNewNotification/NotificationConstant';
import moment from 'moment';

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

    let delivery_type_preview = `${values?.delivery_type || ''}`;

    if (values.notification_type !== Direct) {
      delivery_type_preview += ` ${values?.schedule_time ? moment(values?.schedule_time || '').format('MM/DD/YYYY HH:MM') : ''}`;
    }
    const valueExpire = (values?.expire_time || '').replace(/[A-z]/, '');
    const typeExpire = (values?.expire_time || '').replace(/[0-9]/, '');
    const expired_preview = `${valueExpire || '0'} ${EXPIRE_OPTION_FILTER[typeExpire]}`;
    values.type_url = 'Articles';

    let defaultArray = Array.isArray(values.subscribers) ? values.subscribers.map((x: any) => x?.subscriber) : [];
    return (
      <React.Fragment>
        <Grid container spacing={3} className={classes.containerForm}>
          <Grid item container xs={12} md={6} spacing={3}>
            <Grid item xs={12}>
              <InputField
                name="notification_type"
                label="lang_notification_type"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant={'standard'}
                value={values.notification_type}
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                name="title"
                label="lang_title"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant={'standard'}
                value={values.title}
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                name="type_url"
                label="lang_type_url"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant={'standard'}
                value={values?.type_url}
              />
            </Grid>
          </Grid>
          <Grid item container xs={12} md={6} spacing={3} style={{ height: 'fit-content' }}>
            {[Segment, Sitename].includes(values.notification_type) ? (
              <React.Fragment>
                <Grid item xs={12} style={{ height: 81 }}>
                  <InputField
                    // name="message"
                    label="lang_delivery_type"
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    variant={'standard'}
                    value={delivery_type_preview}
                    style={{ visibility: 'hidden' }}
                  />
                </Grid>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Grid item xs={12}>
                  <InputField
                    // name="message"
                    label="lang_delivery_type"
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    variant={'standard'}
                    value={delivery_type_preview}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    // name="message"
                    label="lang_expire"
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    variant={'standard'}
                    value={expired_preview}
                  />
                </Grid>
              </React.Fragment>
            )}
          </Grid>
          <Grid item container xs={12} spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="tags-readOnly"
                options={[]}
                value={defaultArray}
                readOnly
                freeSolo
                // renderOption={(props, option, { selected }) => <li {...props}>{option.title}</li>}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={
                      <Typography>
                        <Trans>lang_subscribers</Trans>
                      </Typography>
                    }
                  ></TextField>
                )}
              />
            </Grid>
          </Grid>
          <Grid item container xs={12} spacing={3}>
            <Grid item xs={12}>
              <InputField
                name="message"
                label="lang_message"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant={'standard'}
                value={values.message}
                multiline={true}
              />
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
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
