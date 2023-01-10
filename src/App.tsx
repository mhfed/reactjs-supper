/*
 * Created on Fri Jan 06 2023
 *
 * App root
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import SnackbarProvider from 'components/molecules/SnackbarProvider';
import { ThemeProvider, StyledEngineProvider, responsiveFontSizes } from '@mui/material/styles';
import { useGlobalContext } from 'context/GlobalContext';
import Auth from 'containers/Auth';
import NetworkLoading from 'components/atoms/NetworkLoading';
import SnackBarBase from 'components/molecules/SnackBar';
import themes from 'themes';
import { THEMES } from 'configs';
import Routes from 'routes/Routes';
import { Theme } from '@mui/material/styles';
import GlobalModal from 'containers/Modal';
import moment from 'moment-timezone';
import { setConnecting } from 'actions/app.action';
import ExpiredDialog from 'components/molecules/ExpiredDialog';

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

function App() {
  // 0: light, 1: dark
  const { i18n } = useTranslation();
  const { modeTheme, language } = useGlobalContext();
  const type = modeTheme === THEMES.LIGHT ? 0 : 1;
  const dispatch = useDispatch();

  useEffect(() => {
    moment.tz.setDefault('Australia/Sydney');
    window.addEventListener('online', () => {
      dispatch(setConnecting(false));
    });
    window.addEventListener('offline', () => {
      dispatch(setConnecting(true));
    });
    const initTooltip = () => {
      const sheet = (function () {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        return style.sheet;
      })();
      if (sheet?.insertRule) {
        sheet.insertRule('@keyframes hasTitle {from { opacity: 0.99; }to { opacity: 1; }}', 0);
        sheet.insertRule(
          '[title], .MuiTypography-root, .MuiSelect-select, .MuiTableCell-root, span, p{animation-duration: 0.001s;animation-name: hasTitle;}',
          0,
        );
      }
    };
    // const handleTooltip = (event: React.AnimationEvent<HTMLElement>) => {
    const handleTooltip = (event: any) => {
      if (event.animationName !== 'hasTitle') return;
      const target = event.target;
      const targetCL = target.classList;
      if (targetCL.contains('MuiTablePagination-root')) return;
      target.addEventListener('mouseover', function (event: React.MouseEvent<HTMLElement>) {
        let title = '';
        if (target.title) {
          target.titleH = target.title;
          target.title = '';
        }
        if (
          targetCL.contains('MuiTypography-root') ||
          targetCL.contains('MuiTableCell-root') ||
          targetCL.contains('MuiSelect-select') ||
          target.tagName === 'SPAN' ||
          target.tagName === 'P'
        ) {
          if (target.tagName !== 'INPUT') title = target.innerText + '';
          else {
            title = target.value;
          }
        } else {
          title = target.titleH;
        }
        title = (title + '')
          .replace(/\n/g, '')
          .replace(/\u200B/g, '')
          .trim();
        if (!!title) {
          let div = document.getElementById('tooltip');
          if (!div) {
            div = document.createElement('div');
            div.id = 'tooltip';
            document.body.appendChild(div);
          }
          div.style.position = 'absolute';
          div.style.opacity = '1';
          div.style.top = event.clientY + 10 + 'px';
          div.style.left = event.clientX + 10 + 'px';
          div.innerText = title;
          event.stopPropagation();
        }
      });
      target.addEventListener('mouseout', function () {
        const div = document.getElementById('tooltip');
        if (div) div.style.opacity = '0';
      });
      target.addEventListener('mousemove', function (event: React.MouseEvent<HTMLElement>) {
        const div = document.getElementById('tooltip');
        if (div && div.style.opacity !== '0') {
          if (div.clientWidth + event.clientX + 20 > document.body.scrollWidth) {
            div.style.left = event.clientX - div.clientWidth - 10 <= 0 ? '0' : event.clientX - div.clientWidth - 10 + 'px';
          } else {
            div.style.left = event.clientX + 20 + 'px';
          }

          if (div.clientHeight + event.clientY + 20 > document.body.scrollHeight) {
            div.style.top = event.clientY - div.clientHeight - 10 + 'px';
          } else {
            div.style.top = event.clientY + 20 + window.pageYOffset + 'px';
          }
        }
      });
      target.addEventListener('click', function () {
        const div = document.getElementById('tooltip');
        if (div) div.style.opacity = '0';
      });
    };
    initTooltip();
    document.addEventListener('animationstart', handleTooltip);
    return () => {
      document.removeEventListener('animationstart', handleTooltip);
    };
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={responsiveFontSizes(themes(type))}>
        <Router>
          <Auth>
            <SnackbarProvider>
              <GlobalModal>
                <NetworkLoading />
                <Routes />
                <SnackBarBase />
                <ExpiredDialog />
              </GlobalModal>
            </SnackbarProvider>
          </Auth>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
