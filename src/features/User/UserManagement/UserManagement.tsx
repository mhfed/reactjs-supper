import React from 'react';
import { getSearchUserUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';

type UserManagementProps = {};

const UserManagement: React.FC<UserManagementProps> = () => {
  const dispatch = useDispatch();

  const getData = async () => {
    try {
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  };

  React.useEffect(() => {}, []);

  return <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>User Management</div>;
};

export default UserManagement;
