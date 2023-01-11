/*
 * Created on Fri Jan 06 2023
 *
 * Articles create form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { InputField, RichTextboxField } from 'components/fields';

type ArticlesCreateFormProps = {
  onCreate: () => void;
};

const ArticlesCreateForm: React.FC<ArticlesCreateFormProps> = ({ onCreate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      ArticlesCreateForm
    </div>
  );
};

export default ArticlesCreateForm;
