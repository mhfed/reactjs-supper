/*
 * Created on Fri Jan 06 2023
 *
 * Autocomplete field with dynamic data from async request
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import httpRequest from 'services/httpRequest';
import makeStyles from '@mui/styles/makeStyles';
import { Trans } from 'react-i18next';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { LooseObject } from 'models/ICommon';
import Box from '@mui/material/Box';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  chipContainer: {
    '& .MuiChip-root': {
      border: 'none',
    },
    '& .MuiChip-label': {
      color: theme.palette.secondary.main,
    },
  },
  previewContainer: {
    '& input': {
      display: 'none',
    },
    '& .MuiChip-root': {
      margin: 3,
    },
  },
}));

type AutocompleteFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  error?: boolean;
  value?: any;
  helperText?: string;
  isOptionEqualToValue?: (option: LooseObject, value: LooseObject) => boolean;
  required?: boolean;
  preview?: boolean;
  onChange?: (e: any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  options?: LooseObject[];
  getOptionLabel?: (opt: LooseObject) => string;
  getChipLabel?: (opt: LooseObject) => string;
  getUrl: (text: string) => string;
  formatData?: (data: any) => any[];
};

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
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
  preview,
  getOptionLabel,
  getChipLabel,
  getUrl,
  formatData,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState(initialData || []);
  const timeoutId = React.useRef<number | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

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
        setLoading(true);
        const response: any = await httpRequest.get(getUrl(searchText));
        setLoading(false);
        if (formatData) return setOptions(formatData(response));
        setOptions(response?.data || response || []);
      } else {
        return;
      }
    } catch (error) {
      setLoading(false);
      console.error('AutocompleteField getData error: ', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, options: LooseObject[], reason: string) => {
    onChange?.(options);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searcText = e.target.value.trim();
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
    <FormControl
      required={preview ? false : required}
      fullWidth
      error={error}
      className={clsx(preview && classes.previewContainer)}
    >
      <Autocomplete
        loading={loading}
        noOptionsText={inputRef.current?.value ? <Trans>lang_no_matching_records_found</Trans> : ''}
        loadingText={
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color="secondary" size={24} />
          </Box>
        }
        multiple
        disableClearable
        freeSolo={!!inputRef.current?.value && inputRef.current?.value?.length > 2 ? false : true}
        id={id}
        onBlur={onBlur}
        value={value}
        defaultValue={[]}
        onChange={handleChange}
        options={options}
        getOptionLabel={_getOptionLabel}
        isOptionEqualToValue={_isOptionEqualToValue}
        renderTags={(value: readonly string[], getTagProps) => (
          <Box>
            {value?.length &&
              value?.map((option: any, index: number) =>
                preview ? (
                  <Chip
                    sx={{ mb: '1px' }}
                    variant="outlined"
                    label={_getChipLabel(option)}
                    disabled={true}
                    deleteIcon={<></>}
                    title={_getOptionLabel(option)}
                    key={`autocomplete_chip_${id}_${index}`}
                  />
                ) : (
                  <Chip
                    variant="outlined"
                    label={_getChipLabel(option)}
                    {...getTagProps({ index })}
                    color="secondary"
                    className={clsx(classes.chipContainer, 'customTitle')}
                    title={_getOptionLabel(option)}
                    key={`autocomplete_chip_${id}_${index}`}
                  />
                ),
              )}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            required={preview ? false : required}
            {...params}
            inputRef={inputRef}
            variant={preview ? 'standard' : 'outlined'}
            value={value}
            label={<Trans>{label}</Trans>}
            error={error}
            onChange={handleTextChange}
            InputProps={{
              ...params.InputProps,
              endAdornment: null,
            }}
          ></TextField>
        )}
      />
      {_renderHelperText()}
    </FormControl>
  );
};

export default AutocompleteField;
