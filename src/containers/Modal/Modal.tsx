/*
 * Created on Fri Jan 06 2023
 *
 * Global modal, support sub modal nested
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useState, createContext, useContext } from 'react';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LooseObject, IModalProps } from 'models/ICommon';
import { Trans } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenModal: {
    width: '80vw',
    height: '80vh',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: '40vw',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(1),
    background: theme.palette.background.default,
  },
  iconClose: {
    cursor: 'pointer',
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
      showBtnClose: 'showBtnClose' in modalProps ? modalProps.showBtnClose : false,
      fullScreen: 'fullScreen' in modalProps ? modalProps.fullScreen : false,
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
        <Modal className={classes.modal} open={!!store.open} onClose={hideModal} hideBackdrop>
          <Paper className={clsx(classes.container, store.fullScreen && classes.fullScreenModal)}>
            {store.title ? (
              <Box className={classes.header}>
                <Typography>
                  <Trans>{store.title}</Trans>
                </Typography>
                {store.showBtnClose && <CloseIcon className={classes.iconClose} onClick={hideModal} />}
              </Box>
            ) : (
              <></>
            )}
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
