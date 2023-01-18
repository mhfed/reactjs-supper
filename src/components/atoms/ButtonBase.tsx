/*
 * Created on Fri Jan 06 2023
 *
 * Base button with connection check
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { isConnectingSelector } from 'selectors/app.selector';
import { useSelector } from 'react-redux';

type ButtonBaseProps = ButtonProps & {
  network?: boolean;
  isLoading?: boolean;
  scrollToTop?: boolean;
  children: React.ReactNode;
};

const ButtonBase: React.FC<ButtonBaseProps> = ({
  network = false,
  children,
  isLoading = false,
  disabled,
  sx = {},
  onClick,
  scrollToTop,
  ...props
}) => {
  const isConnecting = useSelector(isConnectingSelector);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    scrollToTop && window.scrollTo(0, 0);
    onClick?.(e);
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      sx={{ whiteSpace: 'nowrap', ...sx }}
      disabled={disabled || (network && isConnecting)}
    >
      {children}
      {isLoading && <CircularProgress color="secondary" size={24} sx={{ position: 'absolute' }} />}
    </Button>
  );
};

export default ButtonBase;
