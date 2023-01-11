/*
 * Created on Fri Jan 06 2023
 *
 * Password base field
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Trans } from 'react-i18next';
import Button from 'components/atoms/ButtonBase';
import { FormikErrors } from 'formik';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { isIressLoginSelector } from 'selectors/app.selector';
import ConfirmModal from 'components/molecules/ConfirmModal';
import { iressLogout } from 'actions/app.action';
import { useGlobalModalContext } from 'containers/Modal';
import FetchReport from 'features/FetchReport ';

const useStyles = makeStyles((theme) => ({}));

type TextFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  type?: string;
  error?: boolean;
  value?: string;
  helperText?: string | boolean | undefined | FormikErrors<any>[] | FormikErrors<any> | string[];
  fullWidth?: boolean;
  sx?: any;
  maxLength?: number;
  inputProps?: any;
  InputProps?: any;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  generate?: boolean;
  onChange?: (e: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const IressAuthField: React.FC<TextFieldProps> = ({ label, helperText, value, generate, maxLength = 25, ...props }) => {
  const classes = useStyles();
  const isIressLogin = useSelector(isIressLoginSelector);
  const dispatch = useDispatch();
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const { showSubModal } = useGlobalModalContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(e.target.value);
  };

  const handleIressAuth = () => {
    if (isIressLogin) {
      onShowLogoutConfirm();
    } else {
    }
    showSubModal({
      title: 'lang_sign_in',
      component: FetchReport,
      styleModal: { minWidth: 440 },
      props: {
        title: 'lang_confirm_cancel_text',
        isCancelPage: true,
        emailConfirm: false,
        onSubmit: () => {
          console.log('xin chao');
        },
      },
    });
    // console.log('YOLO');
  };

  const onCloseLogout = () => {
    setLogoutModalOpen(false);
  };

  const onShowLogoutConfirm = () => {
    setLogoutModalOpen(true);
  };

  const onConfirmLogout = () => {
    dispatch(iressLogout());
  };

  return (
    <Box>
      <TextField
        {...props}
        label={<Trans>{label}</Trans>}
        helperText={<Trans>{helperText}</Trans>}
        value={value}
        disabled={!isIressLogin}
        onChange={handleChange}
        inputProps={{
          maxLength,
          autoComplete: 'new-password',
          form: {
            autoComplete: 'off',
          },
        }}
        InputProps={{
          endAdornment: (
            <Button network variant={isIressLogin ? 'text' : 'contained'} onClick={handleIressAuth}>
              <Trans>{isIressLogin ? 'lang_sign_out' : 'lang_sign_in'}</Trans>
            </Button>
          ),
        }}
      ></TextField>
      <ConfirmModal
        open={logoutModalOpen}
        alertTitle="lang_sign_out"
        alertContent="lang_confirm_logout"
        onClose={onCloseLogout}
        onSubmit={onConfirmLogout}
      />
    </Box>
  );
};

export default IressAuthField;
