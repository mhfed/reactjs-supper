/*
 * Created on Fri May 05 2023
 *
 * Article Advanced Filter Form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from 'components/atoms/ButtonBase';
import { Trans } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import { AutocompleteField } from 'components/fields';
import { getSearchAppNameUrl } from 'apis/request.url';
import { LooseObject } from 'models/ICommon';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  container: {
    '& .MuiInputBase-root': {
      alignItems: 'flex-start',
    },
  },
}));

type ArticleAdvancedFilterProps = {
  initialValues?: LooseObject;
  onClose: () => void;
  onApply: (values: LooseObject, initialValues: LooseObject) => void;
};

const defaultValues = {
  app_name: [],
};

const ArticleAdvancedFilter: React.FC<ArticleAdvancedFilterProps> = ({ onClose, onApply, initialValues = defaultValues }) => {
  const classes = useStyles();

  /**
   * Handle submit form
   * @param values form data
   */
  const handleFormSubmit = (values: any) => {};

  /**
   * Register formik form handle
   */
  const { values, errors, touched, handleSubmit, setFieldValue, setFieldTouched, setValues, setTouched } = useFormik({
    initialValues: initialValues || defaultValues,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });

  /**
   * Clear all advanced filter
   */
  const onClearAll = () => {
    setValues(defaultValues, false);
    setTouched({});
  };

  /**
   * Apply new advanced filter
   */
  const onApplyFilter = () => {
    onApply(values, defaultValues);
  };

  return (
    <div>
      <form className={classes.container} noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2">
              <Trans>lang_search_by_app_name</Trans>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <AutocompleteField
              name="app_name"
              label="lang_app_name"
              required
              customSearch={true}
              getUrl={getSearchAppNameUrl}
              isOptionEqualToValue={(option: LooseObject, value: LooseObject) => {
                return option.bundle_id === value.bundle_id;
              }}
              InputProps={{
                style: { minHeight: 112 },
              }}
              getOptionLabel={(option) => option.display_name}
              getChipLabel={(option) => option.display_name}
              value={values.app_name}
              onChange={(value) => setFieldValue('app_name', value)}
              onBlur={() => setFieldTouched('app_name', true, true)}
              error={touched.app_name && Boolean(errors.app_name)}
              helperText={(touched.app_name && errors.app_name) as string}
            />
          </Grid>
        </Grid>
      </form>
      <Stack className={classes.buttonWrapper} direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="text"
          color="error"
          className="customBtnDisable"
          disabled={!values.app_name?.length}
          sx={{ textTransform: 'uppercase !important' }}
          scrollToTop
          onClick={onClearAll}
        >
          <Trans>lang_clear_all</Trans>
        </Button>
        <Button variant="outlined" scrollToTop onClick={onClose}>
          <Trans>lang_cancel</Trans>
        </Button>
        <Button network variant="contained" onClick={onApplyFilter}>
          <Trans>lang_apply</Trans>
        </Button>
      </Stack>
    </div>
  );
};

const validationSchema = yup.object().shape({});

export default ArticleAdvancedFilter;
