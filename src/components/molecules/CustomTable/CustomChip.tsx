/*
 * Created on Fri Jan 06 2023
 *
 * Show multiple chip cell for custom table
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Chip from '@mui/material/Chip';
import { Trans } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
    minWidth: 384,
  },
  collapseBtn: {
    border: 'none',
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

  // if data length greater than 9 display show more button
  const isLargeData = data.length > 9;
  let displayData = [...data];
  if (isLargeData && !show) {
    displayData = data.slice(0, 9);
  }

  return (
    <div className={classes.container}>
      {displayData.map((e: string, i: number) => (
        <Chip key={`custom_chip_${e}_${i}`} label={e} />
      ))}
      {isLargeData && (
        <Chip
          className={classes.collapseBtn}
          key={`custom_chip_expand_collapse_icon`}
          onClick={handleShow}
          variant="outlined"
          color="primary"
          label={<Trans>{show ? 'lang_hide' : 'lang_show_more'}</Trans>}
        />
      )}
    </div>
  );
};

export default CustomChip;
