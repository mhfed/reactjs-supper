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
    '& input': {
      padding: theme.spacing(1),
      background: theme.palette.mode === 'dark' ? 'inherit' : theme.palette.common.white,
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
}));

type CustomSearchProps = {
  searchText: string;
  handleSearch: (text: string) => void;
  handleEdit: (action: string) => void;
  isEditMode: boolean;
  listBtn?: Array<{ label: string; onClick: () => void }>;
  editable: boolean;
  isNodata: boolean;
};

const CustomSearch: React.FC<CustomSearchProps> = ({
  isNodata,
  editable,
  searchText = '',
  handleSearch,
  handleEdit,
  isEditMode,
  listBtn,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const timeoutId = React.useRef<number | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    timeoutId.current && window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      handleSearch(e.target.value);
    }, process.env.REACT_APP_DEBOUNCE_TIME);
  };

  const clearSearch = () => {
    inputRef.current && (inputRef.current.value = '');
    handleSearch('');
  };

  return (
    <div className={classes.container}>
      <div className={classes.listBtn}>
        {listBtn &&
          listBtn?.map((btn, i) => (
            <Button
              key={i}
              network
              variant="contained"
              className={clsx(!listBtn && classes.hidden)}
              sx={{ mr: 1 }}
              onClick={btn.onClick}
            >
              <Trans>{btn.label}</Trans>
            </Button>
          ))}
        {isEditMode ? (
          <div className={clsx(!editable && classes.hidden)}>
            <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEdit(ACTIONS.CANCEL)} sx={{ mr: 1 }}>
              <Trans>lang_cancel</Trans>
            </Button>
            <Button network variant="contained" startIcon={<ModeEditIcon />} onClick={() => handleEdit(ACTIONS.SAVE)}>
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
          >
            <Trans>lang_edit</Trans>
          </Button>
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
        // value={searchText || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomSearch;
