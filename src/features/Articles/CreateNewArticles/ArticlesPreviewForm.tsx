/*
 * Created on Fri Jan 06 2023
 *
 * Articles preview before submit create
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { InputField, RichTextboxField, ImageField, FileField, SelectField, AutocompleteField } from 'components/fields';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import { LooseObject } from 'models/ICommon';
import Button from 'components/atoms/ButtonBase';
import { Trans, useTranslation } from 'react-i18next';
import { getSearchSitenameUrl, getSearchSecurityCodeUrl, getUploadUrl, getArticlesUrl } from 'apis/request.url';
import { SITENAME_OPTIONS, SECURITY_TYPE_OPTIONS, SITENAME } from '../ArticlesConstants';
import httpRequest from 'services/httpRequest';
import { ICreateArticlesBody } from 'models/IArticles';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import { Typography } from '@mui/material';
import useConfirmEdit from 'hooks/useConfirmEdit';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    padding: theme.spacing(3),
  },
}));

type ArticlesPreviewFormProps = {
  values: LooseObject;
  onReturn: () => void;
  onReset: () => void;
};

const ArticlesPreviewForm: React.FC<ArticlesPreviewFormProps> = ({ values, onReturn, onReset }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const confirmEdit = useConfirmEdit(() => true); // eslint-disable-line
  const [loading, setLoading] = React.useState(false);

  /**
   * Handle create new articles
   */
  const onConfirm = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', values.image.file);
      const { data: imageResponse } = await httpRequest.post(getUploadUrl(), formData);
      const body: ICreateArticlesBody = {
        subject: values.subject,
        content: values.content,
        image: imageResponse.url,
        site_name:
          values.site_name === SITENAME.CUSTOM ? values.sitename_custom.map((e: any) => e.site_name) : [values.site_name],
        securities: values.securities.map((e: any) => e.securities),
        security_type: values.security_type,
      };
      if (values.file?.file) {
        const formData = new FormData();
        formData.append('file', values.file.file);
        const { data: fileResponse } = await httpRequest.post(getUploadUrl(), formData);
        body.attachment_url = fileResponse.url;
        body.attachment_name = values.file.name;
      }
      await httpRequest.post(getArticlesUrl(), body);
      setLoading(false);
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_create_articles_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      onReset();
    } catch (error) {
      setLoading(false);
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_create_articles_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  };

  const sitenameOption = SITENAME_OPTIONS.find((e) => e.value === values.site_name);
  const sitename = sitenameOption?.label ? t(sitenameOption.label) : '';
  return (
    <Paper className={classes.container}>
      <Typography variant="h6" sx={{ textTransform: 'uppercase', mb: 2 }}>
        <Trans>lang_preview_new_article</Trans>
      </Typography>
      <Grid container spacing={2} sx={{ flex: 1, justifyContent: 'flex-start' }}>
        <Grid item xs={12}>
          <InputField preview name="subject" label="lang_title" fullWidth value={values.subject} />
        </Grid>
        {values.file?.file ? (
          <Grid item xs={12}>
            <FileField preview name="file" label="lang_file_attachment" helperText="(PDF)" accept=".pdf" value={values.file} />
          </Grid>
        ) : (
          <></>
        )}
        <Grid item xs={12}>
          <ImageField
            preview
            name="image"
            label="lang_thumbnail_image"
            helperText="(JPEG, JPG, PNG, HEIC)"
            accept=".png, .heic, .jpeg, .jpg"
            value={values.image}
          />
        </Grid>
        <Grid item xs={12}>
          <SelectField
            preview
            options={SECURITY_TYPE_OPTIONS}
            name="security_type"
            label="lang_security_type"
            required
            fullWidth
            value={values.security_type}
          />
        </Grid>
        <Grid item xs={12}>
          {values.sitename_custom?.length ? (
            <AutocompleteField
              preview
              name="sitename_custom"
              label="lang_sitename"
              required
              getUrl={getSearchSitenameUrl}
              isOptionEqualToValue={(opt, select) => opt.site_name === select.site_name}
              getOptionLabel={(opt) => opt.site_name}
              value={values.sitename_custom}
            />
          ) : (
            <InputField preview name="site_name" label="lang_sitename" required fullWidth value={sitename} />
          )}
        </Grid>
        <Grid item xs={12}>
          <AutocompleteField
            preview
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
          <RichTextboxField
            preview
            placeholder="lang_enter_your_content"
            label="lang_content"
            value={values.content}
            onChange={(e) => console.log('YOLO: ', e)}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="outlined" onClick={onReturn} scrollToTop>
          <Trans>lang_return</Trans>
        </Button>
        <Button variant="contained" sx={{ ml: 2 }} isLoading={loading} network scrollToTop onClick={onConfirm}>
          <Trans>lang_confirm</Trans>
        </Button>
      </Box>
    </Paper>
  );
};

export default ArticlesPreviewForm;
