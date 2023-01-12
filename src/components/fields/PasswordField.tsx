/*
 * Created on Fri Jan 06 2023
 *
 * Password base field
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { Trans } from 'react-i18next';
import { Box, Button, SxProps, Theme } from '@mui/material';
import { FormikErrors } from 'formik';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  btnGenerate: {
    marginLeft: 1,
    textTransform: 'capitalize',
    background: theme.palette.mode === 'dark' ? 'rgba(0, 199, 127, 0.08)' : '#E1FFF4',
  },
}));

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
  styleIcon?: SxProps<Theme>;
};

const PasswordField: React.FC<TextFieldProps> = ({ label, helperText, value, generate, maxLength = 25, ...props }) => {
  const classes = useStyles();
  const [visibility, setVisibility] = React.useState(false);
  const handleClickShowPassword = () => {
    setVisibility((state) => !state);
  };

  const handleGenPass = () => {
    const pass = autogenPass();
    props.onChange?.(pass);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(e.target.value);
  };
  return (
    <TextField
      {...props}
      label={<Trans>{label}</Trans>}
      helperText={<Trans>{helperText}</Trans>}
      value={value}
      type={visibility ? 'text' : 'password'}
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {value ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                  sx={{ ...props.styleIcon }}
                >
                  {!visibility ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null}
            {generate ? (
              <Button className={classes.btnGenerate} onClick={handleGenPass}>
                <Trans>lang_generate</Trans>
              </Button>
            ) : null}
          </Box>
        ),
      }}
    ></TextField>
  );
};

export default PasswordField;

// Auto generate password
const autogenPass = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const charsUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charsLower = 'abcdefghijklmnopqrstuvwxyz';
  const number = '1234567890';
  let pass = '';
  pass += charsUpper.charAt(Math.floor(Math.random() * charsUpper.length));
  pass += charsLower.charAt(Math.floor(Math.random() * charsLower.length));
  pass += number.charAt(Math.floor(Math.random() * number.length));

  for (let x = 0; x < 6; x++) {
    const i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  return pass;
};
