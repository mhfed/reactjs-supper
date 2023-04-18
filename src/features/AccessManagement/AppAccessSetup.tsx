/*
 * Created on Fri Jan 06 2023
 *
 * Segment detail and edit segment
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Trans } from 'react-i18next';
import { AutocompleteField } from 'components/fields';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import { Stack, Grid, Typography } from '@mui/material';
import { LooseObject } from 'models/ICommon';
import HeaderModal from 'components/atoms/HeaderModal';
import Button from 'components/atoms/ButtonBase';
import { getSearchSubscribersUrl } from 'apis/request.url';
import { useGlobalModalContext } from 'containers/Modal';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal/ConfirmEditModal';

const useStyles = makeStyles((theme) => ({
  divCointainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    borderRadius: 8,
    '& table': {
      border: `1px solid ${theme.palette.divider}`,
      borderCollapse: 'collapse',
    },
    '& th': {
      border: `1px solid ${theme.palette.divider}`,
      borderCollapse: 'collapse',
      padding: theme.spacing(1.5),
      textAlign: 'left',
    },
    '& td': {
      border: `1px solid ${theme.palette.divider}`,
      borderCollapse: 'collapse',
      padding: theme.spacing(1.5),
    },
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(2),
  },
  iconClose: {
    cursor: 'pointer',
  },
}));

const FORM_TYPE = {
  EDIT: 'EDIT',
  PREVIEW: 'PREVIEW',
};
type EditSegmentProps = {
  data?: LooseObject[];
  callback?: () => void;
};
const AppAccessSetup: React.FC<EditSegmentProps> = ({ data = [], callback }) => {
  const classes = useStyles();
  const [formType, setFormType] = React.useState(FORM_TYPE.EDIT);
  const initialValues = {};
  const { hideModal, showSubModal, hideSubModal } = useGlobalModalContext();
  const dispatch = useDispatch();

  /**
   * Handle setup app access
   * @param values form data
   */
  const handleFormSubmit = async (values: any) => {
    try {
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_segment_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
      hideModal();
    }
  };

  const { values, errors, touched, handleSubmit, setFieldValue, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  /**
   * back to edit form from preview form
   */
  const onBack = () => {
    setFormType(FORM_TYPE.EDIT);
  };

  /**
   * back to edit form from preview form
   */
  const onClose = () => {
    const checkChange = true;
    if (checkChange) {
      showSubModal({
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
    } else {
      hideModal();
    }
  };

  /**
   * back to edit form from preview form
   */
  const onPreview = () => {
    setFormType(FORM_TYPE.PREVIEW);
  };

  /**
   * Submit app access edited
   */
  const onSubmit = () => {
    handleSubmit();
  };

  return (
    <div className={classes.divCointainer}>
      <HeaderModal title={formType === FORM_TYPE.EDIT ? 'lang_app_access_setup' : 'lang_preview_edit_access'} />
      {formType === FORM_TYPE.EDIT ? (
        <form className={classes.container} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AutocompleteField
                name="user_id"
                label="lang_user_id"
                required
                options={data}
                readOnly
                disabled
                isOptionEqualToValue={(option: LooseObject, value: LooseObject) => {
                  return option.article_id === value.article_id;
                }}
                value={data}
                getOptionLabel={(option) => option.article_id}
                getChipLabel={(option) => option.article_id}
              />
            </Grid>
            <Grid item xs={12}>
              <AutocompleteField
                name="app_name"
                label="lang_app_name"
                required
                getUrl={getSearchSubscribersUrl}
                isOptionEqualToValue={(option: LooseObject, value: LooseObject) => {
                  return option.bundle_id === value.bundle_id;
                }}
                getOptionLabel={(option) => option.display_name}
                getChipLabel={(option) => option.username}
                value={values.app_name}
                onChange={(value) => setFieldValue('app_name', value)}
                onBlur={() => setFieldTouched('app_name', true, true)}
                error={touched.app_name && Boolean(errors.app_name)}
                helperText={(touched.app_name && errors.app_name) as string}
              />
            </Grid>
          </Grid>
          <Stack className={classes.buttonWrapper} direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" scrollToTop onClick={onClose}>
              <Trans>lang_cancel</Trans>
            </Button>
            <Button network variant="contained" onClick={onPreview}>
              <Trans>lang_confirm</Trans>
            </Button>
          </Stack>
        </form>
      ) : (
        <div className={classes.container}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>
                  <Trans>lang_user_id</Trans>
                </th>
                <th>
                  <Trans>lang_app_name</Trans>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.map((e) => e.article_id).join(', ')}</td>
                <td>{data.map((e) => e.security_type).join(', ')}</td>
              </tr>
            </tbody>
          </table>
          <Typography color="primary" sx={{ mt: 2 }}>
            <Trans>lang_do_you_want_to_process</Trans>
          </Typography>
          <Stack className={classes.buttonWrapper} direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" scrollToTop onClick={onBack}>
              <Trans>lang_no</Trans>
            </Button>
            <Button network variant="contained" onClick={onSubmit}>
              <Trans>lang_yes</Trans>
            </Button>
          </Stack>
        </div>
      )}
    </div>
  );
};

const validationSchema = yup.object().shape({
  // app_name: yup.array().min(1, 'lang_app_name_is_required').required('lang_app_name_is_required'),
});

export default AppAccessSetup;
