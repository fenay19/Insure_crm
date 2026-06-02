import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRights } from 'reduxSlices/authSlice';
import OPDQueue from 'views/OPDQueue';
import { createSocketConnection } from '../../socket'; //

const OPDQueueLayout = () => {
  const dispatch = useDispatch();
  const { authorize, userId, userData, SystemRightData, isCheckingRights } = useSelector((state) => state.auth);
  useEffect(() => {
    const navType = performance.getEntriesByType('navigation')[0]?.type;
    const isPageReload = navType === 'reload' || performance.navigation.type === 1;
    const alreadyFetched = sessionStorage.getItem('hasFetchedRights');

    if (isPageReload && ['NursingAndParamedical', 'MedicalOfficer', 'Consultant'].includes(userData?.role) && userId && !alreadyFetched) {
      dispatch(fetchUserRights(userId));
      sessionStorage.setItem('hasFetchedRights', 'true');
    }
  }, [dispatch, userId, userData?.role]); // Avoid full object dependency

  useEffect(() => {
    if (userId && ['NursingAndParamedical', 'MedicalOfficer', 'Consultant'].includes(userData?.role)) {
      const socket = createSocketConnection();

      socket.emit('REGISTER_USER', userId); // ✅ Custom event

      const handleRightsUpdate = () => {
        console.log('📥 RIGHTS_UPDATED event received!');
        dispatch(fetchUserRights(userId));
      };

      socket.on('RIGHTS_UPDATED', handleRightsUpdate);

      return () => {
        socket.off('RIGHTS_UPDATED', handleRightsUpdate); // 🔧 Cleanup
      };
    }
  }, [dispatch, userId, userData?.role]); // 🚫 Not full object

  if (isCheckingRights) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Checking access...</h2>
      </div>
    );
  }

  return (
    <div>
      {!authorize ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h1 style={{ color: '#ff0000' }}>Unauthorized Access</h1>
          <p style={{ fontSize: '18px' }}>You do not have permission to access this page.</p>
        </div>
      ) : (
        <OPDQueue />
      )}
    </div>
  );
};

export default OPDQueueLayout;
