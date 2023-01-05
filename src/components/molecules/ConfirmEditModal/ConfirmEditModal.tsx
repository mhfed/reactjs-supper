import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { LooseObject } from 'models/ICommon';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { validate } from 'helpers';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { userSelector } from 'selectors/auth.selector';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
}));

type ConfirmEditUserModalProps = {
  title: string;
  titleTransValues?: LooseObject;
  emailConfirm?: boolean;
  data?: LooseObject[];
  onClose: () => void;
  onSubmit: () => void;
};

const ConfirmEditModal: React.FC<ConfirmEditUserModalProps> = ({
  title,
  titleTransValues = {},
  emailConfirm = true,
  data = [],
  onClose,
  onSubmit,
}) => {
  const classes = useStyles();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const timeoutId = React.useRef<number | null>(null);
  const user = useSelector(userSelector);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    timeoutId.current && window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      setEmail(value);
    }, process.env.REACT_APP_DEBOUNCE_TIME);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setError('lang_email_required');
      return;
    }
    const isValid = validate.isValidEmail(e.target.value);
    if (isValid && error) {
      setError('');
      return;
    }
    if (!isValid) {
      setError('lang_email_invalid');
    }
  };

  const handleConfirm = () => {
    if (email !== user.user_login_id) {
      setError('lang_email_did_not_match');
    } else {
      onSubmit();
    }
  };

  return (
    <div className={classes.container}>
      <Typography sx={{ mb: 1 }}>
        <Trans values={titleTransValues} components={[<strong key="strong" />]}>
          {title}
        </Trans>
      </Typography>
      {data.length && data.length > 5 ? (
        data.map((e) => (
          <Typography fontWeight="bold" key={e.user_id}>
            {e.user_login_id}
          </Typography>
        ))
      ) : (
        <></>
      )}
      {emailConfirm ? (
        <TextField
          id="userLoginId"
          name="userLoginId"
          sx={{ mt: 2 }}
          label={<Trans>{'lang_your_email'}</Trans>}
          required
          fullWidth
          autoComplete="email"
          // value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!error}
          helperText={<Trans>{error}</Trans>}
        />
      ) : (
        <></>
      )}
      <div className={classes.btnContainer}>
        <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
          <Trans>lang_cancel</Trans>
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          <Trans>lang_confirm</Trans>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmEditModal;
