/*
 * Created on Fri Jan 06 2023
 *
 * Radio group base field
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormHelperText from '@mui/material/FormHelperText';
import { Trans } from 'react-i18next';

const RadioGroupField = (props: any) => {
  const { label, data, style, translate = true, rowItems, helperText, ...rest } = props;

  const isError = rest?.error || false;

  /**
   * Render helper text or error text
   * @returns translated text
   */
  function _renderHelperText() {
    if (helperText) {
      return (
        <FormHelperText>
          <Trans>{helperText}</Trans>
        </FormHelperText>
      );
    }
  }

  return (
    <FormControl {...rest} error={!!isError}>
      {label ? <FormLabel component="legend">{translate ? <Trans>{label}</Trans> : label}</FormLabel> : <React.Fragment />}
      <RadioGroup row={Boolean(rowItems)} style={style} {...rest}>
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
      {_renderHelperText()}
    </FormControl>
  );
};

export default RadioGroupField;
