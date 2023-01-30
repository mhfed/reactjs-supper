/*
 * Created on Fri Jan 06 2023
 *
 * Select field to choose option
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { Trans } from 'react-i18next';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormikErrors } from 'formik';

type Options = {
  label: string;
  value: string | number;
};
type SelectFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  autoWidth?: boolean;
  error?: boolean;
  preview?: boolean;
  value?: string | number;
  helperText?: string | boolean | undefined | FormikErrors<any>[] | FormikErrors<any> | string[];
  fullWidth?: boolean;
  sx?: any;
  inputProps?: any;
  required?: boolean;
  textTransform?: string;
  onChange?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  options?: Array<Options>;
};

const SelectField: React.FC<SelectFieldProps> = ({
  preview,
  label,
  helperText,
  value,
  textTransform,
  required,
  error,
  ...props
}) => {
  return (
    <FormControl
      required={preview ? false : required}
      error={error}
      sx={{
        minWidth: 120,
        width: props.fullWidth ? '100%' : '',
      }}
    >
      <InputLabel id={props.id} sx={{ ml: preview ? '-1rem' : 0, mt: preview ? 1 : 0 }}>
        <Trans>{label}</Trans>
      </InputLabel>
      <Select
        {...props}
        labelId={props.id}
        required={preview ? false : required}
        variant={preview ? 'standard' : 'outlined'}
        id={props.id}
        label={label ? <Trans>{label}</Trans> : ''}
        value={value}
        readOnly={preview}
        sx={{ textTransform: textTransform ? textTransform : 'none' }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 228,
            },
          },
          disableScrollLock: true,
        }}
      >
        {props.options?.map((e, i) => {
          return (
            <MenuItem key={i} value={e.value} sx={{ textTransform: textTransform ? textTransform : 'none' }}>
              <Trans>{e.label}</Trans>
            </MenuItem>
          );
        })}
      </Select>
      {error && (
        <FormHelperText error>
          <Trans>{helperText}</Trans>
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectField;
