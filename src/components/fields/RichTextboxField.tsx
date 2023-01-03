import React, { useImperativeHandle, forwardRef } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';

type RichTextboxProps = {
  placeholder: string;
  value?: any;
  onChange: (a: any) => void;
};
type RichTextboxHandle = {
  reset: () => void;
};

const RichTextboxField = forwardRef<RichTextboxHandle, RichTextboxProps>((props, ref) => {
  const convertData = (data: any) => {
    if (!data) return EditorState.createEmpty();
    if (typeof data === 'string') {
      const contentBlock = htmlToDraft(data);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        return editorState;
      }
    }
    return data;
  };

  const [editorState, setEditorState] = React.useState(() => convertData(props.value));

  const reset = () => {
    setEditorState(EditorState.createEmpty());
  };

  useImperativeHandle(
    ref,
    () => ({
      reset: reset,
    }),
    [],
  );

  function onChange(v: any) {
    setEditorState(v);
    props?.onChange?.(draftToHtml(convertToRaw(v.getCurrentContent())));
  }

  function uploadImageCallBack(file: File) {
    try {
      // return new Promise((resolve, reject) => {
      //   const formData = new FormData();
      //   formData.append("passport", file);
      //   axios
      //     .post("/item/upload", formData)
      //     .then((response) => {
      //       if (response?.data) {
      //         const imgUrl = response.data
      //           .map((e) => makeDriverImageToViewable(e.viewLink))
      //           .join("|");
      //         resolve({ data: { link: imgUrl } });
      //       }
      //     })
      //     .catch((error) => {
      //       reject(error);
      //     });
      // });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onChange}
      toolbar={{
        image: {
          uploadCallback: uploadImageCallBack,
          alt: { present: false, mandatory: false },
          previewImage: false,
          defaultSize: { maxWidth: '100%', minHeight: '200px' },
        },
      }}
    />
  );
});

export default RichTextboxField;
