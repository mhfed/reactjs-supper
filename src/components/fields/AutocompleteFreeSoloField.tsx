/*
 * Created on Fri Jan 06 2023
 *
 * Autocomplete field with dynamic data from async request
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { FormikErrors } from 'formik';
import { Trans } from 'react-i18next';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { LooseObject } from 'models/ICommon';

type Options = {
  label: string;
  value: string;
};
type AutocompleteAsyncFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  autoWidth?: boolean;
  error?: boolean;
  value?: any;
  setFieldValue?: any;
  helperText?: string | boolean | undefined | FormikErrors<any>[] | FormikErrors<any> | string[];
  fullWidth?: boolean;
  sx?: any;
  isOptionEqualToValue?: (option: LooseObject, value: LooseObject) => boolean;
  getOptionValue?: any;
  inputProps?: any;
  required?: boolean;
  onChange?: (e: any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  options?: Array<Options>;
  defaultValue?: any;
  // multiple?: boolean;
};

const AutocompleteAsyncField: React.FC<AutocompleteAsyncFieldProps> = ({
  isOptionEqualToValue,
  label,
  helperText,
  value,
  setFieldValue,
  ...props
}) => {

  function _renderHelperText() {
    if (props.error) {
      return (
        <FormHelperText error>
          <span style={{ marginTop: '3px' }}>
            <Trans>{helperText}</Trans>
          </span>
        </FormHelperText>
      );
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, options: LooseObject[], reason: string) => {
    props.onChange?.(options);
  };

  return (
    <FormControl required sx={{ minWidth: 120, width: props.fullWidth ? '100%' : '' }} error={props.error}>
      <Autocomplete
        onBlur={props.onBlur}
        multiple
        // disableClearable
        freeSolo
        id={props.id}
        value={value}
        onChange={handleChange}
        options={[]}
        renderOption={(props, option) => <li {...props}>{option}</li>}
        renderInput={(params) => (
          <TextField
            required={props.required}
            {...params}
            value={value}
            label={<Trans>{label}</Trans>}
            error={props.error}
          ></TextField>
        )}
      />
      {props.error && _renderHelperText()}
    </FormControl>
  );
};

export default AutocompleteAsyncField;
