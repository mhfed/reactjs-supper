/*
 * Created on Fri Jan 06 2023
 *
 * Handle auth guard, protect router
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';

// configs
import { PATH_NAME } from 'configs';

// services
import authService from 'services/authService';

type AuthGuardProps = {
  children?: React.ReactNode;
};
// @ts-ignore: Unreachable code error
const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const isAuth = authService.getAccessToken();
  const isAutoLoging = window.localStorage.getItem('isAutoLoging');

  if (!isAuth && !isAutoLoging) return <Navigate to={PATH_NAME.LOGIN} />;

  return <>{children}</>;
};

export default AuthGuard;
