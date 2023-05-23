/*
 * Created on Fri Jan 06 2023
 *
 * Articles edit form
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
import HeaderModal from 'components/atoms/HeaderModal';
import { useFormik } from 'formik';
import { yup, checkDiffArticlesEdit } from 'helpers';
import makeStyles from '@mui/styles/makeStyles';
import { APPNAME_OPTIONS, SECURITY_TYPE_OPTIONS, APPNAME } from '../ArticlesConstants';
import { IBundle, IFileUpload, LooseObject } from 'models/ICommon';
import { IArticlesFormData, ICreateArticlesBody } from 'models/IArticles';
import Button from 'components/atoms/ButtonBase';
import { Trans } from 'react-i18next';
import { getSearchAppNameUrl, getSearchSecurityCodeUrl, getArticlesUrl, getUploadUrl } from 'apis/request.url';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmModal from 'components/molecules/ConfirmModal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { httpRequest } from 'services/initRequest';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import { isBlobFile } from 'helpers';
import { STEP } from '../ArticlesConstants';
import ArticlesPreviewForm from './ArticlesPreviewForm';
import { ARTICLE_STATUS } from '../../Notification/NotificationConstants';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    overflow: 'auto',
    background: theme.palette.background.contentModal,
    padding: theme.spacing(3),
    '& form': {
      display: 'flex',
      flex: 1,
      width: '100%',
    },
  },
}));

type ArticlesEditFormProps = {
  data: IArticlesFormData;
  onCancel: () => void;
  onSuccess?: () => void;
  editFirst: boolean;
};

const ArticlesEditForm: React.FC<ArticlesEditFormProps> = ({ data: initValues, onCancel, editFirst, onSuccess }) => {
  const classes = useStyles();
  const [step, setStep] = React.useState<number>(STEP.EDIT);
  const { showSubModal, hideSubModal, hideModal } = useGlobalModalContext();
  const dispatch = useDispatch();
  const isSaveDraft = React.useRef(false);
  const [loading, setLoading] = React.useState(false);

  /**
   * Check data change and show popup confirm
   */
  const handleBeforeSubmit = (values: LooseObject) => {
    if (isDraft) {
      isSaveDraft.current = false;
      setStep(STEP.PREVIEW);
    } else {
      if (!isDiff) {
        dispatch(
          enqueueSnackbarAction({
            message: 'lang_there_is_no_change_in_the_article_information',
            key: new Date().getTime() + Math.random(),
            variant: 'warning',
          }),
        );
      } else {
        isSaveDraft.current = false;
        setStep(STEP.PREVIEW);
      }
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = useFormik({
    initialValues: { ...initialValues, ...initValues },
    validationSchema: validationSchema,
    onSubmit: handleBeforeSubmit,
  });

  /**
   * Come back to create form from preview mode
   */
  const onReturn = () => {
    setStep(STEP.EDIT);
  };

  /**
   * Handle submit edit articles
   * @param values Form value
   */
  const onSubmit = async (isPublish?: boolean, successCb?: () => void, errorCb?: () => void) => {
    try {
      setLoading(true);
      const body: ICreateArticlesBody = {
        title: values.title,
        content: values.content,
        security_type: values.security_type,
        article_type: isSaveDraft.current ? 'draft' : 'publish',
        notification_enabled: isPublish || values.notification_enabled,
      };
      if (values.securities?.length) {
        body.securities = values.securities.map((e: any) => e.securities);
      } else delete body.securities;
      if (values.app === APPNAME.CUSTOM) {
        body.bundle_id = values.appname_custom.map((e: IBundle) => e.bundle_id);
      } else delete body.bundle_id;
      if (values.image.url) {
        body.image = values.image.url;
      }
      if (values.file.url) {
        body.attachment_url = values.file.url;
        body.attachment_name = values.file.name || 'attachment_name';
      }
      if (isBlobFile(values.image)) {
        const formData = new FormData();
        formData.append('file', values.image.file);
        const { data: imageResponse } = await httpRequest.post(getUploadUrl(), formData);
        body.image = imageResponse.url;
      }
      if (isBlobFile(values.file)) {
        const formData = new FormData();
        formData.append('file', values.file.file);
        const { data: fileResponse } = await httpRequest.post(getUploadUrl(), formData);
        body.attachment_url = fileResponse.url;
        body.attachment_name = values.file.name;
      }
      await httpRequest.put(getArticlesUrl(initValues.article_id), body);
      dispatch(
        enqueueSnackbarAction({
          message: isSaveDraft.current ? 'lang_draft_save_successfully' : 'lang_update_articles_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      successCb?.();
      onSuccess?.();
      hideModal();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorCb?.();
      const message = [120003].includes(error?.errorCode)
        ? error?.errorCodeLang
        : isSaveDraft.current
        ? 'lang_save_draft_unsuccessfully'
        : 'lang_update_articles_unsuccessfully';
      dispatch(
        enqueueSnackbarAction({
          message,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  };

  /**
   * Handle cancel edit, show confirm if user changed data
   */
  const handleCancel = () => {
    if (isDiff) {
      showSubModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          emailConfirm: false,
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
          onSubmit: () => {
            if (editFirst) hideModal();
            else {
              hideSubModal();
              onCancel();
            }
          },
        },
      });
    } else if (editFirst) {
      hideModal();
    } else {
      onCancel();
    }
  };

  /**
   * Handle close edit form, show confirm if user changed data
   */
  const handleCloseModal = () => {
    if (!isDiff) return hideModal();

    return showSubModal({
      title: 'lang_confirm_cancel',
      component: ConfirmEditModal,
      props: {
        title: 'lang_confirm_cancel_text',
        emailConfirm: false,
        cancelText: 'lang_no',
        confirmText: 'lang_yes',
        onSubmit: () => {
          hideModal();
        },
      },
    });
  };

  /**
   * Hanle save draft, switch to preview with draft mode
   */
  const onSaveDraft = () => {
    if (!isDiff) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_there_is_no_change_in_the_article_information',
          key: new Date().getTime() + Math.random(),
          variant: 'warning',
        }),
      );
    } else {
      isSaveDraft.current = true;
      onSubmit(false);
    }
  };

  const isDiff = checkDiffArticlesEdit(initValues, values);
  const haveSaveDraft = [ARTICLE_STATUS.DRAFT, ARTICLE_STATUS.SCHEDULED].includes(initValues.status);
  const isDraft = initValues.status === ARTICLE_STATUS.DRAFT;
  const isCompleted = initValues.status === ARTICLE_STATUS.COMPLETED;
  return (
    <>
      {step === STEP.EDIT ? (
        <>
          <HeaderModal title="lang_edit_article" onClose={handleCloseModal} />
          <Paper className={classes.container}>
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
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
                  <RadioGroupField
                    name="app"
                    label="lang_app"
                    data={APPNAME_OPTIONS}
                    required
                    rowItems
                    disabled={isCompleted}
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
                    maxLength={255}
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
                      disabled={isCompleted}
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
                  <RichTextboxField
                    required
                    placeholder="lang_enter_your_content"
                    label="lang_content"
                    value={values.content}
                    onChange={(e) => setFieldValue('content', e)}
                    error={touched.content && Boolean(errors.content)}
                    helperText={touched.content && errors.content}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', pb: 3 }}>
                  {haveSaveDraft ? (
                    <Button variant="outlined" className="customBtnDisable" network onClick={onSaveDraft} isLoading={loading}>
                      <Trans>lang_save_draft</Trans>
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button variant="outlined" sx={{ ml: 2 }} onClick={() => handleCancel()} scrollToTop>
                    <Trans>{editFirst ? 'lang_cancel' : 'lang_back'}</Trans>
                  </Button>
                  <Button type="submit" variant="contained" sx={{ ml: 2 }} network scrollToTop>
                    <Trans>{isDraft ? 'lang_create' : 'lang_save'}</Trans>
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </>
      ) : (
        <>
          <HeaderModal title="lang_preview_edit_article" onClose={handleCloseModal} />
          <ArticlesPreviewForm onReturn={onReturn} values={values} onSubmit={onSubmit} />
        </>
      )}
    </>
  );
};

export default ArticlesEditForm;

const initialValues = {
  title: '',
  content: '',
  image: '',
  file: '',
  app: APPNAME.ALL_APPS,
  sitename: localStorage.getItem('sitename'),
  appname_custom: [],
  securities: [],
  security_type: '',
};

const validationSchema = yup.object().shape({
  title: yup.string().trim().required('lang_please_enter_title'),
  content: yup.string().trim().required('lang_please_enter_content'),
  image: yup.mixed().checkFile('lang_please_choose_image'),
  file: yup.mixed().checkFile('', 10000000, '.pdf'),
  app: yup.string().required('lang_please_enter_sitename'),
  appname_custom: yup.array().when(['app'], (app, schema) => {
    return app === APPNAME.CUSTOM ? schema.min(1, 'lang_app_name_is_required').required('lang_app_name_is_required') : schema;
  }),
  // securities: yup.array().min(1, 'lang_please_select_security_code').required('lang_please_select_security_code'),
  security_type: yup.string().required('lang_please_select_security_type'),
});
