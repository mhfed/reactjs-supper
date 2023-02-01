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
import { LooseObject, IModalProps } from 'models/ICommon';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import HeaderModal from 'components/atoms/HeaderModal';

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
    background: theme.palette.background.contentModal,
    minWidth: '40vw',
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
  const classes = useStyles();

  /**
   * Show new modal
   * @param modalProps modal props
   */
  const showModal = (modalProps: IModalProps) => {
    setStore({
      ...store,
      open: true,
      ...modalProps,
      title: 'title' in modalProps ? modalProps.title : '',
      fullScreen: 'fullScreen' in modalProps ? modalProps.fullScreen : false,
      showBtnClose: 'showBtnClose' in modalProps ? modalProps.showBtnClose : false,
      styleModal: modalProps.styleModal || {},
    });
  };

  /**
   * Show sub modal
   * @param modalProps modal props
   */
  const showSubModal = (modalProps: IModalProps) => {
    setStore({
      ...store,
      subOpen: true,
      subTitle: modalProps.title,
      subComponent: modalProps.component,
      subProps: modalProps.props,
      styleModal: modalProps.styleModal || {},
    });
  };

  /**
   * Hide all modal
   */
  const hideModal = () => {
    setStore({
      ...store,
      open: false,
      subOpen: false,
    });
  };

  /**
   * Hide sub modal
   */
  const hideSubModal = () => {
    setStore({
      ...store,
      subOpen: false,
    });
  };

  /**
   * Render modal content
   * @returns HTML
   */
  const renderComponent = () => {
    const Component = store.component;
    const SubComponent = store.subComponent;
    return (
      <>
        <Modal className={classes.modal} open={!!store.open}>
          <Paper className={clsx(classes.container, store.fullScreen && classes.fullScreenModal)} style={store?.styleModal || {}}>
            {store.title ? <HeaderModal title={store.title} onClose={hideModal} /> : <></>}
            {Component && <Component {...(store.props || {})} onClose={hideModal} />}
          </Paper>
        </Modal>
        <Modal className={classes.modal} open={!!store.subOpen}>
          <Paper className={classes.container} style={store?.styleModal || {}}>
            {store.subTitle && <HeaderModal title={store.subTitle} onClose={hideSubModal} />}
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
