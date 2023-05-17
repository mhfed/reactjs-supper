/*
 * Created on Fri Jan 06 2023
 *
 * Simple confirm popup with confirm and cancel button
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import Button from 'components/atoms/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useStyles from './styles';
import { Trans } from 'react-i18next';
import { Typography } from '@mui/material';

export type IStyles = {
  backgroundColor?: string;
};

type IProps = IStyles & {
  open: boolean;
  type?: string;
  color?: 'error' | 'warning' | 'info' | 'primary' | 'inherit' | 'secondary';
  textSubmit?: string | React.ReactNode;
  textCancel?: string | React.ReactNode;
  alertTitle?: React.ReactNode | string;
  alertContent: React.ReactNode | string;
  timeRemaining?: string | number;
  onClose?: () => void;
  onSubmit: () => void;
};

const AlertConfirm = ({
  open,
  type = 'warning',
  textSubmit = 'lang_confirm',
  textCancel,
  alertTitle,
  alertContent,
  timeRemaining,
  color = 'primary',
  onClose,
  onSubmit,
  ...styles
}: IProps) => {
  const classes = useStyles(styles)();
  let minutesRemain = 15;
  if (timeRemaining) {
    const timeRemain = new Date(timeRemaining);
    minutesRemain = timeRemain.getMinutes();
  }
  return (
    <Dialog open={open} fullWidth maxWidth="sm" className={classes.container}>
      {alertTitle && (
        <DialogTitle>
          <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
            <Trans>{alertTitle}</Trans>
          </Typography>
        </DialogTitle>
      )}
      <DialogContent>
        <Typography>
          <Trans values={{ time: minutesRemain }} components={[<strong key="strong" />]}>
            {alertContent}
          </Trans>
        </Typography>
      </DialogContent>
      <DialogActions>
        {textCancel ? (
          <Button onClick={onClose} variant="outlined">
            <Trans>{textCancel}</Trans>
          </Button>
        ) : (
          <></>
        )}
        <Button network onClick={onSubmit} variant="contained" autoFocus color={color}>
          <Trans>{textSubmit}</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertConfirm;
