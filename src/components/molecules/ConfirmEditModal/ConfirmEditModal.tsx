/*
 * Created on Fri Jan 06 2023
 *
 * Confirm popup with current user login (email) check
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { LooseObject } from 'models/ICommon';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from 'components/atoms/ButtonBase';
import { validate } from 'helpers';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { userSelector } from 'selectors/auth.selector';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    maxWidth: '40vw',
    '& p': {
      wordBreak: 'break-all',
    },
    '& .MuiTableCell-root': {
      border: `1px solid ${theme.palette.background.attachmentBorder}`,
      padding: theme.spacing(1.5, 2, 1.5, 2),
    },
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  thead: {
    fontWeight: 700,
  },
  linkProceed: {
    padding: theme.spacing(2),
  },
}));

type DataConfigureType = {
  settingName?: string;
  prevSetting?: string;
  newSetting?: string;
};
type ConfirmEditUserModalProps = {
  title: string;
  cancelText?: string;
  confirmText?: string;
  titleTransValues?: LooseObject;
  isTitleValuesBold?: boolean;
  emailConfirm?: boolean;
  data?: LooseObject[];
  onClose: () => void;
  onSubmit: () => void;
  configurationChange?: boolean;
  dataConfigure?: DataConfigureType[];
  centerButton?: boolean;
  centerTitle?: boolean;
  styleContainer?: React.CSSProperties;
};

const ConfirmEditModal: React.FC<ConfirmEditUserModalProps> = ({
  title,
  cancelText = 'lang_cancel',
  confirmText = 'lang_confirm',
  titleTransValues = {},
  isTitleValuesBold = true,
  emailConfirm = true,
  configurationChange = false,
  dataConfigure = [],
  data = [],
  onClose,
  onSubmit,
  centerButton,
  centerTitle,
  styleContainer,
}) => {
  const classes = useStyles();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const timeoutId = React.useRef<number | null>(null);
  const ref = React.useRef<HTMLInputElement>(null);
  const user = useSelector(userSelector);

  /**
   * Handle email change and check error
   * @param e input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    timeoutId.current && window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => {
      if (value === '') {
        setError('lang_plese_enter_user_id');
      } else {
        if (error) setError('');
        setEmail(value);
      }
    }, process.env.REACT_APP_DEBOUNCE_TIME);
  };

  /**
   * Handle confiem email
   */
  const handleConfirm = () => {
    if (emailConfirm && (email + '').replace(/\s/g, '').toLowerCase() !== (user.user_id + '').toLowerCase()) {
      setError('lang_user_id_did_not_match');
    }
    if (configurationChange) {
      onSubmit();
    } else {
      onSubmit();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setError('lang_plese_enter_user_id');
      return;
    }
    if (e.target.value.includes(' ')) {
      ref.current && (ref.current.value = e.target.value.replace(/\s/g, ''));
      setEmail(e.target.value.replace(/\s/g, ''));
    }
  };

  /**
   * Condition to render body of modal
   * @returns JSX Element
   */
  const renderBody = () => {
    if (configurationChange)
      return (
        <TableContainer>
          <Table aria-label="table_configuration_change">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography className={classes.thead}>
                    <Trans>lang_setting_name</Trans>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={classes.thead}>
                    <Trans>lang_prev_settinge</Trans>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={classes.thead}>
                    <Trans>lang_new_setting</Trans>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataConfigure?.map((e) => (
                <TableRow key={e.settingName}>
                  <TableCell>{e.settingName}</TableCell>
                  <TableCell>{e.prevSetting}</TableCell>
                  <TableCell>{e.newSetting}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Link noWrap component="div" underline="none" className={classes.linkProceed}>
            <Trans>lang_do_you_want_to_proceed</Trans>
          </Link>
        </TableContainer>
      );

    return (
      <>
        <Typography sx={{ mb: 1, textAlign: centerTitle ? 'center' : '' }}>
          <Trans values={titleTransValues} components={isTitleValuesBold ? [<span key="span" />] : [<strong key="strong" />]}>
            {title}
          </Trans>
        </Typography>
        {data.length && data.length < 6 ? (
          data.map((e) => (
            <Typography fontWeight="bold" key={e.user_id}>
              {e.user_login_id}
            </Typography>
          ))
        ) : (
          <></>
        )}
        {emailConfirm ? (
          <TextField
            inputRef={ref}
            id="userLoginId"
            name="userLoginId"
            sx={{ mt: 2 }}
            label={<Trans>{'lang_user_id'}</Trans>}
            required
            fullWidth
            // value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!error}
            helperText={<Trans>{error}</Trans>}
          />
        ) : (
          <></>
        )}
      </>
    );
  };
  return (
    <div className={classes.container} style={styleContainer}>
      {renderBody()}
      <div className={classes.btnContainer} style={{ justifyContent: centerButton ? 'center' : '' }}>
        <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
          <Trans>{cancelText}</Trans>
        </Button>
        <Button network variant="contained" disabled={(emailConfirm && !email) || !!error} onClick={handleConfirm}>
          <Trans>{confirmText}</Trans>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmEditModal;
