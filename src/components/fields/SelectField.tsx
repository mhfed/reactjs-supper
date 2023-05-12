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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const useStyles = makeStyles((theme) => ({
  previewContainer: {
    '& .MuiSelect-icon': {
      display: 'none',
    },
  },
  customSelect: {
    '& *': {
      fontSize: 14,
    },
    '& svg': {
      fontSize: 16,
    },
    '& .MuiInputBase-root': {
      '& .MuiInputBase-input': {
        backgroundColor: theme.palette.background.attachment,
        padding: '4px 8px',
      },
      '& fieldset': {
        borderColor: 'transparent',
      },
    },
    '& .MuiInputBase-root.Mui-focused': {
      '& .MuiInputBase-input': {
        backgroundColor: '#08D98D',
        color: theme.palette.common.white,
      },
      '& svg': {
        fill: 'white',
      },
      '& fieldset': {
        borderColor: 'transparent',
      },
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
  readOnly?: boolean;
  disabled?: boolean;
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
  readOnly,
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
      required={preview || readOnly ? false : required}
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
        required={preview || readOnly ? false : required}
        variant={preview && !readOnly ? 'standard' : 'outlined'}
        id={props.id}
        label={label ? <Trans>{label}</Trans> : ''}
        value={value}
        readOnly={preview || readOnly}
        sx={{ textTransform: textTransform ? textTransform : 'none' }}
        IconComponent={customSelect ? (props) => <ExpandMoreIcon {...props} /> : undefined}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 232,
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
