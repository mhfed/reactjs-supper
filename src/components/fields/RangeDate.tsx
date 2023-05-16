/*
 * Created on Fri Jan 06 2023
 *
 * From and to date picker
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EventIcon from '@mui/icons-material/Event';
import { Trans } from 'react-i18next';
import { FormikErrors } from 'formik';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from 'components/atoms/ButtonBase';
import { v4 as uuidv4 } from 'uuid';
import { LooseObject } from 'models/ICommon';

const useStyles = makeStyles((theme) => ({
  container: {
    '& .MuiInputBase-root': {
      cursor: 'pointer',
    },
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
}));

type RangeDateProps = {
  id?: string;
  label?: string;
  name?: string;
  type?: string;
  error?: boolean;
  from: Date;
  to: Date;
  helperText?: string | boolean | undefined | FormikErrors<any>[] | FormikErrors<any> | string[];
  fullWidth?: boolean;
  sx?: any;
  onChange: (e: { from: Date; to: Date }) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const RangeDate: React.FC<RangeDateProps> = (props) => {
  const classes = useStyles();
  const { label, required = false, from, to, onChange, helperText = '' } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [fromDate, setFromDate] = React.useState<Date>(from);
  const [toDate, setToDate] = React.useState<Date>(to);
  const [error, setError] = React.useState<LooseObject>({});
  const datePickerId = uuidv4();

  /**
   * Open date picker popup
   */
  const openDatePicker = () => {
    setAnchorEl(document.getElementById(`datePickerRange_${datePickerId}`));
  };

  React.useEffect(() => {
    if (from) setFromDate(from);
    if (to) setToDate(to);
  }, [from, to]);

  /**
   * Close date picker popup
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle from date change
   */
  const onChangeFromDate = (value: any) => {
    setFromDate(moment(value?.toDate()).startOf('day')?.toDate());
    validateDate('from', value);
  };

  /**
   * Check validate input date
   * @param type from or to
   */
  const validateDate = (type: string, value: any) => {
    try {
      let error = '';
      const isFrom = type === 'from';
      if (!value.isValid() || +value.toDate() > +moment().toDate()) {
        error = isFrom ? 'lang_from_date_is_invalid' : 'lang_to_date_is_invalid';
      } else {
        if (isFrom && +value.toDate() > +toDate) {
          error = 'lang_from_date_error_greater_to_date';
        } else if (!isFrom && +value.toDate() < +fromDate) {
          error = 'lang_to_date_error_smaller_to_date';
        }
      }
      setError((old) => ({ ...old, [type]: error }));
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Handle to date change
   */
  const onChangeToDate = (value: any) => {
    setToDate(moment(value?.toDate())?.endOf('day')?.toDate());
    validateDate('to', value);
  };

  /**
   * Apply new date range
   */
  const onApply = () => {
    setAnchorEl(null);
    onChange?.({ from: fromDate, to: toDate });
  };

  const value = `${moment(props.from).format('DD/MM/YYYY')} - ${moment(props.to).format('DD/MM/YYYY')}`;
  return (
    <div className={classes.container}>
      <TextField
        onClick={openDatePicker}
        fullWidth
        inputProps={{
          readOnly: true,
          style: { cursor: 'pointer' },
        }}
        required={required}
        value={value}
        label={<Trans>{label}</Trans>}
        InputProps={{
          endAdornment: <EventIcon id={`datePickerRange_${datePickerId}`} />,
        }}
        helperText={helperText ? <Trans>{helperText}</Trans> : ''}
      ></TextField>
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
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 2 }}>
            <Trans>lang_date</Trans>
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={onChangeFromDate}
                  inputFormat="DD/MM/YYYY"
                  value={fromDate}
                  maxDate={toDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required={Boolean(props?.required)}
                      error={!!error.from}
                      helperText={<Trans>{error.from}</Trans>}
                      name={'from'}
                      value={fromDate}
                      fullWidth
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={onChangeToDate}
                  inputFormat="DD/MM/YYYY"
                  value={toDate}
                  minDate={fromDate}
                  maxDate={moment()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required={Boolean(props?.required)}
                      error={!!error.to}
                      helperText={<Trans>{error.to}</Trans>}
                      name={'to'}
                      value={toDate}
                      fullWidth
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Stack className={classes.buttonWrapper} direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" scrollToTop onClick={handleClose}>
              <Trans>lang_cancel</Trans>
            </Button>
            <Button network variant="contained" disabled={!!(error?.from || error?.to)} onClick={onApply}>
              <Trans>lang_apply</Trans>
            </Button>
          </Stack>
        </Paper>
      </Popover>
    </div>
  );
};

export default RangeDate;
