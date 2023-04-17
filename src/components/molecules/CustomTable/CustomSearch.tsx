/*
 * Created on Fri Jan 06 2023
 *
 * Custom toobar for custom table
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import makeStyles from '@mui/styles/makeStyles';
import CancelIcon from '@mui/icons-material/Cancel';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'components/atoms/ButtonBase';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ACTIONS } from './TableConstants';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .MuiTextField-root': {
      maxWidth: 336,
    },
    '& .MuiFormControl-root': {
      background: theme.palette.mode === 'dark' ? 'transparent' : 'white',
      borderRadius: 4,
      overflow: 'hidden',
    },
    '& input': {
      padding: theme.spacing(1),
    },
  },
  hidden: {
    visibility: 'hidden',
    width: 0,
  },
  listBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
type TypeButtonHeader = {
  label: string;
  onClick: () => void;
  variant?: 'contained' | 'outlined' | 'text' | string;
  isShow?: boolean;
  sx?: any;
  disabledEditMode?: boolean;
};

type CustomSearchProps = {
  searchText: string;
  handleSearch: (text: string, isCustomSearch?: boolean) => void;
  handleEdit: (action: string) => void;
  isEditMode: boolean;
  listBtn?: Array<TypeButtonHeader>;
  editable: boolean;
  isNodata: boolean;
  showSitename: boolean;
  customSearch: boolean;
};

const CustomSearch: React.FC<CustomSearchProps> = ({
  isNodata,
  editable,
  searchText = '',
  customSearch = false,
  handleSearch,
  handleEdit,
  isEditMode,
  listBtn,
  showSitename = false,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const searchAppNameInputRef = React.useRef<HTMLInputElement | null>(null);
  const timeoutId = React.useRef<number | null>(null);

  /**
   * Handle search new data with search text
   * @param e input change event
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>, isSearchAppname = false) => {
    const searchVal = e.target.value.trim();
    timeoutId.current && window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      if ((searchVal && searchVal.length >= 2) || e.target.value === '') handleSearch(searchVal, isSearchAppname);
    }, process.env.REACT_APP_DEBOUNCE_TIME);
  };

  /**
   * Clear search text and reset table data
   */
  const clearSearch = () => {
    inputRef.current && (inputRef.current.value = '');
    handleSearch('');
  };

  /**
   * Clear custom search text and reset table data
   */
  const clearCustomSearch = () => {
    searchAppNameInputRef.current && (searchAppNameInputRef.current.value = '');
    handleSearch('', true);
  };

  return (
    <div className={classes.container}>
      <div className={classes.rightContainer}>
        <div>
          {listBtn &&
            listBtn?.map(
              (btn: any, i) =>
                btn.isShow && (
                  <Button
                    key={i}
                    network
                    disabled={btn.disabledEditMode && isEditMode}
                    variant={btn.variant || 'contained'}
                    className={clsx(!btn.isShow && classes.hidden)}
                    sx={{ mr: 1 }}
                    color={btn.color || 'primary'}
                    onClick={btn.onClick}
                  >
                    <Trans>{btn.label}</Trans>
                  </Button>
                ),
            )}
        </div>
        <div>
          {isEditMode ? (
            <div className={clsx(!editable && classes.hidden)}>
              <Button variant="outlined" onClick={() => handleEdit(ACTIONS.CANCEL)} sx={{ mr: 1 }}>
                <Trans>lang_cancel</Trans>
              </Button>
              <Button network variant="contained" onClick={() => handleEdit(ACTIONS.SAVE)} sx={{ mr: 1 }}>
                <Trans>lang_save</Trans>
              </Button>
            </div>
          ) : (
            <Button
              network
              variant="contained"
              className={clsx(!editable && classes.hidden)}
              disabled={isNodata}
              startIcon={<ModeEditIcon />}
              onClick={() => handleEdit(ACTIONS.EDIT)}
              sx={{ mr: 1 }}
            >
              <Trans>lang_edit</Trans>
            </Button>
          )}
        </div>
        {showSitename ? (
          <div>
            <TextField
              disabled
              variant="outlined"
              name="sitename"
              sx={{ minWidth: 336, mr: 1 }}
              value={localStorage.getItem('sitename') || ''}
              InputLabelProps={{
                shrink: false,
              }}
              fullWidth
            />
          </div>
        ) : (
          <></>
        )}
        {customSearch ? (
          <div>
            <TextField
              inputRef={searchAppNameInputRef}
              variant="outlined"
              name="search"
              placeholder={t('lang_search_app_name') + ''}
              InputLabelProps={{
                shrink: false,
              }}
              sx={{ width: 192 }}
              InputProps={{
                endAdornment: searchText ? (
                  <InputAdornment position="end">
                    <CancelIcon style={{ width: 16, height: 16, cursor: 'pointer' }} onClick={clearCustomSearch} />
                  </InputAdornment>
                ) : null,
              }}
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, true)}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <TextField
        inputRef={inputRef}
        variant="outlined"
        name="search"
        placeholder={t('lang_quick_filter') + ''}
        InputLabelProps={{
          shrink: false,
        }}
        InputProps={{
          endAdornment: searchText ? (
            <InputAdornment position="end">
              <CancelIcon style={{ width: 16, height: 16, cursor: 'pointer' }} onClick={clearSearch} />
            </InputAdornment>
          ) : null,
        }}
        fullWidth
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
      />
    </div>
  );
};

export default CustomSearch;
