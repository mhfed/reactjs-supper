import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { FormikErrors, useFormikContext } from 'formik';
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
  trigger?: any;
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
  defaultValue?: any;
  // multiple?: boolean;
};

const AutocompleteAsyncField: React.FC<AutocompleteAsyncFieldProps> = ({ label, helperText, value, setFieldValue, ...props }) => {
  const [options, setOptions] = React.useState([]);
  const timeoutId = React.useRef<number | null>(null);
  const defaultArray = props.defaultValue ? props.defaultValue : [];

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
        setOptions(response.data.concat(topFilms));
      }
      console.log('mang gia lap la:', options);
    } catch (error) {
      console.log('Search error:', error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, value: any) => {
    props.onChange?.(value);
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
        key={props.trigger}
        onBlur={props.onBlur}
        multiple
        disableClearable
        freeSolo
        id={props.id}
        onChange={handleChange}
        options={topFilms}
        defaultValue={defaultArray}
        getOptionLabel={(option) => option.username}
        renderOption={(props, option, { selected }) => <li {...props}>{option.username + ' (' + option.site_name + ')'}</li>}
        renderInput={(params) => (
          <TextField
            required={props.required}
            {...params}
            ref={params.InputProps.ref}
            label="Subscribers"
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
const topFilms = [
  { username: 'The Shawshank Redemption', site_name: 1994 },
  { username: 'The Godfather', site_name: 1972 },
  { username: 'The Godfather: Part II', site_name: 1974 },
  { username: 'The Dark Knight', site_name: 2008 },
  { username: '12 Angry Men', site_name: 1957 },
  { username: "Schindler's List", site_name: 1993 },
  { username: 'Pulp Fiction', site_name: 1994 },
  {
    username: 'The Lord of the Rings: The Return of the King',
    site_name: 2003,
  },
  { username: 'The Good, the Bad and the Ugly', site_name: 1966 },
];
