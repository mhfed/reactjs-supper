import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Stack, Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import { InputField, AutocompleteAsyncField, PreviewField } from 'components/fields';
import { useFormik } from 'formik';
import * as yup from 'yup';
import httpRequest from 'services/httpRequest';
import { postCreateSegment } from 'apis/request.url';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';
import { Autocomplete, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    background: theme.palette.background.default,
    height: 'calc(100% - 100px)',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '40px',
    gap: '20px',
    borderRadius: '8px',
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: '1',
    width: '100%',
  },
  title: {
    textTransform: 'uppercase',
  },
}));

const STATE_FORM = {
  CREATE: 'CREATE',
  PREVIEW: 'PREVIEW',
};

const Sample = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [stateForm, setStateForm] = React.useState(STATE_FORM.CREATE);
  const [trigger, setTrigger] = React.useState(false);
  const handleClearData = () => {
    setTrigger((e) => !e);
    resetForm();
  };
  const handleReturn = () => {
    setStateForm(STATE_FORM.CREATE);
  };
  const handleFormSubmit = async (values: any) => {
    try {
      if (stateForm === STATE_FORM.CREATE) {
        setStateForm(STATE_FORM.PREVIEW);
      } else {
        const subcribersArray = values.segment_subscribers.map((x: any) => x.username);
        const body = {
          name: values.segment_name,
          subscribers: subcribersArray,
        };
        const response: any = await httpRequest.post(postCreateSegment(), body);
        dispatch(
          enqueueSnackbarAction({
            message: 'lang_create_segment_successfully',
            key: new Date().getTime() + Math.random(),
            variant: 'success',
          }),
        );
        handleClearData();
        setStateForm(STATE_FORM.CREATE);
      }
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_create_segment_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
      console.error('Create new segment handleFormSubmit error: ', error);
    }
  };
  const renderContent = (stateForm: string) => {
    let defaultArray = Array.isArray(values.segment_subscribers) ? values.segment_subscribers.map((x: any) => x.username) : [];
    switch (stateForm) {
      case STATE_FORM.PREVIEW:
        return (
          <form className={classes.container} noValidate onSubmit={handleSubmit}>
            <Typography className={classes.title} variant="h4">
              <Trans>lang_preview_new_segment</Trans>
            </Typography>
            <PreviewField sx={{ mb: 2, mr: 4 }} label="lang_segment_name" value={values.segment_name} />
            <FormControl style={{ pointerEvents: 'none' }} sx={{ minWidth: 120, width: '100%' }}>
              <Autocomplete
                multiple
                id="tags-readOnly"
                options={values.segment_subscribers}
                defaultValue={defaultArray}
                readOnly
                freeSolo
                // renderOption={(props, option, { selected }) => <li {...props}>{option.title}</li>}
                renderInput={(params) => <TextField {...params} label="readOnly"></TextField>}
              />
            </FormControl>
            <Stack className={classes.buttonWrapper} direction="row" spacing={2} sx={{ margin: '12px 0' }}>
              <Button variant="outlined" onClick={handleReturn}>
                <Trans>lang_return</Trans>
              </Button>
              <Button variant="contained" type="submit">
                <Trans>lang_confirm</Trans>
              </Button>
            </Stack>
          </form>
        );
      default:
        defaultArray = Array.isArray(values.segment_subscribers) ? values.segment_subscribers : [];
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
              trigger={trigger}
              onChange={(v: string) => setFieldValue('segment_subscribers', v)}
              error={touched.segment_subscribers && Boolean(errors.segment_subscribers)}
              helperText={touched.segment_subscribers && errors.segment_subscribers}
              value={values.segment_subscribers}
              required={true}
              defaultValue={defaultArray}
              fullWidth={true}
              id="segment_subscribers"
            />
            <Stack className={classes.buttonWrapper} direction="row" spacing={2} sx={{ margin: '12px 0' }}>
              <Button variant="outlined" onClick={handleClearData}>
                <Trans>lang_cancel</Trans>
              </Button>
              <Button variant="contained" type="submit">
                <Trans>lang_create</Trans>
              </Button>
            </Stack>
          </form>
        );
    }
  };
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });
  return renderContent(stateForm);
};
const initialValues = {
  segment_name: '',
  segment_subscribers: [],
};

const validationSchema = yup.object().shape({
  segment_name: yup
    .string()
    .required('lang_segment_name_is_required')
    .min(3, 'lang_segment_name_min_max_characters')
    .max(64, 'lang_segment_name_min_max_characters'),
  segment_subscribers: yup.array().min(1, 'lang_select_segment_subcriber').required('lang_select_segment_subcriber'),
});
export default Sample;
