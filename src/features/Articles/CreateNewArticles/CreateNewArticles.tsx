/*
 * Created on Fri Jan 06 2023
 *
 * Create new articles form
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

  const onCreate = (values: LooseObject) => {
    data.current = values;
    setStep(STEP.PREVIEW);
  };

  const onReturn = () => {
    setStep(STEP.CREATE);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {step === STEP.CREATE ? (
        <ArticlesCreateForm onCreate={onCreate} values={data.current} />
      ) : (
        <ArticlesPreviewForm onReturn={onReturn} values={data.current} />
      )}
    </div>
  );
};

export default CreateNewArticles;
