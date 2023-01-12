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
  style?: React.CSSProperties | undefined;
  dir?: 'rtl';
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
  clearValue?: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  preview?: boolean;
};

const InputField: React.FC<TextFieldProps> = ({ label, helperText, preview = false, variant, InputProps, ...props }) => {
  const clearValue = () => {
    props?.clearValue && props.clearValue(props?.name || '', '');
  };

  return (
    <TextField
      {...props}
      variant={preview ? 'standard' : variant}
      label={<Trans>{label}</Trans>}
      InputProps={{
        ...(InputProps || {}),
        readOnly: preview ? true : InputProps?.readOnly,
        endAdornment: (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {props?.value && props?.clearValue && !preview ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  sx={{ fontSize: 16, color: '#758695' }}
                  onClick={clearValue}
                  edge="end"
                >
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
