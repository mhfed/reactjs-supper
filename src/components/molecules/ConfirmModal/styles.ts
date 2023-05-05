import makeStyles from '@mui/styles/makeStyles';

import { IStyles } from './ConfirmModal';

const useStyles = (props: IStyles) =>
  makeStyles((theme) => ({
    container: {
      '& .MuiDialog-paper': {
        width: 'fit-content',
        minWidth: 440,
        alignItems: 'center',
        background: theme.palette.background.contentModal,
      },
      '& .MuiDialogTitle-root': {
        width: '100%',
        fontWeight: 'bold',
        background: theme.palette.background.headerModal,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1, 2),
      },
      '& .MuiDialogContent-root': {
        width: '100%',
        display: 'flex',
        padding: theme.spacing(2),
        minHeight: 88,
      },
      '& .MuiDialogActions-root': {
        width: '100%',
        display: 'flex',
        padding: theme.spacing(2),
      },
    },
  }));

export default useStyles;
