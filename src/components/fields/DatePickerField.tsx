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
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { DateTimePicker, DateTimePickerTabs, DateTimePickerTabsProps } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Trans } from 'react-i18next';
import { FormikErrors } from 'formik';
import { makeStyles } from '@mui/styles';
import { t } from 'i18next';

const CustomTabs = (props: DateTimePickerTabsProps) => (
  <React.Fragment>
    <DateTimePickerTabs {...props} />
    <Box sx={{ height: 5 }} />
  </React.Fragment>
);

const useStyles = makeStyles((theme) => ({
  inputField: {
    '& input::placeholder': {
      textTransform: 'uppercase',
    },
  },
}));

type DatePickerFieldProps = {
  id?: string;
  label?: string;
  name?: string;
  type?: string;
  error?: boolean;
  value?: string;
  helperText?: string | boolean | undefined | FormikErrors<any>[] | FormikErrors<any> | string[];
  fullWidth?: boolean;
  sx?: any;
  inputProps?: any;
  InputProps?: any;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  multiline?: boolean;
  defaultValue?: string;
  rows?: number;
  onChange: (e: Date | string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties | undefined;
  inputFormat?: string;
  minDate?: Date;
  hideTabs?: boolean;
  maxDate?: Date;
  size?: 'small' | 'medium';
  typeDatePicker?: 'DateTimePicker' | 'DatePicker';
  placeholder?: string;
  readOnly?: boolean;
};

const DatePickerField: React.FC<DatePickerFieldProps> = (props) => {
  const { label, hideTabs, size, typeDatePicker = 'DateTimePicker', placeholder, readOnly = false, ...rest } = props;
  const isError = rest?.error || false;
  const helperText = rest?.helperText || false;
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const classes = useStyles();
  /**
   * Update datepicker value when field value change
   */
  React.useEffect(() => {
    if (rest.value) {
      const date = new Date(rest.value);
      return setSelectedDate(date);
    }
    setSelectedDate(null);
  }, [rest.value]);

  /**
   * Handle date picker change value
   * @param {Date | null} date is the new date value
   */
  function _onChange(date: Date) {
    if (date == null) return rest.onChange('');
    if (date) {
      setSelectedDate(date);
      try {
        rest.onChange(date);
      } catch (error) {
        rest.onChange(date);
      }
    } else {
      rest.onChange(date);
    }
  }

  const renderInput = (params: TextFieldProps): React.ReactElement<any, string | React.JSXElementConstructor<any>> => {
    const placeHolderField = placeholder && t(placeholder) + '';
    return (
      <TextField
        required={Boolean(props?.required)}
        name={rest.name}
        value={rest.value}
        onBlur={rest.onBlur}
        fullWidth={Boolean(props?.fullWidth)}
        {...params}
        className={classes.inputField}
        inputProps={
          placeHolderField
            ? {
                ...params.inputProps,
                placeholder: placeHolderField,
                readOnly,
              }
            : { ...params.inputProps, readOnly }
        }
        sx={
          placeHolderField
            ? {
                '& input::-webkit-input-placeholder': {
                  textTransform: 'none !important',
                },
              }
            : { ...params.sx }
        }
        label={label ? <Trans>{label}</Trans> : null}
        error={isError}
        size={size}
        helperText={isError && helperText ? <Trans>{helperText}</Trans> : ''}
      />
    );
  };

  const renderDateTimeField = () => {
    return (
      <DateTimePicker
        {...rest}
        onChange={_onChange}
        value={selectedDate}
        label={label}
        renderInput={renderInput}
        hideTabs={Boolean(hideTabs)}
        components={{ Tabs: CustomTabs }}
        componentsProps={{
          tabs: {
            dateRangeIcon: <EventIcon />,
            timeIcon: <ScheduleIcon />,
          },
        }}
      />
    );
  };

  const renderDateField = () => {
    return <DatePicker {...rest} onChange={_onChange} value={selectedDate} label={label} renderInput={renderInput} />;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {typeDatePicker === 'DateTimePicker' ? renderDateTimeField() : renderDateField()}
    </LocalizationProvider>
  );
};

export default DatePickerField;
