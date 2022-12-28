import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { Trans } from 'react-i18next';

type TextFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  type?: string;
  error?: boolean;
  value?: string;
  helperText?: string | boolean | undefined;
  fullWidth?: boolean;
  sx?: any;
  inputProps?: any;
  InputProps?: any;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const PasswordField: React.FC<TextFieldProps> = ({ label, helperText, value, ...props }) => {
  const [visibility, setVisibility] = React.useState(false);

  const handleClickShowPassword = () => {
    setVisibility((state) => !state);
  };

  return (
    <TextField
      {...props}
      label={<Trans>{label}</Trans>}
      helperText={<Trans>{helperText}</Trans>}
      value={value}
      type={visibility ? 'text' : 'password'}
      inputProps={{
        autocomplete: 'new-password',
        form: {
          autocomplete: 'off',
        },
      }}
      InputProps={
        value
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                    {visibility ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : {}
      }
    ></TextField>
  );
};

export default PasswordField;
