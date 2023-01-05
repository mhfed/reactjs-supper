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
  value: string | number;
  options: DropdownOption[];
  onChange: (value: string | number) => void;
};

const DropdownCell: React.FC<DropdownCellProps> = ({ value: initialValue, onChange, options = [] }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className={classes.container}>
      <Select value={value} onChange={handleChange} displayEmpty>
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
