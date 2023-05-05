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
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  previewContainer: {
    '& .MuiSelect-icon': {
      display: 'none',
    },
  },
  customSelect: {
    '& .MuiInputBase-input': {
      backgroundColor: theme.palette.background.attachment,
      padding: '4px 8px',
    },
  },
}));

type Options = {
  label: string;
  value: string | number;
};
type SelectFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  autoWidth?: boolean;
  shrink?: boolean;
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
  customSelect?: boolean;
};

const SelectField: React.FC<SelectFieldProps> = ({
  preview,
  label,
  helperText,
  value,
  textTransform,
  required,
  error,
  shrink,
  customSelect,
  ...props
}) => {
  const classes = useStyles();

  const classesSelect = () => {
    if (preview) return classes.previewContainer;
    if (customSelect) return classes.customSelect;
    return '';
  };

  return (
    <FormControl
      className={clsx(classesSelect())}
      required={preview ? false : required}
      error={error}
      sx={{
        minWidth: 120,
        width: props.fullWidth ? '100%' : '',
      }}
    >
      {shrink === false ? (
        <></>
      ) : (
        <InputLabel id={props.id} sx={{ ml: preview ? '-1rem' : 0, mt: preview ? 1 : 0 }}>
          <Trans>{label}</Trans>
        </InputLabel>
      )}
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
