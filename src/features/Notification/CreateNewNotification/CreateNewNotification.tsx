import React from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, Grid } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { NOTIFICATION_TYPE_OPTION, STATE_FORM } from './NotificationConstant';
import RadioGroupField from 'components/fields/RadioGroupField';

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

const CreateNewNotification: React.FC<CreateNewNotificationProps> = (props) => {
  const classes = useStyles();
  const [stateForm] = React.useState(STATE_FORM.CREATE);

  const submitForm = (values: {}, formikHelpers: FormikHelpers<{}>) => {};

  const renderContent = () => {
    switch (stateForm) {
      default: {
        return (
          <Grid container spacing={2}>
            <Grid item container xs={12} md={6}>
              <Grid item xs={12}>
                <RadioGroupField
                  name="notification_type"
                  label="Notification type"
                  data={NOTIFICATION_TYPE_OPTION}
                  required={true}
                  rowItems={true}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12} lg={6}>
              <p>xs=6 md=4</p>
            </Grid>
          </Grid>
        );
      }
    }
  };

  return (
    <Paper className={classes.wrapper}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitForm}>
        {({ values }) => {
          return renderContent();
        }}
      </Formik>
    </Paper>
  );
};
const initialValues = {
  notification_type: 'Direct',
};

const validationSchema = yup.object().shape({});

export default CreateNewNotification;
