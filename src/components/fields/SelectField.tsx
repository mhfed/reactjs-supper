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

const SelectField: React.FC<SelectFieldProps> = ({ label, helperText, value, textTransform, ...props }) => {
  function _renderHelperText() {
    if (props.error) {
      return (
        <FormHelperText error>
          <Trans>{helperText}</Trans>
        </FormHelperText>
      );
    }
  }

  return (
    <FormControl
      required
      error={props.error}
      sx={{
        minWidth: 120,
        width: props.fullWidth ? '100%' : '',
      }}
    >
      <InputLabel id={props.id}>
        <Trans>{label}</Trans>
      </InputLabel>
      <Select
        {...props}
        labelId={props.id}
        id={props.id}
        label={label}
        value={value}
        sx={{ textTransform: textTransform ? textTransform : 'none' }}
      >
        {props.options?.map((e, i) => {
          return (
            <MenuItem key={i} value={e.value} sx={{ textTransform: textTransform ? textTransform : 'none' }}>
              <Trans>{e.label}</Trans>
            </MenuItem>
          );
        })}
      </Select>
      {_renderHelperText()}
    </FormControl>
  );
};

export default SelectField;
