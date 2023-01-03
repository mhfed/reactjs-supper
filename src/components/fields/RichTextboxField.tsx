import React, { useImperativeHandle, forwardRef } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import makeStyles from '@mui/styles/makeStyles';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import { Trans } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  container: {
    border: `1px solid rgba(255, 255, 255, 0.23)`,
    borderRadius: 4,
    minHeight: 200,
    '& .rdw-editor-toolbar': {
      border: 'none',
      borderBottom: `1px solid rgba(255, 255, 255, 0.23)`,
      background: 'transparent',
    },
    '& .DraftEditor-editorContainer': {
      padding: theme.spacing(0, 1),
    },
  },
}));

type RichTextboxProps = {
  placeholder: string;
  label: string;
  required?: boolean;
  value?: any;
  onChange: (a: any) => void;
};
type RichTextboxHandle = {
  reset: () => void;
};

const RichTextboxField = forwardRef<RichTextboxHandle, RichTextboxProps>((props, ref) => {
  const { required = false, label, value, onChange } = props;
  const classes = useStyles();

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

  const [editorState, setEditorState] = React.useState(() => convertData(value));

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

  function handleChange(v: any) {
    setEditorState(v);
    onChange?.(draftToHtml(convertToRaw(v.getCurrentContent())));
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
    <FormControl fullWidth>
      <FormLabel sx={{ mb: 0.5 }}>
        <Trans>{label}</Trans>
        {required ? ' *' : ''}
      </FormLabel>
      <Box className={classes.container}>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={handleChange}
          toolbar={{
            image: {
              uploadCallback: uploadImageCallBack,
              alt: { present: false, mandatory: false },
              previewImage: false,
              defaultSize: { maxWidth: '100%', minHeight: '200px' },
            },
          }}
        />
      </Box>
    </FormControl>
  );
});

export default RichTextboxField;
