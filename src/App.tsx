import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SnackbarProvider } from 'notistack';

// material core
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

// context
import { useGlobalContext } from 'context/GlobalContext';

// containers
import Auth from 'containers/Auth';

// atomic
// import LinearProgress from 'components/atoms/LinearProgress';
import Dialog from 'components/molecules/Dialog';
import SnackBarBase from 'components/molecules/SnackBar';

// themes
import themes from 'themes';
import { THEMES } from 'configs';

// routes
import Routes from 'routes/Routes';

// it could be your App.tsx file or theme file that is included in your tsconfig.json
import { Theme } from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

function App() {
  // 0: light, 1: dark
  const { i18n } = useTranslation();
  const { modeTheme, language } = useGlobalContext();
  const type = modeTheme === THEMES.LIGHT ? 0 : 1;

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(type)}>
        <Router>
          <Auth>
            <SnackbarProvider
              autoHideDuration={process.env.REACT_APP_AUTO_HIDE_SNACKBAR || 3000}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              maxSnack={process.env.REACT_APP_MAX_SNACKBAR || 3}
            >
              {/* <LinearProgress /> */}
              <Dialog />
              <Routes />
              <SnackBarBase />
            </SnackbarProvider>
          </Auth>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
