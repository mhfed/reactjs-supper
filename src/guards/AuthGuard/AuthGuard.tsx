/*
 * Created on Fri Jan 06 2023
 *
 * Handle auth guard, protect router
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { PATH_NAME } from 'configs';
import authService from 'services/authService';

type AuthGuardProps = {
  children?: React.ReactNode;
};
// @ts-ignore: Unreachable code error
const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const isAuth = authService.getAccessToken();

  // if not login or not auto login navigate to login page
  if (!isAuth) {
    return <Navigate to={PATH_NAME.LOGIN} />;
  }

  // else show router
  return <>{children}</>;
};

export default AuthGuard;
