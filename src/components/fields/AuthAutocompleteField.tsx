/*
 * Created on Fri Jan 06 2023
 *
 * Autocomplete field with iress auth required
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
import { iressLogout } from 'actions/auth.action';
import { useGlobalModalContext } from 'containers/Modal';
import IressSignIn from 'features/IressAuth';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import authService from 'services/authService';

const useStyles = makeStyles((theme) => ({
  container: {
    '& .MuiAutocomplete-inputRoot': {
      paddingRight: `${theme.spacing(1)} !important`,
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

type AuthAutocompleteFieldProps = {
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

const AuthAutocompleteField: React.FC<AuthAutocompleteFieldProps> = ({
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
  const { showSubModal, hideSubModal } = useGlobalModalContext();

  /**
   * Get options data with text search base on url props.
   * @param searchText search text in autocomplete
   */
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
      if (authService.checkIressSessionLogout(error.errorCode)) {
        dispatch(iressLogout());
        showSubModal({
          title: 'lang_sign_in',
          component: IressSignIn,
          styleModal: { minWidth: 440 },
          props: {
            title: 'lang_please_sign_in_to_select_security_code',
            onSubmit: () => {
              hideSubModal();
            },
          },
        });
      } else {
        setLoading(false);
        console.error('AutocompleteField getData error: ', error);
      }
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

  /**
   * Open iress auth login show confirm logout popup
   */
  const handleIressAuth = () => {
    if (iressToken) {
      showSubModal({
        title: 'lang_confirm',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_logout',
          emailConfirm: false,
          onSubmit: () => {
            dispatch(iressLogout());
            hideSubModal();
          },
        },
      });
    } else {
      showSubModal({
        title: 'lang_sign_in',
        component: IressSignIn,
        styleModal: { minWidth: 440 },
        props: {
          title: 'lang_please_sign_in_to_select_security_code',
          onSubmit: () => {
            hideSubModal();
          },
        },
      });
    }
  };

  return (
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
                  color="secondary"
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
