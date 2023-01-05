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
  },
  header: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1),
    background: theme.palette.background.default,
  },
}));

type GlobalModalContextProps = {
  showModal: (modalProps: IModalProps) => void;
  hideModal: () => void;
  showSubModal: (modalProps: IModalProps) => void;
  hideSubModal: () => void;
  store: object;
};

const initalState: GlobalModalContextProps = {
  showModal: () => {
    console.log('showModal');
  },
  hideModal: () => {
    console.log('hideModal');
  },
  showSubModal: () => {
    console.log('showSubModal');
  },
  hideSubModal: () => {
    console.log('hideSubModal');
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

  const showSubModal = (modalProps: IModalProps) => {
    setStore({
      ...store,
      subOpen: true,
      subTitle: modalProps.title,
      subComponent: modalProps.component,
      subProps: modalProps.props,
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      open: false,
    });
  };

  const hideSubModal = () => {
    setStore({
      ...store,
      subOpen: false,
    });
  };

  const renderComponent = () => {
    const Component = store.component;
    const SubComponent = store.subComponent;
    return (
      <>
        <Modal className={classes.modal} open={!!store.open} onClose={hideModal}>
          <Paper className={classes.container}>
            <Box className={classes.header}>
              <Typography>
                <Trans>{store.title}</Trans>
              </Typography>
            </Box>
            {Component && <Component {...(store.props || {})} onClose={hideModal} />}
          </Paper>
        </Modal>
        <Modal className={classes.modal} open={!!store.subOpen} onClose={hideSubModal}>
          <Paper className={classes.container}>
            <Box className={classes.header}>
              <Typography>
                <Trans>{store.subTitle}</Trans>
              </Typography>
            </Box>
            {SubComponent && <SubComponent {...(store.subProps || {})} onClose={hideSubModal} />}
          </Paper>
        </Modal>
      </>
    );
  };

  return (
    <GlobalModalContext.Provider value={{ store, showModal, hideModal, showSubModal, hideSubModal }}>
      {renderComponent()}
      {children}
    </GlobalModalContext.Provider>
  );
};

export default GlobalModal;
