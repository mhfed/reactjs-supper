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
  AuthAutocompleteField,
  SelectField,
  AutocompleteField,
} from 'components/fields';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import HeaderModal from 'components/atoms/HeaderModal';
import { useFormik } from 'formik';
import { yup, checkDiffArticlesEdit } from 'helpers';
import makeStyles from '@mui/styles/makeStyles';
import { SITENAME_OPTIONS, SECURITY_TYPE_OPTIONS, SITENAME } from '../ArticlesConstants';
import { IFileUpload, LooseObject } from 'models/ICommon';
import { IArticlesFormData, ICreateArticlesBody } from 'models/IArticles';
import Button from 'components/atoms/ButtonBase';
import { Trans } from 'react-i18next';
import { getSearchSitenameUrl, getSearchSecurityCodeUrl, getArticlesUrl, getUploadUrl } from 'apis/request.url';
import { useGlobalModalContext } from 'containers/Modal';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { httpRequest } from 'services/initRequest';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import { isBlobFile } from 'helpers';

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
  const { showSubModal, hideSubModal, hideModal } = useGlobalModalContext();
  const dispatch = useDispatch();

  /**
   * Check data change and show popup confirm
   */
  const handleBeforeSubmit = (values: LooseObject) => {
    const isDiff = checkDiffArticlesEdit(initValues, values);
    if (!isDiff) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_there_is_no_change_in_the_article_information',
          key: new Date().getTime() + Math.random(),
          variant: 'warning',
        }),
      );
    } else {
      showSubModal({
        title: 'lang_confirm',
        component: ConfirmEditModal,
        props: {
          title: 'lang_enter_your_email_to_edit_article',
          emailConfirm: true,
          titleTransValues: { user: values.user_login },
          onSubmit: () => handleFormSubmit(values),
        },
      });
    }
  };

  /**
   * Handle submit edit articles
   * @param values Form value
   */
  const handleFormSubmit = async (values: LooseObject) => {
    try {
      const body: ICreateArticlesBody = {
        subject: values.subject,
        content: values.content,
        site_name:
          values.site_name === SITENAME.CUSTOM ? values.sitename_custom.map((e: any) => e.site_name) : [values.site_name],
        securities: values.securities.map((e: any) => e.securities),
        security_type: values.security_type,
      };
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
          message: 'lang_update_articles_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      onSuccess?.();
      hideModal();
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_articles_unsuccessfully',
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
    const isDiff = checkDiffArticlesEdit(initValues, values);
    if (isDiff) {
      showSubModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
          emailConfirm: false,
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

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = useFormik({
    initialValues: { ...initialValues, ...initValues },
    validationSchema: validationSchema,
    onSubmit: handleBeforeSubmit,
  });

  return (
    <>
      <HeaderModal title="lang_edit_articles" onClose={hideModal} />
      <Paper className={classes.container}>
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputField
                name="subject"
                label="lang_title"
                required
                fullWidth
                value={values.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.subject && Boolean(errors.subject)}
                helperText={touched.subject && errors.subject}
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
              <RadioGroupField
                name="site_name"
                label="lang_sitename"
                data={SITENAME_OPTIONS}
                required
                rowItems
                value={values.site_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched?.site_name && Boolean(errors?.site_name)}
                helperText={touched.site_name && errors.site_name}
              />
            </Grid>
            {values.site_name === SITENAME.CUSTOM ? (
              <Grid item xs={12}>
                <AutocompleteField
                  name="sitename_custom"
                  label="lang_enter_sitename"
                  sizeInput="small"
                  required
                  getUrl={getSearchSitenameUrl}
                  isOptionEqualToValue={(opt, select) => opt.site_name === select.site_name}
                  getOptionLabel={(opt) => opt.site_name}
                  value={values.sitename_custom}
                  onChange={(value) => setFieldValue('sitename_custom', value)}
                  onBlur={() => setFieldTouched('sitename_custom', true, true)}
                  error={touched.sitename_custom && Boolean(errors.sitename_custom)}
                  helperText={(touched.sitename_custom && errors.sitename_custom) as string}
                />
              </Grid>
            ) : (
              <></>
            )}
            <Grid item xs={12}>
              <AuthAutocompleteField
                name="securities"
                label="lang_security_code"
                required
                getUrl={getSearchSecurityCodeUrl}
                isOptionEqualToValue={(opt, select) => opt.securities === select.securities}
                getOptionLabel={(opt) => opt.securities}
                value={values.securities}
                onChange={(value) => setFieldValue('securities', value)}
                onBlur={handleBlur}
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
              <Button variant="outlined" onClick={() => handleCancel()} scrollToTop>
                <Trans>{editFirst ? 'lang_cancel' : 'lang_back'}</Trans>
              </Button>
              <Button type="submit" variant="contained" sx={{ ml: 2 }} network scrollToTop>
                <Trans>lang_save</Trans>
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default ArticlesEditForm;

const initialValues = {
  subject: '',
  content: '',
  image: '',
  file: '',
  site_name: SITENAME.ALL_SITES,
  sitename_custom: [],
  securities: [],
  security_type: '',
};

const validationSchema = yup.object().shape({
  subject: yup.string().trim().required('lang_please_enter_title'),
  content: yup.string().trim().required('lang_please_enter_content'),
  image: yup.mixed().checkFile('lang_please_choose_image'),
  file: yup.mixed().checkFile('', 10000000, '.pdf'),
  site_name: yup.string().required('lang_please_enter_sitename'),
  sitename_custom: yup.array().when(['site_name'], (sitename, schema) => {
    return sitename === SITENAME.CUSTOM
      ? schema.min(1, 'lang_please_enter_sitename').required('lang_please_enter_sitename')
      : schema;
  }),
  securities: yup.array().min(1, 'lang_please_select_security_code').required('lang_please_select_security_code'),
  security_type: yup.string().required('lang_please_select_security_type'),
});
