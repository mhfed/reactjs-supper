/*
 * Created on Fri Jan 06 2023
 *
 * Preview field for preview mode
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import TextField from '@mui/material/TextField';
import { Trans, useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';

type Options = {
  label: string;
  value: string | number;
};
type PreviewFieldProps = {
  label?: string;
  value?: string | number;
  sx?: any;
  variant?: 'filled' | 'outlined' | 'standard';
  multiline?: boolean;
  autoFocus?: boolean;
  rows?: number;
  options?: Array<Options>;
  disabled?: boolean;
  required?: boolean;
  textTransform?: string;
};

const useStyles = makeStyles((theme) => ({
  preview: {
    pointerEvents: 'none',
    position: 'relative',
  },
}));
const PreviewField: React.FC<PreviewFieldProps> = ({ label, value, options, textTransform, ...props }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const val = options ? options.find((o) => o.value.toString() === value?.toString())?.label : value;
  let text = value;
  if (options) {
    text = val ? t(val.toString()).toUpperCase() : '';
  }
  return (
    <TextField
      className={classes.preview}
      variant={'standard'}
      {...props}
      value={text || '--'}
      fullWidth
      label={<Trans>{label}</Trans>}
    ></TextField>
  );
};

export default PreviewField;
