import Typography from '@mui/material/Typography';
import { Trans } from 'react-i18next';

const Version = () => {
  return (
    <>
      <Typography variant="caption" style={{ color: '#758695', padding: '8px 0 8px 24px' }}>
        <Trans values={{ time: 'May 06 2023 12:32:13' }}>lang_build_version</Trans>
      </Typography>
    </>
  );
};

export default Version;
