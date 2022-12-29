import React from 'react';
import { getSearchUserUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import httpRequest from 'services/httpRequest';
import CustomTable, { TableData, COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { USER_STATUS_OPTIONS } from './constants';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export const FIELD = {
  USER_ID: 'user_id',
  USER_LOGIN: 'user_login_id',
  FULL_NAME: 'full_name',
  SITE_NAME: 'site_name',
  USER_TYPE: 'user_type',
  ROLE_GROUP: 'role_group',
  USER_GROUP: 'user_group',
  ACCESS_METHOD: 'access_method',
  STATUS: 'status',
  EMAIL_TEMPLATE: 'email_template',
  LIVE_NEWS: 'live_news',
  MORNINGSTAR: 'addon',
  TIPRANK: 'tipRank',
  BROKERDATA: 'brokerData',
  CONTINGENTORDER: 'contingentOrder',
  EMAIL: 'email',
  PHONE: 'phone',
  LIST_MAPPING: 'list_mapping',
  NOTE: 'note',
  ACTOR: 'actor',
  UPDATED: 'updated',
  WHITE_LABEL: 'bl_environment',
  LAST_TIME: 'last_time',
  CREATE_TIME: 'create_time',
  ACTION: 'action',
};

type TableHandle = React.ElementRef<typeof CustomTable>;
type UserManagementProps = {};

const UserManagement: React.FC<UserManagementProps> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const gridRef = React.useRef<TableHandle>(null);

  const getData = async () => {
    try {
      const curPage: Partial<TableData> = gridRef?.current?.getPaginate?.();
      const queryBody: any = gridRef?.current?.getQuery?.();
      const response: any = await httpRequest.post(getSearchUserUrl(curPage.page, curPage.rowsPerPage), queryBody);
      gridRef?.current?.setData?.(response);
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

  React.useEffect(() => {
    getData();
  }, []);

  const getColumns = () => {
    return [
      {
        name: FIELD.USER_LOGIN,
        label: 'lang_user_login',
      },
      {
        name: FIELD.FULL_NAME,
        label: 'lang_full_name',
      },
      {
        name: FIELD.SITE_NAME,
        label: 'lang_site_name',
      },
      {
        name: FIELD.STATUS,
        label: 'lang_status',
        dataOptions: USER_STATUS_OPTIONS,
        type: COLUMN_TYPE.DROPDOWN,
      },
      {
        name: FIELD.NOTE,
        label: 'lang_note',
      },
      {
        name: FIELD.ACTOR,
        label: 'lang_actor',
      },
      {
        name: FIELD.LAST_TIME,
        label: 'lang_last_active',
      },
      {
        name: FIELD.CREATE_TIME,
        label: 'lang_create_time',
      },
      {
        name: FIELD.UPDATED,
        label: 'lang_last_updated',
      },
      {
        name: FIELD.ACTION,
        label: ' ',
      },
    ];
  };
  const onTableChange = () => {};
  const onRowDbClick = () => {};

  return (
    <div className={classes.container}>
      <CustomTable ref={gridRef} onTableChange={onTableChange} onRowDbClick={onRowDbClick} columns={getColumns()} />
    </div>
  );
};

export default UserManagement;
