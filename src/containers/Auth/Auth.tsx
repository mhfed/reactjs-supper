/*
 * Created on Fri Jan 06 2023
 *
 * Auth parent component to handle auto login
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';
import { autoLoginNew } from 'actions/auth.action';
import { useNavigate } from 'react-router-dom';

type AuthProps = {
  children: React.ReactNode; // 👈️ type children
};

const Auth: FC<AuthProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [already, setAlready] = React.useState(false);

  /**
   * Handle auto login
   */
  useEffect(() => {
    async function initAuth() {
      const lastUserId = window.localStorage.getItem(`lastUserId`);
      const refreshToken = window.localStorage.getItem(`${lastUserId}_refreshToken`) as string;
      const accessToken = window.localStorage.getItem(`${lastUserId}_accessToken`) as string;

      if (accessToken && refreshToken) {
        dispatch(
          autoLoginNew(accessToken, refreshToken, navigate, () => {
            setAlready(true);
          }) as any,
        );
      } else {
        setAlready(true);
      }
    }
    initAuth();
  }, [dispatch]);

  if (!already) return <></>;

  return <>{children}</>;
};

export default Auth;
