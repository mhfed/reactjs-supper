import React, { FC } from 'react';
import clsx from 'clsx';

import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

// material core
import IconButton from '@mui/material/IconButton';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

const useStyles = makeStyles((theme: Theme) => ({
  borderColor: {
    border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(206, 203, 203, 0.12)'}`,
  },
}));

type IProps = TooltipProps & {
  title: string | React.ReactNode;
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  isBorderColor?: boolean;
  id?: string;
};

const DefaultPage: FC<IProps> = ({ title, color = 'inherit', isBorderColor = false, children, onClick, id }) => {
  const classes = useStyles();

  return (
    <Tooltip title={title}>
      <IconButton id={id} color={color} onClick={onClick} className={clsx(isBorderColor && classes.borderColor)} size="large">
        {children}
      </IconButton>
    </Tooltip>
  );
};

export default DefaultPage;
