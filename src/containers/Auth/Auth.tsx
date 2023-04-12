/*
 * Created on Fri Jan 06 2023
 *
 * Auth parent component to handle auto login
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { FC } from 'react';

type AuthProps = {
  children: React.ReactNode; // 👈️ type children
};

const Auth: FC<AuthProps> = ({ children }) => {
  return <>{children}</>;
};

export default Auth;
