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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    '& > div:last-child': {
      width: 'fit-content',
    },
  },
}));

type DropdownHeaderCellProps = {
  id: string;
  label?: string;
  options: DropdownOption[];
  onChange: (value: string | number) => void;
  style?: any;
};

const DropdownHeaderCell: React.FC<DropdownHeaderCellProps> = ({ id, onChange, options = [], style = {}, label }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState<any>('');

  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className={classes.container}>
      <Trans>{label}</Trans>
      <Select value={value} onChange={handleChange} displayEmpty sx={style} renderValue={() => ''}>
        {options.map((option, index) => (
          <MenuItem value={option.value} key={`MenuItem_${index}`}>
            <Trans>{option.label}</Trans>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default DropdownHeaderCell;
