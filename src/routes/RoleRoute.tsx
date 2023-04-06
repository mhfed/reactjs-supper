/*
 * Created on Fri Jan 06 2023
 *
 * Handle role for each router
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { FC } from 'react';

type IProps = {
  requireRoles: string[] | [];
  children?: React.ReactNode;
};

const RoleRoute: FC<IProps> = ({ children, requireRoles = [] }) => {
  // useEffect(() => {
  //   if (!roles || requireRoles.length === 0) return;

  //   const checkRole = () => {
  //     if (Array.isArray(requireRoles)) {
  //       for (let index = 0; index < requireRoles.length; index++) {
  //         const role = requireRoles[index];
  //         if (!roles.includes(role)) return false;
  //       }
  //       return true;
  //     } else {
  //       return roles.includes(requireRoles);
  //     }
  //   };
  //   if (!checkRole()) {
  //     navigate(PATH_NAME.ERROR_403, { replace: true });
  //   }
  // }, [navigate, roles, requireRoles]);

  return <>{children}</>;
};

export default RoleRoute;
