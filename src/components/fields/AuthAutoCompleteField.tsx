/*
 * Created on Fri Jan 06 2023
 *
 * Autocomplete field with dynamic data from async request
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import httpRequest from 'services/httpRequest';
import CircularProgress from '@mui/material/CircularProgress';
import makeStyles from '@mui/styles/makeStyles';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { LooseObject } from 'models/ICommon';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { Trans } from 'react-i18next';
import Button from 'components/atoms/ButtonBase';
import { useDispatch, useSelector } from 'react-redux';
import { iressTokenSelector, iressSitenameSelector } from 'selectors/auth.selector';
import ConfirmModal from 'components/molecules/ConfirmModal';
import { iressLogout } from 'actions/auth.action';
import { useGlobalModalContext } from 'containers/Modal';
import IressSignIn from 'features/IressAuth';

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
  getUrl?: (text: string) => string;
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
    '& .MuiAutocomplete-inputRoot': {
      paddingRight: theme.spacing(1),
    },
    '& input': {
      flex: 1,
    },
  },
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  const [loading, setLoading] = React.useState(false);
  const timeoutId = React.useRef<number | null>(null);
  const iressToken = useSelector(iressTokenSelector);
  const sitename = useSelector(iressSitenameSelector);
  const dispatch = useDispatch();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const { showSubModal, hideSubModal } = useGlobalModalContext();

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
        const { data: response } = await httpRequest.get(getUrl(searchText), {
          headers: { 'token-app': iressToken, 'site-name': sitename },
        });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, options: LooseObject[], reason: string) => {
    onChange?.(options);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    if (searchText.length > 1) {
      timeoutId.current && window.clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        getData(searchText);
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

  const handleIressAuth = () => {
    if (iressToken) {
      onShowLogoutConfirm();
    } else {
      showSubModal({
        title: 'lang_sign_in',
        component: IressSignIn,
        styleModal: { minWidth: 440 },
        props: {
          title: 'lang_confirm_cancel_text',
          isCancelPage: true,
          emailConfirm: false,
          onSubmit: () => {
            hideSubModal();
          },
        },
      });
    }
  };

  const onCloseLogout = () => {
    setLogoutModalOpen(false);
  };

  const onShowLogoutConfirm = () => {
    setLogoutModalOpen(true);
  };

  const onConfirmLogout = () => {
    dispatch(iressLogout());
  };

  return (
    <Box>
      <FormControl required fullWidth error={error} className={classes.container}>
        <Autocomplete
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
          disabled={!iressToken}
          id={id}
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
                    title={_getOptionLabel(option)}
                    key={`autocomplete_chip_${id}_${index}`}
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
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <Button network variant={iressToken ? 'text' : 'contained'} onClick={handleIressAuth}>
                      <Trans>{iressToken ? 'lang_sign_out' : 'lang_sign_in'}</Trans>
                    </Button>
                  </InputAdornment>
                ),
              }}
            ></TextField>
          )}
        />
        {_renderHelperText()}
      </FormControl>
      <ConfirmModal
        open={logoutModalOpen}
        alertTitle="lang_sign_out"
        alertContent="lang_confirm_logout"
        onClose={onCloseLogout}
        onSubmit={onConfirmLogout}
      />
    </Box>
  );
};

export default AutocompleteAsyncField;
