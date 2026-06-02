import React, { useEffect, useState } from 'react';
import { useGetConsultantsQuery } from 'services/endpoints/consultants/consultantApi';
import { List, ListItem, Paper, TextField, Box, Chip,  IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  useAddPatientCrossConsultationMutation,
 
  useUpdatePatientCrossConsultationMutation,
  useDeletePatientCrossConsultationMutation,
  useLazyGetPatientCrossConsultationQuery
} from 'services/endpoints/Orders/crossConsultation';
import { useSelector } from 'react-redux';

function CrossConsultation() {
  const patient = useSelector((state) => state.patient.selectedPatient);
  const { data = [] } = useGetConsultantsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const [notes, setNotes] = useState('');
  const [addConsultation] = useAddPatientCrossConsultationMutation();
  const [triggerGetPatientCrossConsultation, { data: patiantCrossConsultant }] = useLazyGetPatientCrossConsultationQuery();

  const [updatePatientCrossConsultation] = useUpdatePatientCrossConsultationMutation();
  console.log(patiantCrossConsultant);
  // const [deletePatientCrossConsultation] = useDeletePatientCrossConsultationMutation();

  const filteredData = data.filter((item) => {
    const fullName =
      `${item?.basicDetails?.firstName} ${item?.basicDetails?.lastName} ${item?.employmentDetails?.departmentOrSpeciality?.departmentName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  console.log(data);

  const displayedData = searchTerm ? filteredData : filteredData.slice(0, 5);
  // console.log(selectedDoctor);

  const handleChipClick = async (doctor) => {
    const data = {
      patientId: patient?.patientId?._id,
      consultantId: patient?.consultantId,
      opdPatientId: patient?._id,
      notes: notes,
      consultant: doctor._id
    };

    if (patiantCrossConsultant) {
      await updatePatientCrossConsultation({ id: patiantCrossConsultant?._id, data });
    } else {
      await addConsultation(data);
    }
    setShowContent(true);
  };

  const handleCloseBox = () => {
    setShowContent(false);
    setSelectedDoctor([]);
  };
  useEffect(() => {
    if (patiantCrossConsultant?.consultant?.length > 0) {
      setShowContent(true);
    }
  }, [patiantCrossConsultant]);
  useEffect(()=>{
    if(patient){
      triggerGetPatientCrossConsultation(patient?.patientId?._id);
    }
  },[patient])
  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3, width: 400 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search doctor or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <List>
          {(displayedData || [])?.map((item) => (
            <ListItem key={item?._id} divider disableGutters>
              <Chip
                onClick={() => {
                  handleChipClick(item);
                }}
                label={`${item?.basicDetails?.firstName} ${item?.basicDetails?.lastName} (${item?.employmentDetails?.departmentOrSpeciality?.departmentName})`}
                sx={{ backgroundColor: 'rgb(8, 155, 171)', color: 'white', fontWeight: 500, width: '100%' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {showContent && selectedDoctor && (
        <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3, width: 400, position: 'relative' }}>
          <IconButton onClick={handleCloseBox} sx={{ position: 'absolute', top: 8, right: 8 }} size="small">
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {patiantCrossConsultant?.consultant?.map((items) => {
              return (
                <Chip
                  key={items._id}
                  className="selectProblemActive"
                  label={`${items?.basicDetails?.firstName} ${items?.basicDetails?.firstName} (${items?.employmentDetails?.departmentOrSpeciality?.departmentName})`}
                  sx={{
                    margin: '5px',
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                    borderRadius: '20px',
                    padding: '8px 12px',
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: '#303f9f'
                    }
                  }}
                />
              );
            })}
          </Box>

          
          <TextField
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
            variant="outlined"
            label="Notes"
            placeholder="Add your notes here..."
            sx={{ mt: 2 }}
          />
        </Paper>
      )}
    </Box>
  );
}

export default CrossConsultation;
