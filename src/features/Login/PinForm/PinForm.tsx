import React from 'react';
import BackspaceIcon from '@mui/icons-material/BackspaceOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import PinInput from './PinInput';
import { verifyPin, setPinFirstTime, forceSetPin } from 'actions/auth.action';
import { isLoadingSelector } from 'selectors/auth.selector';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
    maxWidth: 336,
    flexDirection: 'column',
    alignItems: 'center',
    background: theme.palette.background.paper,
  },
  pinBody: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(3),
  },
  keyboardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  keyboardButton: {
    userSelect: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.typography.fontSize * 2.5,
    borderRadius: theme.spacing(0.5),
    fontSize: theme.typography.h5.fontSize,
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(0.5),
    width: `calc(100%/3 - ${theme.spacing(1)})`,
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.primary.main,
    },
  },
  hiddenButton: {
    backgroundColor: 'transparent',
    visibility: 'hidden',
    pointerEvents: 'none',
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
  textButton: {
    width: 'fit-content',
  },
  header: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.palette.background.default,
    padding: theme.spacing(2),
    '& button': {
      '&:hover': {
        background: 'transparent',
      },
    },
  },
}));

const LIST_KEYBOARD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'Backspace'];
type PinInputHandle = React.ElementRef<typeof PinInput>;
type PinFormProps = {
  password?: string;
  isSetPin?: boolean;
  isFirstTime?: boolean;
};
const PIN_STEP = {
  ENTER_YOUR_PIN: 'ENTER_YOUR_PIN',
  SET_YOUR_PIN: 'SET_YOUR_PIN',
  CONFIRM_YOUR_NEW_PIN: 'CONFIRM_YOUR_NEW_PIN',
};
const LIST_STEP_SET_PIN = [PIN_STEP.SET_YOUR_PIN, PIN_STEP.CONFIRM_YOUR_NEW_PIN];
const LIST_STEP_ENTER_PIN = [PIN_STEP.ENTER_YOUR_PIN];

const PinForm: React.FC<PinFormProps> = ({ isSetPin = false, isFirstTime = false, password = '' }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const listStep = React.useRef(isSetPin ? LIST_STEP_SET_PIN : LIST_STEP_ENTER_PIN);
  const [step, setStep] = React.useState(0);
  const [number, setNumber] = React.useState<string[]>([]);
  const [errorMessage, setError] = React.useState('');
  const pinRef = React.useRef<string[]>([]);
  const oldPinRef = React.useRef<string[]>([]);
  const pinInputRef = React.useRef<PinInputHandle>(null);
  const timeoutId = React.useRef<number | null>(null);
  const isLoading = useSelector(isLoadingSelector);
  const stepName = listStep.current[step];
  const navigate = useNavigate();

  const clearPin = () => {
    pinRef.current = [];
    setNumber([]);
  };

  const checkPin = () => {
    const pin = pinRef.current.join('');
    const oldPin = oldPinRef.current.join('');
    if (isSetPin) {
      if (stepName === PIN_STEP.SET_YOUR_PIN) {
        oldPinRef.current = [...pinRef.current];
        setNumber([]);
        setStep((step) => step + 1);
      } else if (stepName === PIN_STEP.SET_YOUR_PIN) {
        if (pin === oldPin) {
          if (isFirstTime) {
            dispatch(setPinFirstTime(pin, navigate) as any);
          } else {
            dispatch(forceSetPin(pin, password, navigate) as any);
          }
        } else {
          setError('lang_pin_not_match');
          clearPin();
        }
      }
    } else {
      dispatch(verifyPin(pin, navigate) as any);
    }
  };

  const handleKeyBoard = React.useCallback((item: string) => {
    timeoutId.current && clearTimeout(timeoutId.current);
    if (item === 'Backspace') {
      pinRef.current.splice(-1, 1);
      pinInputRef.current?.setShowNumber?.(false);
    } else if (pinRef.current.length < 6) {
      pinRef.current.push(item);
      pinInputRef.current?.setShowNumber?.(true);
      timeoutId.current = window.setTimeout(() => {
        pinInputRef.current?.setShowNumber?.(false);
      }, 2000);
      if (pinRef.current.length === 6) {
        checkPin();
      }
    }
    setNumber([...pinRef.current]);
  }, []); // eslint-disable-line

  React.useEffect(() => {
    const handleKeyboardPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' || /^\d+$/.test(e.key)) {
        handleKeyBoard(e.key);
      }
    };
    document.addEventListener('keydown', handleKeyboardPress as any);
    return () => {
      document.removeEventListener('keydown', handleKeyboardPress as any);
    };
  }, []); // eslint-disable-line

  const mapKeyBoard = () => {
    const keyboard = LIST_KEYBOARD.map((item, index) => {
      return (
        <div
          className={clsx(
            classes.keyboardButton,
            item === '' && classes.hiddenButton,
            item === 'Backspace' && classes.deleteButton,
          )}
          onClick={() => handleKeyBoard(item)}
          key={index}
        >
          {item === 'Backspace' ? <BackspaceIcon /> : item}
        </div>
      );
    });
    return keyboard;
  };

  const onBack = () => {
    errorMessage && setError('');
    pinRef.current = [...oldPinRef.current];
    oldPinRef.current = [];
    setNumber([...pinRef.current]);
  };

  const renderHeader = () => {
    switch (stepName) {
      case PIN_STEP.SET_YOUR_PIN:
        return (
          <div className={classes.header}>
            <Button sx={{ pointerEvents: 'none' }}></Button>
            <Typography variant="h6">
              <Trans>lang_set_your_pin</Trans>
            </Typography>
            <Button disabled={number.length < 6}>
              <Trans>lang_next</Trans>
            </Button>
          </div>
        );
      case PIN_STEP.CONFIRM_YOUR_NEW_PIN:
        return (
          <div className={classes.header}>
            <Button variant="text" onClick={onBack}>
              <Trans>lang_back</Trans>
            </Button>
            <Typography variant="h6">
              <Trans>lang_confirm_your_new_pin</Trans>
            </Typography>
            <Button variant="text" disabled={isLoading || number.length < 6}>
              <Trans>lang_done</Trans>
              {isLoading ? <CircularProgress size={24} /> : <></>}
            </Button>
          </div>
        );
      case PIN_STEP.ENTER_YOUR_PIN:
      default:
        return (
          <div className={classes.header}>
            <Button sx={{ pointerEvents: 'none' }}></Button>
            <Typography variant="h6" align="center" sx={{ width: '100%' }}>
              <Trans>lang_enter_your_pin</Trans>
            </Typography>
            <Button sx={{ pointerEvents: 'none' }}></Button>
          </div>
        );
    }
  };

  return (
    <div className={classes.wrapper}>
      {renderHeader()}
      <div className={classes.pinBody}>
        <PinInput ref={pinInputRef} data={number} />
        <FormHelperText error sx={{ pt: 1 }}>
          <Trans>{errorMessage}</Trans>
        </FormHelperText>
        {stepName === PIN_STEP.SET_YOUR_PIN ? (
          <Typography sx={{ width: '100%', py: 2 }}>
            <Trans>lang_set_pin_tip</Trans>
          </Typography>
        ) : (
          <Box sx={{ p: 2 }}></Box>
        )}
        <div className={classes.keyboardContainer}>{mapKeyBoard()}</div>
      </div>
    </div>
  );
};

export default PinForm;
