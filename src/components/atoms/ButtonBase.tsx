import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { isConnectingSelector } from 'selectors/app.selector';
import { useSelector } from 'react-redux';

type ButtonBaseProps = ButtonProps & {
  network?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
};

const ButtonBase: React.FC<ButtonBaseProps> = ({ network = false, children, isLoading = false, disabled, ...props }) => {
  const isConnecting = useSelector(isConnectingSelector);

  return (
    <Button {...props} disabled={disabled || (network && isConnecting)}>
      {children}
      {isLoading && <CircularProgress color="secondary" size={24} sx={{ position: 'absolute' }} />}
    </Button>
  );
};

export default ButtonBase;
