/*
 * Created on Fri Jan 06 2023
 *
 * Linear progress bar for network connecting
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles } from '@mui/styles';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { isConnectingSelector } from 'selectors/app.selector';
import { Trans } from 'react-i18next';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '124px',
      height: 'fit-content',
      backgroundColor: theme.palette.primary.main,
      padding: '8px 16px',
      position: 'absolute',
      bottom: 16,
      right: 16,
      '& span': {
        display: 'block',
      },
      '& > * + *': {
        marginTop: theme.spacing(1),
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: 'transparent',
      pointerEvents: 'none',
      justifyContent: 'inherit',
      alignItems: 'inherit',
      color: '#fff',
    },
  }),
);

export default function NetworkLoading() {
  const classes = useStyles();
  const isConnecting = useSelector(isConnectingSelector);

  return (
    <Backdrop className={classes.backdrop} open={isConnecting}>
      <div className={classes.root}>
        <Typography>
          <Trans>lang_connecting</Trans>
        </Typography>
        <LinearProgress />
      </div>
    </Backdrop>
  );
}
