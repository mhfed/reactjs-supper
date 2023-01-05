import React from 'react';
import { useField } from 'formik';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormHelperText from '@mui/material/FormHelperText';
import { makeStyles } from '@mui/styles';
import { Trans } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    '&.radio-horizontal': {
      width: 'fit-content',
      '& $group': {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
    '& .MuiFormControlLabel-root': {
      alignItems: 'flex-start',
      paddingTop: theme.spacing(2),
      '& .MuiRadio-root': {
        marginTop: -8,
      },
    },
  },
  group: {
    margin: theme.spacing(0),
  },
}));

// interface RadioField {}

const RadioGroupField = (props: any) => {
  const { label, data, style, translate = true, ...rest } = props;
  const classes = useStyles();
  const [field, meta, helper] = useField(props);
  const { setValue: setValueForm, setTouched } = helper || {};
  const { value: selectedValue } = field;
  const { touched, error } = meta;
  const isError = touched && error && true;

  /**
   * Render helper text or error text
   * @returns translated text
   */
  function _renderHelperText() {
    if (isError) {
      return (
        <FormHelperText>
          <Trans>{error}</Trans>
        </FormHelperText>
      );
    }
  }

  /**
   * Update new value for radio
   * @param {Event} event material ui Radio change event
   */
  const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!touched) setTouched(true);
    setValueForm(event.target.value, true);
  };

  return (
    <FormControl {...rest} error={isError}>
      {label ? <FormLabel component="legend">{translate ? <Trans>{label}</Trans> : label}</FormLabel> : <React.Fragment />}
      <RadioGroup
        aria-label={label}
        name={label}
        row={Boolean(rest?.rowItems)}
        className={classes.group}
        style={style}
        value={selectedValue}
        onBlur={field.onBlur}
        onChange={_onChange}
      >
        {data.map(
          (
            item: {
              value: unknown;
              transProps: any;
              label:
                | string
                | number
                | boolean
                | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined;
            },
            index: React.Key | null | undefined,
          ) => (
            <FormControlLabel
              key={index}
              value={item.value}
              control={<Radio />}
              label={translate ? <Trans {...(item.transProps || {})}>{item.label}</Trans> : item.label}
            />
          ),
        )}
      </RadioGroup>
      <input
        readOnly
        style={{
          opacity: 0,
          position: 'absolute',
          pointerEvents: 'none',
          left: 136,
        }}
        type="checkbox"
        id="gender"
        required={rest.required}
        checked={!!(selectedValue && data.length ? selectedValue.value ?? selectedValue : '')}
      />
      {_renderHelperText()}
    </FormControl>
  );
};

export default RadioGroupField;
