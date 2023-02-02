import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Trans } from 'react-i18next';

const Version = () => {
  return (
    <>
      <Divider />
      <Typography variant="caption" style={{ color: '#758695', padding: '8px 0 8px 24px' }}>
        <Trans values={{ time: 'Feb02 2023 11:04:59' }}>lang_build_version</Trans>
      </Typography>
    </>
  );
};

export default Version;
