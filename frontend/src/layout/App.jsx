import React, { useEffect, useState } from 'react';

// material-ui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Modal } from '@mui/material';

// third-party
import { useSelector } from 'react-redux';

// project import
import theme from 'themes';
import Routes from 'routes/index';
import NavigationScroll from './NavigationScroll';
import { ToastContainer } from 'react-toastify';
import LockScreen from 'component/lockScreen/LockScreen';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);
  const [savedPattern, setSavedPattern] = useState({});

  const handleCloseLock = () => {
    setSavedPattern((prev) => ({ ...prev, status: false }));

    const updatedData = { ...savedPattern, status: false };
    localStorage.setItem('lockData', JSON.stringify(updatedData));
  };

  useEffect(() => {
    const lockData = localStorage.getItem('lockData');
    if (lockData) {
      const parsedData = JSON.parse(lockData);
      if (parsedData && typeof parsedData === 'object') {
        setSavedPattern(parsedData);
      }
    }
  }, []);

  return (
    <>
      <NavigationScroll>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme(customization)}>
            <CssBaseline />
            <ToastContainer />

            <Routes />
          </ThemeProvider>
        </StyledEngineProvider>
      </NavigationScroll>
      <Modal open={!!savedPattern?.status} onClose={handleCloseLock}>
        <LockScreen onClose={handleCloseLock} />
      </Modal>
    </>
  );
};

export default App;
