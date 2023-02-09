/*
 * Created on Fri Jan 06 2023
 *
 * Dropdown cell for custom table
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    minWidth: 200,
    '& input': {
      padding: theme.spacing(0.5, 1),
    },
    '& > div:first-child': {
      width: '100%',
    },
  },
}));

type DropdownCellProps = {
  id: string;
  value: string | number;
  onChange: (value: string | number) => void;
};

const InputCell: React.FC<DropdownCellProps> = ({ id, value: initialValue, onChange }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(initialValue);

  /**
   * Update new value for input cell when field id changed
   */
  React.useEffect(() => {
    setValue(initialValue);
  }, [id]);

  /**
   * Handle input cell change data
   * @param e input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.title = e.target.value;
    onChange(e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className={classes.container}>
      <TextField title={value + ''} variant="outlined" fullWidth value={value || ''} onChange={handleChange} />
    </div>
  );
};

export default InputCell;
