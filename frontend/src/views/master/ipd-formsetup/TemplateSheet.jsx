import React, { useState, useEffect} from 'react';
import {
  Box, Grid,TextField,Paper,Typography,Button,IconButton} from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import { get } from 'api/api';
import DrugTable from './child/DrugTable';
import Modals from './child/Modals';
import FormFields from './child/FormFields';

const freqToColCount = {
  OD: 1,
  BD: 2,
  TDS: 3,
};
const TemplateSheet = () => {
  const [allMedicines, setAllMedicines] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openRouteModalIndex, setOpenRouteModalIndex] = useState(null);
  const [openDoseModalIndex, setOpenDoseModalIndex] = useState(null);
  const [originalRouteOptions, setOriginalRouteOptions] = useState([]);
  const [originalDoseOptions, setOriginalDoseOptions] = useState([]);
  const [originalMedicinesOptions, setOriginalMedicineOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: '',
    allergy: '',
    postOfDay: '',
    icuDay: '',
    dietOrders: ''
  });
  const initialFormData = {
    diagnosis: '',
    allergy: '',
    postofDay: '',
    icuDay: '',
    dietOrders: '',
  };  
  
const initialDrugData = [
    {
      genericName: '',
      day: '',
      dose: '',
      route: '',
      freq: '',
      adminRecords: [{ time: '', showCurrentTime: false }],
    },
  ];
  const [doseOptions, setDoseOptions] = useState([]);
  const [drugData, setDrugData] = useState([
    {
      name: '',
      day: '',
      dose: '',
      route: '',
      freq: 'OD',
      adminRecords: [{ timeSign: '', showCurrentTime: false }],
    },
  ]);
  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [medicineOptions, setMedicinesOptions] = useState([]);
  const [filteredRouteOptions, setFilteredRouteOptions] = useState(routeOptions);
  const [customSections, setCustomSections] = useState([]);
  const [newSection, setNewSection] = useState('');
  const [openDialogIndex, setOpenDialogIndex] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await get('route-master');
        const formattedRoutes = response.data.map((route) => ({
          id: route._id,
          routeName: route.routeName,
        }));
        setRouteOptions(formattedRoutes);
        setOriginalRouteOptions(formattedRoutes)
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);
  useEffect(() => {
    const fetchDoses = async () => {
      try {
        const response = await get('dose-master');
        const formattedDoses = response.data.map((dose) => ({
          id: dose._id,
          dose: dose.dose,
        }));
        setDoseOptions(formattedDoses);
        setOriginalDoseOptions(formattedDoses)
      } catch (error) {
        console.error('Error fetching doses:', error);
      }
    };
    fetchDoses();
  }, []);
  useEffect(() => {
  const fetchMedicines = async () => {
      try {
        const response = await get('medicines');
        console.log(response);
        if (Array.isArray(response.allMedicines)){
          const formattedMedicines = response.allMedicines.map((medicine) => ({
            id: medicine._id,
            genericName: medicine.genericName, 
          }));
          setMedicinesOptions(formattedMedicines);
          setOriginalMedicineOptions(formattedMedicines);
        } else {
          console.error('Expected response.data to be an array, but received:', response.allMedicines);
        }
      } catch (error) {
        console.error('Error fetching medicines:',error);
      }
    };
    fetchMedicines();
  }, []);
  const handleOpenRouteModal = (rowIndex) => {
    setOpenRouteModalIndex(rowIndex);
  };
  const handleSelectRoute = (rowIndex, selectedRoute) => {
    const updatedData = [...drugData];
    updatedData[rowIndex].route = selectedRoute;
    setDrugData(updatedData);
    setOpenRouteModalIndex(null);
  };
  const handleReset = () => {
    setFormData(initialFormData);
    setDrugData(initialDrugData);
  };
  const handleOpenViewModal = (drugData) =>{
    setDrugData(drugData);
    setOpenViewModal(true);
  };
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === '') {
      setMedicinesOptions(medicineOptions);
    }
    else{
      const filteredMedicines = medicineOptions.filter(medicine =>
        medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMedicinesOptions(filteredMedicines);
    }
  };
  const handleSearchDose=(searchTerm)=>{
    if(searchTerm.trim()===''){
      setDoseOptions(doseOptions);
    }
    else{
      const filteredDoses=doseOptions.filter(dose=>
        dose.dose.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setDoseOptions(filteredDoses);
    }
  }
  const handleSearchRoute=(searchTerm)=>{
    if(searchTerm.trim()===''){
      setRouteOptions(routeOptions);
    }
    else{
      const filteredRoutes=routeOptions.filter(route=>
        route.routeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
     setRouteOptions(filteredRoutes);
    }
  }
  const handleAddRow = () => {
    setDrugData((prev) => [
      ...prev,
      {
        name: '',
        day: '',
        dose: '',
        route: '',
        freq: 'OD',
        adminRecords: [{ time: '', sign: '', showCurrentTime: false }],
        },
      ]);
    };  
    const handleSelectMedicine = (rowIndex, selectedGenericName) => {
      const updatedData = [...drugData];
      updatedData[rowIndex].genericName = selectedGenericName;
      setDrugData(updatedData);
      setOpenDialogIndex(null);
    };
  const handleCloseViewModal = () => {
          setOpenViewModal(false);
          setSelectedDrug(null);
      };
  const handleFreqChange = (index, value) => {
    const colCount = freqToColCount[value.toUpperCase()] || 1;
    const updatedData = [...drugData];
    updatedData[index].freq = value;
    updatedData[index].adminRecords = Array.from({length: colCount }, () => ({
      time: '',
      sign: '',
      showCurrentTime: false,
    }));
    setDrugData(updatedData);
  };
  const handleTimeCheckboxChange = (rowIndex, recordIndex, checked) => {
    const updatedData = [...drugData];
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updatedData[rowIndex].adminRecords[recordIndex].showCurrentTime = checked;
    updatedData[rowIndex].adminRecords[recordIndex].time = checked ? currentTime : '';
    setDrugData(updatedData);
  };
const handleTimeChange = (rowIndex, recordIndex, value) => {
    const updatedData = [...drugData];
    updatedData[rowIndex].adminRecords[recordIndex].time = value;
    setDrugData(updatedData);
  };
  const handleOpenModal = (rowIndex) => {
    setOpenModalIndex(rowIndex);
  };
  const handleOpenDoseModal = (rowIndex) => {
    setOpenDoseModalIndex(rowIndex);
  };
  const [customFields, setCustomFields] = useState([]);

  const handleAddCustomSection = () => {
    setCustomFields([...customFields, { label: '', value: '' }]);
  };

  const handleCustomFieldChange = (index, e) => {
    const newCustomFields = [...customFields];
    newCustomFields[index].value = e.target.value;
    setCustomFields(newCustomFields);
  };

  const handleSelectDose = (rowIndex, selectedDose) => {
    const updatedData = [...drugData];
    updatedData[rowIndex].dose = selectedDose;
    setDrugData(updatedData);
    setOpenDoseModalIndex(null);
  };
 const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false);
    setNewSection('');
  };
  const handleSubmit = () => {
    console.log('Submitting:', drugData);
  };
  return (
    <Box p={3} key={reloadKey}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}> 
        <Button onClick={handleReset}>Add Patient</Button>
        <Modals
        openRouteModalIndex={openRouteModalIndex}
        openDoseModalIndex={openDoseModalIndex}
        openModalIndex={openModalIndex}
        openViewModal={openViewModal}
        formData={formData}
        drugData={drugData}
        routeOptions={routeOptions}
        doseOptions={doseOptions}
        medicineOptions={medicineOptions}
        handleSelectRoute={handleSelectRoute}
        handleSelectDose={handleSelectDose}
        handleSearchRoute={handleSearchRoute}
        handleSelectMedicine={handleSelectMedicine}
        handleCloseViewModal={handleCloseViewModal}
        setOpenRouteModalIndex={setOpenRouteModalIndex}
        setOpenDoseModalIndex={setOpenDoseModalIndex}
        setOpenModalIndex={setOpenModalIndex}
        setOpenViewModal={setOpenViewModal}
        handleSearch={handleSearch}
        handleSearchDose={handleSearchDose}
      />
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', marginBottom: 5 }}>
          Patient Information
        </Typography>
      {/* Pass handleAddCustomSection */}
      <FormFields
        formData={formData}
        setFormData={setFormData}
        handleAddCustomSection={handleAddCustomSection}
      />
      {/* Now map the custom fields */}
      <Grid container spacing={2} mt={2}>
        {customFields.map((field, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <TextField
              label={field.label}
              value={field.value}
              onChange={(e) => handleCustomFieldChange(index, e)}
              fullWidth
              variant="outlined"
              sx={{ border: '1px solid black' }}
            />
          </Grid>
        ))}
      </Grid>
         <DrugTable
        drugData={drugData}
        setDrugData={setDrugData}
        handleOpenModal={handleOpenModal}
        handleOpenDoseModal={handleOpenDoseModal}
        handleOpenRouteModal={handleOpenRouteModal}
        handleFreqChange={handleFreqChange}
        handleTimeCheckboxChange={handleTimeCheckboxChange}
        handleTimeChange={handleTimeChange}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
        <IconButton onClick={() => handleOpenViewModal(drugData)}>
            <VisibilityIcon sx={{width:30,height:30,color:'blue',marginTop:2,
        }}/>
         </IconButton> 
         <IconButton>
            <SaveIcon sx={{width:30,height:30,color:'green',marginTop:2}} onClick={handleSubmit}/>
         </IconButton>
         </Box>
        <Box sx={{ mt:2}} onClick={handleAddRow} style={{ cursor: 'pointer' }}>
          <AddIcon fontSize="large" />
        </Box>
      </Paper>
    </Box>
  );
};
export default TemplateSheet;
