/*
 * Created on Fri Jan 06 2023
 *
 * Confirm popup with current user login (email) check
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { LooseObject } from 'models/ICommon';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from 'components/atoms/ButtonBase';
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
  cancelText?: string;
  confirmText?: string;
  titleTransValues?: LooseObject;
  emailConfirm?: boolean;
  data?: LooseObject[];
  onClose: () => void;
  onSubmit: () => void;
};

const ConfirmEditModal: React.FC<ConfirmEditUserModalProps> = ({
  title,
  cancelText = 'lang_cancel',
  confirmText = 'lang_confirm',
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
  const ref = React.useRef<HTMLInputElement>(null);
  const user = useSelector(userSelector);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    timeoutId.current && window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      if (value === '') {
        setError('lang_plese_enter_email');
      } else {
        const errorCodeLang = validate.isValidEmail(value);
        if (errorCodeLang && errorCodeLang !== error) {
          setError(errorCodeLang);
        } else if (!errorCodeLang) {
          if (error) setError('');
          setEmail(value);
        }
      }
    }, process.env.REACT_APP_DEBOUNCE_TIME);
  };

  const handleConfirm = () => {
    if (emailConfirm && (email + '').replace(/\s/g, '').toLowerCase() !== (user.user_login_id + '').toLowerCase()) {
      setError('lang_email_did_not_match');
    } else {
      onSubmit();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setError('lang_plese_enter_email');
      return;
    }
    if (e.target.value.includes(' ')) {
      ref.current && (ref.current.value = e.target.value.replace(/\s/g, ''));
      setEmail(e.target.value.replace(/\s/g, ''));
    }
  };

  return (
    <div className={classes.container}>
      <Typography sx={{ mb: 1 }}>
        <Trans values={titleTransValues} components={[<strong key="strong" />]}>
          {title}
        </Trans>
      </Typography>
      {data.length && data.length < 6 ? (
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
          inputRef={ref}
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
          <Trans>{cancelText}</Trans>
        </Button>
        <Button network variant="contained" disabled={(emailConfirm && !email) || !!error} onClick={handleConfirm}>
          <Trans>{confirmText}</Trans>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmEditModal;
