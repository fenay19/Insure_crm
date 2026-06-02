import React, { useEffect, useState } from 'react';
import { Box, Typography, Tooltip, Chip, Modal } from '@mui/material';
import dayjs from 'dayjs';
import StatusBoxes from '../StatusBoxes';
import AddAppointment from 'views/master/frontOffice-setup/appointment/forms/AddAppointment';
import { get } from 'api/api';

function TimeSlotsOfConsultant({ timeSlots, drInfo }) {
  const [open, setOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotAData, setSlotAData] = useState();
  const [slotBData, setSlotBData] = useState();

  const handleOpen = (slot) => {
    setSelectedSlot(slot);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSlot(null);
  };
  useEffect(() => {
    fetchCheckedPatient();
  }, [drInfo]);

  // if (!timeSlots || !timeSlots.schedulingData) return null;

  const { schedulingData } = timeSlots;

  // Get time slots directly from the object
  // const slotAData = schedulingData.slotA.timeSlotsIntervalWise;
  useEffect(() => {
    if (schedulingData) {
      setSlotAData(schedulingData.slotA?.timeSlotsIntervalWise || []);
      setSlotBData(schedulingData.slotB?.timeSlotsIntervalWise || []);
    }
  }, [schedulingData]);
  // const slotBData = schedulingData.slotB.timeSlotsIntervalWise;

  const fetchCheckedPatient = async () => {
    try {
      if (!drInfo?.departmentId || !drInfo?.consultantId) {
        throw new Error('Missing doctor information.');
      }

      const date = new Date(drInfo?.date).toISOString().split('T')[0];
      const res = await get(`opd-patient/${drInfo.departmentId}/${drInfo.consultantId}/${date}`);
      const patients = res?.data || []; // Ensure it's an array

      // Function to update slots with patient details
      const updateSlotsWithPatients = (slots) =>
        slots.map((slot) => {
          const matchedPatient = patients.find((p) => p.time === slot.time && slot.status === 'CHECKED');
          return matchedPatient ? { ...slot, patient: matchedPatient } : slot;
        });

      // Update state with new data
      setSlotAData((prev) => updateSlotsWithPatients(prev));
      setSlotBData((prev) => updateSlotsWithPatients(prev));
    } catch (error) {
      console.error('Error fetching checked patient:', error.message);
    }
  };

  const CHIPS_BG_COLORS = {
    VACANT: '#388e3c',
    'BOOKED BUT NOT PAID': '#424874',
    'BOOKED AND PAID': '#80dfff',
    CHECKED: '#993333',
    'APPOINTMENT BOOKED': '#9ba6a5'
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ width: '70%' }}>
          {/* Slot A */}
          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '16px' }}>
            Slot A
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.4,
              justifyContent: 'center',
              marginBottom: '24px'
            }}
          >
            {slotAData?.map((slot, index) => {
              const isBooked =
                slot.status === 'CHECKED' ||
                slot.status === 'BOOKED AND PAID' ||
                slot.status === 'BOOKED BUT NOT PAID' ||
                slot.status === 'APPOINTMENT BOOKED';

              return (
                <Box key={index} sx={{ textAlign: 'center', margin: '4px' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '8px' }}>
                    {slot.time}
                  </Typography>
                  <Tooltip
                    title={
                      slot.status === 'CHECKED' && slot.patient ? (
                        <Box sx={{ textAlign: 'left', p: 1 }}>
                          <Typography variant="body2">
                            <strong>Name:</strong> {slot.patient.prefix || ''} {slot.patient.patientFirstName || 'N/A'}{' '}
                            {slot.patient.patientLastName || ''}
                          </Typography>
                          <Typography variant="body2">
                            <strong>OPD Reg No:</strong> {slot.patient.opd_regNo || 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>UHID:</strong> {slot.patient.uhid || 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Department:</strong> {slot.patient.departmentName || 'N/A'}
                          </Typography>
                        </Box>
                      ) : isBooked ? (
                        'This slot is already booked'
                      ) : (
                        ''
                      )
                    }
                    placement="top"
                    arrow
                  >
                    <Chip
                      label={slot.status === 'CHECKED' ? 'CHECKED' : isBooked ? 'BOOKED' : 'Slot A'}
                      sx={{
                        backgroundColor: CHIPS_BG_COLORS[slot.status] || '#d32f2f',
                        color: '#fff',
                        height: '32px',
                        fontSize: '0.9rem',
                        padding: '0 12px',
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        opacity: isBooked ? 0.6 : 1
                      }}
                      onClick={!isBooked ? () => handleOpen(slot.time) : undefined}
                    />
                  </Tooltip>
                </Box>
              );
            })}
          </Box>

          {/* Slot B */}
          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '16px' }}>
            Slot B
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.4, justifyContent: 'center' }}>
            {slotBData?.map((slot, index) => {
              const isBooked =
                slot.status === 'CHECKED' ||
                slot.status === 'BOOKED AND PAID' ||
                slot.status === 'BOOKED BUT NOT PAID' ||
                slot.status === 'APPOINTMENT BOOKED';

              return (
                <Box key={index} sx={{ textAlign: 'center', margin: '4px' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '8px' }}>
                    {slot.time}
                  </Typography>
                  <Tooltip
                    title={
                      slot.status === 'CHECKED' && slot.patient ? (
                        <Box sx={{ textAlign: 'left', p: 1 }}>
                          <Typography variant="body2">
                            <strong>Name:</strong> {slot.patient.prefix || ''} {slot.patient.patientFirstName || 'N/A'}{' '}
                            {slot.patient.patientLastName || ''}
                          </Typography>
                          <Typography variant="body2">
                            <strong>OPD Reg No:</strong> {slot.patient.opd_regNo || 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>UHID:</strong> {slot.patient.uhid || 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Department:</strong> {slot.patient.departmentName || 'N/A'}
                          </Typography>
                        </Box>
                      ) : isBooked ? (
                        'This slot is already booked'
                      ) : (
                        ''
                      )
                    }
                    placement="top"
                    arrow
                  >
                    <Chip
                      label={slot.status === 'CHECKED' ? 'CHECKED' : isBooked ? 'BOOKED' : 'Slot B'}
                      sx={{
                        backgroundColor: CHIPS_BG_COLORS[slot.status] || '#d32f2f',
                        color: '#fff',
                        height: '32px',
                        fontSize: '0.9rem',
                        padding: '0 12px',
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        opacity: isBooked ? 0.6 : 1
                      }}
                      onClick={!isBooked ? () => handleOpen(slot.time) : undefined}
                    />
                  </Tooltip>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Right Side - Status Boxes */}
        <Box sx={{ width: '25%', marginTop: '50px' }}>
          <StatusBoxes />
        </Box>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4
          }}
        >
          {selectedSlot && <AddAppointment close={handleClose} selectedSlot={selectedSlot} isOpdDashboard={true} drInfo={drInfo} />}
        </Box>
      </Modal>
    </>
  );
}

export default TimeSlotsOfConsultant;
