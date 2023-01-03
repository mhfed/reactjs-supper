import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Trans } from 'react-i18next';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';
import { getUserDetailUrl } from 'apis/request.url';
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

type ConfirmForceChangePasswordProps = {
  userId: string;
  userLoginId: string;
  onClose: () => void;
  isChangingPassword: boolean | number;
};

const ConfirmForceChangePassword: React.FC<ConfirmForceChangePasswordProps> = ({
  userId,
  userLoginId,
  isChangingPassword,
  onClose,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await httpRequest.put(getUserDetailUrl(userId), {
        data: { change_password: isChangingPassword ? 0 : 1 },
      });
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_force_to_change_password_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      onClose();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_force_to_change_password_unsuccessfully',
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
          {isChangingPassword ? 'lang_confirm_cancel_force_change_password' : 'lang_confirm_force_change_password'}
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

export default ConfirmForceChangePassword;
