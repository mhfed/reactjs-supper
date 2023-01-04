import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { validate } from 'helpers';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Trans } from 'react-i18next';
import { isLoadingSelector, createPasswordTokenSelector, userLoginSelector } from 'selectors/auth.selector';
import httpRequest from 'services/httpRequest';
import { getCreatePasswordUrl } from 'apis/request.url';
import { PasswordField } from 'components/fields';
import { setPinAfterChangePass } from 'actions/auth.action';
import { IChangePassValues } from 'models/ICommon';

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.light,
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

type SetPasswordProps = {
  setNewPassord: (pw: string) => void;
};

const SetPassword: React.FC<SetPasswordProps> = ({ setNewPassord }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLoading = useSelector(isLoadingSelector);
  const token = useSelector(createPasswordTokenSelector);
  const email = useSelector(userLoginSelector);

  const handleFormSubmit = async (values: IChangePassValues) => {
    try {
      setNewPassord(values.password);
      await httpRequest.post(getCreatePasswordUrl(), {
        data: {
          token,
          user_login_id: email,
          password: values.password,
        },
      });
      dispatch(setPinAfterChangePass() as any);
    } catch (error) {
      console.error('SetPassword handleFormSubmit error: ', error);
    }
  };

  const { values, errors, touched, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Paper className={classes.loginForm}>
      <div className={classes.title}>
        <Typography variant="h5">
          <Trans>lang_choose_a_password</Trans>
        </Typography>
      </div>
      <Typography variant="body2" align="center" sx={{ width: '100%', px: 3, pt: 3 }}>
        <Trans>lang_password_required</Trans>
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <PasswordField
          id="password"
          name="password"
          sx={{ mb: 2 }}
          label="lang_password"
          required
          fullWidth
          value={values.password}
          onChange={(v: string) => setFieldValue('password', v)}
          onBlur={handleBlur}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password}
        />
        <PasswordField
          id="re_password"
          name="re_password"
          sx={{ mb: 2 }}
          label="lang_confirm_password"
          required
          fullWidth
          value={values.re_password}
          onChange={(v: string) => setFieldValue('re_password', v)}
          onBlur={handleBlur}
          error={touched.re_password && Boolean(errors.re_password)}
          helperText={touched.re_password && errors.re_password}
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
  password: yup.string().required('lang_password_required').matches(validate.getPasswordPattern(), 'lang_password_required'),
  re_password: yup
    .string()
    .required('lang_input_confirm_password')
    .oneOf([yup.ref('password'), null], 'lang_password_not_match'),
});

export default SetPassword;
