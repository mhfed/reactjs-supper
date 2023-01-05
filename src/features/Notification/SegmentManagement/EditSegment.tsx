import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Stack, Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import { InputField, AutocompleteAsyncField, PreviewField } from 'components/fields';
import { useFormik } from 'formik';
import * as yup from 'yup';
import httpRequest from 'services/httpRequest';
import { postCreateSegment, putDataUpdateSegmentByID } from 'apis/request.url';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';
import { Autocomplete, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useLocation } from 'react-router';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    background: theme.palette.background.other2,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(5),
    gap: theme.spacing(2),
    borderRadius: 8,
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
    width: '100%',
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(2),
  },
}));

const STATE_FORM = {
  DETAIL: 'DETAIL',
  EDIT: 'EDIT',
};
type EditSegmentProps = {
  typePage?: string;
  // onClose: () => void;
};
const EditSegment: React.FC<EditSegmentProps> = () => {
  const classes = useStyles();
  const location = useLocation();
  const { showModal, hideModal } = useGlobalModalContext();
  const formData = location.state.data;
  formData.listSubscribers = location?.state?.listSubscribers || [];
  const initialValues = {
    segment_name: formData?.name || '',
    segment_subscribers: formData?.listSubscribers,
    segment_id: formData?.segment_id || '',
  };
  const dispatch = useDispatch();
  const [stateForm, setStateForm] = React.useState(location?.state?.typePage ? location?.state?.typePage : STATE_FORM.DETAIL);
  const handleClearData = () => {
    resetForm();
  };
  const handleFormSubmit = async (values: any) => {
    try {
      const subcribersArray = values.segment_subscribers.map((x: any) => x.username);
      const body = {
        name: values.segment_name,
        subscribers: subcribersArray,
      };
      await httpRequest.put(putDataUpdateSegmentByID(values.segment_id), body);
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_create_segment_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      handleClearData();
      hideModal();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_create_segment_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
      hideModal();
      console.error('Create new segment handleFormSubmit error: ', error);
    }
  };
  const onSave = () => {
    if (JSON.stringify(values) === JSON.stringify(initialValues)) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_there_is_no_change_in_the_segment_information',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
    } else {
      showModal({
        title: 'lang_confirm',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_edit_segment',
          titleTransValues: { segment: values.segment_id },
          onSubmit: () => handleFormSubmit(values),
        },
      });
    }
  };
  const renderContent = (stateForm: string) => {
    let defaultArray = Array.isArray(values.segment_subscribers) ? values.segment_subscribers.map((x: any) => x.username) : [];
    switch (stateForm) {
      case STATE_FORM.DETAIL:
        return (
          <form className={classes.container} noValidate onSubmit={handleSubmit}>
            <Typography className={classes.title} variant="h4">
              <Trans>lang_segment_details</Trans>
            </Typography>
            <Stack direction="row" style={{ width: '100%' }}>
              <PreviewField sx={{ mb: 2, mr: 2 }} label="lang_segment_name" value={values.segment_name} />
              <PreviewField sx={{ mb: 2 }} label="lang_segment_id" value={values.segment_id} />
            </Stack>
            <FormControl style={{ pointerEvents: 'none' }} sx={{ minWidth: 120, width: '100%' }}>
              <Typography sx={{ mb: '12px' }} variant="h5">
                <Trans>lang_subscribers</Trans>
              </Typography>
              <Autocomplete
                multiple
                id="tags-readOnly"
                options={values.segment_subscribers}
                defaultValue={defaultArray}
                readOnly
                freeSolo
                // renderOption={(props, option, { selected }) => <li {...props}>{option.title}</li>}
                renderInput={(params) => <TextField {...params}></TextField>}
              />
            </FormControl>
            <Stack className={classes.buttonWrapper} direction="row" spacing={2} sx={{ margin: '12px 0' }}>
              <Button
                variant="contained"
                onClick={() => {
                  setStateForm(STATE_FORM.EDIT);
                }}
              >
                <Trans>lang_edit</Trans>
              </Button>
            </Stack>
          </form>
        );
      default:
        defaultArray = Array.isArray(values.segment_subscribers) ? values.segment_subscribers : [];
        return (
          <form className={classes.container} noValidate onSubmit={handleSubmit}>
            <Stack direction="row" style={{ width: '100%' }}>
              <InputField
                id="segment_name"
                name="segment_name"
                sx={{ mb: 2, mr: 2 }}
                label="lang_segment_name"
                required
                fullWidth
                value={values.segment_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.segment_name && Boolean(errors.segment_name)}
                helperText={touched.segment_name && errors.segment_name}
              />
              <PreviewField sx={{ mb: 2, mr: 4 }} label="lang_segment_id" value={values.segment_id} />
            </Stack>

            <AutocompleteAsyncField
              onBlur={handleBlur}
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
              <Button variant="contained" onClick={onSave}>
                <Trans>lang_save</Trans>
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

const validationSchema = yup.object().shape({
  segment_name: yup
    .string()
    .required('lang_segment_name_is_required')
    .min(3, 'lang_segment_name_min_max_characters')
    .max(64, 'lang_segment_name_min_max_characters'),
  segment_subscribers: yup.array().min(1, 'lang_select_segment_subcriber').required('lang_select_segment_subcriber'),
});
export default EditSegment;
