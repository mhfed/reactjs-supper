/*
 * Created on Fri Jan 06 2023
 *
 * RichTextbox to create articles
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useImperativeHandle, forwardRef } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import makeStyles from '@mui/styles/makeStyles';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import { Trans, useTranslation } from 'react-i18next';
import { alpha } from '@mui/material';
import { getUploadUrl } from 'apis/request.url';
import httpRequest from 'services/httpRequest';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  container: {
    border: `1px solid ${alpha(theme.palette.text.primary, 0.23)}`,
    borderRadius: 4,
    minHeight: 200,
    '& *': {
      boxSizing: 'initial',
    },
    '& br': {
      color: theme.palette.text.primary,
    },
    '& .rdw-editor-toolbar': {
      border: 'none',
      borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.23)}`,
      background: theme.palette.background.other2,
      color: theme.palette.common.black,
    },
    '& .rdw-editor-main': {
      padding: theme.spacing(0, 1),
      color: theme.palette.text.primary,
    },
    '& .public-DraftEditorPlaceholder-root': {
      '& *': {
        color: theme.palette.text.secondary,
      },
    },
    '& .rdw-dropdown-wrapper': {
      background: theme.palette.common.white,
      '& .rdw-dropdown-selectedtext': {
        '& span': {
          color: theme.palette.common.black,
        },
      },
      border: 'none',
      '& .rdw-dropdown-optionwrapper': {
        '& *': {
          color: theme.palette.common.black,
        },
        border: 'none',
        boxShadow: theme.shadows[1],
        '& .rdw-dropdownoption-active': {
          background: alpha(theme.palette.primary.main, 0.16),
        },
        '& .rdw-dropdownoption-highlighted': {
          background: alpha(theme.palette.primary.main, 0.08),
        },
      },
    },
    '& .rdw-image-modal': {
      color: theme.palette.common.black,
    },
    '& .rdw-option-active': {
      background: theme.palette.primary.main,
      borderColor: 'transparent',
    },
  },
  errorContainer: {
    border: `1px solid ${theme.palette.error.main}`,
  },
}));

type RichTextboxProps = {
  placeholder: string;
  label: string;
  required?: boolean;
  value?: any;
  onChange: (a: any) => void;
  error?: boolean;
  helperText?: any;
};
type RichTextboxHandle = {
  reset: () => void;
};

const RichTextboxField = forwardRef<RichTextboxHandle, RichTextboxProps>((props, ref) => {
  const { required = false, label, value, onChange, placeholder, error, helperText } = props;
  const classes = useStyles();
  const { t } = useTranslation();

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
    const strValue = draftToHtml(convertToRaw(v.getCurrentContent()));
    onChange?.(strValue);
  }

  function uploadImageCallBack(file: File) {
    try {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        httpRequest
          .post(getUploadUrl(), formData)
          .then((response) => {
            if (response?.data?.url) {
              resolve({ data: { link: response.data.url } });
            } else {
              reject('upload unsuccessfully');
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    } catch (error) {
      console.error('Richtextbox upload image error: ', error);
    }
  }

  function _renderHelperText() {
    if (error) {
      return (
        <FormHelperText error>
          <Trans>{helperText}</Trans>
        </FormHelperText>
      );
    }
  }

  return (
    <FormControl required={required} error={error} fullWidth>
      <FormLabel required={required} error={error} sx={{ mb: 0.5 }}>
        <Trans>{label}</Trans>
      </FormLabel>
      <Box className={clsx(classes.container, error && classes.errorContainer)}>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={handleChange}
          placeholder={t(placeholder) as string}
          toolbar={{
            options: ['inline', 'blockType', 'list', 'image', 'textAlign'],
            inline: { inDropdown: false, options: ['bold', 'italic'] },
            list: {
              inDropdown: false,
              options: ['ordered', 'unordered'],
            },
            textAlign: { inDropdown: false, options: ['left', 'center', 'right'] },
            link: { inDropdown: true },
            image: {
              uploadCallback: uploadImageCallBack,
              alt: { present: false, mandatory: false },
              previewImage: false,
              defaultSize: { maxWidth: '100%', height: '200px' },
            },
          }}
        />
      </Box>
      {_renderHelperText()}
    </FormControl>
  );
});

export default RichTextboxField;
