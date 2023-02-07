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

const CreateNewArticles = () => {
  const [step, setStep] = React.useState<number>(STEP.CREATE);
  const data = React.useRef<LooseObject>({});

  /**
   * Switch to preview mode from create form
   * @param values form data
   */
  const onCreate = (values: LooseObject) => {
    data.current = values;
    setStep(STEP.PREVIEW);
  };

  /**
   * Come back to create form from preview mode
   */
  const onReturn = () => {
    setStep(STEP.CREATE);
  };

  /**
   * Reset data and come back to create form from preview mode
   */
  const onReset = () => {
    data.current = {};
    setStep(STEP.CREATE);
  };

  return (
    <>
      {step === STEP.CREATE ? (
        <ArticlesCreateForm onCreate={onCreate} values={data.current} />
      ) : (
        <ArticlesPreviewForm onReturn={onReturn} values={data.current} onReset={onReset} />
      )}
    </>
  );
};

export default CreateNewArticles;
