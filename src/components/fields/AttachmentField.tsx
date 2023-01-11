import React from 'react';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputBase from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { Trans } from 'react-i18next';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: 'initial',
    maxWidth: '100%',
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
    background: '#1B2029',
  },
  errorContainer: {
    borderColor: theme.palette.error.main,
  },
  removeImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 11,
    '& svg': {
      fill: theme.palette.common.black,
    },
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  previewImage: {
    zIndex: '1',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  asterisk: {
    color: theme.palette.error.main,
  },
}));

type AttachmentFieldProps = {
  selectText?: string;
  helperText?: string;
  accept?: string;
  maxSize?: number;
  error?: boolean;
  required?: boolean;
  name: string;
  label: string;
  onChange: (data: any) => void;
  setFieldTouched?: any;
  style?: React.CSSProperties;
};

const AttachmentField: React.FC<AttachmentFieldProps> = (props) => {
  const classes = useStyles();
  const {
    error,
    selectText = 'lang_choose_file',
    required,
    helperText = 'JPEG, JPG, PNG, HEIC',
    accept = '.png, .heic, .jpeg, .jpg',
    maxSize = 10 * 1000 * 1000, // bytes
    name,
    label,
    style = {},
    setFieldTouched,
    onChange,
  } = props;
  const [url, setUrl] = React.useState('');
  const refInput = React.useRef<HTMLInputElement>();

  /**
   * Update new file upload
   * @param {Event} e input type file change event
   */
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldTouched?.(name, true);
    const file = e.target?.files?.[0];
    if (!file) return;
    const { size: fileSize, name: fileName } = file;
    const extension = (fileName + '').match(/([^.]*)$/)?.[0]?.toLowerCase();
    if (fileSize > maxSize || (extension && !accept.includes(extension))) {
      onChange({
        name: fileName,
        size: fileSize,
        extension,
      });
      url && setUrl('');
      refInput.current && (refInput.current.value = '');
    } else {
      const objUrl = URL.createObjectURL(file);
      setUrl(objUrl);
      onChange({
        url: objUrl,
        name: fileName,
        size: fileSize,
        extension,
      });
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
          <Trans>{error}</Trans>
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
    setUrl('');
    refInput.current && (refInput.current.value = '');
    onChange('');
  };

  /**
   * Render preview image for file selected
   * @returns HTML UI show preview image
   */
  const renderPreview = () => {
    return (
      <React.Fragment>
        <IconButton onClick={onRemove} className={classes.removeImage}>
          <CloseIcon />
        </IconButton>
        <img alt="attachment_field_preview_img" className={classes.previewImage} src={url} />
      </React.Fragment>
    );
  };

  return (
    <div className={classes.wrapper}>
      <InputLabel shrink>
        <Trans>{label}</Trans>
        <Typography component="span" className={classes.asterisk}>
          {required ? ' *' : ''}
        </Typography>
      </InputLabel>
      <label
        htmlFor={`input_file_for_${name}`}
        className={clsx(classes.container, error && classes.errorContainer)}
        style={style}
      >
        <InputBase
          type="file"
          inputRef={refInput}
          id={`input_file_for_${name}`}
          inputProps={{
            accept: accept,
          }}
          onChange={onChangeFile}
          className={classes.inputFileHidden}
        />
        <FormControl className={classes.inputContainer} error={error}>
          {url ? (
            renderPreview()
          ) : (
            <React.Fragment>
              <Typography sx={{ px: 1 }} color="primary" variant="body1">
                <Trans>{selectText}</Trans>
              </Typography>
              <FormHelperText error={false} sx={{ pl: 1 }}>
                {helperText}
              </FormHelperText>
            </React.Fragment>
          )}
        </FormControl>
      </label>
      {_renderHelperText()}
    </div>
  );
};

export default AttachmentField;
