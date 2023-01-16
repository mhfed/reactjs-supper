import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';
import IconButton from 'components/atoms/IconButton';
import CloseCircle from 'assets/icons/CloseCircle';
import InputBase from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { Trans } from 'react-i18next';
import clsx from 'clsx';
import { IFileUpload } from 'models/ICommon';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: 'initial',
    maxWidth: '100%',
    position: 'relative',
  },
  container: {
    display: 'flex',
    overflow: 'hidden',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    width: '100%',
    minHeight: 100,
    cursor: 'pointer',
    borderRadius: '8px',
    borderColor: theme.palette.background.attachmentBorder,
    background: theme.palette.background.attachment,
  },
  imageContainer: {
    minHeight: 200,
  },
  errorContainer: {
    borderColor: theme.palette.error.main,
  },
  previewContainer: {
    border: 'none',
    minHeight: 'unset',
    background: 'transparent',
  },
  inputFileHidden: {
    position: 'absolute',
    display: 'none',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notCenter: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  previewImage: {
    position: 'relative',
    padding: theme.spacing(1, 1, 0, 0),
    width: '100%',
    maxWidth: 300,
    '& img': {
      borderRadius: 8,
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    },
  },
}));

type AttachmentFieldProps = {
  selectText?: string;
  helperText?: string;
  errorText?: any;
  accept?: string;
  maxSize?: number;
  error?: boolean;
  required?: boolean;
  preview?: boolean;
  name: string;
  label: string;
  onChange?: (data: any) => void;
  setFieldTouched?: any;
  value?: IFileUpload;
};

const AttachmentField: React.FC<AttachmentFieldProps> = (props) => {
  const classes = useStyles();
  const {
    error,
    required,
    helperText = 'JPEG, JPG, PNG, HEIC',
    accept = '.png, .heic, .jpeg, .jpg',
    maxSize = 10 * 1000 * 1000, // bytes
    name,
    label,
    value = {},
    setFieldTouched,
    errorText,
    preview,
    onChange,
  } = props;
  const [file, setFile] = React.useState<IFileUpload>(value);
  const refInput = React.useRef<HTMLInputElement>();

  React.useEffect(() => {
    if (file && !value) {
      setFile({});
    }
  }, [value]);

  /**
   * Update new file upload
   * @param {Event} e input type file change event
   */
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldTouched?.(name, true);
    const chooseFile = e.target?.files?.[0];
    if (!chooseFile) return;
    const { size: fileSize, name: fileName } = chooseFile;
    const extension = (fileName + '').match(/([^.]*)$/)?.[0]?.toLowerCase();
    if (fileSize > maxSize || (extension && !accept.includes(extension))) {
      const fileObj = {
        file: chooseFile,
        name: fileName,
        size: fileSize,
        extension,
      };
      onChange?.(fileObj);
      setFile(fileObj);
      refInput.current && (refInput.current.value = '');
    } else {
      const objUrl = URL.createObjectURL(chooseFile);
      const fileObj = {
        file: chooseFile,
        url: objUrl,
        name: fileName,
        size: fileSize,
        extension,
      };
      setFile(fileObj);
      onChange?.(fileObj);
    }
  };

  /**
   * Render the helper text or error text
   * @returns text translated
   */
  function _renderHelperText() {
    if (error) {
      return (
        <FormHelperText sx={{ pl: 1.5 }} error>
          <Trans>{errorText}</Trans>
        </FormHelperText>
      );
    }
  }

  /**
   * Remove file uploaded
   * @param {Event} e dom click event
   */
  const onRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFile({});
    refInput.current && (refInput.current.value = '');
    onChange?.('');
  };

  return (
    <div className={classes.wrapper}>
      <InputLabel shrink error={error} required={required}>
        <Trans>{label}</Trans>
      </InputLabel>
      <label
        htmlFor={`input_file_for_${name}`}
        className={clsx(
          classes.container,
          classes.imageContainer,
          error && classes.errorContainer,
          file.url && classes.previewContainer,
        )}
      >
        <InputBase
          type="file"
          inputRef={refInput}
          disabled={preview}
          id={`input_file_for_${name}`}
          inputProps={{
            accept: accept,
          }}
          onChange={onChangeFile}
          className={classes.inputFileHidden}
        />
        <FormControl className={clsx(classes.inputContainer, file.url && classes.notCenter)} error={error}>
          {file.url ? (
            <Box className={classes.previewImage}>
              {preview ? (
                <></>
              ) : (
                <IconButton onClick={onRemove}>
                  <CloseCircle />
                </IconButton>
              )}
              <img alt="attachment_field_preview_img" src={file.url} />
            </Box>
          ) : (
            <React.Fragment>
              <Typography sx={{ px: 1 }} color="primary" variant="body1">
                <Trans>lang_choose_image</Trans>
              </Typography>
              <Typography color="gray">{helperText}</Typography>
            </React.Fragment>
          )}
        </FormControl>
      </label>
      {_renderHelperText()}
    </div>
  );
};

export default AttachmentField;
