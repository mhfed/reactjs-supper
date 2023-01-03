import React from 'react';
import TextField from '@mui/material/TextField';
import { Trans, useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
type TextFieldProps = {
  label?: string;
  value?: string;
  sx?: any;
  variant?: 'filled' | 'outlined' | 'standard';
  multiline?: boolean;
  autoFocus?: boolean;
  rows?: number;
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
const PreviewField: React.FC<TextFieldProps> = ({ label, value, ...props }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <TextField
      className={classes.preview}
      variant="standard"
      {...props}
      value={value ? t(value) : '--'}
      fullWidth
      label={<Trans>{label}</Trans>}
    ></TextField>
  );
};

export default PreviewField;
