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
import { httpRequest } from 'services/initRequest';
import CancelIcon from '@mui/icons-material/Cancel';
import makeStyles from '@mui/styles/makeStyles';
import { Trans } from 'react-i18next';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { LooseObject } from 'models/ICommon';
import Box from '@mui/material/Box';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  container: {},
  customContainer: {
    '& .MuiInputBase-root': {
      display: 'flex',
      alignItems: 'flex-start',
      '& input': {
        paddingTop: '2px !important',
      },
    },
  },
  previewContainer: {
    '& input': {
      display: 'none',
    },
  },
  previewContainerVisible: {
    paddingBottom: 4,
    '& input': {
      visibility: 'hidden',
    },
  },
}));

type AutocompleteFieldProps = {
  label?: string;
  name?: string;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  value?: any;
  helperText?: string;
  isOptionEqualToValue?: (option: LooseObject, value: LooseObject) => boolean;
  required?: boolean;
  preview?: boolean;
  onChange?: (e: any) => void;
  onBlur?: () => void;
  options?: LooseObject[];
  InputProps?: LooseObject;
  getOptionLabel?: (opt: LooseObject) => string;
  getChipLabel?: (opt: LooseObject) => string;
  getUrl?: (text: string) => string;
  formatData?: (data: any) => any[];
  multiple?: boolean;
  disableClearable?: boolean;
  sizeInput?: 'small' | 'medium';
  defaultValue?: Array<any>;
  changeDisplayInput?: boolean;
  customSearch?: boolean;
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
  name,
  onChange,
  preview,
  getOptionLabel,
  getChipLabel,
  getUrl,
  formatData,
  InputProps = {},
  disabled = false,
  readOnly = false,
  multiple = true,
  disableClearable = true,
  sizeInput = 'medium',
  defaultValue = [],
  changeDisplayInput = false,
  customSearch,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState(initialData || []);
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
        const response: any = await httpRequest.get(getUrl(searchText));
        if (formatData) {
          setOptions(formatData(response));
        } else {
          setOptions(response?.data || response || []);
        }
        setLoading(false);
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, options: LooseObject[], reason: string) => {
    if (reason === 'removeOption') onBlur?.();
    onChange?.(options);
  };

  /**
   * Handle search text change with debounce
   * @param e input change event
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searcText = e.target.value.trim();
    if (searcText.length > 1) {
      timeoutId.current && window.clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        getData(searcText);
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

  /**
   * Choose class to change way to display input when previewing
   */

  const renderClasses = () => {
    if (!preview) return null;
    return changeDisplayInput ? classes.previewContainerVisible : classes.previewContainer;
  };

  return (
    <FormControl
      required={preview ? false : required}
      fullWidth
      error={error}
      className={clsx(customSearch ? classes.customContainer : classes.container, renderClasses())}
    >
      <Autocomplete
        filterOptions={(x) => x}
        loading={loading}
        noOptionsText={inputRef.current?.value ? <Trans>lang_no_matching_records_found</Trans> : ''}
        loadingText={
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color="secondary" size={24} />
          </Box>
        }
        disabled={disabled}
        readOnly={readOnly}
        multiple={multiple}
        disableClearable={disableClearable}
        // freeSolo={!!inputRef.current?.value && inputRef.current?.value?.length > 1 ? false : true}
        id={name}
        popupIcon={null}
        clearIcon={value || value?.length ? <CancelIcon style={{ width: 16, height: 16, cursor: 'pointer' }} /> : null}
        onBlur={onBlur}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        options={options}
        getOptionLabel={_getOptionLabel}
        isOptionEqualToValue={_isOptionEqualToValue}
        renderTags={(value: readonly string[], getTagProps) => (
          <Box>
            {value?.length &&
              value?.map((option: any, index: number) =>
                preview || disabled ? (
                  <Chip
                    {...getTagProps({ index })}
                    label={_getChipLabel(option)}
                    disabled={true}
                    deleteIcon={<></>}
                    title={_getOptionLabel(option)}
                    key={`autocomplete_chip_${name}_${index}`}
                  />
                ) : (
                  <Chip
                    variant="outlined"
                    label={_getChipLabel(option)}
                    {...getTagProps({ index })}
                    color="secondary"
                    className={'customTitle'}
                    title={_getOptionLabel(option)}
                    key={`autocomplete_chip_${name}_${index}`}
                  />
                ),
              )}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            required={preview ? false : required}
            {...params}
            id={name}
            size={sizeInput}
            inputRef={inputRef}
            variant={preview ? 'standard' : 'outlined'}
            value={value}
            label={<Trans>{label}</Trans>}
            error={error}
            onChange={handleTextChange}
            InputProps={{
              ...params.InputProps,
              ...InputProps,
            }}
          ></TextField>
        )}
      />
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

export default AutocompleteField;
