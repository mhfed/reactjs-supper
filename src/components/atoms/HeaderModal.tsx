/*
 * Created on Mon Jan 30 2023
 *
 * Header for all modal to use common style
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Trans } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(1),
    zIndex: 99,
    background: theme.palette.background.headerModal,
    '& h6': {
      fontWeight: 700,
    },
  },
  iconClose: {
    cursor: 'pointer',
  },
}));

type HeaderModalProps = {
  title: string;
  onClose?: () => void;
};

const HeaderModal: React.FC<HeaderModalProps> = ({ title, onClose }) => {
  const classes = useStyles();

  return (
    <Box className={classes.header}>
      <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
        <Trans>{title}</Trans>
      </Typography>
      {onClose && <CloseIcon className={classes.iconClose} onClick={onClose} />}
    </Box>
  );
};

export default HeaderModal;
