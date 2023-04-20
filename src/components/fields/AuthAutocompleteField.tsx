/*
 * Created on Fri Jan 06 2023
 *
 * Autocomplete field with iress auth required
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import { LooseObject } from 'models/ICommon';
import React from 'react';
import { Trans } from 'react-i18next';
import { httpRequest } from 'services/initRequest';

const useStyles = makeStyles((theme) => ({
  container: {
    '& .MuiAutocomplete-root': {
      display: 'flex',
      flex: 1,
    },
    '& .MuiAutocomplete-endAdornment': {
      display: 'none',
    },
    '& .MuiInputBase-root': {
      paddingRight: theme.spacing(10),
    },
    '& input': {
      flex: 1,
    },
  },
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    '& .MuiChip-root': {
      marginLeft: 0,
      marginRight: 4,
    },
  },
}));

type AuthAutocompleteFieldProps = {
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
  getUrl?: (text: string) => string;
};

const AuthAutocompleteField: React.FC<AuthAutocompleteFieldProps> = ({
  isOptionEqualToValue,
  label,
  required,
  helperText,
  value,
  error,
  name,
  onBlur,
  options: initialData,
  onChange,
  getOptionLabel,
  getChipLabel,
  getUrl,
}) => {
  const classes = useStyles();
  const [options, setOptions] = React.useState(initialData || []);
  const [loading, setLoading] = React.useState(false);
  const timeoutId = React.useRef<number | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Get options data with text search base on url props.
   * @param searchText search text in autocomplete
   */
  const getData = async (searchText: string) => {
    try {
      if (getUrl) {
        setLoading(true);
        const { data: response } = await httpRequest.get(getUrl(searchText));
        setLoading(false);
        setOptions(response || []);
      } else {
        return;
      }
    } catch (error) {
      setLoading(false);
      console.error('AutocompleteField getData error: ', error);
    }
  };

  /**
   * Change cuatocomplete selected option
   * @param e change event
   * @param options new options changed
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, options: LooseObject[]) => {
    onChange?.(options);
  };

  /**
   * Handle search text change with debounce
   * @param e input change event
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    if (searchText.length > 1) {
      timeoutId.current && window.clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        getData(searchText);
      }, process.env.REACT_APP_DEBOUNCE_TIME);
    }
  };

  /**
   * Get custom label for chip component
   * @param opt option data
   */
  const _getChipLabel = (opt: LooseObject) => {
    if (getChipLabel) {
      return getChipLabel(opt);
    } else if (getOptionLabel) {
      return getOptionLabel(opt);
    } else {
      return opt.label || '';
    }
  };

  /**
   * Get display label for option
   * @param opt option data
   */
  const _getOptionLabel = (opt: LooseObject) => {
    if (getOptionLabel) {
      return getOptionLabel(opt);
    } else {
      return opt.label || '';
    }
  };

  /**
   * Compare function to check selected options
   * @param option option data
   * @param selected selected data
   */
  const _isOptionEqualToValue = (option: LooseObject, selected: LooseObject) => {
    if (isOptionEqualToValue) {
      return isOptionEqualToValue(option, selected);
    } else {
      return option.value === selected.value;
    }
  };

  return (
    <FormControl required fullWidth error={error} className={classes.container}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <Autocomplete
          filterOptions={(x) => x}
          loading={loading}
          noOptionsText={inputRef.current?.value ? <Trans>lang_no_matching_records_found</Trans> : ''}
          loadingText={
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress color="secondary" size={24} />
            </Box>
          }
          onBlur={onBlur}
          multiple
          disableClearable
          id={name}
          value={value}
          defaultValue={[]}
          onChange={handleChange}
          options={options}
          clearOnBlur
          getOptionLabel={_getOptionLabel}
          isOptionEqualToValue={_isOptionEqualToValue}
          renderTags={(value: readonly string[], getTagProps) => (
            <Box className={classes.tagContainer}>
              {value.length &&
                value.map((option: any, index: number) => (
                  <Chip
                    variant="outlined"
                    label={_getChipLabel(option)}
                    {...getTagProps({ index })}
                    color="secondary"
                    title={_getOptionLabel(option)}
                    key={`autocomplete_chip_${name}_${index}`}
                  />
                ))}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              required={required}
              {...params}
              inputRef={inputRef}
              label={<Trans>{label}</Trans>}
              error={error}
              onChange={handleTextChange}
            ></TextField>
          )}
        />
      </div>
      {error && (
        <FormHelperText error>
          <span style={{ marginTop: '3px' }}>
            <Trans>{helperText}</Trans>
          </span>
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default AuthAutocompleteField;
