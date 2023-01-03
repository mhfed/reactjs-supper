import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import makeStyles from '@mui/styles/makeStyles';
import CancelIcon from '@mui/icons-material/Cancel';
import { Trans, useTranslation } from 'react-i18next';
import { alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
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
      background: alpha(theme.palette.background.paper, 0.5),
    },
  },
  hidden: {
    visibility: 'hidden',
    width: 0,
  },
}));

type CustomSearchProps = {
  searchText: string;
  handleSearch: (text: string) => void;
  handleEdit: (action: string) => void;
  isEditMode: boolean;
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
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const timeoutId = React.useRef<number | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    timeoutId.current && window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      handleSearch(e.target.value);
    }, process.env.REACT_APP_DEBOUNCE_TIME);
  };

  return (
    <div className={classes.container}>
      {isEditMode ? (
        <div className={clsx(!editable && classes.hidden)}>
          <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEdit(ACTIONS.CANCEL)} sx={{ mr: 1 }}>
            <Trans>lang_cancel</Trans>
          </Button>
          <Button variant="contained" startIcon={<ModeEditIcon />} onClick={() => handleEdit(ACTIONS.SAVE)}>
            <Trans>lang_save</Trans>
          </Button>
        </div>
      ) : (
        <Button
          variant="contained"
          className={clsx(!editable && classes.hidden)}
          disabled={isNodata}
          startIcon={<ModeEditIcon />}
          onClick={() => handleEdit(ACTIONS.EDIT)}
        >
          <Trans>lang_edit</Trans>
        </Button>
      )}
      <TextField
        disabled={isEditMode}
        variant="outlined"
        name="search"
        placeholder={t('lang_quick_filter') + ''}
        InputLabelProps={{
          shrink: false,
        }}
        InputProps={{
          endAdornment: searchText ? (
            <InputAdornment position="start">
              <CancelIcon style={{ width: 16, height: 16 }} />
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
