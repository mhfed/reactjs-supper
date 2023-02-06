/*
 * Created on Fri Jan 06 2023
 *
 * Error boundary
 *
 * Copyright (c) 2023 - Novus Fintech
 */

/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect, useCallback, FC } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Button from 'components/atoms/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type DefaultPageProps = {
  children?: React.ReactNode;
};

const DefaultPage: FC<DefaultPageProps> = ({ children }) => {
  const [boundaryKey, setBoundaryKey] = useState(0);

  const memorizedSyncLog = useCallback(async (message?: any, componentStack?: any) => {
    const params = {
      level: 'ERROR',
      datetime: new Date().toUTCString(),
      os: 'Window',
      description: 'platform.description',
      userId: 1,
      error: JSON.stringify(message),
      componentStack: JSON.stringify(componentStack),
      location: window.location.href,
      version: '1.0.0',
    };
    localStorage.setItem('errorLog', JSON.stringify(params));
  }, []);

  useEffect(() => {
    async function sendLogWhenOnline() {
      const getLogFromStorage: string | null = localStorage.getItem('errorLog');
      if (getLogFromStorage) {
        memorizedSyncLog();
      }
    }
    sendLogWhenOnline();

    window.onerror = async (message, _, __, ___, errorObj) => {
      memorizedSyncLog(message, errorObj?.stack);
    };

    return () => {
      window.onerror = null;
    };
  }, [memorizedSyncLog]);

  /**
   * Show exception dialog
   */
  function ErrorFallbackUI({ resetErrorBoundary }: FallbackProps) {
    return (
      <Dialog onClose={resetErrorBoundary} fullWidth open>
        <DialogTitle component="h4">Error</DialogTitle>
        <DialogContent>
          <DialogContentText>Something went wrong!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetErrorBoundary} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <ErrorBoundary
      resetKeys={[boundaryKey]}
      FallbackComponent={ErrorFallbackUI}
      onReset={() => setBoundaryKey((prev) => prev + 1)}
    >
      {children}
    </ErrorBoundary>
  );
};

export default DefaultPage;
