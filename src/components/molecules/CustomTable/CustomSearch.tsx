import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import makeStyles from '@mui/styles/makeStyles';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import { alpha } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    '& input': {
      padding: theme.spacing(1),
      background: alpha(theme.palette.background.paper, 0.5),
    },
  },
}));

type CustomSearchProps = {
  searchText: string;
  handleSearch: (text: string) => void;
};

const CustomSearch: React.FC<CustomSearchProps> = ({ searchText = '', handleSearch }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(searchText);
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
      <TextField
        variant="outlined"
        name="search"
        placeholder={t('lang_quick_filter') + ''}
        InputLabelProps={{
          shrink: false,
        }}
        InputProps={{
          endAdornment: value ? (
            <InputAdornment position="start">
              <CancelIcon style={{ width: 16, height: 16 }} />
            </InputAdornment>
          ) : null,
        }}
        fullWidth
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomSearch;
