/*
 * Created on Fri Jan 06 2023
 *
 * Input base field
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import TextField from '@mui/material/TextField';
import { Trans } from 'react-i18next';
import { FormikErrors } from 'formik';
import { Box, IconButton, InputAdornment } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

type TextFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  type?: string;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  value?: string;
  helperText?: string | boolean | undefined | FormikErrors<any>[] | FormikErrors<any> | string[];
  fullWidth?: boolean;
  sx?: any;
  maxLength?: number;
  inputProps?: any;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  multiline?: boolean;
  defaultValue?: string;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties | undefined;
  dir?: 'rtl';
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
  clearValue?: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  preview?: boolean;
};

const InputField: React.FC<TextFieldProps> = ({
  label,
  helperText,
  preview = false,
  value,
  variant,
  maxLength,
  readOnly,
  ...props
}) => {
  const clearValue = () => {
    props?.clearValue && props.clearValue(props?.name || '', '');
  };

  return (
    <TextField
      {...props}
      variant={preview ? 'standard' : variant}
      value={value}
      label={<Trans>{label}</Trans>}
      inputProps={{
        maxLength: maxLength || 1000,
      }}
      InputProps={{
        readOnly: preview ? true : readOnly,
        endAdornment: (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {value && props?.clearValue && !preview ? (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={clearValue} edge="end">
                  <CancelIcon />
                </IconButton>
              </InputAdornment>
            ) : null}
          </Box>
        ),
      }}
      helperText={<Trans>{helperText}</Trans>}
    ></TextField>
  );
};

export default InputField;
