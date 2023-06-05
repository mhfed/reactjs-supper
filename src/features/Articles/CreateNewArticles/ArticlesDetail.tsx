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
import HeaderModal from 'components/atoms/HeaderModal';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import Button from 'components/atoms/ButtonBase';
import { Trans } from 'react-i18next';
import { getSearchSitenameUrl, getSearchSecurityCodeUrl } from 'apis/request.url';
import { SECURITY_TYPE_OPTIONS } from '../ArticlesConstants';
import { IArticlesFormData } from 'models/IArticles';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useGlobalModalContext } from 'containers/Modal';
import ArticlesEditForm from './ArticlesEditForm';
import { ARTICLE_STATUS } from 'features/Notification/NotificationConstants';
import authService from 'services/authService';

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
    background: theme.palette.background.contentModal,
    width: '100%',
    padding: theme.spacing(3),
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(3),
  },
}));

type ArticlesDetailProps = {
  data: IArticlesFormData;
  isEdit?: boolean;
  editFirst?: boolean;
  successCb?: () => void;
};

const ArticlesDetail: React.FC<ArticlesDetailProps> = ({ data: values, isEdit = false, editFirst = false, successCb }) => {
  const classes = useStyles();
  const [isEditMode, setEditMode] = React.useState(isEdit);
  const { hideModal } = useGlobalModalContext();

  /**
   * Switch to edit screen
   */
  const onEdit = () => {
    setEditMode(true);
  };

  /**
   * render detail form
   * @returns HTML
   */
  const renderDetailPreview = () => {
    return (
      <>
        <HeaderModal title="lang_articles_details" onClose={hideModal} />
        <Box className={classes.container}>
          <Grid container spacing={2}>
            {values.title ? (
              <Grid item xs={12}>
                <InputField preview name="title" label="lang_title" fullWidth value={values.title} />
              </Grid>
            ) : (
              <></>
            )}
            {values.file?.name || values.file?.url ? (
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
            {values.image ? (
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
            ) : (
              <></>
            )}
            {values.appname_custom?.length ? (
              <Grid item xs={12}>
                <AutocompleteField
                  preview
                  name="appname_custom"
                  label="lang_app_name"
                  required
                  getUrl={getSearchSitenameUrl}
                  isOptionEqualToValue={(opt, select) => opt.bundle_id === select.bundle_id}
                  getOptionLabel={(opt) => opt.display_name || ''}
                  value={values.appname_custom}
                />
              </Grid>
            ) : (
              <></>
            )}
            <Grid item xs={12}>
              <InputField
                preview
                name="sitename"
                label="lang_sitename"
                required
                fullWidth
                maxLength={255}
                value={authService.getSitename() || ''}
              />
            </Grid>
            {values.security_type ? (
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
            ) : (
              <></>
            )}
            {values.securities?.length ? (
              <Grid item xs={12}>
                <AutocompleteField
                  preview
                  name="securities"
                  label="lang_security_codes"
                  required
                  getUrl={getSearchSecurityCodeUrl}
                  isOptionEqualToValue={(opt, select) => opt.securities === select.securities}
                  getOptionLabel={(opt) => opt.securities}
                  value={values.securities}
                />
              </Grid>
            ) : (
              <></>
            )}
            {values.content ? (
              <Grid item xs={12}>
                <RichTextboxField preview placeholder="lang_enter_your_content" label="lang_content" value={values.content} />
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
          {values.editable ? (
            <Box className={classes.btnContainer}>
              <Button variant="contained" sx={{ ml: 2 }} startIcon={<ModeEditIcon />} network onClick={onEdit}>
                <Trans>lang_edit</Trans>
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </>
    );
  };

  /**
   * Come back to detail view from edit mode
   */
  const onCancel = () => {
    setEditMode(false);
  };

  return (
    <Paper className={classes.wrapper}>
      {isEditMode ? (
        <ArticlesEditForm editFirst={editFirst} data={values} onCancel={onCancel} onSuccess={successCb} />
      ) : (
        renderDetailPreview()
      )}
    </Paper>
  );
};

export default ArticlesDetail;
