/*
 * Created on Fri Jan 06 2023
 *
 * Create new articles
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import ArticlesCreateForm from './ArticlesCreateForm';
import ArticlesPreviewForm from './ArticlesPreviewForm';
import { STEP } from '../ArticlesConstants';
import { LooseObject } from 'models/ICommon';
import { httpRequest } from 'services/initRequest';
import { ICreateArticlesBody } from 'models/IArticles';
import { IBundle } from 'models/ICommon';
import { useDispatch } from 'react-redux';
import { enqueueSnackbarAction } from 'actions/app.action';
import { getUploadUrl, getArticlesUrl } from 'apis/request.url';
import { APPNAME } from '../ArticlesConstants';

const CreateNewArticles = () => {
  const [step, setStep] = React.useState<number>(STEP.CREATE);
  const data = React.useRef<LooseObject>({});
  const isSaveDraft = React.useRef(false);
  const dispatch = useDispatch();

  /**
   * Switch to preview mode from create form
   * @param values form data
   */
  const onCreate = (values: LooseObject, saveDraft: boolean = false) => {
    data.current = values;
    isSaveDraft.current = saveDraft;
    setStep(STEP.PREVIEW);
  };

  /**
   * Come back to create form from preview mode
   */
  const onReturn = () => {
    setStep(STEP.CREATE);
  };

  /**
   * Submit create article
   */
  const onSubmit = async (publishWithNotification: boolean = true, successCb?: () => void, errorCb?: () => void) => {
    try {
      const formData = new FormData();
      const values = { ...data.current };
      formData.append('file', values.image.file);
      const { data: imageResponse } = await httpRequest.post(getUploadUrl(), formData);
      const body: ICreateArticlesBody = {
        title: values.title,
        content: values.content,
        image: imageResponse.url,
        securities: values.securities.map((e: any) => e.securities),
        security_type: values.security_type,
        article_type: isSaveDraft.current ? 'draft' : 'publish',
        notification_enabled: publishWithNotification,
      };
      if (values.app === APPNAME.CUSTOM) {
        body.bundle_id = values.appname_custom.map((e: IBundle) => e.bundle_id);
      } else delete body.bundle_id;
      if (values.file?.file) {
        const formData = new FormData();
        formData.append('file', values.file.file);
        const { data: fileResponse } = await httpRequest.post(getUploadUrl(), formData);
        body.attachment_url = fileResponse.url;
        body.attachment_name = values.file.name;
      }
      await httpRequest.post(getArticlesUrl(), body);
      successCb?.();
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_create_articles_successfully',
          key: new Date().getTime() + Math.random(),
          variant: 'success',
        }),
      );
      data.current = {};
      setStep(STEP.CREATE);
    } catch (error) {
      errorCb?.();
      dispatch(
        enqueueSnackbarAction({
          message: 'lang_create_articles_unsuccessfully',
          key: new Date().getTime() + Math.random(),
          variant: 'error',
        }),
      );
    }
  };

  return (
    <>
      {step === STEP.CREATE ? (
        <ArticlesCreateForm onCreate={onCreate} values={data.current} />
      ) : (
        <ArticlesPreviewForm isCreate onReturn={onReturn} values={data.current} onSubmit={onSubmit} />
      )}
    </>
  );
};

export default CreateNewArticles;
