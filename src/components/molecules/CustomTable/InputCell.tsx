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
    '& > div:first-child': {
      width: '100%',
    },
  },
}));

type DropdownCellProps = {
  id: string;
  value: string | number;
  onChange: (value: string | number) => void;
  classeName: any;
};

const InputCell: React.FC<DropdownCellProps> = ({ id, value: initialValue, onChange, classeName }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.title = e.target.value;
    onChange(e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className={classes.container}>
      <TextField
        title={value + ''}
        className={classeName}
        variant="outlined"
        fullWidth
        value={value || ''}
        onChange={handleChange}
      />
    </div>
  );
};

export default InputCell;
