/*
 * Created on Fri Jan 06 2023
 *
 * Articles create form with formik
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import {
  InputField,
  RichTextboxField,
  RadioGroupField,
  ImageField,
  FileField,
  SelectField,
  AutocompleteField,
} from 'components/fields';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import makeStyles from '@mui/styles/makeStyles';
import { APPNAME_OPTIONS, SECURITY_TYPE_OPTIONS, APPNAME } from '../ArticlesConstants';
import { IFileUpload, LooseObject } from 'models/ICommon';
import Button from 'components/atoms/ButtonBase';
import { Trans } from 'react-i18next';
import { getSearchAppNameUrl, getSearchSecurityCodeUrl } from 'apis/request.url';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import useConfirmEdit from 'hooks/useConfirmEdit';
import { diff } from 'deep-diff';
import ConfirmModal from 'components/molecules/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    padding: theme.spacing(3),
    '& form': {
      display: 'flex',
      flex: 1,
      width: '100%',
    },
  },
}));

type ArticlesCreateFormProps = {
  values: LooseObject;
  onCreate: (values: LooseObject, isSaveDraft?: boolean) => void;
};

const ArticlesCreateForm: React.FC<ArticlesCreateFormProps> = ({ onCreate, values: initValues }) => {
  const classes = useStyles();
  const { showSubModal, hideSubModal } = useGlobalModalContext();
  const valuesClone = React.useRef({});
  const confirmEdit = useConfirmEdit(() => !!diff(initialValues, valuesClone.current)); // eslint-disable-line
  /**
   * Handle articles create submit
   * @param values form data
   */
  const handleFormSubmit = (values: LooseObject) => {
    onCreate(values);
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    setTouched,
    setValues,
  } = useFormik({
    initialValues: { ...initialValues, ...initValues },
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  React.useEffect(() => {
    valuesClone.current = { ...values };
  }, [values]);

  /**
   * Hanle save draft, switch to preview with draft mode
   */
  const onSaveDraft = () => {
    if (isChange) {
      onCreate(values, true);
    } else {
      showSubModal({
        title: 'lang_confirm',
        component: ConfirmModal,
        props: {
          open: true,
          alertTitle: 'lang_confirm',
          alertContent: 'lang_required_draft_change',
          onSubmit: () => hideSubModal(),
          textSubmit: 'lang_ok',
        },
      });
    }
  };

  /**
   * Hanle clear form data
   */
  const onClear = () => {
    if (isChange) {
      showSubModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          emailConfirm: false,
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
          onSubmit: () => {
            hideSubModal();
            setValues(initialValues, false);
            setTouched({});
          },
        },
      });
    }
  };

  const isChange = React.useMemo(() => {
    return (
      values.title ||
      values.content ||
      values.image?.file ||
      values.file?.file ||
      values.app !== APPNAME.ALL_APPS ||
      (values.app === APPNAME.CUSTOM && values.appname_custom?.length) ||
      values.securities?.length ||
      values.security_type
    );
  }, [values]);

  return (
    <Paper className={classes.container}>
      <form noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item container spacing={2} xs={12} md={6}>
            <Grid item xs={12}>
              <InputField
                name="title"
                label="lang_title"
                required
                fullWidth
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <RichTextboxField
                required
                placeholder="lang_enter_your_content"
                label="lang_content"
                value={values.content}
                onChange={(e) => setFieldValue('content', e)}
                onBlur={() => setFieldTouched('content', true)}
                error={touched.content && Boolean(errors.content)}
                helperText={touched.content && errors.content}
              />
            </Grid>
            <Grid item xs={12}>
              <ImageField
                required
                name="image"
                label="lang_thumbnail_image"
                helperText="(JPEG, JPG, PNG, HEIC)"
                accept=".png, .heic, .jpeg, .jpg"
                error={touched.image && Boolean(errors.image)}
                errorText={touched.image && errors.image}
                value={values.image}
                setFieldTouched={setFieldTouched}
                onChange={(file: IFileUpload) => setFieldValue('image', file)}
              />
            </Grid>
            <Grid item xs={12}>
              <FileField
                name="file"
                label="lang_file_attachment"
                helperText="(PDF)"
                accept=".pdf"
                value={values.file}
                error={touched.file && Boolean(errors.file)}
                errorText={touched.file && errors.file}
                setFieldTouched={setFieldTouched}
                onChange={(file: IFileUpload) => setFieldValue('file', file)}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={2} xs={12} md={6}>
            <Grid item xs={12}>
              <RadioGroupField
                name="app"
                label="lang_app"
                data={APPNAME_OPTIONS}
                required
                rowItems
                value={values.app}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched?.app && Boolean(errors?.app)}
                helperText={touched.app && errors.app}
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                name="sitename"
                label="lang_sitename"
                required
                fullWidth
                disabled
                value={values.sitename}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.sitename && Boolean(errors.sitename)}
                helperText={touched.sitename && errors.sitename}
              />
            </Grid>
            {values.app === APPNAME.CUSTOM ? (
              <Grid item xs={12}>
                <AutocompleteField
                  name="appname_custom"
                  label="lang_app_name"
                  required
                  getUrl={getSearchAppNameUrl}
                  isOptionEqualToValue={(opt, select) => opt.bundle_id === select.bundle_id}
                  getOptionLabel={(opt) => opt.display_name || ''}
                  value={values.appname_custom}
                  onChange={(value) => setFieldValue('appname_custom', value)}
                  onBlur={() => setFieldTouched('appname_custom', true, true)}
                  error={touched.appname_custom && Boolean(errors.appname_custom)}
                  helperText={(touched.appname_custom && errors.appname_custom) as string}
                />
              </Grid>
            ) : (
              <></>
            )}
            <Grid item xs={12}>
              <AutocompleteField
                name="securities"
                label="lang_security_codes"
                getUrl={getSearchSecurityCodeUrl}
                isOptionEqualToValue={(opt, select) => opt.securities === select.securities}
                getOptionLabel={(opt) => opt.securities}
                value={values.securities}
                onChange={(value) => setFieldValue('securities', value)}
                onBlur={() => setFieldTouched('securities', true, true)}
                error={touched.securities && Boolean(errors.securities)}
                helperText={(touched.securities && errors.securities) as string}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectField
                options={SECURITY_TYPE_OPTIONS}
                name="security_type"
                label="lang_security_type"
                required
                fullWidth
                value={values?.security_type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched?.security_type && Boolean(errors?.security_type)}
                helperText={touched.security_type && errors.security_type}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" className="customBtnDisable" network onClick={onSaveDraft}>
              <Trans>lang_save_draft</Trans>
            </Button>
            <Button variant="outlined" sx={{ ml: 2 }} onClick={onClear}>
              <Trans>lang_clear</Trans>
            </Button>
            <Button type="submit" variant="contained" sx={{ ml: 2 }} network scrollToTop>
              <Trans>lang_create</Trans>
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ArticlesCreateForm;

const initialValues = {
  title: '',
  content: '',
  image: '',
  file: '',
  sitename: localStorage.getItem('sitename'),
  app: APPNAME.ALL_APPS,
  appname_custom: window.apps?.length === 1 ? window.apps : [],
  securities: [],
  security_type: '',
};

const validationSchema = yup.object().shape({
  title: yup.string().trim().checkRequired('lang_please_enter_title').max(255, 'lang_title_must_includes_255'),
  content: yup.string().trim().checkRequired('lang_please_enter_content'),
  image: yup.mixed().checkFile('lang_please_choose_image'),
  file: yup.mixed().checkFile('', 10000000, '.pdf'),
  appname_custom: yup.array().when(['app'], (app, schema) => {
    return app === APPNAME.CUSTOM ? schema.min(1, 'lang_app_name_is_required').required('lang_app_name_is_required') : schema;
  }),
  // securities: yup.array().min(1, 'lang_please_select_security_code').required('lang_please_select_security_code'),
  security_type: yup.string().required('lang_please_select_security_type'),
});
