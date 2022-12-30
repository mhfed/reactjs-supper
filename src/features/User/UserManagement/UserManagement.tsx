import React from 'react';
import { getSearchUserUrl } from 'apis/request.url';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import httpRequest from 'services/httpRequest';
import CustomTable, { COLUMN_TYPE } from 'components/molecules/CustomTable';
import makeStyles from '@mui/styles/makeStyles';
import { FIELD, USER_STATUS_OPTIONS, SITE_NAME_OPTIONS } from './UserConstants';
import { ITableData, ITableConfig } from 'models/ICommon';

const useStyles = makeStyles(() => ({
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

  const getData = async () => {
    try {
      const curPage: Partial<ITableData> = gridRef?.current?.getPaginate?.();
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

  const onTableChange = () => {
    getData();
  };

  React.useEffect(() => {
    getData();
  }, []);

  const actions = React.useMemo(() => {
    return [
      {
        label: 'lang_user_detail',
        onClick: () => console.log('YOLO: lang_user_detail'),
      },
      {
        label: 'lang_reset_password',
        onClick: () => console.log('YOLO: lang_reset_password'),
      },
      {
        label: 'lang_force_to_change_password',
        onClick: () => console.log('YOLO: lang_force_to_change_password'),
      },
    ];
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
        label: 'lang_note',
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
        label: 'lang_last_updated',
        type: COLUMN_TYPE.DATETIME,
      },
      {
        name: FIELD.ACTION,
        type: COLUMN_TYPE.ACTION,
        actions: actions,
        label: ' ',
      },
    ];
  };

  const onRowDbClick = () => {};

  return (
    <div className={classes.container}>
      <CustomTable ref={gridRef} onTableChange={onTableChange} onRowDbClick={onRowDbClick} columns={getColumns()} />
    </div>
  );
};

export default UserManagement;
