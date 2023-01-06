import React from 'react';
import { TextField, CircularProgress, ClickAwayListener } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete'
import httpRequest from 'services/httpRequest';
import { getSearchSegment } from 'apis/request.url';

export default function SearchAsyncField(props: any) {
  const { label, variant = 'outlined', ...rest } = props;
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const timeoutId = React.useRef<any>()

  const helperText = rest?.helperText || false;

  React.useEffect(() => {
    return () => {
      timeoutId.current && clearTimeout(timeoutId.current)
    }
  }, [])

  function _renderHelperText() {
    if (helperText && rest?.error && rest?.touched) {
      return helperText;
    }
  }

  const getListSuggestAddress = (text = '') => {
    if (text.length < 2) return
    setLoading(true)
    httpRequest.get(getSearchSegment(`?search=${text}`)).then((res: any) => {
      setOptions(res.data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  function onChangeText(e: any) {
    if (!open) setOpen(true)
    const text = e.target.value || ''
    timeoutId.current && clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => getListSuggestAddress(text), 500)
  }

  function _onChange(event: any, option: any, reason: any) {
    if (reason === 'selectOption') {
      option.isValid = true
      rest.onChange(option || '');
    }
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Autocomplete
          style={{ flex: 1 }}
          // {...field}
          {...rest}
          onChange={_onChange}
          disableClearable
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          filterOptions={x => x}
          getOptionLabel={(option: any) => option?.segment_id || ''}
          options={options}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              // {...field}
              {...rest}
              variant={variant}
              error={rest?.touched && rest?.error && true}
              helperText={_renderHelperText()}
              onChange={onChangeText}
              label={label}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          )}
        />
      </div>
    </ClickAwayListener>
  );
}