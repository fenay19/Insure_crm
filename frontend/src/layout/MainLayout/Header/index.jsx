import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
// import logo from '../../../assets/images/iqubx_logo.png';
import logo from '../../../assets/images/mirailogo.png';
import insureLogo from '../../../assets/images/insure logo_bg.jpeg';
import JPLogo from '../../../assets/images/JP Insurance LOGO.jpeg';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, TextField, Typography, Select, MenuItem } from '@mui/material';

// project import
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { drawerWidth } from 'config.js';
import { financialYearContext } from 'context/financialYearContext';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CurrentDate from './CureentDateSection';
import REACT_APP_API_URL, { get } from 'api/api';
import { useDispatch, useSelector } from 'react-redux';
// import { setHospitalData } from 'reduxSlices/hospitalData';
// import { cleanDigitSectionValue } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils';
// import value from 'assets/scss/_themes-vars.module.scss';

import { Dialog, DialogContent, Button, Fade } from '@mui/material';
import { Close as CloseIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';

// ==============================|| HEADER ||============================== //

const Header = ({ drawerToggle }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { hospitalData } = useSelector((state) => state.hospitalData);
  const loginData = JSON.parse(localStorage.getItem('loginData')) || {};

  const [secondLogo, setSecondLogo] = useState(null);

  const end = localStorage.getItem('end');

  const [openPopup, setOpenPopup] = useState(false);
  const [daysLeft, setDaysLeft] = useState(null);
  const [financialYearData, setFinancialYearData] = useState([]);
  const [selectedFY, setSelectedFY] = useState('');

  useEffect(() => {
    if (end) {
      const endDate = new Date(end);
      const today = new Date();
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays);

      if (diffDays <= 0) {
        // expired
        localStorage.setItem('expired', 'true');
        setOpenPopup(true);
      } else {
        // not expired
        localStorage.setItem('expired', 'false');
        // Show popup if subscription ends in 30 days or less
        if (diffDays <= 30) {
          setOpenPopup(true);
        }
      }
    }
  }, [end]);

  const handleClose = () => setOpenPopup(false);
  const handleSubscribe = () => {
    // window.open('https://your-subscription-link.com', '_blank'); // replace with real link
  };

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;

    // normalize slashes
    const normalized = logoPath.replace(/\\/g, '/');

    // replace public/images with uploads
    const urlPath = normalized.replace('public/images', 'uploads');

    // prepend backend root URL, not /api/
    // console.log(`http://localhost:5050/api/${urlPath}`);

    localStorage.setItem('img', `${REACT_APP_API_URL}${urlPath}`);
    return `${REACT_APP_API_URL}${urlPath}`;
  };

  useEffect(() => {
    const fetchSecondLogo = async () => {
      try {
        const rawRefId = localStorage.getItem('refId');

        let parsedRefId;
        try {
          parsedRefId = JSON.parse(rawRefId);
        } catch (e) {
          parsedRefId = rawRefId;
        }

        if (!parsedRefId) return;

        const response = await get(`companySettings/${parsedRefId}/logo`); // your API endpoint
        // console.log('------------------------------------------', response);

        const logoUrl = response?.logo; // adjust based on your API response

        if (logoUrl) {
          setSecondLogo(logoUrl);
        }
      } catch (error) {
        console.error('Error fetching company logo:', error);
      }
    };

    const fetchFYData = async () => {
      const res = await get('financialYear');
      // console.log('FY data:', res.data);
      if (res.data) {
        setFinancialYearData(res.data);
        const now = new Date();
        const currentFinancialYear = financialYearData.find((year) => new Date(year.fromDate) <= now && new Date(year.toDate) >= now);
        setSelectedFY(currentFinancialYear?._id);

        console.log(selectedFY);
      } else setFinancialYearData([]);
    };

    fetchSecondLogo();
    fetchFYData();
  }, []);

  useEffect(() => {
    if (selectedFY) {
      localStorage.setItem('selectedFY', selectedFY);
      console.log('FY changed ', selectedFY);
    }
  }, [selectedFY]);

  const handleFYChange = (e) => {
    const value = e.target.value;
    setSelectedFY(value);
    console.log('value changed ', value);
    localStorage.setItem('selectedFY', value);
  };

  useEffect(() => {
    if (selectedFY) {
      localStorage.setItem('selectedFY', selectedFY);
      // ✅ Dispatch custom event so OTHER components react
      window.dispatchEvent(new Event('storage'));
    }
  }, [selectedFY]);

  // const fetchHospitalData = async () => {
  //   const response = await get('company-setup');
  //   dispatch(setHospitalData(response.data[0]));
  // };

  useEffect(() => {
    // fetchHospitalData();
    // getLogoUrl();
  }, []);

  return (
    <>
      <financialYearContext.Provider value={selectedFY}>
        <Box width={drawerWidth} sx={{ zIndex: 1201 }}>
          {/* <Grid container justifyContent="space-between" alignItems="center"> */}
          <Grid sx={{ display: 'flex', width: '100%' }}>
            <Grid item>
              <IconButton edge="start" sx={{ mr: theme.spacing(1.25) }} aria-label="open drawer" onClick={drawerToggle} size="large">
                <MenuTwoToneIcon sx={{ fontSize: '1.5rem' }} />
              </IconButton>
            </Grid>
            <Box sx={{ display: 'flex', backgroundColor: 'none' }} mt={0.5}>
              <Box sx={{ display: 'flex', ml: 2, gap: 2 }}>
                {/* First Logo */}
                <Box
                  sx={{
                    width: '140px',
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}
                >
                  <img src={insureLogo} alt="LOGO" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </Box>

                {/* Second Logo */}
                {secondLogo && (
                  <Box
                    sx={{
                      width: '0px',
                      height: '0px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}
                  >
                    <img src={getLogoUrl(secondLogo)} alt="Company Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  </Box>
                )}
              </Box>
              {/* <Box sx={{ display: 'flex', marginLeft: '6rem' }}>
              <Grid item sx={{ display: 'flex' }}>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '1rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                ></div>
              </Grid>
            </Box> */}
            </Box>
          </Grid>
        </Box>

        <Dialog
          open={openPopup}
          onClose={handleClose}
          TransitionComponent={Fade}
          sx={{
            '& .MuiBackdrop-root': {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.4)'
            },
            '& .MuiDialog-paper': {
              background: 'linear-gradient(180deg, #ffffff, #f9f9f9)',
              borderRadius: '20px',
              maxWidth: 420,
              width: '90%',
              textAlign: 'center',
              p: 4,
              boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }
          }}
        >
          <DialogContent
            sx={{
              p: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: '#888',
                '&:hover': { color: '#000' }
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box
              sx={{
                bgcolor: daysLeft <= 0 ? '#ffebee' : '#e3f2fd',
                color: daysLeft <= 0 ? '#d32f2f' : '#1976d2',
                width: 70,
                height: 70,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 36 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {daysLeft <= 0 ? 'Subscription Expired' : 'Subscription Reminder'}
            </Typography>

            <Typography variant="body1" sx={{ color: '#444' }}>
              {daysLeft <= 0 ? (
                <>
                  Your subscription has <strong style={{ color: '#d32f2f' }}>expired</strong>.
                </>
              ) : (
                <>
                  Your subscription will expire in <strong style={{ color: '#d32f2f' }}>{daysLeft}</strong> day
                  {daysLeft !== 1 ? 's' : ''}.
                </>
              )}
            </Typography>

            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              {daysLeft <= 0 ? 'Please renew now to regain access.' : 'Renew now to continue enjoying uninterrupted access.'}
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleSubscribe}
              sx={{
                background: daysLeft <= 0 ? 'linear-gradient(45deg, #d32f2f, #ef5350)' : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                color: '#fff',
                borderRadius: '30px',
                px: 4,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  background: daysLeft <= 0 ? 'linear-gradient(45deg, #c62828, #e53935)' : 'linear-gradient(45deg, #1565c0, #2196f3)'
                }
              }}
            >
              {daysLeft <= 0 ? 'Renew Subscription' : 'Renew Now'}
            </Button>
          </DialogContent>
        </Dialog>

        <Box sx={{ flexGrow: 1 }} />
        {/* {data?.role === 'Administrative' ? <CurrentDate /> : <SearchSection theme="light" />} */}
        <Box
          sx={{
            display: { md: 'flex', xs: 'none' },
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '12px', sm: '14px' },
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: '1px',
              lineHeight: '1.5',
              textTransform: 'uppercase'
            }}
          >
            {`${loginData?.name || 'N/A'}  `}
          </Typography>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          {/* <select
            name="finacialYear"
            id="financialYear"
            value={selectedFY}
            onChange={handleFYChange}
            style={{ backgroundColor: '#247375ff', color: 'white', height: '35px' }}
          >
            {financialYearData?.length > 0 &&
              financialYearData?.map((type) => (
                <option key={type._id} value={type._id}>
                  {new Date(type.fromDate).getFullYear()} - {new Date(type.toDate).getFullYear()}
                </option>
              ))}
          </select>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; */}
          <CurrentDate />
        </Box>

        <NotificationSection />
        <ProfileSection />
      </financialYearContext.Provider>
    </>
  );
};

Header.propTypes = {
  drawerToggle: PropTypes.func
};

export default Header;
