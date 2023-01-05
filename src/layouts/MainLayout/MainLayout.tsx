import React, { useState, useCallback, FC } from 'react';
import { useTheme } from '@mui/material';
import clsx from 'clsx';
import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from 'containers/ErrorBoundary';
import NavBar from './NavBar';
import TopBar from './TopBar';
import Footer from './Footer';

// styles
import useStyles from './styles';

const MainLayout: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [isDrawer, setIsDrawer] = useState(true);

  const _handleToogleDrawer = useCallback(() => {
    setIsDrawer(!isDrawer);
  }, [isDrawer]);

  return (
    <div className={classes.root}>
      <CssBaseline />

      <TopBar isDrawer={isDrawer} handleToogleDrawer={_handleToogleDrawer} />

      <NavBar isDrawer={isDrawer} />

      <main className={clsx(classes.content, isDrawer && classes.contentShift)}>
        <div className={classes.container}>
          <div className={classes.toolbar} />
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
        <Footer style={{ position: 'relative' }} />
      </main>
    </div>
  );
};

export default MainLayout;
