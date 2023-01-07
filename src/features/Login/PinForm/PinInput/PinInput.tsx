/*
 * Created on Fri Jan 06 2023
 *
 * Pin input symbol
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { forwardRef, useImperativeHandle, ForwardRefRenderFunction } from 'react';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  pinInput: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 0, 1, 0),
    height: 40,
  },
  pinSymbol: {
    color: theme.palette.text.disabled,
    fontSize: theme.typography.body1.fontSize,
    padding: theme.spacing(0, 1, 0, 1),
  },
  pinSymbolActive: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.h6.fontSize,
  },
  pinSymbolNumber: {
    fontSize: theme.typography.h4.fontSize,
  },
}));

type PinInputProps = {
  data: string[];
};
type PinInputHandle = {
  setShowNumber: any;
};

const PIN_PATTERM = [1, 2, 3, 4, 5, 6];

const PinInput: ForwardRefRenderFunction<PinInputHandle, PinInputProps> = ({ data = [] }, ref) => {
  const classes = useStyles();
  const [show, setShow] = React.useState(true);

  useImperativeHandle(
    ref,
    () => ({
      setShowNumber: setShow,
    }),
    [],
  );

  return (
    <div className={classes.pinInput}>
      {PIN_PATTERM.map((e, i) => {
        const isHaveValue = data[i] && typeof +data[i] === 'number';
        const isLastItem = i === data.length - 1;
        return (
          <div
            key={`pin_number_${i}`}
            className={clsx(
              classes.pinSymbol,
              isHaveValue && classes.pinSymbolActive,
              isLastItem && show && classes.pinSymbolNumber,
            )}
          >
            {isLastItem && show ? data[i] : '✲'}
          </div>
        );
      })}
    </div>
  );
};

export default forwardRef(PinInput);
