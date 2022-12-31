import React, { useState, createContext, useContext } from 'react';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import { LooseObject, IModalProps } from 'models/ICommon';

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
      <Modal sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} open={store.open} onClose={hideModal}>
        <Component />
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
