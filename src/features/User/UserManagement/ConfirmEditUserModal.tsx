import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import { LooseObject } from 'models/ICommon';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { validate } from 'helpers';
import { Trans } from 'react-i18next';
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
  dicDataChanged: LooseObject;
  onClose: () => void;
};

const ConfirmEditUserModal: React.FC<ConfirmEditUserModalProps> = ({ dicDataChanged = {}, onClose }) => {
  const classes = useStyles();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const user = useSelector(userSelector);
  const timeoutId = React.useRef<number | null>(null);

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

  const handleCancel = () => {
    onClose();
  };
  const handleConfirm = () => {
    if (email !== user.user_login_id) {
      setError('lang_email_did_not_match');
      return;
    }
    onClose();
  };

  const listChangeUser = Object.keys(dicDataChanged);
  // if (!listChangeUser.length) return <></>;
  const isLess = listChangeUser.length < 6;
  return (
    <div className={classes.container}>
      <Typography sx={{ mb: 1 }}>
        {isLess ? (
          <Trans>lang_enter_your_email_to_edit_user_login</Trans>
        ) : (
          <Trans values={{ count: listChangeUser.length }}>lang_enter_your_email_to_edit_count_user_logins</Trans>
        )}
      </Typography>
      {isLess ? (
        listChangeUser.map((useLoginId) => (
          <Typography fontWeight="bold" key={useLoginId}>
            {useLoginId}
          </Typography>
        ))
      ) : (
        <></>
      )}
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
      <div className={classes.btnContainer}>
        <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>
          <Trans>lang_cancel</Trans>
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          <Trans>lang_confirm</Trans>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmEditUserModal;
