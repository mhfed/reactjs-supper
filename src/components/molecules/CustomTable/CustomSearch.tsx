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
import { Grid } from '@mui/material';

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
  handleSearch: (text: string) => void;
  handleEdit: (action: string) => void;
  isEditMode: boolean;
  listBtn?: Array<TypeButtonHeader>;
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

  /**
   * Handle search new data with search text
   * @param e input change event
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchVal = e.target.value.trim();
    timeoutId.current && window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      if ((searchVal && searchVal.length >= 2) || e.target.value === '') handleSearch(searchVal);
    }, process.env.REACT_APP_DEBOUNCE_TIME);
  };

  /**
   * Clear search text and reset table data
   */
  const clearSearch = () => {
    inputRef.current && (inputRef.current.value = '');
    handleSearch('');
  };

  return (
    <div className={classes.container}>
      <Grid container direction="row" justifyContent="start" alignItems="center" rowSpacing={1}>
        <Grid item>
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
        </Grid>
        <Grid item>
          {isEditMode ? (
            <div className={clsx(!editable && classes.hidden)}>
              <Button variant="outlined" onClick={() => handleEdit(ACTIONS.CANCEL)} sx={{ mr: 1 }}>
                <Trans>lang_cancel</Trans>
              </Button>
              <Button network variant="contained" onClick={() => handleEdit(ACTIONS.SAVE)}>
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
        </Grid>
      </Grid>
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
