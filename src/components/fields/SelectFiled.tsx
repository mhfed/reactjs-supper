import React from 'react';
import { Trans } from 'react-i18next';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormikErrors } from 'formik';

type Options = {
  label: string;
  value: string;
};
type SelectFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  autoWidth?: boolean;
  error?: boolean;
  value?: string | number;
  helperText?: string | boolean | undefined | FormikErrors<any>[] | FormikErrors<any> | string[];
  fullWidth?: boolean;
  sx?: any;
  inputProps?: any;
  required?: boolean;
  onChange?: (e: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  options?: Array<Options>;
  // multiple?: boolean;
};

const SelectField: React.FC<SelectFieldProps> = ({ label, helperText, value, ...props }) => {
  const [val, setVal] = React.useState('');

  function _renderHelperText() {
    if (props.error) {
      return (
        <FormHelperText error>
          <Trans>{helperText}</Trans>
        </FormHelperText>
      );
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    props.onChange?.(event.target.value);
    setVal(event.target.value);
    console.log(event);
  };
  return (
    <FormControl required sx={{ minWidth: 120, width: props.fullWidth ? '100%' : '' }}>
      <InputLabel id={props.id}>
        <Trans>{label}</Trans>
      </InputLabel>
      <Select
        {...props}
        labelId={props.id}
        id={props.id}
        label={label}
        value={val}
        onChange={handleChange}
        // multiple={!!props.multiple}
      >
        {props.options?.map((e, i) => {
          return (
            <MenuItem key={i} value={e.value}>
              <Trans>{e.label}</Trans>
            </MenuItem>
          );
        })}
      </Select>
      {_renderHelperText()}
    </FormControl>
  );
};

export default SelectField;
