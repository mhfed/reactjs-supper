import React from 'react';

// material cores
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// material icons
import WarningIcon from '@mui/icons-material/Warning';

// styles
import useStyles from './styles';

export type IStyles = {
  backgroundColor?: string;
};

type IProps = IStyles & {
  open: boolean;
  type?: string;
  textSubmit?: string | React.ReactNode;
  textCancel?: string | React.ReactNode;
  alertTitle: React.ReactNode | string;
  alertContent: React.ReactNode | string;
  onClose: () => void;
  onSubmit: () => void;
  idBtnCancel?: string;
  idBtnSubmit?: string;
};

const AlertConfirm = ({
  open,
  type = 'warning',
  textSubmit = 'Yes',
  textCancel = 'Cancel',
  alertTitle,
  alertContent,
  onClose,
  onSubmit,
  idBtnCancel = 'button-cancel-alert',
  idBtnSubmit = 'button-submit-alert',
  ...styles
}: IProps) => {
  const classes = useStyles(styles)();

  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
      <div className={classes.title}>
        {type === 'warning' && <WarningIcon />}
        {alertTitle}
      </div>

      <DialogContent id="alert-dialog-content">{alertContent}</DialogContent>
      <DialogActions>
        <Button id={idBtnCancel} onClick={onClose}>
          {textCancel}
        </Button>
        <Button id={idBtnSubmit} onClick={onSubmit} color="primary" autoFocus>
          {textSubmit}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertConfirm;
