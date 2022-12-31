import React, { useState, createContext, useContext } from 'react';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LooseObject, IModalProps } from 'models/ICommon';
import { Trans } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: '40vw',
    minHeight: 200,
  },
  header: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1),
    background: theme.palette.primary.dark,
  },
}));

type GlobalModalContextProps = {
  showModal: (modalProps: IModalProps) => void;
  hideModal: () => void;
  store: object;
};

const initalState: GlobalModalContextProps = {
  showModal: () => {
    console.log('showModal');
  },
  hideModal: () => {
    console.log('hideModal');
  },
  store: {},
};

const GlobalModalContext = createContext<GlobalModalContextProps>(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

type GlobalModalProps = {
  children: JSX.Element | React.ReactNode | null;
};

const GlobalModal: React.FC<GlobalModalProps> = ({ children }) => {
  const [store, setStore] = useState<LooseObject>({});
  const { modalProps } = store || {};
  const classes = useStyles();

  const showModal = (modalProps: IModalProps) => {
    setStore({
      ...store,
      open: true,
      ...modalProps,
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      open: false,
    });
  };

  const renderComponent = () => {
    const Component = store.component;
    return (
      <Modal className={classes.modal} open={store.open} onClose={hideModal}>
        <Paper className={classes.container}>
          <Box className={classes.header}>
            <Typography>
              <Trans>{store.title}</Trans>
            </Typography>
          </Box>
          <Component />
        </Paper>
      </Modal>
    );
  };

  return (
    <GlobalModalContext.Provider value={{ store, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </GlobalModalContext.Provider>
  );
};

export default GlobalModal;
