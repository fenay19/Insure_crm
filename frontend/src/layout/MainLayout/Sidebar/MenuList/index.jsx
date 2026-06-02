import React, { useEffect, useState } from 'react';
import REACT_APP_API_URL, { get, put } from '../../../../api/api.js';
import { Typography, List, ListItem, Box, Card } from '@mui/material';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import adminMenuItems from 'admin-menu-items';
import staffMenuItems from 'staff-menu-items.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectPatient } from 'store/patientSlice';
import { toast, ToastContainer } from 'react-toastify';
import NavItem from './NavItem';
import { useNavigate } from 'react-router';
import { fetchSystemRights } from 'reduxSlices/systemRightSlice.js';

const MenuList = () => {
  // const [systemRights, setSystemRights] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const loginRole = localStorage.getItem('loginRole');
  const [patients, setPatients] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const img = window.localStorage.getItem('img');

  const dummyPatientData = [
    { id: 1, name: 'John Doe', age: 30, gender: 'Male' },
    { id: 2, name: 'Jane Smith', age: 25, gender: 'Female' },
    { id: 3, name: 'Bob Johnson', age: 40, gender: 'Male' }
  ];

  const getDailyConfirmedAppointmentConsultantWise = async () => {
    const { refId: consultantId } = JSON.parse(localStorage.getItem('loginData'));
    // const response = await get(`opd-patient/getDailyConfirmedAppoitmentsConsultantWise/${consultantId}`);
    setPatients([]);
  };
  const systemRights = useSelector((state) => state.systemRights.systemRights);
  const isLoading = useSelector((state) => state.systemRights.isLoading);
  // const getSystemRights = async () => {
  //   try {
  //     const loginData = JSON.parse(localStorage.getItem('loginData'));
  //     const userId = loginData?._id;
  //     if (!userId) return;
  //     const response = await get(`admin/user/system-rights/${userId}`);
  //     if (response?.success) {
  //       setSystemRights(response.systemRights);
  //     } else {
  //       console.error('Failed to fetch system rights:', response.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching system rights:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const [secondLogo, setSecondLogo] = useState(null);

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

    fetchSecondLogo();
  }, []);

  const handlePatientIn = async (id) => {
    const status = 'Patient In';
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const patientInTime = `${formattedHours}:${minutes} ${ampm}`;
    try {
      const { data } = await get(`opd-patient/patient/${id}`);
      if (data && data?.status?.toLowerCase()?.trim() === 'waiting') {
        const res = await put(`opd-patient/update-patient-status/${id}`, { status, patientInTime });
        if (res?.success) {
          toast.success('Patient status updated successfully');
          dispatch(selectPatient(res?.data || {}));
        } else {
          toast.error(res?.message || 'Failed to update patient status');
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error('Error updating patient status:', err);
    }
  };

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    const userId = loginData?._id;
    if (userId) {
      dispatch(fetchSystemRights(userId));
    }
    // getSystemRights();
    getDailyConfirmedAppointmentConsultantWise();
  }, []);
  // console.log('System Rights:', systemRights);
  // Pass action permissions to menu item filtering if needed downstream
  const filterMenuItems = (menuItems, authorizedIds, actionPermissions) => {
    return menuItems
      .map((item) => {
        if (item.type === 'group' || item.type === 'collapse') {
          const filteredChildren = filterMenuItems(item.children || [], authorizedIds, actionPermissions);
          if (authorizedIds[item.id] || filteredChildren.length > 0) {
            return {
              ...item,
              children: filteredChildren
            };
          }
          return null;
        }
        // You could use actionPermissions[item.id] here for finer control, e.g. only show if View is allowed
        if (item.type === 'item' && authorizedIds[item.id]) {
          // Example: Only show menu item if View permission is true
          if (actionPermissions && actionPermissions[item.id] && actionPermissions[item.id].View) {
            return item;
          }
          // If you want to show item regardless of specific action, use only authorizedIds
          // return item;
        }
        return null;
      })
      .filter(Boolean);
  };

  let filteredMenuItems = [];

  if (loginRole === 'admin') {
    filteredMenuItems = adminMenuItems.items;
  } else if (loginRole === 'super-admin') {
    filteredMenuItems = menuItem.items;
  } else if (loginRole === 'Consultant') {
    filteredMenuItems = dummyPatientData;
  } else if (systemRights?.authorizedIds) {
    filteredMenuItems = filterMenuItems(staffMenuItems.items, systemRights.authorizedIds, systemRights?.actionPermissions);
    console.log('Filtered Menu Items:', filteredMenuItems);
  }

  const consultantDashboard = [
    {
      items: [
        {
          id: 'navigation',
          type: 'group',
          title: 'Navigation',
          icon: {},
          children: [
            {
              id: 'dashboard',
              title: 'Dashboard',
              type: 'item',
              icon: {},
              url: '/patient-dashboard'
            }
          ]
        }
      ]
    }
  ];

  function handleSelectPatient(id) {
    navigate('/dashboard');
    handlePatientIn(id);
  }

  const navItems =
    loginRole === 'Consultant' ? (
      <>
        {consultantDashboard?.map((item, ind) => (
          <NavItem key={ind} item={item?.items?.[0]?.children?.[0]} level={1} />
        ))}
        {patients
          ?.filter((patient) => {
            const billingStatus = patient?.billingStatus?.toLowerCase()?.trim();
            const payeeCategory = patient?.payeeCategory?.toLowerCase()?.trim();
            return billingStatus === 'paid' || payeeCategory === 'insurance';
          })
          .map((patient) => (
            <ListItem key={patient?._id} disableGutters onClick={() => dispatch(selectPatient(patient))}>
              <Card elevation={2} sx={{ width: '100%', padding: 0.5, marginBottom: 0, backgroundColor: '#f9f9f9' }}>
                <Box display="flex" flexDirection="column" onClick={() => handleSelectPatient(patient?._id)}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                    {patient?.patientFirstName} {patient?.patientLastName}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.9rem', color: '#666' }}>
                    Age: {patient?.age}, Gender: {patient?.gender}
                  </Typography>
                </Box>
              </Card>
            </ListItem>
          ))}
      </>
    ) : (
      filteredMenuItems.map((item) => {
        switch (item.type) {
          case 'group':
            return <NavGroup key={item.id} item={item} />;
          default:
            return (
              <Typography key={item.id} variant="h6" color="error" align="center">
                Menu Items Error
              </Typography>
            );
        }
      })
    );

  if (isLoading) {
    return (
      <Typography variant="h6" color="primary" align="center">
        Loading menu...
      </Typography>
    );
  }

  return loginRole === 'Consultant' ? (
    <List>{navItems}</List>
  ) : (
    <>
      <Box
        sx={{
          width: 'auto',
          // height: '80px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '6px',
          overflow: 'hidden'
        }}
      >
        <img src={getLogoUrl(secondLogo)} alt="Company Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Box>
      {navItems}
      <ToastContainer />
    </>
  );
};

export default MenuList;
