import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Default from 'views/Dashboard/Default';
import FrontOfficeDashboards from 'views/master/frontOffice-setup/frontOfficeDashboards';
import OPDQueueLayout from 'layout/OPDQueueLayout';
import Loader from 'component/Loader/Loader';
import SuperAdminDashboard from 'views/Dashboard/Default/SuperAdminDashboard';

const DashboardRoute = {
  admin: <Default />,
  'super-admin': <SuperAdminDashboard />,
  staff: <Default />,

  Administrative: <FrontOfficeDashboards />,
  Consultant: <OPDQueueLayout />,
  NursingAndParamedical: <OPDQueueLayout />,
  MedicalOfficer: <OPDQueueLayout />
};

function NavigateToDashboard() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loggedRole = localStorage.getItem('loginRole');
    setRole(loggedRole);
  }, []);

  if (!role) {
    return <Loader />;
  }

  // Render the component associated with the role or show Unauthorized Access message
  return DashboardRoute[role] || <div>Unauthorized Access</div>;
}

export default NavigateToDashboard;
