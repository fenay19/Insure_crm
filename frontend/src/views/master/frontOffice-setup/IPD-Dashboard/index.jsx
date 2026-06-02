import React from 'react';
import IPDHeader from './Header';
import DashboardBeds from './Beds';
import { floorsData } from './data';

const IPDDashboard = () => {
  return (
    <>
      <IPDHeader />
      <DashboardBeds
        floors={floorsData}
        cardStyle={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        iconStyle={{ fontSize: '35px' }}
        titleStyle={{ fontWeight: 'bold', color: '#555' }}
      />
    </>
  );
};

export default IPDDashboard;
