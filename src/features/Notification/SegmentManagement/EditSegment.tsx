/*
 * Created on Fri Jan 06 2023
 *
 * Segment detail and edit segment
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Stack, Grid, Chip, useTheme } from '@mui/material';
import { Trans } from 'react-i18next';
import { InputField, AutocompleteField } from 'components/fields';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import httpRequest from 'services/httpRequest';
import { putDataUpdateSegmentByID } from 'apis/request.url';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';
import { Autocomplete, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { LooseObject } from 'models/ICommon';
import EditIcon from '@mui/icons-material/Edit';
import HeaderModal from 'components/atoms/HeaderModal';
import Button from 'components/atoms/ButtonBase';
import { getSearchSubscribersUrl } from 'apis/request.url';
import { compareArray } from 'helpers';

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
    padding: theme.spacing(3),
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

  /**
   * Handle close form when detail mode or back to detail at edit mode
   */
  const handleClose = () => {
    if (stateForm === STATE_FORM.DETAIL) {
      hideModal();
    } else {
      handleCancelEdit(true);
    }
  };

  /**
   * Handle cancel button press, check diff and show confirm cancel popup
   * @param isXbutton is press from close modal button
   */
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
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
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

  /**
   * Similar close button, handle cancel and close modal
   */
  const handleCancel = () => {
    if (typePage === STATE_FORM.DETAIL && stateForm === STATE_FORM.EDIT) {
      handleCancelEdit(false);
    } else {
      typePage === STATE_FORM.EDIT ? handleCancelEdit(false) : hideModal();
    }
  };

  /**
   * Trim data and set segment name
   * @param e input focus event
   */
  const handleBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    setFieldValue('segment_name', values.segment_name.trim());
    handleBlur(e);
  };

  /**
   * handle submit edit segment
   * @param values form data
   */
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

  /**
   * Handle save edited data
   */
  const onSave = () => {
    const isChangeSubscriber = compareArray(
      values.segment_subscribers.map((e: { username: string }) => e.username),
      initialValues.segment_subscribers.map((e: { username: string }) => e.username),
    );
    if (values.segment_name === initialValues.segment_name && !isChangeSubscriber) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_there_is_no_change_in_the_segment_information',
          // message: 'lang_there_is_nothing_to_change',
          key: new Date().getTime() + Math.random(),
          variant: 'warning',
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

  /**
   * Compare function to check selected option for list subscribers
   */
  const isOptionEqualToValue = React.useCallback((option: LooseObject, value: LooseObject) => {
    return option.username === value.username;
  }, []);

  const renderContent = () => {
    let defaultArray = Array.isArray(values.segment_subscribers) ? values.segment_subscribers.map((x: any) => x.username) : [];
    switch (stateForm) {
      case STATE_FORM.DETAIL:
        return (
          <form className={classes.container} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputField preview label="lang_segment_name" value={values.segment_name} />
              </Grid>
              <Grid item xs={6}>
                <InputField preview label="lang_segment_id" value={values.segment_id} />
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
                          className="customTitle"
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
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                network
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
                <InputField preview variant="outlined" label="lang_segment_id" value={values.segment_id} disabled required />
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
                  onBlur={() => setFieldTouched('segment_subscribers', true, true)}
                  error={touched.segment_subscribers && Boolean(errors.segment_subscribers)}
                  helperText={(touched.segment_subscribers && errors.segment_subscribers) as string}
                />
              </Grid>
            </Grid>
            <Stack className={classes.buttonWrapper} direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleCancel} scrollToTop>
                {typePage === STATE_FORM.DETAIL ? <Trans>lang_back</Trans> : <Trans>lang_cancel</Trans>}
              </Button>
              <Button network variant="contained" onClick={onSave}>
                <Trans>lang_save</Trans>
              </Button>
            </Stack>
          </form>
        );
    }
  };
  const { values, errors, touched, handleBlur, handleSubmit, setFieldValue, resetForm, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <div className={classes.divCointainer}>
      <HeaderModal title={stateForm === STATE_FORM.DETAIL ? 'lang_segment_details' : 'lang_edit_segment'} onClose={handleClose} />
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
