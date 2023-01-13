/*
 * Created on Fri Jan 06 2023
 *
 * User management screen
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { getSearchUserUrl, getUserDetailUrl, getUserDetailByIdUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import httpRequest from 'services/httpRequest';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { FIELD, USER_STATUS_OPTIONS, SITE_NAME_OPTIONS } from '../UserConstants';
import { ITableConfig, LooseObject } from 'models/ICommon';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import UserDetailEdit from '../UserDetailEdit';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

type TableHandle = React.ElementRef<typeof CustomTable>;
type UserManagementProps = {};

const UserManagement: React.FC<UserManagementProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);
  const { showModal, hideModal } = useGlobalModalContext();
  const dicUser = React.useRef<any>({});

  const getData = async () => {
    try {
      gridRef?.current?.setLoading?.(true);
      const config: ITableConfig = gridRef?.current?.getConfig?.();
      const queryBody: any = gridRef?.current?.getQuery?.();
      const response: any = await httpRequest.post(getSearchUserUrl(config), queryBody);
      response.data.map((e: any) => {
        dicUser.current[e[FIELD.USER_ID]] = e;
      }, {});
      gridRef?.current?.setData?.(response);
    } catch (error) {
      gridRef?.current?.setData?.();
      dispatch(
        enqueueSnackbarAction({
          message: error?.errorCodeLang,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  };

  const onTableChange = () => {
    getData();
  };

  React.useEffect(() => {
    getData();
  }, []);

  const confirmForceChangePassword = React.useCallback(async (userId: string, isChangingPassword: boolean | number) => {
    try {
      await httpRequest.put(getUserDetailByIdUrl(userId), {
        data: { change_password: isChangingPassword ? 0 : 1 },
      });
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_force_to_change_password_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      hideModal();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_force_to_change_password_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  }, []);

  const confirmDeleteUser = React.useCallback(async (userId: string) => {
    try {
      await httpRequest.delete(getUserDetailUrl(userId));
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_delete_user_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      hideModal();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error?.errorCodeLang || 'lang_delete_user_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  }, []);

  const actions = React.useMemo(() => {
    return [
      {
        label: 'lang_view_user_detail',
        onClick: async (data: any) => {
          const response: any = await httpRequest.get(getUserDetailUrl(data.user_id));
          showModal({
            component: UserDetailEdit,
            showBtnClose: true,
            fullScreen: true,
            props: {
              dataForm: response,
            },
          });
        },
      },
      {
        label: 'lang_force_to_change_password',
        onClick: (data: any) =>
          showModal({
            title: 'lang_confirm',
            component: ConfirmEditModal,
            props: {
              emailConfirm: true,
              title: data.change_password ? 'lang_confirm_cancel_force_change_password' : 'lang_confirm_force_change_password',
              titleTransValues: { user: data[FIELD.USER_LOGIN] },
              onSubmit: () => confirmForceChangePassword(data[FIELD.USER_ID], data.change_password),
            },
          }),
      },
      {
        label: 'lang_delete_user',
        onClick: (data: any) =>
          showModal({
            title: 'lang_confirm',
            component: ConfirmEditModal,
            props: {
              emailConfirm: true,
              title: 'lang_confirm_delete_user',
              titleTransValues: { user: data[FIELD.USER_LOGIN] },
              onSubmit: () => confirmDeleteUser(data[FIELD.USER_ID]),
            },
          }),
      },
    ];
  }, []);

  const columns = React.useMemo(() => {
    return [
      {
        name: FIELD.USER_LOGIN,
        label: 'lang_user_login',
      },
      {
        name: FIELD.FULL_NAME,
        label: 'lang_full_name',
        formatter: (data: any) => (data?.[FIELD.FULL_NAME] + '').toUpperCase(),
      },
      {
        name: FIELD.SITE_NAME,
        label: 'lang_sitename',
        dataOptions: SITE_NAME_OPTIONS,
        type: COLUMN_TYPE.DROPDOWN,
      },
      {
        name: FIELD.STATUS,
        label: 'lang_status',
        dataOptions: USER_STATUS_OPTIONS,
        type: COLUMN_TYPE.DROPDOWN_WITH_BG,
      },
      {
        name: FIELD.NOTE,
        label: 'lang_notes',
        type: COLUMN_TYPE.INPUT,
      },
      {
        name: FIELD.ACTOR,
        label: 'lang_actor',
      },
      {
        name: FIELD.LAST_TIME,
        label: 'lang_last_active',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.CREATE_TIME,
        label: 'lang_create_time',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.UPDATED,
        label: 'lang_last_update',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: 'ACTION_COLUMN',
        type: COLUMN_TYPE.ACTION,
        actions: actions,
        label: ' ',
      },
    ];
  }, []);

  const onRowDbClick = () => {};

  const getRowId = (data: any) => {
    return data[FIELD.USER_ID];
  };

  const confirmEditUser = React.useCallback(async (data: any, callback: () => void) => {
    try {
      const bodyData = data?.map((e: LooseObject) => {
        const { user_login_id, ...rest } = e;
        return rest;
      });
      await httpRequest.put(getUserDetailUrl(), { data: bodyData });
      callback?.();
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_user_information_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      hideModal();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_user_information_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  }, []);

  const onSaveUser = (dicDataChanged: LooseObject, cb: any) => {
    const data = Object.keys(dicDataChanged).map((k) => ({
      ...dicDataChanged[k],
      [FIELD.USER_LOGIN]: dicUser.current[k][FIELD.USER_LOGIN],
      [FIELD.USER_ID]: k,
    }));
    showModal({
      title: 'lang_confirm',
      component: ConfirmEditModal,
      props: {
        emailConfirm: true,
        title: data.length < 6 ? 'lang_enter_your_email_to_edit_user_login' : 'lang_enter_your_email_to_edit_count_user_logins',
        titleTransValues: { count: data.length },
        data,
        onSubmit: () => confirmEditUser(data, cb),
      },
    });
  };

  return (
    <div className={classes.container}>
      <CustomTable
        name="user_management"
        editable
        fnKey={getRowId}
        ref={gridRef}
        onSave={onSaveUser}
        onTableChange={onTableChange}
        onRowDbClick={onRowDbClick}
        columns={columns}
        defaultSort={{ [FIELD.CREATE_TIME]: 'desc' }}
        noChangeKey="lang_there_is_no_change_in_the_user_information"
      />
    </div>
  );
};

export default UserManagement;
