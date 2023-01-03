import React from 'react';
import { RichTextboxField } from 'components/fields';

const CreateNewArticles = () => {
  return (
    <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <RichTextboxField placeholder="lang_type_your_articles" value="" onChange={(e) => console.log('YOLO: ', e)} />
    </div>
  );
};

export default CreateNewArticles;
