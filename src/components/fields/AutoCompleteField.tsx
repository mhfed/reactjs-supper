/*
 * Created on Fri Jan 06 2023
 *
 * Autocomplete field with dynamic data from async request
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import httpRequest from 'services/httpRequest';
import makeStyles from '@mui/styles/makeStyles';
import { Trans } from 'react-i18next';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import { LooseObject } from 'models/ICommon';

type AutocompleteAsyncFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  error?: boolean;
  value?: any;
  helperText?: string;
  isOptionEqualToValue?: (option: LooseObject, value: LooseObject) => boolean;
  required?: boolean;
  onChange?: (e: any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  options?: LooseObject[];
  getOptionLabel?: (opt: LooseObject) => string;
  getChipLabel?: (opt: LooseObject) => string;
  getUrl: (text: string) => string;
};
const useStyles = makeStyles((theme) => ({
  container: {
    '& .MuiChip-root': {
      background: theme.palette.background.other5,
      border: 'none',
    },
    '& .MuiChip-label': {
      color: theme.palette.secondary.main,
    },
  },
}));

const AutocompleteAsyncField: React.FC<AutocompleteAsyncFieldProps> = ({
  isOptionEqualToValue,
  label,
  required,
  helperText,
  value,
  error,
  onBlur,
  options: initialData,
  id,
  onChange,
  getOptionLabel,
  getChipLabel,
  getUrl,
}) => {
  const classes = useStyles();
  const [options, setOptions] = React.useState(initialData || []);
  const timeoutId = React.useRef<number | null>(null);

  function _renderHelperText() {
    if (error) {
      return (
        <FormHelperText error>
          <span style={{ marginTop: '3px' }}>
            <Trans>{helperText}</Trans>
          </span>
        </FormHelperText>
      );
    }
  }

  const getData = async (searchText: string) => {
    try {
      if (getUrl) {
        const response: any = await httpRequest.get(getUrl(searchText));
        setOptions(response || []);
      } else {
        return;
      }
    } catch (error) {
      console.error('AutocompleteField getData error: ', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, options: LooseObject[], reason: string) => {
    onChange?.(options);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searcText = e.target.value;
    if (searcText.length > 1) {
      timeoutId.current && window.clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        getData(searcText);
      }, process.env.REACT_APP_DEBOUNCE_TIME);
    }
  };

  const _getChipLabel = (opt: LooseObject) => {
    if (getChipLabel) {
      return getChipLabel(opt);
    } else if (getOptionLabel) {
      return getOptionLabel(opt);
    } else {
      return opt.label || '';
    }
  };

  const _getOptionLabel = (opt: LooseObject) => {
    if (getOptionLabel) {
      return getOptionLabel(opt);
    } else {
      return opt.label || '';
    }
  };

  const _isOptionEqualToValue = (option: LooseObject, selected: LooseObject) => {
    if (isOptionEqualToValue) {
      return isOptionEqualToValue(option, selected);
    } else {
      return option.value === selected.value;
    }
  };

  return (
    <FormControl required fullWidth error={error} className={classes.container}>
      <Autocomplete
        onBlur={onBlur}
        multiple
        disableClearable
        freeSolo
        id={id}
        value={value}
        defaultValue={[]}
        onChange={handleChange}
        options={options}
        clearOnBlur
        getOptionLabel={_getOptionLabel}
        isOptionEqualToValue={_isOptionEqualToValue}
        renderTags={(value: readonly string[], getTagProps) => (
          <Stack gap={16}>
            {value.map((option: any, index: number) => (
              <Chip
                variant="outlined"
                label={_getChipLabel(option)}
                {...getTagProps({ index })}
                title={_getOptionLabel(option)}
                key={`autocomplete_chip_${id}_${index}`}
              />
            ))}
          </Stack>
        )}
        renderInput={(params) => (
          <TextField
            required={required}
            {...params}
            value={value}
            label={<Trans>{label}</Trans>}
            error={error}
            onChange={handleTextChange}
          ></TextField>
        )}
      />
      {_renderHelperText()}
    </FormControl>
  );
};

export default AutocompleteAsyncField;
