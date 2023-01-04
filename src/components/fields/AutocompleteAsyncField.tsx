import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { FormikErrors } from 'formik';
import httpRequest from 'services/httpRequest';
import { Trans } from 'react-i18next';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { getListSubscriberSegmenttUrl } from 'apis/request.url';

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
  value?: string | number;
  setFieldValue?: any;
  helperText?: string | boolean | undefined | FormikErrors<any>[] | FormikErrors<any> | string[];
  fullWidth?: boolean;
  sx?: any;
  inputProps?: any;
  required?: boolean;
  onChange?: (e: any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  options?: Array<Options>;
  // multiple?: boolean;
};

const AutocompleteAsyncField: React.FC<AutocompleteAsyncFieldProps> = ({ label, helperText, value, setFieldValue, ...props }) => {
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
          pageId: 1,
          pageSize: 50,
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, value: any) => {
    console.log('e.target', e.target.value);
    props.onChange?.(value);
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('character in autocomplete box is:', e.target.value);
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
        id={props.id}
        onChange={handleChange}
        options={options}
        getOptionLabel={(option) => option.username + ' (' + option.site_name + ')'}
        // renderOption={(props, option, { selected }) => <li {...props}>{option.title}</li>}
        renderInput={(params) => (
          <TextField
            required={props.required}
            {...params}
            label="Subscribers"
            error={props.error}
            value={value}
            onChange={handleTextChange}
          ></TextField>
        )}
      />
      {props.error && _renderHelperText()}
    </FormControl>
  );
};

export default AutocompleteAsyncField;
