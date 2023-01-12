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
  ImageField,
  FileField,
  AuthAutoCompleteField,
  SelectField,
  AutoCompleteField,
} from 'components/fields';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import { LooseObject } from 'models/ICommon';
import Button from 'components/atoms/ButtonBase';
import { Trans } from 'react-i18next';
import { getSearchSitenameUrl, getSearchSecurityCodeUrl } from 'apis/request.url';

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

type ArticlesPreviewFormProps = {
  values: LooseObject;
};

const ArticlesPreviewForm: React.FC<ArticlesPreviewFormProps> = ({ values }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <Grid container spacing={2}>
        <Grid item container spacing={2} xs={12} md={6} sx={{ height: 'fit-content' }}>
          <Grid item xs={12}>
            <InputField preview name="subject" label="lang_title" required fullWidth value={values.subject} />
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
            <ImageField
              required
              name="image"
              label="lang_thumbnail_image"
              helperText="(JPEG, JPG, PNG, HEIC)"
              accept=".png, .heic, .jpeg, .jpg"
              value={values.image}
            />
          </Grid>
          <Grid item xs={12}>
            <FileField name="file" label="lang_file_attachment" helperText="(PDF)" accept=".pdf" value={values.file} />
          </Grid>
        </Grid>
        <Grid item container spacing={2} xs={12} md={6} sx={{ height: 'fit-content' }}>
          <Grid item xs={12}>
            <AutoCompleteField
              name="sitename_custom"
              label="lang_enter_sitename"
              required
              getUrl={getSearchSitenameUrl}
              isOptionEqualToValue={(opt, select) => opt.site_name === select.site_name}
              getOptionLabel={(opt) => opt.site_name}
              value={values.site_name}
            />
          </Grid>
          <Grid item xs={12}>
            <AuthAutoCompleteField
              name="securities"
              label="lang_security_code"
              required
              getUrl={getSearchSecurityCodeUrl}
              isOptionEqualToValue={(opt, select) => opt.securities === select.securities}
              getOptionLabel={(opt) => opt.securities}
              value={values.securities}
            />
          </Grid>
          <Grid item xs={12}>
            <SelectField name="security_type" label="lang_security_type" required fullWidth value={values.security_type} />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined">
            <Trans>lang_return</Trans>
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} network>
            <Trans>lang_confirm</Trans>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ArticlesPreviewForm;

// try {
//   const formData = new FormData();
//   formData.append('file', values.image.file);
//   const { data: imageResponse } = await httpRequest.post(getUploadUrl(), formData)
//   const body: ICreateArticlesBody = {
//     subject: values.subject,
//     content: values.content,
//     image: imageResponse.url,
//     site_name: values.site_name.map((e: any) => e.site_name),
//     securities: values.securities.map((e: any) => e.securities),
//     security_type: values.security_type,
//   }
//   if (values.file?.file) {
//     const formData = new FormData();
//     formData.append('file', values.file.file);
//     const { data: fileResponse } = await httpRequest.post(getUploadUrl(), formData)
//     body.attachment_url = fileResponse.url;
//     body.attachment_name = values.file.name;
//   }
//   await httpRequest.post(getArticlesUrl(), body)
//   dispatch(
//     enqueueSnackbarAction({
//       message: 'lang_create_articles_successfully',
//       key: new Date().getTime() + Math.random(),
//       variant: 'error',
//     }),
//   );
// } catch (error) {
//   dispatch(
//     enqueueSnackbarAction({
//       message: 'lang_create_articles_unsuccessfully',
//       key: new Date().getTime() + Math.random(),
//       variant: 'error',
//     }),
//   );
// }
