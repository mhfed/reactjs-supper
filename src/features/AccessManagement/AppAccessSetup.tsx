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

const FORM_TYPE = {
  EDIT: 'EDIT',
  PREVIEW: 'PREVIEW',
};
type EditSegmentProps = {
  typePage?: string;
  dataForm?: any;
  listSubscribers?: any;
  callback?: () => void;
};
const AppAccessSetup: React.FC<EditSegmentProps> = ({ typePage, dataForm, listSubscribers, callback }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { showSubModal, hideModal, hideSubModal } = useGlobalModalContext();
  const dispatch = useDispatch();
  const [formType, setFormType] = React.useState(FORM_TYPE.EDIT);
  const initialValues = {};

  /**
   * Handle setup app access
   * @param values form data
   */
  const handleFormSubmit = async (values: any) => {};

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  /**
   * Compare function to check selected option for list subscribers
   */
  const isOptionEqualToValue = React.useCallback((option: LooseObject, value: LooseObject) => {
    return option.username === value.username;
  }, []);

  return (
    <div className={classes.divCointainer}>
      <HeaderModal title={formType === FORM_TYPE.EDIT ? 'lang_app_access_setup' : 'lang_preview_edit_access'} />
      {formType === FORM_TYPE.EDIT ? (
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
            <Button variant="outlined" scrollToTop>
              <Trans>lang_cancel</Trans>
            </Button>
            <Button network variant="contained">
              <Trans>lang_save</Trans>
            </Button>
          </Stack>
        </form>
      ) : (
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
            <Button variant="outlined" scrollToTop>
              <Trans>lang_cancel</Trans>
            </Button>
            <Button network variant="contained">
              <Trans>lang_save</Trans>
            </Button>
          </Stack>
        </form>
      )}
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

export default AppAccessSetup;
