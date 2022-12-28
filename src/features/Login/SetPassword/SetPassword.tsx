import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { IValidator } from 'models/ICommon';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Trans, useTranslation } from 'react-i18next';
import { isLoadingSelector } from 'selectors/auth.selector';
import httpRequest from 'services/httpRequest';
import { getCreatePasswordUrl } from 'apis/request.url';
import { setPinAfterChangePass, changePasswordRequest } from 'actions/auth.action';

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginForm: {
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#272B3B',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    padding: theme.spacing(4, 3, 3, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  termsContainer: {
    textAlign: 'center',
  },
}));

interface IChangePassValues {
  password: string;
  re_password: string;
}
type SetPasswordProps = {
  setNewPassord: (pw: string) => void;
};

const SetPassword: React.FC<SetPasswordProps> = ({ setNewPassord }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isLoading = useSelector(isLoadingSelector);

  const handleFormSubmit = async (values: IChangePassValues) => {
    try {
      dispatch(changePasswordRequest() as any);
      await httpRequest.get(getCreatePasswordUrl(), {
        showSpinner: true,
      });
      dispatch(setPinAfterChangePass() as any);
    } catch (error) {
      console.error('SetPassword handleFormSubmit error: ', error);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Paper className={classes.loginForm}>
      <div className={classes.title}>
        <Typography variant="h5">
          <Trans>lang_sign_in_to_your_account</Trans>
        </Typography>
      </div>
      <Typography sx={{ width: '100%', py: 2 }}>
        <Trans>lang_password_required</Trans>
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          id="password"
          name="password"
          sx={{ mb: 2 }}
          label={<Trans>lang_password</Trans>}
          required
          fullWidth
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password && t(errors.password)}
        />
        <TextField
          id="password"
          name="password"
          sx={{ mb: 2 }}
          label={<Trans>lang_password</Trans>}
          required
          fullWidth
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password && t(errors.password)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
          <Trans>lang_change_password</Trans>
          {isLoading && <CircularProgress color="secondary" size={24} sx={{ position: 'absolute' }} />}
        </Button>
      </form>
    </Paper>
  );
};

const initialValues = {
  password: '',
  re_password: '',
};

const validationSchema = yup.object().shape({
  password: yup.string().required('lang_password_required').matches(IValidator.PASSWORD, 'lang_password_required'),
  re_password: yup
    .string()
    .required('lang_input_confirm_password')
    .oneOf([yup.ref('password'), null], 'lang_password_not_match'),
});

export default SetPassword;
