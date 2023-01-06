import makeStyles from '@mui/styles/makeStyles';

import { IStyles } from './ConfirmModal';

const useStyles = (props: IStyles) =>
  makeStyles((theme) => ({
    container: {
      '& .MuiDialog-paper': {
        width: 'fit-content',
        minWidth: 336,
        alignItems: 'center',
        paddingBottom: theme.spacing(1),
      },
    },
  }));

export default useStyles;
