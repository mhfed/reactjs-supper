import React from 'react';
import { Link, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

import makeStyles from '@mui/styles/makeStyles';

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

function Footer({ color, style }: { color: string; style?: React.CSSProperties }) {
  const classes = useStyles();

  return (
    <div className={classes.container} style={style || {}}>
      <Typography variant="body2" align="center" component="span" style={{ color }}>
        Customer support:&nbsp;&nbsp;&nbsp;
        {<MailIcon style={{ fill: color, marginBottom: -2, fontSize: 16 }} />}
        &nbsp;
        <Link color="secondary" target="_blank" href="mailto:support@iress.app">
          support@iress.app
        </Link>
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
        <span style={{ color: color || 'inherit' }}>Powered by</span>
        <img alt="footerLogo" style={{ height: 20, marginLeft: 8 }} src="/assets/images/novus-fintech.svg" />
      </div>
    </div>
  );
}

export default Footer;
