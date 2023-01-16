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
  ImageField,
  FileField,
  SelectField,
  AutocompleteField,
  AuthAutocompleteField,
} from 'components/fields';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import makeStyles from '@mui/styles/makeStyles';
import { SITENAME_OPTIONS, SECURITY_TYPE_OPTIONS, SITENAME } from '../ArticlesConstants';
import { IFileUpload, LooseObject } from 'models/ICommon';
import Button from 'components/atoms/ButtonBase';
import { Trans } from 'react-i18next';
import { getSearchSitenameUrl, getSearchSecurityCodeUrl } from 'apis/request.url';

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
  onCreate: (values: LooseObject) => void;
};

const ArticlesCreateForm: React.FC<ArticlesCreateFormProps> = ({ onCreate, values: initValues }) => {
  const classes = useStyles();

  const handleFormSubmit = async (values: LooseObject) => {
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

  const onClear = () => {
    setValues(initialValues, false);
    setTouched({});
  };

  return (
    <Paper className={classes.container}>
      <form noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item container spacing={2} xs={12} md={6}>
            <Grid item xs={12}>
              <InputField
                name="subject"
                label="lang_title"
                required
                fullWidth
                maxLength={255}
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
                onChange={(e) => setFieldValue('content', e)}
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
            <Button variant="outlined" onClick={onClear}>
              <Trans>lang_clear</Trans>
            </Button>
            <Button type="submit" variant="contained" sx={{ ml: 2 }} network>
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
  securities: [],
  security_type: '',
};

const validationSchema = yup.object().shape({
  subject: yup.string().required('lang_please_enter_title'),
  content: yup.string().required('lang_please_enter_content'),
  // @ts-ignore
  image: yup.mixed().checkFile('lang_please_choose_image'),
  site_name: yup.string().required('lang_please_enter_sitename'),
  sitename_custom: yup.array().when(['site_name'], (sitename, schema) => {
    return sitename === SITENAME.CUSTOM
      ? schema.min(1, 'lang_please_enter_sitename').required('lang_please_enter_sitename')
      : schema;
  }),
  securities: yup.array().min(1, 'lang_please_select_security_code').required('lang_please_select_security_code'),
  security_type: yup.string().required('lang_please_select_security_type'),
});
