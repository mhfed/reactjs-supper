/*
 * Created on Fri Jan 06 2023
 *
 * RichTextbox to create articles content
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useImperativeHandle, forwardRef } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState, RichUtils } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import makeStyles from '@mui/styles/makeStyles';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
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
    marginTop: '0.875rem',
    '& .rdw-option-wrapper': {
      background: 'transparent',
      border: 'none',
      '&:hover': {
        background: theme.palette.hover.success,
        boxShadow: 'none',
      },
      '&:active': {
        boxShadow: 'none',
      },
    },
    '& *': {
      boxSizing: 'initial',
    },
    '& br': {
      color: theme.palette.text.primary,
    },
    '& .rdw-editor-toolbar': {
      border: 'none',
      borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.23)}`,
      background: theme.palette.background.attachment,
      color: theme.palette.text.primary,
    },
    '& .rdw-editor-main': {
      maxHeight: 800,
      padding: theme.spacing(0, 1),
      color: theme.palette.text.primary,
    },
    '& .public-DraftEditorPlaceholder-root': {
      '& *': {
        color: theme.palette.text.secondary,
      },
    },
    '& .rdw-dropdown-wrapper': {
      '&:hover': {
        background: theme.palette.background.option,
        boxShadow: 'none',
      },
      background: theme.palette.background.option,
      borderRadius: 4,
      '& .rdw-dropdown-selectedtext': {
        '& span': {
          color: theme.palette.text.primary,
        },
      },
      '& .rdw-dropdown-carettoopen': {
        borderTopColor: theme.palette.text.primary,
      },
      '& .rdw-dropdown-carettclose': {
        borderBottomColor: theme.palette.text.primary,
      },
      border: 'none',
      '& .rdw-dropdown-optionwrapper': {
        background: theme.palette.background.paper,
        '& *': {
          color: theme.palette.text.primary,
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
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      boxShadow: theme.shadows[1],
      borderColor: theme.palette.divider,
      '& .rdw-image-modal-upload-option': {
        background: theme.palette.background.oddRow,
      },
      '& input': {
        color: theme.palette.text.primary,
        background: theme.palette.background.oddRow,
        borderColor: theme.palette.divider,
      },
      '& .rdw-image-modal-btn': {
        '&:hover': {
          boxShadow: 'none',
        },
        background: theme.palette.primary.main,
        border: 'none',
        '&:disabled': {
          background: theme.palette.background.disabled,
        },
      },
    },
    '& .rdw-option-active': {
      background: theme.palette.primary.main,
      borderColor: 'transparent',
    },
  },
  errorContainer: {
    border: `1px solid ${theme.palette.error.main}`,
  },
  previewContainer: {
    marginTop: 8,
    borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.7)}`,
    padding: theme.spacing(0.5, 0, 0.5, 0),
    '& p': {
      margin: 0,
    },
  },
}));

type RichTextboxProps = {
  placeholder: string;
  label: string;
  required?: boolean;
  value?: any;
  onChange?: (a: any) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: any;
  preview?: boolean;
};
type RichTextboxHandle = {
  reset: () => void;
};

const RichTextboxField = forwardRef<RichTextboxHandle, RichTextboxProps>((props, ref) => {
  const { required = false, label, value, onChange, onBlur, placeholder, error, helperText, preview } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  /**
   * Convert data to display in richtextbox with first load
   * @param data html string data to convert to data use for rich textbox
   * @returns data converted
   */
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

  /**
   * Reset richtextbox content when value change to empty
   */
  React.useEffect(() => {
    if (editorState && value === '') {
      setEditorState(EditorState.createEmpty());
    }
  }, [value]);

  /**
   * Reset richtextbox content
   */
  const reset = () => {
    setEditorState(EditorState.createEmpty());
  };

  /**
   * Mock reset function to use on parent component
   */
  useImperativeHandle(
    ref,
    () => ({
      reset: reset,
    }),
    [],
  );

  /**
   * Handle field blur and check empty data, if empty reset richtextbox content
   */
  function handleBlur() {
    onBlur?.();
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const strValue = draftToHtml(rawContent);
    if (strValue.includes('<img')) return;
    const isEmpty = convertToRaw(editorState.getCurrentContent()).blocks.every((b) => b.text.trim() === '');
    if (isEmpty) {
      reset();
      onChange?.('');
    }
  }

  /**
   * Convert richtextbox content to html string and handle onchange field
   * @param v richtextbox change event
   */
  function handleChange(v: any) {
    try {
      const rawContent = convertToRaw(v.getCurrentContent());
      setEditorState(v);
      const strValue = draftToHtml(rawContent);
      onChange?.(strValue);
    } catch (error) {
      console.error('handleChange richtexbox error: ', error);
    }
  }

  /**
   * Handle image upload and show preview on richtextbox content
   * @param file Image file data
   */
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

  /**
   * List custom icon to custom richtexbox toolbar
   */
  const listIcon = {
    bold: '/assets/icons/bold-light.svg',
    italic: '/assets/icons/italic-light.svg',
    ordered: '/assets/icons/number-list-light.svg',
    unordered: '/assets/icons/order-list-light.svg',
    left: '/assets/icons/align-left-light.svg',
    center: '/assets/icons/align-center-light.svg',
    right: '/assets/icons/align-right-light.svg',
    image: '/assets/icons/insert-image-light.svg',
  };

  return (
    <FormControl required={required} error={error} fullWidth sx={{ mt: 1 }}>
      <InputLabel required={required} error={error} shrink sx={{ ml: '-1rem' }}>
        <Trans>{label}</Trans>
      </InputLabel>
      {preview ? (
        <div dangerouslySetInnerHTML={{ __html: value }} className={classes.previewContainer}></div>
      ) : (
        <Box className={clsx(classes.container, error && classes.errorContainer)}>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleChange}
            handleKeyCommand={(command) => {
              const newState = RichUtils.handleKeyCommand(editorState, command);
              if (newState) {
                handleChange(newState);
                return 'handled';
              }
              return 'not-handled';
            }}
            onBlur={handleBlur}
            handlePastedText={() => false}
            placeholder={t(placeholder) as string}
            toolbar={{
              options: ['inline', 'blockType', 'list', 'image', 'textAlign'],
              inline: {
                inDropdown: false,
                options: ['bold', 'italic'],
                bold: { icon: listIcon['bold'] },
                italic: { icon: listIcon['italic'] },
              },
              blockType: {
                className: 'yolo',
              },
              list: {
                inDropdown: false,
                options: ['ordered', 'unordered'],
                ordered: { icon: listIcon['ordered'] },
                unordered: { icon: listIcon['unordered'] },
              },
              textAlign: {
                inDropdown: false,
                options: ['left', 'center', 'right'],
                left: { icon: listIcon['left'] },
                center: { icon: listIcon['center'] },
                right: { icon: listIcon['right'] },
              },
              link: { inDropdown: true },
              image: {
                icon: listIcon['image'],
                alignmentEnabled: true,
                uploadCallback: uploadImageCallBack,
                alt: { present: false, mandatory: false },
                previewImage: true,
                defaultSize: { maxWidth: '100%', width: '100%', height: 'auto' },
              },
            }}
          />
        </Box>
      )}
      {error && (
        <FormHelperText error>
          <Trans>{helperText}</Trans>
        </FormHelperText>
      )}
    </FormControl>
  );
});

export default RichTextboxField;
