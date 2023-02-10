/*
 * Created on Fri Jan 06 2023
 *
 * Dropdown header cell for custom table, use for apply all column case
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
    justifyContent: 'space-between',
    width: '100%',
    '& .MuiSelect-select': {
      paddingLeft: 6,
    },
    '& .MuiInputBase-root': {
      '&.Mui-focused': {
        '& svg': {
          fill: theme.palette.primary.main,
        },
      },
      backgroundColor: 'transparent',
    },
    '& fieldset': {
      borderColor: theme.palette.divider,
      borderWidth: 2,
    },
  },
  label: {
    flex: 1,
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

  /**
   * Handle select change at header cell for apply all column
   * @param e select change event
   */
  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className={classes.container}>
      <div className={classes.label}>
        {' '}
        <Trans>{label}</Trans>
      </div>
      <Select
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        }}
        value={value}
        onChange={handleChange}
        displayEmpty
        sx={style}
        renderValue={() => ''}
      >
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
