/*
 * Created on Fri Jan 06 2023
 *
 * Create new articles form
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React from 'react';
import { RichTextboxField, InputField } from 'components/fields';

const CreateNewArticles = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <InputField
        id="email"
        name="email"
        sx={{ mb: 2 }}
        label="lang_email"
        required
        fullWidth
        autoComplete="email"
        autoFocus
        value={''}
        onChange={() => {}}
        onBlur={() => {}}
      />
      <RichTextboxField
        required
        placeholder="lang_type_your_articles"
        label="lang_content"
        value=""
        onChange={(e) => console.log('YOLO: ', e)}
      />
    </div>
  );
};

export default CreateNewArticles;
