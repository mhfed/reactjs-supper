/*
 * Created on Fri Jan 06 2023
 *
 * Auth parent component to handle auto login
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';
import { autoLogin } from 'actions/auth.action';

type AuthProps = {
  children: React.ReactNode; // 👈️ type children
};

const Auth: FC<AuthProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    function initAuth() {
      const isStaySignedIn = window.localStorage.getItem('isStaySignedIn') === 'true';
      const lastEmailLogin = window.localStorage.getItem('lastEmailLogin');
      const lastDeviceId = window.localStorage.getItem('lastDeviceId');
      const refreshToken = window.localStorage.getItem(`${lastEmailLogin}_refreshToken`);
      if (isStaySignedIn && lastDeviceId && refreshToken) {
        dispatch(autoLogin(refreshToken, lastDeviceId) as any);
      }
    }
    initAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default Auth;
