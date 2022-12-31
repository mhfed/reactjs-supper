import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { useGlobalContext } from 'context/GlobalContext';
import Auth from 'containers/Auth';
import Dialog from 'components/molecules/Dialog';
import SnackBarBase from 'components/molecules/SnackBar';
import themes from 'themes';
import { THEMES } from 'configs';
import Routes from 'routes/Routes';
import { Theme } from '@mui/material/styles';
import GlobalModal from 'containers/Modal';

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
              <GlobalModal>
                <Dialog />
                <Routes />
                <SnackBarBase />
              </GlobalModal>
            </SnackbarProvider>
          </Auth>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
