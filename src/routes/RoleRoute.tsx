/*
 * Created on Fri Jan 06 2023
 *
 * Handle role for each router
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_NAME } from 'configs';
import checkRole from 'helpers/checkRole';

type IProps = {
  requireRoles: string[] | [];
  children?: React.ReactNode;
};

const RoleRoute: FC<IProps> = ({ children, requireRoles = [] }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (requireRoles.length === 0) return;
    if (!checkRole(requireRoles)) {
      navigate(PATH_NAME.ERROR_403, { replace: true });
    }
  }, [navigate, requireRoles]);

  return <>{children}</>;
};

export default RoleRoute;
