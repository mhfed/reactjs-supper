/*
 * Created on Fri Jan 06 2023
 *
 * Date picker modal
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
  onChange: (e: Date | string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const RangeDate: React.FC<RangeDateProps> = (props) => {
  const classes = useStyles();
  const { label, required = false, from, to, helperText = '' } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const datePickerId = uuidv4();

  /**
   * Open date picker popup
   */
  const openDatePicker = () => {
    setAnchorEl(document.getElementById(`datePickerRange_${datePickerId}`));
  };

  /**
   * Close date picker popup
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Apply new date range
   */
  const onApply = () => {};

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
                  onChange={() => {}}
                  value={from}
                  renderInput={(params) => (
                    <TextField {...params} required={Boolean(props?.required)} name={'from'} value={from} fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={() => {}}
                  value={to}
                  renderInput={(params) => (
                    <TextField {...params} required={Boolean(props?.required)} name={'to'} value={to} fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Stack className={classes.buttonWrapper} direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" scrollToTop onClick={handleClose}>
              <Trans>lang_cancel</Trans>
            </Button>
            <Button network variant="contained" onClick={onApply}>
              <Trans>lang_apply</Trans>
            </Button>
          </Stack>
        </Paper>
      </Popover>
    </div>
  );
};

export default RangeDate;
