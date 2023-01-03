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

  if (!isAuth) return <Navigate to={PATH_NAME.LOGIN} />;

  return <>{children}</>;
};

export default AuthGuard;
