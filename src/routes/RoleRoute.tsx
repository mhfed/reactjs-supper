import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// configs
import { PATH_NAME } from 'configs';

// selectors
import { roleSelector } from 'selectors/auth.selector';

type IProps = {
  requireRoles: string[] | [];
  children?: React.ReactNode;
};

const RoleRoute: FC<IProps> = ({ children, requireRoles = [] }) => {
  const navigate = useNavigate();
  const roles = useSelector(roleSelector);

  useEffect(() => {
    if (!roles || requireRoles.length === 0) return;

    const checkRole = () => {
      if (Array.isArray(requireRoles)) {
        for (let index = 0; index < requireRoles.length; index++) {
          const role = requireRoles[index];
          if (!roles.includes(role)) return false;
        }
        return true;
      } else {
        return roles.includes(requireRoles);
      }
    };
    if (!checkRole) {
      navigate(PATH_NAME.ERROR_403, { replace: true });
    }
  }, [navigate, roles, requireRoles]);

  return <>{children}</>;
};

export default RoleRoute;
