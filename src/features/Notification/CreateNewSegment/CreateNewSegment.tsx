/*
 * Created on Fri Jan 06 2023
 *
 * Create new segment form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Stack, Typography, Grid, Chip, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import { InputField, AutocompleteField, PreviewField } from 'components/fields';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import { getSearchSubscribersUrl } from 'apis/request.url';
import { useGlobalModalContext } from 'containers/Modal';
import httpRequest from 'services/httpRequest';
import { postCreateSegment } from 'apis/request.url';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';
import { Autocomplete, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { LooseObject } from 'models/ICommon';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    height: '100%',
    background: theme.palette.mode === 'dark' ? theme.palette.background.other2 : theme.palette.background.default,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(5),
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
  CREATE: 'CREATE',
  PREVIEW: 'PREVIEW',
};

const Sample = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { showModal, hideModal } = useGlobalModalContext();
  const [stateForm, setStateForm] = React.useState(STATE_FORM.CREATE);
  const handleClearData = () => {
    if (JSON.stringify(values) !== JSON.stringify(initialValues))
      showModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
          emailConfirm: false,
          onSubmit: () => {
            resetForm();
            hideModal();
          },
        },
      });
  };

  const handleReturn = () => {
    setStateForm(STATE_FORM.CREATE);
  };
  const handleFormSubmit = async (values: any) => {
    try {
      if (stateForm === STATE_FORM.CREATE) {
        setStateForm(STATE_FORM.PREVIEW);
      } else {
        const subcribersArray = values.segment_subscribers.map((x: any) => ({ username: x.username, site_name: x.site_name }));
        const body = {
          name: values.segment_name,
          subscribers: subcribersArray,
        };
        await httpRequest.post(postCreateSegment(), body);
        dispatch(
          enqueueSnackbarAction({
            message: 'lang_create_segment_successfully',
            key: new Date().getTime() + Math.random(),
            variant: 'success',
          }),
        );
        resetForm();
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

  const isOptionEqualToValue = React.useCallback((option: LooseObject, value: LooseObject) => {
    return option.username === value.username;
  }, []);

  const handleBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    setFieldValue('segment_name', values.segment_name.trim());
    handleBlur(e);
  };

  const renderContent = (stateForm: string) => {
    let defaultArray = Array.isArray(values.segment_subscribers) ? values.segment_subscribers.map((x: any) => x.username) : [];
    switch (stateForm) {
      case STATE_FORM.PREVIEW:
        return (
          <form className={classes.container} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography className={classes.title}>
                  <Trans>lang_preview_new_segment</Trans>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <PreviewField sx={{ mb: 2, mr: 4 }} label="lang_segment_name" value={values.segment_name} />
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
                          {...getTagProps({ index })}
                          label={option}
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
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputField
                  id="segment_name"
                  name="segment_name"
                  sx={{ mb: 2, mr: 4 }}
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
              <Grid item xs={12}>
                <AutocompleteField
                  name="segment_subscribers"
                  label="lang_subscribers"
                  required
                  getUrl={getSearchSubscribersUrl}
                  isOptionEqualToValue={isOptionEqualToValue}
                  getOptionLabel={(option) => `${option.username} (${option.site_name})`}
                  getChipLabel={(option) => option.username}
                  value={values.segment_subscribers}
                  onChange={(value) => setFieldValue('segment_subscribers', value)}
                  onBlur={handleBlur}
                  error={touched.segment_subscribers && Boolean(errors.segment_subscribers)}
                  helperText={(touched.segment_subscribers && errors.segment_subscribers) as string}
                />
              </Grid>
            </Grid>
            <Stack className={classes.buttonWrapper} direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleClearData}>
                <Trans>lang_clear</Trans>
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
