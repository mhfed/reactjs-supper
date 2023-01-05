import React from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, Grid } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface CreateNewNotificationProps {}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    background: theme.palette.background.paper,
    padding: 40,
  },
}));

const STATE_FORM = {
  CREATE: 'CREATE',
  PREVIEW: 'PREVIEW',
};

const CreateNewNotification: React.FC<CreateNewNotificationProps> = (props) => {
  const classes = useStyles();
  const [stateForm] = React.useState(STATE_FORM.CREATE);

  const submitForm = (values: {}, formikHelpers: FormikHelpers<{}>) => {};

  const renderContent = () => {
    switch (stateForm) {
      default: {
        return (
          <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
              <Item>xs=6 md=8</Item>
            </Grid>
            <Grid item xs={6} md={4}>
              <Item>xs=6 md=4</Item>
            </Grid>
            <Grid item xs={6} md={4}>
              <Item>xs=6 md=4</Item>
            </Grid>
            <Grid item xs={6} md={8}>
              <Item>xs=6 md=8</Item>
            </Grid>
          </Grid>
        );
      }
    }
  };

  return (
    <Paper className={classes.wrapper}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitForm}>
        {renderContent()}
      </Formik>
    </Paper>
  );
};
const initialValues = {
  email: '',
  password: '',
};

const validationSchema = yup.object().shape({});

export default CreateNewNotification;
