/*
 * Created on Fri Jan 06 2023
 *
 * Global context includes theme mode, language
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useReducer, useContext, createContext } from 'react';

type IProps = {
  children: React.ReactNode;
};

type IContext = {
  modeTheme: string;
  language: string;
  setModeTheme: (mode: string) => void;
  setLanguage: (language: string) => void;
};

type IAction = {
  type: string;
  payload: any;
};

const lastTheme = window.localStorage.getItem('lastTheme');

const initialState = {
  modeTheme: lastTheme || process.env.REACT_APP_THEME,
  language: process.env.REACT_APP_LANGUAGE,
  setModeTheme: () => {},
  setLanguage: () => {},
};

const GlobalContext = createContext<IContext>(initialState);

const reducer = (state: IContext, { type, payload }: IAction) => {
  switch (type) {
    case 'SET_MODE_THEME': {
      return {
        ...state,
        modeTheme: payload,
      };
    }
    case 'SET_LANGUAGE': {
      return {
        ...state,
        language: payload,
      };
    }
    default:
      return state;
  }
};

const GlobalProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const _handleSetModeTheme = (mode: string) => {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(mode);
    window.localStorage.setItem('lastTheme', mode);
    dispatch({
      type: 'SET_MODE_THEME',
      payload: mode,
    });
  };

  const _handleChangeLanguage = (language: string) => {
    dispatch({
      type: 'SET_LANGUAGE',
      payload: language,
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        setModeTheme: _handleSetModeTheme,
        setLanguage: _handleChangeLanguage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => useContext(GlobalContext);

export { GlobalContext, GlobalProvider, useGlobalContext };
