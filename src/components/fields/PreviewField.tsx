import React from 'react';
import TextField from '@mui/material/TextField';
import { Trans, useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
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
};

const useStyles = makeStyles((theme) => ({
  preview: {
    pointerEvents: 'none',
    position: 'relative',
    // '& ::before': {
    //   content: '',
    //   position: 'absolute',
    //   zIndex: 10,
    //   width: '100%',
    //   height: '100%',
    //   opacity: 0,
    // },
  },
}));
const PreviewField: React.FC<PreviewFieldProps> = ({ label, value, options, ...props }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const val = options ? options.find((o) => o.value === value)?.label : value;

  return (
    <TextField
      className={classes.preview}
      variant={'standard'}
      {...props}
      value={val ? t(val.toString()) : '--'}
      fullWidth
      label={
        <Typography variant="h4">
          <Trans>{label}</Trans>
        </Typography>
      }
    ></TextField>
  );
};

export default PreviewField;
