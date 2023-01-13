/*
 * Created on Fri Jan 06 2023
 *
 * User detail and edit user
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { yup } from 'helpers';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import { InputField, PreviewField, SelectField } from 'components/fields';
import { useFormik } from 'formik';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Trans } from 'react-i18next';
import httpRequest from 'services/httpRequest';
import { getUserDetailUrl } from 'apis/request.url';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { SITE_NAME_OPTIONS, USER_STATUS_OPTIONS } from '../UserConstants';
import moment from 'moment-timezone';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { diff } from 'deep-diff';

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
  },
  form: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(5),
    '& .MuiGrid-item': {
      paddingTop: theme.spacing(3),
    },
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

type UserDetailProps = {};

const formatDate = (valueFormat: number | string) => {
  if (!valueFormat) return '--';
  return moment(valueFormat).format('DD/MM/YYYY HH:mm:ss');
};

const UserDetail: React.FC<UserDetailProps> = ({ dataForm }: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = React.useState(false);
  const { showSubModal, hideModal, hideSubModal } = useGlobalModalContext();

  const initialValues = {
    full_name: dataForm.full_name || '',
    status: dataForm.status ?? '',
    user_login: dataForm.user_login_id || '',
    site_name: dataForm.site_name ?? '',
    last_time: dataForm.last_time || '',
    create_time: dataForm.create_time || '',
    note: dataForm.note || '',
  };

  // Handle show modal confirm
  const handleBeforeSubmit = () => {
    const isChanged = diff(initialValues, values);
    if (!isChanged) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_there_is_no_change_in_the_user_information',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
    } else {
      showSubModal({
        title: 'lang_confirm',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_edit_user',
          emailConfirm: true,
          titleTransValues: { user: values.user_login },
          onSubmit: () => handleFormSubmit(),
        },
      });
    }
  };

  // Handle Submit Form
  const handleFormSubmit = async () => {
    try {
      const body = {
        data: {
          full_name: values.full_name,
          status: values.status,
          site_name: values.site_name,
          note: values.note,
        },
      };
      const user_id = dataForm.user_id;
      const response: any = await httpRequest.put(getUserDetailUrl(user_id), body);

      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_user_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      hideModal();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error?.errorCodeLang,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
      hideModal();
      console.error('Update user handleFormSubmit error: ', error);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useFormik({
    initialValues: { ...initialValues },
    validationSchema: validationSchema,
    onSubmit: handleBeforeSubmit,
  });

  const handleTurnOnEditMode = () => {
    setEditMode(true);
  };
  const handleBackOrClose = (closeModal?: boolean) => {
    const isChanged = diff(initialValues, values);
    if (isChanged) {
      showSubModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          emailConfirm: false,
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
          onSubmit: () => {
            resetForm();
            hideSubModal();
            setEditMode(false);
            if (closeModal) hideModal();
          },
        },
      });
    } else {
      hideSubModal();
      hideModal();
    }
  };
  const handleClose = () => {
    handleBackOrClose(true);
  };
  React.useEffect(() => {}, []);

  const renderHeader = () => {
    return (
      <Box className={classes.header}>
        <Typography fontWeight={700}>
          <Trans>lang_user_details</Trans>
        </Typography>
        <CloseIcon className={classes.iconClose} onClick={handleClose} />
      </Box>
    );
  };
  const renderContent = (editMode: boolean) => {
    if (!editMode) {
      return (
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <PreviewField label="lang_full_name" value={values.full_name} />
            </Grid>
            <Grid item xs={6}>
              <PreviewField label="lang_status" value={values.status} options={USER_STATUS_OPTIONS} />
            </Grid>
            <Grid item xs={6}>
              <PreviewField label="lang_user_login" value={values.user_login} />
            </Grid>
            <Grid item xs={6}>
              <PreviewField label="lang_last_active" value={formatDate(values.last_time)} />
            </Grid>
            <Grid item xs={6}>
              <PreviewField label="lang_sitename" value={values.site_name} options={SITE_NAME_OPTIONS} />
            </Grid>
            <Grid item xs={6}>
              <PreviewField label="lang_create_time" value={formatDate(values.create_time)} />
            </Grid>
            <Grid item xs={12}>
              <PreviewField label="lang_notes" value={values.note} multiline />
            </Grid>
          </Grid>
        </Box>
      );
    } else {
      return (
        <Box>
          <Grid container spacing={4} rowSpacing={1}>
            <Grid item xs={6}>
              <InputField
                id="full_name"
                name="full_name"
                label="lang_full_name"
                required
                fullWidth
                value={values.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.full_name && Boolean(errors.full_name)}
                helperText={touched.full_name && errors.full_name}
                inputProps={{ maxLength: 64 }}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectField
                required
                options={USER_STATUS_OPTIONS}
                name="status"
                label="lang_status"
                id="status"
                fullWidth
                onBlur={handleBlur}
                value={values.status}
                onChange={handleChange}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
                textTransform="uppercase"
              />
            </Grid>
            <Grid item xs={6}>
              <PreviewField required label="lang_user_login" value={values.user_login} variant={'outlined'} disabled />
            </Grid>
            <Grid item xs={6}>
              <PreviewField
                required
                label="lang_last_active"
                value={formatDate(values.last_time)}
                variant={'outlined'}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <SelectField
                required
                options={SITE_NAME_OPTIONS}
                name="site_name"
                label="lang_sitename"
                id="site_name"
                fullWidth
                onBlur={handleBlur}
                value={values.site_name}
                onChange={handleChange}
                error={touched.site_name && Boolean(errors.site_name)}
                helperText={touched.site_name && errors.site_name}
                textTransform="uppercase"
              />
            </Grid>
            <Grid item xs={6}>
              <PreviewField
                required
                label="lang_create_time"
                value={formatDate(values.create_time)}
                variant={'outlined'}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                id="note"
                name="note"
                label="lang_notes"
                fullWidth
                value={values.note}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.note && Boolean(errors.note)}
                helperText={touched.note && errors.note}
                multiline
                rows={4}
                inputProps={{ maxLength: 255 }}
              />
            </Grid>
          </Grid>
        </Box>
      );
    }
  };
  const renderButton = (editMode: boolean) => {
    if (editMode) {
      return (
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
          <Button variant="outlined" onClick={() => handleBackOrClose()}>
            <Trans>lang_back</Trans>
          </Button>
          <Button variant="contained" type="submit">
            <Trans>lang_save</Trans>
          </Button>
        </Stack>
      );
    } else {
      return (
        <Stack direction="row" justifyContent="end" alignItems="center">
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleTurnOnEditMode}>
            <Trans>lang_edit</Trans>
          </Button>
        </Stack>
      );
    }
  };
  return (
    <>
      {renderHeader()}
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        {renderContent(editMode)}
        {renderButton(editMode)}
      </form>
    </>
  );
};

const validationSchema = yup.object().shape({
  full_name: yup.string().required('lang_full_name_required').max(64, 'lang_full_name_max_length'),
  site_name: yup.string().required('lang_site_name_required'),
  status: yup.string().required('lang_status_required'),
});

export default UserDetail;
