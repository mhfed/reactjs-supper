/*
 * Created on Mon Jan 30 2023
 *
 * Input code field for iress login fail
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { Trans } from 'react-i18next';
import ReactCodeInput from 'react-code-input';
import { Typography } from '@mui/material';

const RenderOTPForm = (props: any) => {
  const { onChangeOTP, pinRef, error, OTP_LENGTH, theme } = props;
  return (
    <React.Fragment>
      <Typography style={{ paddingBottom: 8 }}>
        <Trans>lang_please_enter_the_2FA</Trans>
      </Typography>
      <ReactCodeInput
        // id="pinCode"
        type="number"
        name={'phone_otp'}
        className="ReactCodeInput"
        isValid={!error}
        fields={OTP_LENGTH}
        pattern="[0-9]*"
        inputMode="numeric"
        onChange={onChangeOTP}
        ref={pinRef}
        inputStyle={{
          outline: 'none',
          // margin: 7,
          width: 'calc((100% - 56px) / 6)',
          maxWidth: 56,
          height: 56,
          borderRadius: 4,
          fontSize: 32,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.grey[500]}`,
          textAlign: 'center',
        }}
        inputStyleInvalid={{
          outline: 'none',
          // margin: 7,
          width: 'calc((100% - 56px) / 6)',
          maxWidth: 56,
          height: 56,
          borderRadius: 4,
          fontSize: 32,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.error.main}`,
          textAlign: 'center',
        }}
      />
    </React.Fragment>
  );
};
export default RenderOTPForm;
