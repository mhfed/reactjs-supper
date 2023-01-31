/*
 * Created on Fri Jan 06 2023
 *
 * Show multiple chip cell for custom table
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { Trans } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  collapseBtn: {
    justifyContent: 'flex-start',
    border: 'none',
    '& .MuiChip-label': {
      paddingLeft: 0,
    },
  },
}));

type CustomStackProps = {
  data: string[];
};

const CustomChip: React.FC<CustomStackProps> = ({ data = [] }) => {
  const classes = useStyles();
  const [show, setShow] = React.useState(false);

  /**
   * Handle show more or hide cell data
   */
  const handleShow = () => {
    setShow((old) => !old);
  };

  // if data length greater than 3 display show more button
  const isLargeData = data.length > 3;
  let displayData = [...data];
  if (isLargeData && !show) {
    displayData = data.slice(0, 3);
  }

  return (
    <Stack direction="column">
      {displayData.map((e: string) => (
        <Typography key={e}>
          <Trans>{e}</Trans>
        </Typography>
      ))}
      {isLargeData && (
        <Chip
          className={classes.collapseBtn}
          key={'custom_Stack_expand_collapse_icon'}
          onClick={handleShow}
          variant="outlined"
          color="primary"
          label={<Trans>{show ? 'lang_hide' : 'lang_show_more'}</Trans>}
        />
      )}
    </Stack>
  );
};

export default CustomChip;
