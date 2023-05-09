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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import { LooseObject } from 'models/ICommon';
import Button from 'components/atoms/ButtonBase';
import { Trans, useTranslation } from 'react-i18next';
import { getSearchSitenameUrl, getSearchSecurityCodeUrl } from 'apis/request.url';
import { APPNAME, SECURITY_TYPE_OPTIONS } from '../ArticlesConstants';
import { Typography } from '@mui/material';
import useConfirmEdit from 'hooks/useConfirmEdit';
import { useGlobalModalContext } from 'containers/Modal';
import NotificationSetup from '../ArticlesManagement/NotificationSetup';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    padding: theme.spacing(3),
  },
  modalContainer: {
    background: theme.palette.background.contentModal,
    overflow: 'auto',
  },
}));

type ArticlesPreviewFormProps = {
  isCreate?: boolean;
  isDraft?: boolean;
  values: LooseObject;
  onReturn: () => void;
  onSubmit: (isPublish?: boolean, successCb?: () => void, errorCb?: () => void) => void;
};

const ArticlesPreviewForm: React.FC<ArticlesPreviewFormProps> = ({ isCreate, isDraft, values, onReturn, onSubmit }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const confirmEdit = useConfirmEdit(() => true); // eslint-disable-line
  const publishWithNotification = React.useRef<boolean>(!!isCreate);
  const [loading, setLoading] = React.useState(false);
  const { showModal, hideModal } = useGlobalModalContext();

  /**
   * Handle create new articles
   */
  const onConfirm = () => {
    if (publishWithNotification.current) {
      const contentElement = document.getElementsByClassName('richtextboxPreviewContainer')?.[0];
      const message = contentElement ? (contentElement as HTMLElement).innerText?.replaceAll('\n', ' ') : '';
      showModal({
        component: NotificationSetup,
        showBtnClose: true,
        fullScreen: true,
        props: {
          beforeSubmit: isCreate ? onSubmit : null,
          data: { ...values, message },
        },
      });
    } else {
      setLoading(true);
      onSubmit(
        publishWithNotification.current,
        () => setLoading(false),
        () => setLoading(false),
      );
    }
  };

  /**
   * Storage publish with notification value for use late
   * @param e checkbox event
   */
  const onChangePublish = (e: React.ChangeEvent<HTMLInputElement>) => {
    publishWithNotification.current = e.target.checked;
  };

  return (
    <Paper className={clsx(classes.container, isCreate || classes.modalContainer)}>
      {isCreate ? (
        <Typography variant="h6" sx={{ textTransform: 'uppercase', mb: 2 }}>
          <Trans>{isDraft ? 'lang_preview_draft_article' : 'lang_preview_new_article'}</Trans>
        </Typography>
      ) : (
        <></>
      )}
      <Grid container spacing={2} sx={{ flex: 1, justifyContent: 'flex-start' }}>
        <Grid item xs={12}>
          <InputField preview name="title" label="lang_title" fullWidth value={values.title} />
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
          {values.app === APPNAME.CUSTOM ? (
            <AutocompleteField
              preview
              name="app"
              label="lang_app_name"
              required
              getUrl={getSearchSitenameUrl}
              isOptionEqualToValue={(opt, select) => opt.bundle_id === select.bundle_id}
              getOptionLabel={(opt) => opt.display_name || ''}
              value={values.appname_custom}
            />
          ) : (
            <InputField preview name="app" label="lang_app_name" fullWidth value={t('lang_all_apps') as string} />
          )}
        </Grid>
        <Grid item xs={12}>
          <InputField preview name="sitename" label="lang_sitename" required fullWidth maxLength={255} value={values.sitename} />
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
        <Grid item xs={12}>
          <RichTextboxField preview placeholder="lang_enter_your_content" label="lang_content" value={values.content} />
        </Grid>
        {isCreate && !isDraft ? (
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControlLabel
              sx={{ mr: 0 }}
              control={<Checkbox defaultChecked onChange={onChangePublish} />}
              label={<Trans>lang_publish_with_notification</Trans>}
            />
          </Grid>
        ) : (
          <></>
        )}
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
