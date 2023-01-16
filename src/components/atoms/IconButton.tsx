/*
 * Created on Fri Jan 06 2023
 *
 * Base button with connection check
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 0,
    top: 0,
    background: theme.palette.background.closeIconBg,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    '& svg': {
      fill: theme.palette.background.closeIcon,
      color: theme.palette.background.closeIcon,
    },
  },
}));

type ButtonBaseProps = IconButtonProps & {
  children: React.ReactNode;
};

const ButtonBase: React.FC<ButtonBaseProps> = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <IconButton {...props}>{children}</IconButton>
    </div>
  );
};

export default ButtonBase;
