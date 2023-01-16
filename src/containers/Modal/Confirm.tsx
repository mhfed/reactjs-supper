/*
 * Created on Fri Jan 06 2023
 *
 * Simple confirm popup with confirm and cancel button
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import Button from 'components/atoms/ButtonBase';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Trans } from 'react-i18next';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(1, 2),
    background: theme.palette.background.headerModal,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

export type IStyles = {
  backgroundColor?: string;
};

type IProps = IStyles & {
  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
  textSubmit?: string | React.ReactNode;
  textCancel?: string | React.ReactNode;
  onClose?: () => void;
  onSubmit: () => void;
};

const IressSignOut = ({
  title = 'lang_confirm',
  textSubmit = 'lang_yes',
  textCancel = 'lang_no',
  content = '',
  onClose,
  onSubmit,
}: IProps) => {
  const classes = useStyles();

  return (
    <Paper>
      <Box className={classes.header}>
        <Typography fontWeight={700}>
          <Trans>{title}</Trans>
        </Typography>
      </Box>
      <Box className={classes.contentContainer}>
        <Typography sx={{ pt: 2, pb: 5 }}>
          <Trans>{content}</Trans>
        </Typography>
        <Box className={classes.btnContainer}>
          {onClose ? (
            <Button onClick={onClose} variant="outlined">
              <Trans>{textCancel}</Trans>
            </Button>
          ) : (
            <></>
          )}
          <Button network onClick={onSubmit} variant="contained" sx={{ ml: 2 }} autoFocus>
            <Trans>{textSubmit}</Trans>
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default IressSignOut;
