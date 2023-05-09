/*
 * Created on Fri Jan 06 2023
 *
 * Custom toobar for custom table
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import makeStyles from '@mui/styles/makeStyles';
import CancelIcon from '@mui/icons-material/Cancel';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'components/atoms/ButtonBase';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ACTIONS } from './TableConstants';
import clsx from 'clsx';
import { AutocompleteField } from 'components/fields';
import { getSearchAppNameUrl } from 'apis/request.url';
import { IBundle, LooseObject } from 'models/ICommon';
import AdvancedFilterIcon from 'assets/icons/AdvancedFilter';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { diff } from 'deep-diff';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';

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
  advancedFilterBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: 40,
    height: 40,
    marginRight: -14,
  },
  filterInactive: {
    background: theme.palette.background.disabled,
  },
  filterActive: {
    background: theme.palette.primary.main,
  },
}));
type TypeButtonHeader = {
  label: string;
  onClick: () => void;
  variant?: 'contained' | 'outlined' | 'text' | string;
  sx?: any;
  disabledEditMode?: boolean;
};

type CustomSearchProps = {
  searchText: string;
  handleSearch: (text: string, customSearch?: LooseObject) => void;
  handleFilter?: (filterObj?: any) => void;
  handleEdit: (action: string) => void;
  isEditMode: boolean;
  listBtn?: Array<TypeButtonHeader>;
  editable: boolean;
  isNodata: boolean;
  showSitename: boolean;
  advancedFilter?: any;
  customSearch: boolean;
};

const CustomSearch: React.FC<CustomSearchProps> = ({
  isNodata,
  editable,
  searchText = '',
  customSearch = false,
  handleSearch,
  handleFilter,
  handleEdit,
  isEditMode,
  listBtn,
  advancedFilter: AdvancedFilter = null,
  showSitename = false,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const timeoutId = React.useRef<number | null>(null);
  const [appName, setAppName] = React.useState<any>('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const filterObj = React.useRef<any>(null);
  const statusFilter = React.useRef(false);
  const dispatch = useDispatch();

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

  /**
   * Apply new advanced filter
   */
  const onApplyFilter = (values: any, initialValues: any, unIncludes: any) => {
    const initValues = { ...initialValues };
    const currentValues = { ...values };

    if (Object.values(unIncludes).length) {
      for (const key in initValues) {
        if (unIncludes[key]) {
          delete initValues[key];
          delete currentValues[key];
        }
      }
    }

    const checkDiff = diff(initValues, currentValues);

    statusFilter.current = Boolean(checkDiff);
    if (!statusFilter.current) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_filter_no_change',
          key: new Date().getTime() + Math.random(),
          variant: 'warning',
        }),
      );
    } else {
      setAnchorEl(null);
      handleFilter?.(values);
    }
    filterObj.current = values;
  };

  /**
   * Search by app name
   */
  const onSearchAppName = (value: IBundle) => {
    setAppName(value);
    handleSearch('', value);
  };

  /**
   * Close advanced filter popup
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Open advanced filter popup
   */
  const openAdvancedFilter = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <div className={classes.container}>
      <div className={classes.rightContainer}>
        <div>
          {listBtn ? (
            listBtn?.map((btn: any, i) => (
              <Button
                key={i}
                network
                disabled={btn.disabledEditMode && isEditMode}
                variant={btn.variant || 'contained'}
                startIcon={btn.icon || null}
                sx={{ mr: 1 }}
                color={btn.color || 'primary'}
                onClick={btn.onClick}
              >
                <Trans>{btn.label}</Trans>
              </Button>
            ))
          ) : (
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
          <div style={{ minWidth: 224, marginRight: 8 }}>
            <AutocompleteField
              name="search_app_name"
              label="lang_app_name"
              disableClearable={false}
              sizeInput="small"
              getUrl={getSearchAppNameUrl}
              multiple={false}
              value={appName}
              isOptionEqualToValue={(opt, select) => opt.bundle_id === select.bundle_id}
              getOptionLabel={(opt) => opt.display_name || ''}
              onChange={onSearchAppName}
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
          endAdornment: (
            <InputAdornment position="end">
              <>
                {searchText ? (
                  <CancelIcon
                    style={{ width: 16, height: 16, cursor: 'pointer', marginRight: AdvancedFilter ? 8 : 0 }}
                    onClick={clearSearch}
                  />
                ) : (
                  <></>
                )}
                {AdvancedFilter ? (
                  <div
                    className={clsx(
                      classes.advancedFilterBtn,
                      statusFilter.current ? classes.filterActive : classes.filterInactive,
                    )}
                    onClick={(e) => openAdvancedFilter(e)}
                  >
                    <AdvancedFilterIcon />
                  </div>
                ) : (
                  <></>
                )}
              </>
            </InputAdornment>
          ),
        }}
        fullWidth
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
      />
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: { background: 'transparent', boxShadow: 'none' },
        }}
      >
        <Paper sx={{ p: 2, marginTop: '22px' }}>
          <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 2 }}>
            <Trans>lang_advanced_filter</Trans>
          </Typography>
          {!!AdvancedFilter && <AdvancedFilter onClose={handleClose} onApply={onApplyFilter} initialValues={filterObj.current} />}
        </Paper>
      </Popover>
    </div>
  );
};

export default CustomSearch;
