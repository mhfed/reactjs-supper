/*
 * Created on Fri Jan 06 2023
 *
 * Dropdown cell for custom table
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Trans } from 'react-i18next';
import { DropdownOption } from 'models/ICommon';

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
  options: DropdownOption[];
  onChange: (value: string | number) => void;
  style?: any;
};

const DropdownCell: React.FC<DropdownCellProps> = ({ id, value: initialValue, onChange, options = [], style = {} }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(initialValue);

  /**
   * Update dropdown selected value when value or field id changed
   */
  React.useEffect(() => {
    setValue(initialValue);
  }, [id, initialValue]);

  /**
   * Handle dropdown change event, set value and call table cell onchange
   * @param e Select change event
   */
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className={classes.container}>
      <Select value={value} onChange={handleChange} displayEmpty sx={style}>
        {options.map((option, index) => (
          <MenuItem value={option.value} key={`MenuItem_${index}`}>
            <Trans>{option.label}</Trans>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default DropdownCell;
