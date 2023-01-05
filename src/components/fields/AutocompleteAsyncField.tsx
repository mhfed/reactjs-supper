import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { FormikErrors } from 'formik';
import httpRequest from 'services/httpRequest';
import { Trans } from 'react-i18next';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { getListSubscriberSegmenttUrl } from 'apis/request.url';
import { LooseObject } from 'models/ICommon';

type Options = {
  label: string;
  value: string;
};
type AutocompleteAsyncFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  autoWidth?: boolean;
  error?: boolean;
  value?: any;
  setFieldValue?: any;
  helperText?: string | boolean | undefined | FormikErrors<any>[] | FormikErrors<any> | string[];
  fullWidth?: boolean;
  sx?: any;
  isOptionEqualToValue?: (option: LooseObject, value: LooseObject) => boolean;
  getOptionValue?: any;
  inputProps?: any;
  required?: boolean;
  onChange?: (e: any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  options?: Array<Options>;
  defaultValue?: any;
  // multiple?: boolean;
};

const AutocompleteAsyncField: React.FC<AutocompleteAsyncFieldProps> = ({
  isOptionEqualToValue,
  label,
  helperText,
  value,
  setFieldValue,
  ...props
}) => {
  const [options, setOptions] = React.useState([]);
  const timeoutId = React.useRef<number | null>(null);

  function _renderHelperText() {
    if (props.error) {
      return (
        <FormHelperText error>
          <span style={{ marginTop: '3px' }}>
            <Trans>{helperText}</Trans>
          </span>
        </FormHelperText>
      );
    }
  }
  const getData = async (SearchKey: string) => {
    try {
      if (SearchKey.length < 2) return;
      const response: any = await httpRequest.get(
        getListSubscriberSegmenttUrl({
          page: 1,
          rowsPerPage: 50,
          searchText: SearchKey,
        }),
      );
      if (!response.data) {
        setOptions([]);
      } else {
        setOptions(response.data);
      }
    } catch (error) {
      console.log('Search error:', error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, options: LooseObject[], reason: string) => {
    props.onChange?.(options);
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    timeoutId.current && window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      getData(e.target.value);
    }, 400);
  };

  return (
    <FormControl required sx={{ minWidth: 120, width: props.fullWidth ? '100%' : '' }}>
      <Autocomplete
        onBlur={props.onBlur}
        multiple
        disableClearable
        freeSolo
        id={props.id}
        value={value}
        onChange={handleChange}
        options={options}
        defaultValue={props.defaultValue || []}
        getOptionLabel={(option) => option.username}
        isOptionEqualToValue={isOptionEqualToValue}
        renderOption={(props, option) => <li {...props}>{option.username + ' (' + option.site_name + ')'}</li>}
        renderInput={(params) => (
          <TextField
            required={props.required}
            {...params}
            ref={params.InputProps.ref}
            label={<Trans>{label}</Trans>}
            error={props.error}
            onChange={handleTextChange}
          ></TextField>
        )}
      />
      {props.error && _renderHelperText()}
    </FormControl>
  );
};

export default AutocompleteAsyncField;
