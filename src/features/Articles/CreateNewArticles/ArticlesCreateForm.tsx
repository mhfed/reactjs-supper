/*
 * Created on Fri Jan 06 2023
 *
 * Articles create form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import {
  InputField,
  RichTextboxField,
  RadioGroupField,
  AttachmentField,
  AuthAutoCompleteField,
  SelectField,
  AutoCompleteField,
} from 'components/fields';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import makeStyles from '@mui/styles/makeStyles';
import { SITENAME_OPTIONS, SECURITY_TYPE_OPTIONS, SITENAME } from '../ArticlesConstants';
import { IFileUpload } from 'models/ICommon';
import Button from 'components/atoms/ButtonBase';
import { Trans } from 'react-i18next';
import { getSearchSitenameUrl, getSearchSecurityCodeUrl, getUploadUrl } from 'apis/request.url';
import { enqueueSnackbarAction } from 'actions/app.action';
import { useDispatch } from 'react-redux';
import httpRequest from 'services/httpRequest';
import { ICreateArticlesBody } from 'models/IArticles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    padding: theme.spacing(2),
    '& form': {
      display: 'flex',
      flex: 1,
      width: '100%',
    },
  },
}));

type ArticlesCreateFormProps = {
  onCreate: () => void;
};

const ArticlesCreateForm: React.FC<ArticlesCreateFormProps> = ({ onCreate }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleFormSubmit = async (values: any) => {
    try {
      // const body:ICreateArticlesBody = {
      //   subject: values.subject;
      //   content: values.content;
      //   image: string;
      //   attachment_url?: string;
      //   attachment_name?: string;
      //   site_name: string[];
      //   securities: string[];
      //   security_type: string;
      // }
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error?.errorCodeLang,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Paper className={classes.container}>
      <form noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item container spacing={2} xs={12} md={6} sx={{ height: 'fit-content' }}>
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
              <RichTextboxField
                required
                placeholder="lang_enter_your_content"
                label="lang_content"
                value={values.content}
                onChange={(e) => console.log('YOLO: ', e)}
              />
            </Grid>
            <Grid item xs={12}>
              <AttachmentField
                required
                image
                name="image"
                label="lang_thumbnail_image"
                selectText="lang_choose_image"
                helperText="(JPEG, JPG, PNG, HEIC)"
                accept=".png, .heic, .jpeg, .jpg"
                error={touched.image && Boolean(errors.image)}
                setFieldTouched={setFieldTouched}
                onChange={(file: IFileUpload) => setFieldValue('image', file)}
              />
            </Grid>
            <Grid item xs={12}>
              <AttachmentField
                name="file"
                label="lang_file_attachment"
                selectText="lang_choose_file"
                helperText="(PDF)"
                accept=".pdf"
                error={touched.file && Boolean(errors.file)}
                setFieldTouched={setFieldTouched}
                onChange={(file: IFileUpload) => setFieldValue('image', file)}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={2} xs={12} md={6} sx={{ height: 'fit-content' }}>
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
                <AutoCompleteField
                  name="sitename_custom"
                  label="lang_enter_sitename"
                  required
                  getUrl={getSearchSitenameUrl}
                  isOptionEqualToValue={(opt, select) => opt.site_name === select.site_name}
                  getOptionLabel={(opt) => opt.site_name}
                  value={values.sitename_custom}
                  onChange={(value) => setFieldValue('sitename_custom', value)}
                  onBlur={handleBlur}
                  error={touched.sitename_custom && Boolean(errors.sitename_custom)}
                  helperText={(touched.sitename_custom && errors.sitename_custom) as string}
                />
              </Grid>
            ) : (
              <></>
            )}
            <Grid item xs={12}>
              <AuthAutoCompleteField
                name="security_code"
                label="lang_security_code"
                required
                getUrl={getSearchSecurityCodeUrl}
                isOptionEqualToValue={(opt, select) => opt.securities === select.securities}
                getOptionLabel={(opt) => opt.securities}
                value={values.security_code}
                onChange={(value) => setFieldValue('security_code', value)}
                onBlur={handleBlur}
                error={touched.security_code && Boolean(errors.security_code)}
                helperText={(touched.security_code && errors.security_code) as string}
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
            <Button variant="outlined">
              <Trans>lang_clear</Trans>
            </Button>
            <Button variant="contained" sx={{ ml: 2 }} network>
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
  subject: '',
  content: '',
  image: '',
  file: '',
  site_name: SITENAME.ALL_SITES,
  sitename_custom: [],
  security_code: '',
  security_type: '',
};

const validationSchema = yup.object().shape({});
