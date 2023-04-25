/*
 * Created on Wed Apr 19 2023
 *
 * App access setup popup
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Trans } from 'react-i18next';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import { yup } from 'helpers';
import { getReportUrl } from 'apis/request.url';
import { Stack, Grid, Typography } from '@mui/material';
import { LooseObject } from 'models/ICommon';
import HeaderModal from 'components/atoms/HeaderModal';
import Button from 'components/atoms/ButtonBase';
import { useGlobalModalContext } from 'containers/Modal';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import ConfirmEditModal from 'components/molecules/ConfirmEditModal/ConfirmEditModal';
import { InputField, SelectField } from 'components/fields';
import { httpRequest } from 'services/initRequest';

const useStyles = makeStyles((theme) => ({
  divCointainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    '& table': {
      padding: theme.spacing(3, 3, 0),
    },
    '& th': {
      padding: theme.spacing(0.5),
      textAlign: 'left',
    },
    '& td': {
      padding: theme.spacing(0.5),
    },
    height: '100%',
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    borderRadius: 8,
    overflow: 'hidden',
    '& .MuiGrid-container': {
      overflow: 'auto',
      maxHeight: '100%',
    },
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
  headerText: {
    fontWeight: 700,
  },
}));

const FORM_TYPE = {
  EDIT: 'EDIT',
  PREVIEW: 'PREVIEW',
};
const PARAMETER_OPTIONS = [
  { label: 'lang_textbox', value: 'Textbox' },
  { label: 'lang_datetime', value: 'Datetime' },
];
export type ReportParam = {
  name?: string;
  id: number;
  title: string;
  type: string;
};
type EditSegmentProps = {
  data?: LooseObject;
  callback?: () => void;
};
const EditReport: React.FC<EditSegmentProps> = ({ data = {}, callback }) => {
  const classes = useStyles();
  const [formType, setFormType] = React.useState(FORM_TYPE.EDIT);
  const initialValues = React.useRef({
    params: data.params.map((e: ReportParam) => ({
      ...e,
      title: e.title || '',
      type: e.type || '',
      name: e.name || '',
    })),
  });
  const { hideModal, showSubModal, hideSubModal } = useGlobalModalContext();
  const dispatch = useDispatch();

  /**
   * Handle setup app access
   * @param values form data
   */
  const handleFormSubmit = async (values: any) => {
    try {
      const params: ReportParam[] = values.params.map((e: ReportParam) => ({
        id: e.id,
        title: e.title,
        type: e.type,
      }));
      await httpRequest.put(getReportUrl(), {
        bundle_id: data?.application_user?.bundle_id,
        params,
      });
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_report_updated_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      hideModal();
      callback?.();
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

  const formik = useFormik({
    initialValues: initialValues.current,
    validationSchema: validationSchema,
    onSubmit: handleFormSubmit,
  });
  const { values, errors, touched, handleSubmit, handleChange, handleBlur, validateForm, setTouched } = formik;

  /**
   * back to edit form from preview form
   */
  const onBack = () => {
    setFormType(FORM_TYPE.EDIT);
  };

  const checkChangeParam = () => {
    let isChange = false;
    const dicCur = values.params.reduce((acc: LooseObject, cur: ReportParam) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
    for (let index = 0; index < data.params.length; index++) {
      const element = { ...(data?.params?.[index] || {}) };
      if (!element.title) element.title = '';
      if (element.title !== dicCur[element.id].title || element.type !== dicCur[element.id].type) {
        isChange = true;
        break;
      }
    }
    return isChange;
  };

  /**
   * back to edit form from preview form
   */
  const onClose = () => {
    const isChange = checkChangeParam();
    if (isChange) {
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
    validateForm().then((errors) => {
      if (errors && Object.keys(errors).length) {
        setTouched(errors as any);
      } else {
        setFormType(FORM_TYPE.PREVIEW);
      }
    });
  };

  /**
   * Submit app access edited
   */
  const onSubmit = () => {
    handleSubmit();
  };

  const touchedObj = { ...touched } as any;
  const errorsObj = { ...errors } as any;
  return (
    <div className={classes.divCointainer}>
      <HeaderModal title={formType === FORM_TYPE.EDIT ? 'lang_report_setup' : 'lang_preview_edit_report'} />
      <table style={{ width: '100%', maxWidth: 500 }}>
        <thead>
          <tr>
            <th>
              <Trans>lang_report_name</Trans>
            </th>
            <th>
              <Trans>lang_app_name</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.name}</td>
            <td>{data?.application_user?.display_name}</td>
          </tr>
        </tbody>
      </table>
      {formType === FORM_TYPE.EDIT ? (
        <form className={classes.container} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography className={classes.headerText}>
                <Trans>lang_parameter_name</Trans>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.headerText}>
                <Trans>lang_title</Trans>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.headerText}>
                <Trans>lang_parameter_type</Trans>
              </Typography>
            </Grid>
            <FormikProvider value={formik}>
              <FieldArray
                name="params"
                validateOnChange={true}
                render={() => (
                  <>
                    {values.params.map((e: ReportParam, i: number) => (
                      <React.Fragment key={`edit_report_params_${i}`}>
                        <Grid item xs={4}>
                          <InputField preview disabled shrink={false} label={''} name={`params[${i}].name`} value={e.name} />
                        </Grid>
                        <Grid item xs={4}>
                          <InputField
                            name={`params[${i}].title`}
                            label="lang_title"
                            maxLength={100}
                            required
                            value={values.params[i].title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touchedObj?.params?.[i]?.title && Boolean(errorsObj.params?.[i]?.title)}
                            helperText={touchedObj.params?.[i]?.title && errorsObj.params?.[i]?.title}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <SelectField
                            name={`params[${i}].type`}
                            options={PARAMETER_OPTIONS}
                            required
                            fullWidth
                            shrink={false}
                            value={values.params[i].type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touchedObj?.params?.[i]?.type && Boolean(errorsObj?.params?.[i]?.type)}
                            helperText={touchedObj?.params?.[i]?.type && errorsObj?.params?.[i]?.type}
                          />
                        </Grid>
                      </React.Fragment>
                    ))}
                  </>
                )}
              />
            </FormikProvider>
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
          <div>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>
                    <Trans>lang_parameter_name</Trans>
                  </th>
                  <th>
                    <Trans>lang_title</Trans>
                  </th>
                  <th>
                    <Trans>lang_parameter_type</Trans>
                  </th>
                </tr>
              </thead>
              <tbody>
                {values.params.map((e: ReportParam, i: number) => (
                  <tr key={`edit_report_preview_${i}`}>
                    <td>{e.name}</td>
                    <td>{e.title}</td>
                    <td>{e.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Typography color="primary" sx={{ mt: 2 }}>
              <Trans>lang_do_you_want_to_process</Trans>
            </Typography>
          </div>
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
  params: yup.array().of(
    yup.object().shape({
      title: yup.string().required('lang_title_required'),
    }),
  ),
});

export default EditReport;
