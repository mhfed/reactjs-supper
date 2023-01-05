import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Stack, Typography, Grid } from '@mui/material';
import { Trans } from 'react-i18next';
import { InputField, AutocompleteAsyncField, PreviewField } from 'components/fields';
import { useFormik } from 'formik';
import * as yup from 'yup';
import httpRequest from 'services/httpRequest';
import { putDataUpdateSegmentByID } from 'apis/request.url';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';
import { Autocomplete, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { LooseObject } from 'models/ICommon';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(5),
    borderRadius: 8,
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
  dataForm?: any;
  listSubscribers?: any;
  // GoByDetail?: boolean;
};
const EditSegment: React.FC<EditSegmentProps> = ({ typePage, dataForm, listSubscribers }) => {
  const classes = useStyles();
  const { showSubModal, hideModal, hideSubModal } = useGlobalModalContext();
  let initialValues = {
    segment_name: dataForm?.name || '',
    segment_subscribers: listSubscribers || [],
    segment_id: dataForm?.segment_id || '',
  };
  const dispatch = useDispatch();
  const [stateForm, setStateForm] = React.useState(typePage || STATE_FORM.DETAIL);
  const handleCancel = () => {
    if (typePage === STATE_FORM.DETAIL && stateForm === STATE_FORM.EDIT) {
      setStateForm(STATE_FORM.DETAIL);
    } else {
      hideModal();
    }
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
      hideSubModal();
      hideModal();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_create_segment_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
      hideSubModal();
      console.error('Create new segment handleFormSubmit error: ', error);
    }
  };
  const compareArray = (array1: any, array2: any) => {
    const arrayString1 = array1.map((x: any) => x.username);
    const arrayString2 = array2.map((x: any) => x.username);
    let isChange = false;
    arrayString1.map((element: any) => {
      if (!arrayString2.includes(element)) {
        isChange = true;
      }
    });
    return isChange;
  };
  const onSave = () => {
    const isChangeSubscriber = compareArray(values.segment_subscribers, initialValues.segment_subscribers);
    if (values.segment_name === initialValues.segment_name && !isChangeSubscriber) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_there_is_no_change_in_the_segment_information',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
    } else {
      showSubModal({
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
  const isOptionEqualToValue = React.useCallback((option: LooseObject, value: LooseObject) => {
    return option.username === value.username;
  }, []);
  const renderContent = (stateForm: string) => {
    let defaultArray = Array.isArray(values.segment_subscribers) ? values.segment_subscribers.map((x: any) => x.username) : [];
    switch (stateForm) {
      case STATE_FORM.DETAIL:
        return (
          <form className={classes.container} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <PreviewField sx={{ mb: 2 }} label="lang_segment_name" value={values.segment_name} />
              </Grid>
              <Grid item xs={6}>
                <PreviewField sx={{ mb: 2 }} label="lang_segment_id" value={values.segment_id} />
              </Grid>
              <Grid item xs={12}>
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label={
                          <Typography variant="h4">
                            <Trans>lang_subscribers</Trans>
                          </Typography>
                        }
                      ></TextField>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Stack className={classes.buttonWrapper} direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleCancel}>
                <Trans>lang_cancel</Trans>
              </Button>
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
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputField
                  id="segment_name"
                  name="segment_name"
                  sx={{ mb: 2 }}
                  label="lang_segment_name"
                  required
                  fullWidth
                  value={values.segment_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.segment_name && Boolean(errors.segment_name)}
                  helperText={touched.segment_name && errors.segment_name}
                />
              </Grid>
              <Grid item xs={6}>
                <PreviewField
                  sx={{ mb: 2 }}
                  label="lang_segment_id"
                  value={values.segment_id}
                  variant="outlined"
                  disabled={true}
                  required={true}
                />
              </Grid>
              <Grid item xs={12}>
                <AutocompleteAsyncField
                  onBlur={handleBlur}
                  isOptionEqualToValue={isOptionEqualToValue}
                  onChange={(v: string) => setFieldValue('segment_subscribers', v)}
                  error={touched.segment_subscribers && Boolean(errors.segment_subscribers)}
                  helperText={touched.segment_subscribers && errors.segment_subscribers}
                  value={values.segment_subscribers}
                  required={true}
                  defaultValue={defaultArray}
                  fullWidth={true}
                  label="lang_subscribers"
                  id="segment_subscribers"
                />
              </Grid>
            </Grid>
            <Stack className={classes.buttonWrapper} direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleCancel}>
                {typePage === STATE_FORM.DETAIL ? <Trans>lang_back</Trans> : <Trans>lang_cancel</Trans>}
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
