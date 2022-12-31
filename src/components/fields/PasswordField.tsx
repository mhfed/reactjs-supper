import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { Trans } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { FormikErrors } from 'formik';

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
  inputProps?: any;
  InputProps?: any;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  generate?: boolean;
  onChange?: (e: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const PasswordField: React.FC<TextFieldProps> = ({ label, helperText, value, ...props }) => {
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
        autocomplete: 'new-password',
        form: {
          autocomplete: 'off',
        },
      }}
      InputProps={{
        endAdornment: (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {value ? (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                  {visibility ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null}
            {props.generate ? (
              <Button
                // className={classes.btnGenerate}
                onClick={handleGenPass}
                sx={{ ml: 1 }}
              >
                Generate
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
