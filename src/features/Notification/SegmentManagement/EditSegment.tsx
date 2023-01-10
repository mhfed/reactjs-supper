/*
 * Created on Fri Jan 06 2023
 *
 * Segment detail and edit segment
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Stack, Typography, Grid, Box, Chip, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import { InputField, AutocompleteAsyncField, PreviewField } from 'components/fields';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import httpRequest from 'services/httpRequest';
import { putDataUpdateSegmentByID } from 'apis/request.url';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';
import { Autocomplete, TextField, FormLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { LooseObject } from 'models/ICommon';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  divCointainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
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
  iconClose: {
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing(1),
    textTransform: 'uppercase',
    background: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.other4,
  },
  ChipTags: {
    color: '#27A6E7',
    backgroundColor: '#E3EFFD',
    border: 'none',
    '&:hover': {
      backgroundColor: '#08D98D',
      color: '#ffffff',
    },
    '&:hover svg': {
      fill: '#ffffff',
    },
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
  onTableChange?: () => {};
};
const EditSegment: React.FC<EditSegmentProps> = ({ typePage, dataForm, listSubscribers, onTableChange }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { showSubModal, hideModal, hideSubModal } = useGlobalModalContext();
  let initialValues = {
    segment_name: dataForm?.name || '',
    segment_subscribers: listSubscribers || [],
    segment_id: dataForm?.segment_id || '',
  };

  const dispatch = useDispatch();
  const [stateForm, setStateForm] = React.useState(typePage || STATE_FORM.DETAIL);
  const handleClose = () => {
    if (stateForm === STATE_FORM.DETAIL) {
      hideModal();
    } else {
      handleCancelEdit(true);
    }
  };
  const handleCancelEdit = (isXbutton: boolean) => {
    const isChangeSubscriber = compareArray(values.segment_subscribers, initialValues.segment_subscribers);
    if (values.segment_name === initialValues.segment_name && !isChangeSubscriber) {
      typePage === STATE_FORM.DETAIL && !isXbutton ? setStateForm(STATE_FORM.DETAIL) : hideModal();
    } else {
      showSubModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          isCancelPage: true,
          emailConfirm: false,
          onSubmit: () => {
            hideSubModal();
            resetForm();
            typePage === STATE_FORM.DETAIL && !isXbutton ? setStateForm(STATE_FORM.DETAIL) : hideModal();
          },
        },
      });
    }
  };
  const handleCancel = () => {
    if (typePage === STATE_FORM.DETAIL && stateForm === STATE_FORM.EDIT) {
      handleCancelEdit(false);
    } else {
      typePage === STATE_FORM.EDIT ? handleCancelEdit(false) : hideModal();
    }
  };

  const handleBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    setFieldValue('segment_name', values.segment_name.trim());
    handleBlur(e);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const subcribersArray = values.segment_subscribers.map((x: any) => ({ username: x.username, site_name: x.site_name }));
      const body = {
        name: values.segment_name,
        subscribers: subcribersArray,
      };
      await httpRequest.put(putDataUpdateSegmentByID(values.segment_id), body);
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_segment_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      onTableChange && onTableChange();
      hideSubModal();
      hideModal();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_segment_unsuccessfully',
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
      if (Object.values(errors).length > 0) return;
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

  const renderHeader = () => {
    return (
      <Box className={classes.header}>
        <Typography>
          <Trans>{stateForm === STATE_FORM.DETAIL ? 'lang_segment_details' : 'lang_edit_segment'}</Trans>
        </Typography>
        <CloseIcon className={classes.iconClose} onClick={handleClose} />
      </Box>
    );
  };
  const renderContent = () => {
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
                <FormControl sx={{ minWidth: 120, width: '100%' }}>
                  <Autocomplete
                    multiple
                    id="tags-readOnly"
                    options={values.segment_subscribers}
                    defaultValue={defaultArray}
                    readOnly
                    freeSolo
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: any, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          style={{ marginRight: theme.spacing(2) }}
                          title={`${values.segment_subscribers[index].username} (${values.segment_subscribers[index].site_name})`}
                          className={clsx(theme.palette.mode === 'dark' ? '' : classes.ChipTags, 'customTitle')}
                          key={index}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" label={<Trans>lang_subscribers</Trans>}></TextField>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Stack className={classes.buttonWrapper} direction="row" spacing={2}>
              {/* <Button variant="outlined" onClick={handleCancel}>
                <Trans>lang_cancel</Trans>
              </Button> */}
              <Button
                variant="contained"
                startIcon={<EditIcon />}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('segment_name', e.target.value.trimStart());
                  }}
                  onBlur={handleBlurInput}
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

  return (
    <div className={classes.divCointainer}>
      {renderHeader()}
      {renderContent()}
    </div>
  );
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
