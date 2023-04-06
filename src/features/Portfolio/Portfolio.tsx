/*
 * Created on Tue Mar 28 2023
 *
 * Portfolio
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import EditIcon from '@mui/icons-material/Edit';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { enqueueSnackbarAction } from 'actions/app.action';
import { getPPIndicatorUpdateUrl, getPPIndicatorUrl } from 'apis/request.url';
import Button from 'components/atoms/ButtonBase';
import { InputField, SelectField } from 'components/fields';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal';
import { useGlobalModalContext } from 'containers/Modal';
import { diff } from 'deep-diff';
import { useFormik } from 'formik';
import { yup } from 'helpers';
import { LooseObject } from 'models/ICommon';
import React from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { iressSitenameSelector } from 'selectors/auth.selector';
import httpRequest from 'services/httpRequest';
import { PORTFOLIO_PERFORMANCE_INDICATOR } from './PortfolioConstant';

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
  },
  form: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    '& .MuiGrid-item': {
      paddingTop: theme.spacing(3),
    },
  },
  iconClose: {
    cursor: 'pointer',
  },
  ppIndicator: {
    marginBottom: theme.spacing(3),
  },
  ppIndicatorHead: {
    fontWeight: 700,
  },
}));

type PortfolioProps = {};

type ResponseDataType = {
  sitename: string;
  list_configuration: ConfigurationType;
};
type ConfigurationType = {
  bundle_id: string;
  portfolio_performance_indicator: string;
};

const Portfolio: React.FC<PortfolioProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const { showSubModal, hideModal, hideSubModal } = useGlobalModalContext();
  const sitename = useSelector(iressSitenameSelector) ?? '';
  const [optionBundleID, setOptionBundleID] = React.useState([]);
  const dataListConfigRef = React.useRef<ConfigurationType[]>([]);
  const viewValuesRef = React.useRef(initialValues);

  /**
   * Check data change and show popup confirm
   */
  const handleBeforeSubmit = () => {
    const isChanged = diff(viewValuesRef.current, values);

    const dataConfigure = [
      {
        settingName: 'Portfolio Performance Indicator',
        prevSetting: viewValuesRef.current.portfolio_performance_indicator,
        newSetting: values.portfolio_performance_indicator,
      },
    ];
    if (!isChanged) {
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_there_is_no_change_in_the_user_information',
          // message: 'lang_there_is_nothing_to_change',
          key: new Date().getTime() + Math.random(),
          variant: 'warning',
        }),
      );
    } else {
      showSubModal({
        title: 'lang_configuration_change',
        component: ConfirmEditModal,
        props: {
          configurationChange: true,
          dataConfigure: dataConfigure,
          emailConfirm: false,
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
          styleContainer: { maxWidth: '80vw' },
          onSubmit: handleFormSubmit,
        },
      });
    }
  };

  /**
   * Handle submit update portfolio
   */
  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const body = {
        site_name: values.site_name,
        bundle_id: values.bundle_id,
        portfolio_performance_indicator: values.portfolio_performance_indicator,
      };
      await httpRequest.put(getPPIndicatorUrl(), body);
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_update_user_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      hideModal();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatch(
        enqueueSnackbarAction({
          message: error?.errorCodeLang,
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
      hideModal();
      console.error('Update user handleFormSubmit error: ', error);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: { ...initialValues },
    validationSchema: validationSchema,
    onSubmit: handleBeforeSubmit,
  });

  /**
   * turn on edit mode
   */
  const handleTurnOnEditMode = () => {
    setEditMode(true);
  };

  const handleBack = () => {
    const isChanged = diff(viewValuesRef.current, values);
    if (isChanged) {
      showSubModal({
        title: 'lang_confirm_cancel',
        component: ConfirmEditModal,
        props: {
          title: 'lang_confirm_cancel_text',
          emailConfirm: false,
          cancelText: 'lang_no',
          confirmText: 'lang_yes',
          onSubmit: () => {
            hideSubModal();
            setEditMode(false);
          },
        },
      });
    } else {
      setEditMode(false);
    }
  };

  const handleChangeBundleID = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const itemSlected = dataListConfigRef.current?.find((element) => element.bundle_id === e.target.value);
    setFieldValue('portfolio_performance_indicator', itemSlected?.portfolio_performance_indicator);
    viewValuesRef.current = { ...viewValuesRef.current, ...itemSlected };
  };
  const getData = async function () {
    try {
      const { data }: LooseObject = await httpRequest.get(getPPIndicatorUpdateUrl(sitename));
      const dataOptionBundleID = data?.list_configuration.map((e: any) => {
        return { label: e.bundle_id, value: e.bundle_id };
      });
      setOptionBundleID(dataOptionBundleID);
      dataListConfigRef.current = data?.list_configuration;

      const initValues = {
        site_name: data.site_name,
        bundle_id: data.list_configuration[0].bundle_id,
        portfolio_performance_indicator: data.list_configuration[0].portfolio_performance_indicator,
      };
      resetForm({
        values: initValues,
      });
      viewValuesRef.current = { ...initValues };
    } catch (error) {
      dispatch(
        enqueueSnackbarAction({
          message: error?.errorCodeLang,
          // message: 'lang_there_is_nothing_to_change',
          key: new Date().getTime() + Math.random(),
          variant: 'warning',
        }),
      );
    }
  };
  React.useEffect(() => {
    getData();
  }, []);
  /**
   * Render preview screen
   * @returns Preview Screen JSX
   */
  const renderViewScreen = () => {
    return (
      <>
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <InputField id="site_name" preview label="lang_sitename" fullWidth value={values.site_name} />
            </Grid>
            <Grid item xs={6}>
              <SelectField
                required
                options={optionBundleID}
                name="bundle_id"
                label="lang_bundle_id"
                id="bundle_id"
                fullWidth
                onBlur={handleBlur}
                value={values.bundle_id}
                onChange={(e: any) => {
                  handleChangeBundleID(e);
                  handleChange(e);
                }}
                error={touched.bundle_id && Boolean(errors.bundle_id)}
                helperText={touched.bundle_id && errors.bundle_id}
                textTransform="uppercase"
              />
            </Grid>
            <Grid item xs={6}>
              <div className={classes.ppIndicator}>
                <Typography className={classes.ppIndicatorHead}>
                  <Trans>lang_portfolio_performance_indicator</Trans>
                </Typography>
                <Typography>
                  <Trans>lang_displays_portfolio_performance</Trans>
                </Typography>
              </div>
              <SelectField
                id="portfolio_performance_indicator"
                value={values.portfolio_performance_indicator}
                options={PORTFOLIO_PERFORMANCE_INDICATOR}
                label="lang_portfolio_performance_indicator"
                fullWidth
                preview
                textTransform="uppercase"
              />
            </Grid>
          </Grid>
        </Box>
        <Stack direction="row" justifyContent="end" alignItems="center">
          <Button variant="contained" startIcon={<EditIcon />} network onClick={handleTurnOnEditMode}>
            <Trans>lang_edit</Trans>
          </Button>
        </Stack>
      </>
    );
  };

  /**
   * Render edit screen
   * @returns Edit screen JSX
   */
  const renderEditScreen = () => {
    return (
      <>
        <Box>
          <Grid container spacing={4} rowSpacing={1}>
            <Grid item xs={6}>
              <InputField
                id="site_name"
                name="site_name"
                disabled
                label="lang_sitename"
                required
                fullWidth
                value={values.site_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.site_name && Boolean(errors.site_name)}
                helperText={touched.site_name && errors.site_name}
                inputProps={{ maxLength: 255 }}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectField
                required
                options={optionBundleID}
                name="bundle_id"
                label="lang_bundle_id"
                id="bundle_id"
                fullWidth
                onBlur={handleBlur}
                value={values.bundle_id}
                onChange={(e: any) => {
                  handleChangeBundleID(e);
                  handleChange(e);
                }}
                error={touched.bundle_id && Boolean(errors.bundle_id)}
                helperText={touched.bundle_id && errors.bundle_id}
                textTransform="uppercase"
              />
            </Grid>
            <Grid item xs={6}>
              <div className={classes.ppIndicator}>
                <Typography className={classes.ppIndicatorHead}>
                  <Trans>lang_portfolio_performance_indicator</Trans>
                </Typography>
                <Typography>
                  <Trans>lang_displays_portfolio_performance</Trans>
                </Typography>
              </div>
              <SelectField
                required
                options={PORTFOLIO_PERFORMANCE_INDICATOR}
                name="portfolio_performance_indicator"
                label="lang_portfolio_performance_indicator"
                id="portfolio_performance_indicator"
                fullWidth
                onBlur={handleBlur}
                value={values.portfolio_performance_indicator}
                onChange={handleChange}
                error={touched.portfolio_performance_indicator && Boolean(errors.portfolio_performance_indicator)}
                helperText={touched.portfolio_performance_indicator && errors.portfolio_performance_indicator}
                textTransform="uppercase"
              />
            </Grid>
          </Grid>
        </Box>
        <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
          <Button variant="outlined" onClick={handleBack} scrollToTop>
            <Trans>lang_back</Trans>
          </Button>
          <Button variant="contained" type="submit">
            <Trans>lang_save</Trans>
          </Button>
        </Stack>
      </>
    );
  };

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit}>
      {editMode ? renderEditScreen() : renderViewScreen()}
    </form>
  );
};

const initialValues = {
  site_name: '',
  bundle_id: '',
  portfolio_performance_indicator: '',
};
const validationSchema = yup.object().shape({
  site_name: yup.string().required('lang_site_name_required').max(255, 'lang_full_name_max_length'),
  bundle_id: yup.string().required(''),
  portfolio_performance_indicator: yup.string().required('lang_status_required'),
});

export default Portfolio;
