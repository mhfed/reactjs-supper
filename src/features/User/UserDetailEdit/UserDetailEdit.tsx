import React from 'react';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import { InputField, PreviewField, SelectField } from 'components/fields';
import { useFormik } from 'formik';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Trans } from 'react-i18next';
import httpRequest from 'services/httpRequest';
import { getUserDetailByUserIdUrl } from 'apis/request.url';
import EditIcon from '@mui/icons-material/Edit';
import { SITE_NAME_OPTIONS, USER_STATUS_OPTIONS } from '../UserConstants';
import { useLocation } from 'react-router';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    background: theme.palette.background.other2,
    padding: theme.spacing(5),
  },
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
    '& .MuiGrid-item': {
      paddingTop: theme.spacing(3),
    },
  },
}));

type UserDetailProps = {};

const UserDetail: React.FC<UserDetailProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = React.useState(false);
  const location = useLocation();

  const initialValues = {
    full_name: location.state.full_name,
    status: location.state.status,
    user_login: location.state.user_login_id,
    site_name: location.state.site_name,
    last_time: location.state.last_time,
    create_time: location.state.create_time,
    description: location.state.note,
  };

  // Handle Submit Form
  const handleFormSubmit = async () => {
    try {
      const body = {
        data: {
          full_name: values.full_name,
          status: values.status,
          site_name: values.site_name,
          note: values.description,
        },
      };
      const user_id = location.state.user_id;
      const response: any = await httpRequest.put(getUserDetailByUserIdUrl(user_id), body);
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_create_user_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
      console.error('Create user handleFormSubmit error: ', error);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: { ...initialValues },
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  const handleTurnOnEditMode = () => {
    setEditMode(true);
  };
  const handleTurnOffEditMode = () => {
    setEditMode(false);
  };
  React.useEffect(() => {}, []);

  const renderContent = (editMode: boolean) => {
    if (!editMode) {
      return (
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h4" className={classes.title}>
                <Trans>lang_user_details</Trans>
              </Typography>
            </Grid>
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
              <PreviewField label="lang_last_active" value={moment(values.last_time).format('DD/MM/YYYY HH:mm:ss')} />
            </Grid>
            <Grid item xs={6}>
              <PreviewField label="lang_sitename" value={values.site_name} options={SITE_NAME_OPTIONS} />
            </Grid>
            <Grid item xs={6}>
              <PreviewField label="lang_create_time" value={moment(values.create_time).format('DD/MM/YYYY HH:mm:ss')} />
            </Grid>
            <Grid item xs={12}>
              <PreviewField label="lang_description" value={values.description} />
            </Grid>
          </Grid>
        </Box>
      );
    } else {
      return (
        <Box>
          <Grid container spacing={4} rowSpacing={1}>
            <Grid item xs={12}>
              <Typography variant="h4" className={classes.title}>
                <Trans>lang_user_details</Trans>
              </Typography>
            </Grid>
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
                options={USER_STATUS_OPTIONS}
                name="status"
                label="lang_status"
                id="status"
                fullWidth={true}
                onBlur={handleBlur}
                value={values.status}
                onChange={handleChange}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
              />
            </Grid>
            <Grid item xs={6}>
              <PreviewField label="lang_user_login" value={values.user_login} />
            </Grid>
            <Grid item xs={6}>
              <PreviewField label="lang_last_active" value={moment(values.last_time).format('DD/MM/YYYY HH:mm:ss')} />
            </Grid>
            <Grid item xs={6}>
              <SelectField
                options={SITE_NAME_OPTIONS}
                name="site_name"
                label="lang_sitename"
                id="site_name"
                fullWidth={true}
                onBlur={handleBlur}
                value={values.site_name}
                onChange={handleChange}
                error={touched.site_name && Boolean(errors.site_name)}
                helperText={touched.site_name && errors.site_name}
              />
            </Grid>
            <Grid item xs={6}>
              <PreviewField label="lang_create_time" value={moment(values.create_time).format('DD/MM/YYYY HH:mm:ss')} />
            </Grid>
            <Grid item xs={12}>
              <InputField
                id="description"
                name="description"
                label="lang_description"
                required
                fullWidth
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
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
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2} sx={{ margin: '12px 0' }}>
          <Button variant="outlined" onClick={handleTurnOffEditMode}>
            <Trans>lang_cancel</Trans>
          </Button>
          <Button variant="contained" type="submit">
            <Trans>lang_save</Trans>
          </Button>
        </Stack>
      );
    } else {
      return (
        <Stack direction="row" justifyContent="end" alignItems="center" sx={{ margin: '12px 0' }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={handleTurnOnEditMode}>
            <Trans>lang_edit</Trans>
          </Button>
        </Stack>
      );
    }
  };
  return (
    <Paper className={classes.wrapper}>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        {renderContent(editMode)}
        {renderButton(editMode)}
        <Box></Box>
      </form>
    </Paper>
  );
};

const validationSchema = yup.object().shape({
  full_name: yup.string().required('lang_full_name_required').max(64, 'lang_full_name_max_length'),
  site_name: yup.string().required('lang_site_name_required'),
  status: yup.string().required('lang_status_required'),
});

export default UserDetail;
