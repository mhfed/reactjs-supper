import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Trans } from 'react-i18next';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';
import { getResetUserPasswordUrl } from 'apis/request.url';
import httpRequest from 'services/httpRequest';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
}));

type ConfirmEditUserModalProps = {
  userLoginId: string;
  onClose: () => void;
};

const ConfirmEditUserModal: React.FC<ConfirmEditUserModalProps> = ({ userLoginId, onClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await httpRequest.post(getResetUserPasswordUrl(), {
        data: { user_login_id: userLoginId, type: 'forgot_password' },
      });
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_sending_reset_password_success',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      onClose();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  };

  return (
    <div className={classes.container}>
      <Typography sx={{ mb: 1 }}>
        <Trans values={{ user: userLoginId }} components={[<strong key="strong" />]}>
          lang_confirm_reset_password_for_user
        </Trans>
      </Typography>
      <div className={classes.btnContainer}>
        <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>
          <Trans>lang_cancel</Trans>
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          <Trans>lang_confirm</Trans>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmEditUserModal;
