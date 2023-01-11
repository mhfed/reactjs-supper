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

const CreateNewArticles = () => {
  const [step, setStep] = React.useState<number>(STEP.CREATE);

  const onCreate = () => {
    setStep(STEP.PREVIEW);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {step === STEP.CREATE ? <ArticlesCreateForm onCreate={onCreate} /> : <ArticlesPreviewForm />}
    </div>
  );
};

export default CreateNewArticles;
