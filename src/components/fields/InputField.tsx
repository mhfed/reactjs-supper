import React from 'react';
import TextField from '@mui/material/TextField';
import { Trans } from 'react-i18next';
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
  multiline?: boolean;
  defaultValue?: string;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const InputField: React.FC<TextFieldProps> = ({ label, helperText, ...props }) => {
  return <TextField {...props} label={<Trans>{label}</Trans>} helperText={<Trans>{helperText}</Trans>}></TextField>;
};

export default InputField;
