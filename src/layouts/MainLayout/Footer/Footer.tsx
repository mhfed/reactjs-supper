import React from 'react';
import { Link, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { Trans } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { useTheme } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    bottom: 0,
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

function Footer({ style }: { style?: React.CSSProperties }) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.container} style={style || {}}>
      <Typography variant="body2" align="center" component="span">
        <Trans
          values={{ email: 'support@iress.app' }}
          components={[
            <MailIcon key="emailIcon" style={{ marginBottom: -2, fontSize: 16 }} />,
            <Link key="emailLink" target="_blank" href="mailto:support@iress.app" />,
          ]}
        >
          lang_customer_support_email
        </Trans>
      </Typography>
      <div style={{ height: 8 }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 5,
          cursor: 'pinter',
        }}
        onClick={() => {
          window.open('https://www.novus-fintech.com/', '_blank');
        }}
      >
        <Typography>
          <Trans>lang_powered_by</Trans>
        </Typography>
        <img
          alt="footerLogo"
          style={{ height: 20, marginLeft: 8 }}
          src={theme.palette.mode === 'dark' ? '/assets/images/novus-fintech-dark.svg' : '/assets/images/novus-fintech-light.svg'}
        />
      </div>
    </div>
  );
}

export default Footer;
