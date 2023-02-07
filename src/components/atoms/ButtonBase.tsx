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
  debounce?: boolean;
  isLoading?: boolean;
  scrollToTop?: boolean;
  children?: React.ReactNode;
};

const ButtonBase: React.FC<ButtonBaseProps> = ({
  network = false,
  children,
  isLoading = false,
  debounce = true,
  disabled,
  sx = {},
  onClick,
  scrollToTop,
  ...props
}) => {
  const isConnecting = useSelector(isConnectingSelector);
  const timeoutId = React.useRef<number>();

  /**
   * Handle onclick and scroll to top for case change step screen
   * @param e click event
   */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (debounce) {
      timeoutId.current && window.clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        scrollToTop && window.scrollTo(0, 0);
        onClick?.(e);
      }, process.env.REACT_APP_DEBOUNCE_TIME);
    } else {
      scrollToTop && window.scrollTo(0, 0);
      onClick?.(e);
    }
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      sx={{ whiteSpace: 'nowrap', ...sx }}
      disabled={isLoading || disabled || (network && isConnecting)}
    >
      {children}
      {isLoading && <CircularProgress color="secondary" size={24} sx={{ position: 'absolute' }} />}
    </Button>
  );
};

export default ButtonBase;
