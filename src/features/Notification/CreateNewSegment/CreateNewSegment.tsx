import makeStyles from '@mui/styles/makeStyles';
import { Button, Stack } from '@mui/material';
import { Trans } from 'react-i18next';
import { InputField, AutocompleteAsyncField } from 'components/fields';
import { useFormik } from 'formik';
import * as yup from 'yup';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    background: theme.palette.background.default,
    height: 'calc(100% - 100px)',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '40px',
    gap: '20px',
    color: 'black',
    borderRadius: '8px',
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: '1',
    width: '100%',
  },
}));

const Sample = () => {
  const classes = useStyles();
  const handleFormSubmit = async (values: any) => {
    console.log('values', values);
    console.log('error:', errors);
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });
  return (
    <form className={classes.container} noValidate onSubmit={handleSubmit}>
      <InputField
        id="segment_name"
        name="segment_name"
        sx={{ mb: 2, mr: 4 }}
        label="lang_segment_name"
        required
        fullWidth
        value={values.segment_name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.segment_name && Boolean(errors.segment_name)}
        helperText={touched.segment_name && errors.segment_name}
      />
      <AutocompleteAsyncField
        onBlur={handleBlur}
        error={touched.segment_subscribers && Boolean(errors.segment_subscribers)}
        helperText={touched.segment_subscribers && errors.segment_subscribers}
        value={values.segment_subscribers}
        required={true}
        fullWidth={true}
        id="segment_subscribers"
      />
      <Stack className={classes.buttonWrapper} direction="row" spacing={2} sx={{ margin: '12px 0' }}>
        <Button variant="outlined">
          <Trans>lang_cancel</Trans>
        </Button>
        <Button variant="contained" type="submit" onClick={() => handleSubmit()}>
          <Trans>lang_create</Trans>
        </Button>
      </Stack>
    </form>
  );
};
const initialValues = {
  segment_name: '',
};

const validationSchema = yup.object().shape({
  segment_name: yup.string().required('lang_segment_name_is_required'),
  segment_subscribers: yup.string().required('lang_select_segment_subcriber'),
});
export default Sample;
