/*
 * Created on Fri Jan 06 2023
 *
 * Articles Detail
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { InputField, RichTextboxField, ImageField, FileField, SelectField, AutocompleteField } from 'components/fields';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import Button from 'components/atoms/ButtonBase';
import { Trans, useTranslation } from 'react-i18next';
import { getSearchSitenameUrl, getSearchSecurityCodeUrl } from 'apis/request.url';
import { SITENAME_OPTIONS, SECURITY_TYPE_OPTIONS } from '../ArticlesConstants';
import { IArticlesFormData } from 'models/IArticles';
import { useDispatch } from 'react-redux';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CloseIcon from '@mui/icons-material/Close';
import { useGlobalModalContext } from 'containers/Modal';
import ArticlesEditForm from './ArticlesEditForm';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    borderRadius: 8,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
    width: '100%',
    padding: theme.spacing(3),
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    textTransform: 'uppercase',
    padding: theme.spacing(1),
    background: theme.palette.background.headerModal,
  },
}));

type ArticlesDetailProps = {
  data: IArticlesFormData;
  isEdit?: boolean;
  editFirst?: boolean;
};

const ArticlesDetail: React.FC<ArticlesDetailProps> = ({ data: values, isEdit = false, editFirst = false }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isEditMode, setEditMode] = React.useState(isEdit);
  const { showModal, hideModal } = useGlobalModalContext();

  const onEdit = () => {
    setEditMode(true);
  };

  const sitenameOption = SITENAME_OPTIONS.find((e) => e.value === values.site_name);
  const sitename = sitenameOption?.label ? t(sitenameOption.label) : '';

  const renderDetailPreview = () => {
    return (
      <>
        <Box className={classes.header}>
          <Typography fontWeight={700}>
            <Trans>lang_articles_details</Trans>
          </Typography>
          <IconButton onClick={hideModal}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box className={classes.container}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputField preview name="subject" label="lang_title" fullWidth value={values.subject} />
            </Grid>
            <Grid item xs={12} md={6}>
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
            {values.file?.file ? (
              <Grid item xs={12}>
                <FileField
                  preview
                  name="file"
                  label="lang_file_attachment"
                  helperText="(PDF)"
                  accept=".pdf"
                  value={values.file}
                />
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
              {values.sitename_custom?.length ? (
                <AutocompleteField
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
              <RichTextboxField preview placeholder="lang_enter_your_content" label="lang_content" value={values.content} />
            </Grid>
          </Grid>
          <Box className={classes.btnContainer}>
            <Button variant="contained" sx={{ ml: 2 }} startIcon={<ModeEditIcon />} network onClick={onEdit}>
              <Trans>lang_edit</Trans>
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  const onCancel = () => {
    setEditMode(false);
  };

  return (
    <Paper className={classes.wrapper}>
      {isEditMode ? <ArticlesEditForm editFirst={editFirst} data={values} onCancel={onCancel} /> : renderDetailPreview()}
    </Paper>
  );
};

export default ArticlesDetail;
