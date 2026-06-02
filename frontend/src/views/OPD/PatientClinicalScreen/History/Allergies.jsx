import { Add, Close, Delete, Edit, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  TextField,
  Tabs,
  Tab,
  Typography,
  Dialog,
  DialogContent
} from '@mui/material';
import REACT_APP_BASE_URL, { post, remove, retrieveToken } from 'api/api';
import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const Allergies = ({
  departmentId,
  medicalCategory,
  activeStep,
  patientHistory,
  setPatientHistory,
  allAllergies,
  since,
  sinceFunction,
  getAllMasterData
}) => {
  const [openSelectAllergy, setOpenSelectAllergy] = useState(false);
  const [generalInputData, setGeneralInputData] = useState({});
  const [foodInputData, setFoodInputData] = useState({});
  const [drugInputData, setDrugInputData] = useState({});
  const [openGeneralAllergiesData, setOpenGeneralAllergiesData] = useState(false);
  const [openFoodAllergiesData, setOpenFoodAllergiesData] = useState(false);
  const [openDrugAllergiesData, setOpenDrugAllergiesData] = useState(false);

  const [mostUsedAllergies, setMostUsedAllergies] = useState({
    general: [],
    drug: [],
    food: []
  });
  const [allergies, setAllergies] = useState({
    general: [],
    drug: [],
    food: []
  });

  const [patientAllergy, setPatientAllergy] = useState({
    general: [],
    drug: [],
    food: [],
    other: ''
  });

  const [openAddGeneralAllergy, setOpenAddGeneralAllergy] = useState(false);
  const [openAddDrugAllergy, setOpenAddDrugAllergy] = useState(false);
  const [openAddFoodAllergy, setOpenAddFoodAllergy] = useState(false);

  const [openGeneralEditHandler, setOpenGeneralEditHandler] = useState(false);
  const [openGeneralDeleteHandler, setOpenGeneralDeleteHandler] = useState(false);
  const [openGeneralEditDataDetail, setOpenGeneralEditDataDetail] = useState(false);
  const [deleteGeneralIds, setDeletedGeneralIds] = useState([]);
  const [editId, setEditId] = useState('');

  const [openFoodEditHandler, setOpenFoodEditHandler] = useState(false);
  const [openFoodDeleteHandler, setOpenFoodDeleteHandler] = useState(false);
  const [openFoodEditDataDetail, setOpenFoodEditDataDetail] = useState(false);
  const [deleteFoodIds, setDeletedFoodIds] = useState([]);

  const [openDrugEditHandler, setOpenDrugEditHandler] = useState(false);
  const [openDrugDeleteHandler, setOpenDrugDeleteHandler] = useState(false);
  const [openDrugEditDataDetail, setOpenDrugEditDataDetail] = useState(false);
  const [deleteDrugIds, setDeletedDrugIds] = useState([]);

  const [error, setError] = useState('');
  const [allergyName, setAllergyName] = useState('');
  const [searchValueGeneral, setSearchValueGeneral] = useState('');
  const [searchValueDrug, setSearchValueDrug] = useState('');
  const [searchValueFood, setSearchValueFood] = useState('');
  const [sinceOpen, setSinceOpen] = useState(false);
  const [sinceValue, setSinceValue] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };
  const [loader, setLoader] = useState(true);
  const token = retrieveToken();

  const handleSince = () => {
    setSinceOpen(true);
    setOpenSelectAllergy(false);
  };

  const handleSinceClose = () => {
    setSinceOpen(false);
    setOpenSelectAllergy(true);
  };

  const handleSinceSubmit = async () => {
    if (sinceValue === '') {
      return alert('Enter the Since');
    }

    await post('since-master', { since: sinceValue }).then((response) => {
      if (response) {
        sinceFunction();
        setSinceOpen(false);
        // setOpenMedicalPro(true);
        setSinceValue('');
      }
    });
  };

  const deleteSince = async (id) => {
    await remove(`since-master/delete/${id}`).then((response) => {
      if (response) {
        sinceFunction();
      }
    });
  };

  const getAllergy = async () => {
    setLoader(true);

    await axios
      .get(`${REACT_APP_BASE_URL}opd/general-allergy/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setAllergies((prev) => {
          return { ...prev, general: res };
        });

        setMostUsedAllergies((prev) => {
          return { ...prev, general: res };
        });
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/food-allergy/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setAllergies((prev) => {
          return { ...prev, food: res };
        });

        setMostUsedAllergies((prev) => {
          return { ...prev, food: res };
        });
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/drug-allergy/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setAllergies((prev) => {
          return { ...prev, drug: res };
        });

        setMostUsedAllergies((prev) => {
          return { ...prev, drug: res };
        });
        setLoader(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (patientHistory?.allergies?.having === 'Yes') {
      setOpenSelectAllergy(true);
    } else {
      setOpenSelectAllergy(false);
      setOpenAddDrugAllergy(false);
      setOpenAddGeneralAllergy(false);
      setOpenAddFoodAllergy(false);
      setOpenGeneralEditDataDetail(false);
      setOpenGeneralEditHandler(false);
      setOpenGeneralDeleteHandler(false);

      setOpenDrugEditDataDetail(false);
      setOpenDrugEditHandler(false);
      setOpenDrugDeleteHandler(false);

      setOpenFoodEditDataDetail(false);
      setOpenFoodEditHandler(false);
      setOpenFoodDeleteHandler(false);
    }

    // eslint-disable-next-line
  }, [patientHistory?.allergies]);

  useEffect(() => {
    setPatientAllergy(patientHistory?.allergies?.which);

    getAllergy();
    // eslint-disable-next-line
  }, []);

  const closeAllergyForm = () => {
    setOpenAddDrugAllergy(false);
    setOpenAddGeneralAllergy(false);
    setOpenAddFoodAllergy(false);
    setAllergyName('');
    setOpenDrugDeleteHandler(false);
    setOpenGeneralDeleteHandler(false);
    setOpenFoodDeleteHandler(false);
    setOpenDrugEditDataDetail(false);
    setOpenGeneralEditDataDetail(false);
    setOpenFoodEditDataDetail(false);
    setOpenDrugEditHandler(false);
    setOpenGeneralEditHandler(false);
    setOpenFoodEditHandler(false);
    setDeletedDrugIds([]);
    setDeletedGeneralIds([]);
    setDeletedFoodIds([]);
    setEditId('');
  };

  const handleButtonClick = (btn) => {
    if (btn === 'Yes') {
      setOpenSelectAllergy(false);
      setPatientHistory((prev) => {
        return {
          ...prev,
          allergies: {
            having: btn,
            which: {
              general:
                patientHistory?.allergies?.which !== undefined
                  ? patientHistory?.allergies?.which?.general !== undefined && patientHistory?.allergies?.which?.general
                  : [],
              food:
                patientHistory?.allergies.which !== undefined
                  ? patientHistory?.allergies.which.food !== undefined && patientHistory.allergies.which.food
                  : [],
              drug:
                patientHistory?.allergies.which !== undefined
                  ? patientHistory?.allergies.which.drug !== undefined && patientHistory.allergies.which.drug
                  : [],
              other: ''
            }
          }
        };
      });
    } else {
      setOpenSelectAllergy(false);
      setOpenAddDrugAllergy(false);
      setOpenAddGeneralAllergy(false);
      setOpenAddFoodAllergy(false);
      setPatientHistory((prev) => {
        return {
          ...prev,
          allergies: {
            having: btn,
            which: { general: [], food: [], drug: [], other: '' }
          }
        };
      });
    }
  };

  const handleSearchGeneral = (e) => {
    setSearchValueGeneral(e.target.value);
    if (e.target.value === '') {
      let medP = mostUsedAllergies.general.slice();

      patientAllergy.general !== undefined &&
        patientAllergy.general.forEach((vv) => {
          if (!medP.some((v) => v.allergyName === vv.allergyName)) {
            medP.unshift(vv);
          }
        });
      setAllergies((prev) => {
        return { ...prev, general: medP };
      });
    } else {
      let med = [];
      allAllergies.general.forEach((v) => {
        if (v.allergyName.toLowerCase().includes(e.target.value.toLowerCase())) {
          med.push(v);
        }
      });
      setAllergies((prev) => {
        return { ...prev, general: med };
      });
    }
  };

  const handleSearchFood = (e) => {
    setSearchValueFood(e.target.value);
    if (e.target.value === '') {
      let medP = mostUsedAllergies.food.slice();

      patientAllergy.food !== undefined &&
        patientAllergy.food.forEach((vv) => {
          if (!medP.some((v) => v.allergyName === vv.allergyName)) {
            medP.unshift(vv);
          }
        });
      setAllergies((prev) => {
        return { ...prev, food: medP };
      });
    } else {
      let med = [];
      allAllergies.food.forEach((v) => {
        if (v.allergyName.toLowerCase().includes(e.target.value.toLowerCase())) {
          med.push(v);
        }
      });
      setAllergies((prev) => {
        return { ...prev, food: med };
      });
    }
  };

  const handleSearchDrug = (e) => {
    setSearchValueDrug(e.target.value);
    if (e.target.value === '') {
      let medP = mostUsedAllergies.drug.slice();

      patientAllergy.drug !== undefined &&
        patientAllergy.drug.forEach((vv) => {
          if (!medP.some((v) => v.allergyName === vv.allergyName)) {
            medP.unshift(vv);
          }
        });
      setAllergies((prev) => {
        return { ...prev, drug: medP };
      });
    } else {
      let med = [];
      allAllergies.drug.forEach((v) => {
        if (v.allergyName.toLowerCase().includes(e.target.value.toLowerCase())) {
          med.push(v);
        }
      });
      setAllergies((prev) => {
        return { ...prev, drug: med };
      });
    }
  };

  const handleSubmitGeneralAllergy = async () => {
    setOpenSelectAllergy(true)
    if (allergyName === '') {
      setError(`Enter the  General Allergy`);
    } else {
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/general-allergy`,
          {
            allergyName: allergyName,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
    setOpenSelectAllergy(true)

          await getAllMasterData();
          await getAllergy();
          let sM = [response.data.data, ...allergies.general];
          sM = [...new Map(sM.map((item) => [item['allergyName'], item])).values()];
          setAllergies((prev) => {
            return {
              ...prev,
              general: sM
            };
          });
          closeAllergyForm();
          setOpenSelectAllergy(true);
          toast.success('General Allergy Created Successfully!!');
    setOpenSelectAllergy(true)

        })
        .catch((error) => {
          toast({
            title: 'Something went wrong, Please try later!!',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        });
    }
  };

  const handleSubmitUpdateGeneralAllergy = async () => {
    if (allergyName === '') {
      setError(`Enter the  General Allergy`);
    } else {
      setOpenGeneralEditDataDetail(false);
      setOpenSelectAllergy(true);
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/general-allergy/${editId}`,
          {
            allergyName: allergyName,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getAllergy();
          // closeAllergyForm();

          toast({
            title: 'General Allergy Updated Successfully!!',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        })
        .catch((error) => {
          toast({
            title: 'Something went wrong, Please try later!!',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        });
    }
  };

  const handleSubmitFoodAllergy = async () => {
    if (allergyName === '') {
      setError(`Enter the  Food Allergy`);
    } else {
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/food-allergy`,
          {
            allergyName: allergyName,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getAllergy();
          let sM = [response.data.data, ...allergies.food];
          sM = [...new Map(sM.map((item) => [item['allergyName'], item])).values()];
          setAllergies((prev) => {
            return {
              ...prev,
              food: sM
            };
          });
          closeAllergyForm();
          setOpenSelectAllergy(true);
          toast({
            title: 'Food Allergy Created Successfully!!',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        })
        .catch((error) => {
          toast({
            title: 'Something went wrong, Please try later!!',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        });
    }
  };

  const handleSubmitUpdateFoodAllergy = async () => {
    if (allergyName === '') {
      setError(`Enter the  Food Allergy`);
    } else {
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/food-allergy/${editId}`,
          {
            allergyName: allergyName,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getAllergy();

          closeAllergyForm();
          setOpenSelectAllergy(true);
          toast({
            title: 'Food Allergy Updated Successfully!!',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        })
        .catch((error) => {
          toast({
            title: 'Something went wrong, Please try later!!',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        });
    }
  };

  const handleSubmitDrugAllergy = async () => {
    if (allergyName === '') {
      setError(`Enter the  Drug Allergy`);
    } else {
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/drug-allergy`,
          {
            allergyName: allergyName,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllergy();
          let sM = [response.data.data, ...allergies.drug];
          sM = [...new Map(sM.map((item) => [item['allergyName'], item])).values()];
          setAllergies((prev) => {
            return {
              ...prev,
              drug: sM
            };
          });
          closeAllergyForm();
          setOpenSelectAllergy(true);
          toast({
            title: 'Drug Allergy Created Successfully!!',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        })
        .catch((error) => {
          toast({
            title: 'Something went wrong, Please try later!!',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        });
    }
  };

  const handleSubmitUpdateDrugAllergy = async () => {
    if (allergyName === '') {
      setError(`Enter the  Drug Allergy`);
    } else {
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/drug-allergy/${editId}`,
          {
            allergyName: allergyName,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getAllergy();

          closeAllergyForm();
          setOpenSelectAllergy(true);
          toast({
            title: 'Drug Allergy Updated Successfully!!',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        })
        .catch((error) => {
          toast({
            title: 'Something went wrong, Please try later!!',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
        });
    }
  };

  const handleSaveDeleteGeneralAllergy = () => {
    let data = {
      ids: deleteGeneralIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/general-allergy`, {
        headers,
        data
      })
      .then(async (response) => {
        await getAllMasterData();
        getAllergy();
        closeAllergyForm();
        setOpenSelectAllergy(true);
        toast({
          title: 'General Allergy Deleted Successfully!!',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      })
      .catch((error) => {
        toast({
          title: 'Something went wrong, Please try later!!',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      });
  };

  const handleSaveDeleteDrugAllergy = () => {
    let data = {
      ids: deleteDrugIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/drug-allergy`, {
        headers,
        data
      })
      .then(async (response) => {
        await getAllMasterData();
        getAllergy();
        closeAllergyForm();
        setOpenSelectAllergy(true);
        toast({
          title: 'Drug Allergy Deleted Successfully!!',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      })
      .catch((error) => {
        toast({
          title: 'Something went wrong, Please try later!!',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      });
  };

  const handleSaveDeleteFoodAllergy = () => {
    let data = {
      ids: deleteFoodIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/food-allergy`, {
        headers,
        data
      })
      .then(async (response) => {
        await getAllMasterData();
        getAllergy();
        closeAllergyForm();
        setOpenSelectAllergy(true);
        toast({
          title: 'Food Allergy Deleted Successfully!!',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      })
      .catch((error) => {
        toast({
          title: 'Something went wrong, Please try later!!',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      });
  };
console.log(openSelectAllergy);

  return (
    <>
      <Grid container spacing={1} height="100%">
        <Box sx={{ display: 'flex', marginLeft: '2rem', flexDirection: 'column' }}>
          <Grid sx={{ width: '200px' }} gridRow={2} item height="inherit">
            <h2 className="heading">
              {activeStep + 1}. {medicalCategory[activeStep].category}
            </h2>
            <p className="catQue">Do patient have any allergies?</p>

            <ButtonGroup variant="outlined" aria-label="Basic button group" style={{ margin: '10px 0', display: 'block' }}>
              <Button
                className={`${patientHistory?.allergies?.having === 'Yes' && 'selectOptionActive'}`}
                sx={{
                  backgroundColor: `${patientHistory?.allergies?.having === 'Yes' ? '#126078' : 'white'}`,
                  color: `${patientHistory?.allergies?.having === 'Yes' ? 'white' : '#126078'}`,
                  '&:hover': {
                    color: '#126078'
                  }
                }}
                onClick={() => handleButtonClick('Yes')}
              >
                Yes
              </Button>
              <Button
                className={`${patientHistory?.allergies?.having === 'No' && 'selectOptionActive'}`}
                onClick={() => handleButtonClick('No')}
                sx={{
                  backgroundColor: `${patientHistory?.allergies?.having === 'No' ? '#126078' : 'white'}`,
                  color: `${patientHistory?.allergies?.having === 'No' ? 'white' : '#126078'}`,
                  '&:hover': {
                    color: '#126078'
                  }
                }}
              >
                No
              </Button>
            </ButtonGroup>
            {/* <Button color="primary" variant="contained" onClick={handleSince}>
            Add Since
          </Button> */}
          </Grid>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', gap: 3, width: '55vw' }}>
              {openSelectAllergy && (
                <Grid item xs={8} className="ptData">
                  <Box className="selectedPtCategory" style={{ maxHeight: 'calc(100% - 10px)' }}>
                    {loader ? (
                      <div style={{ display: 'flex' }}>
                        <CircularProgress />
                      </div>
                    ) : (
                      <>
                        { (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Tabs
                              value={tabIndex}
                              onChange={handleTabChange}
                              variant="scrollable"
                              scrollButtons="auto"
                              indicatorColor="primary"
                              textColor="primary"
                              sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}
                            >
                              {['General Allergy', 'Food Allergy', 'Drug Allergy', 'Other Allergy'].map((label, index) => (
                                <Tab
                                  key={index}
                                  label={label}
                                  sx={{
                                    backgroundColor: tabIndex === index ? '#126078' : 'transparent',
                                    color: tabIndex === index ? '#fff' : '#555',
                                    borderRadius: '8px 8px 0 0',
                                    px: 2,
                                    mx: 0.5, // Adds spacing between tabs
                                    transition: 'all 0.3s ease-in-out',
                                    '&.Mui-selected': {
                                      color: '#fff', // Ensures the text turns white when selected
                                      fontWeight: 'bold'
                                    }
                                  }}
                                />
                              ))}
                            </Tabs>

                            {/* Tabs Content */}
                            <Box sx={{ boxShadow: 3, p: 2 }}>
                              {tabIndex === 0 && (
                                <Box>
                                  <h4 style={{ margin: '0 0 10px 0' }}> General Allergies</h4>
                                  <Input
                                    className="search_patient_data"
                                    type="search"
                                    placeholder="Search..."
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <Search className="search_patient_data_icon" />
                                      </InputAdornment>
                                    }
                                    onChange={handleSearchGeneral}
                                    value={searchValueGeneral}
                                  />

                                  <Button
                                    style={{ marginLeft: '2px', display: 'inline-block' }}
                                    className="button-87"
                                    onClick={() => {
                                      setOpenGeneralAllergiesData(false);
                                      setOpenAddGeneralAllergy(true);
                                      // setOpenSelectAllergy(false);
                                      setOpenGeneralEditDataDetail(false);
                                      setOpenGeneralEditHandler(false);
                                      setOpenGeneralDeleteHandler(false);
                                    }}
                                  >
                                    Add
                                  </Button>

                                  {allAllergies.general.length > 0 && (
                                    <IconButton
                                      style={{ marginLeft: '2px' }}
                                      title="Edit General Allergy"
                                      onClick={() => {
                                        setOpenAddGeneralAllergy(false);
                                        // setOpenSelectAllergy(false);
                                        setOpenGeneralEditDataDetail(false);
                                        setOpenGeneralEditHandler(true);
                                        setOpenGeneralDeleteHandler(false);
                                      }}
                                    >
                                      <Edit fontSize="small" style={{ color: 'blue' }} />
                                    </IconButton>
                                  )}

                                  {allAllergies.general.length > 0 && (
                                    <IconButton
                                      style={{ marginLeft: '2px' }}
                                      title="Delete General Allergy"
                                      onClick={() => {
                                        setOpenAddGeneralAllergy(false);
                                        setOpenSelectAllergy(false);
                                        setOpenGeneralEditDataDetail(false);
                                        setOpenGeneralEditHandler(false);
                                        setOpenGeneralDeleteHandler(true);
                                      }}
                                    >
                                      <Delete fontSize="small" style={{ color: 'red' }} />
                                    </IconButton>
                                  )}
                                  {allAllergies.general.length === 0 ? (
                                    <>
                                      <h4 className="noFoundOPd">General Allergy Not Available, Please Add...</h4>
                                    </>
                                  ) : (
                                    <>
                                      {allergies.general.length > 0 ? (
                                        <Box sx={{ display: 'flex' }}>
                                          <Box className="allergyChip">
                                            {allergies.general.map((val, ind) => {
                                              let pre = false;
                                              patientAllergy.general !== undefined &&
                                                patientAllergy.general.forEach((v) => {
                                                  if (val.allergyName === v.allergyName && val._id === v._id && val.since !== '') {
                                                    pre = true;
                                                  }
                                                });

                                              let isSelected = val.allergyName === generalInputData.allergyName; // Check if selected

                                              return (
                                                <Chip
                                                  sx={{
                                                    borderWidth: 2, // Increase border thickness
                                                    borderColor: isSelected ? 'primary.main' : 'secondary.main',
                                                    borderStyle: 'solid',
                                                    mr: 1
                                                  }}
                                                  variant={isSelected ? 'default' : 'outlined'}
                                                  color={isSelected ? 'primary' : 'default'}
                                                  key={ind}
                                                  className={`${isSelected ? 'selectProblem_selected' : pre ? 'selectProblemActive' : 'selectProblem'}`}
                                                  label={val.allergyName}
                                                  onClick={() => {
                                                    let med = {
                                                      _id: val._id,
                                                      allergyName: val.allergyName,
                                                      since: ''
                                                    };
                                                    patientAllergy.general.forEach((v) => {
                                                      if (v.allergyName === val.allergyName && v._id === val._id && v.since !== '') {
                                                        med = v;
                                                      }
                                                    });
                                                    setGeneralInputData(med);
                                                    setOpenGeneralAllergiesData(true);
                                                    setOpenFoodAllergiesData(false);
                                                    setOpenDrugAllergiesData(false);
                                                    setOpenGeneralEditDataDetail(false);
                                                    setOpenGeneralEditHandler(false);
                                                    setOpenGeneralDeleteHandler(false);
                                                  }}
                                                  onDelete={
                                                    pre
                                                      ? () => {
                                                          let medPro = [];
                                                          patientAllergy.general.forEach((vM) => {
                                                            if (vM.allergyName !== val.allergyName) {
                                                              medPro.push(vM);
                                                            }
                                                          });
                                                          setPatientAllergy((prev) => {
                                                            return {
                                                              ...prev,
                                                              general: medPro
                                                            };
                                                          });
                                                          setOpenGeneralEditDataDetail(false);
                                                          setOpenGeneralEditHandler(false);
                                                          setOpenGeneralDeleteHandler(false);
                                                          setOpenGeneralAllergiesData(false);
                                                        }
                                                      : undefined
                                                  }
                                                  deleteIcon={pre ? <Close /> : undefined}
                                                />
                                              );
                                            })}
                                          </Box>
                                        </Box>
                                      ) : (
                                        <h4 className="noFoundOPd" style={{ paddingTop: '-20px' }}>
                                          Not Found
                                        </h4>
                                      )}
                                    </>
                                  )}
                                </Box>
                              )}
                              {tabIndex === 1 && (
                                <Box>
                                  <h4 style={{ margin: '15px 0 10px 0' }}> Food Allergies</h4>
                                  <Input
                                    className="search_patient_data"
                                    type="search"
                                    placeholder="Search..."
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <Search className="search_patient_data_icon" />
                                      </InputAdornment>
                                    }
                                    onChange={handleSearchFood}
                                    value={searchValueFood}
                                  />
                                  <Button
                                    style={{ marginLeft: '2px', display: 'inline-block' }}
                                    className="button-87"
                                    onClick={() => {
                                      setOpenFoodAllergiesData(false);
                                      setOpenAddFoodAllergy(true);
                                      setOpenSelectAllergy(false);
                                      setOpenFoodEditDataDetail(false);
                                      setOpenFoodEditHandler(false);
                                      setOpenFoodDeleteHandler(false);
                                    }}
                                  >
                                    Add
                                  </Button>

                                  {allAllergies.food.length > 0 && (
                                    <IconButton
                                      style={{ marginLeft: '2px' }}
                                      title="Edit Food Allergy"
                                      onClick={() => {
                                        setOpenAddFoodAllergy(false);
                                        setOpenSelectAllergy(false);
                                        setOpenFoodEditDataDetail(false);
                                        setOpenFoodEditHandler(true);
                                        setOpenFoodDeleteHandler(false);
                                      }}
                                    >
                                      <Edit fontSize="small" style={{ color: 'blue' }} />
                                    </IconButton>
                                  )}

                                  {allAllergies.food.length > 0 && (
                                    <IconButton
                                      style={{ marginLeft: '2px' }}
                                      title="Delete Food Allergy"
                                      onClick={() => {
                                        setOpenAddFoodAllergy(false);
                                        setOpenSelectAllergy(false);
                                        setOpenFoodEditDataDetail(false);
                                        setOpenFoodEditHandler(false);
                                        setOpenFoodDeleteHandler(true);
                                      }}
                                    >
                                      <Delete fontSize="small" style={{ color: 'red' }} />
                                    </IconButton>
                                  )}
                                  {allAllergies.food.length === 0 ? (
                                    <>
                                      <h4 className="noFoundOPd">Food Allergy Not Available, Please Add...</h4>
                                    </>
                                  ) : (
                                    <>
                                      {allergies.food.length > 0 ? (
                                        <Box className="allergyChip">
                                          {allergies.food.map((val, ind) => {
                                            let pre = false;
                                            patientAllergy.food !== undefined &&
                                              patientAllergy.food.forEach((v) => {
                                                if (val.allergyName === v.allergyName && val._id === v._id && val.since !== '') {
                                                  pre = true;
                                                }
                                              });

                                            let isSelected = val.allergyName === foodInputData.allergyName; // Check if selected

                                            return (
                                              <Chip
                                                sx={{
                                                  borderWidth: 2, // Increase border thickness
                                                  borderColor: isSelected ? 'primary.main' : 'secondary.main',
                                                  borderStyle: 'solid',
                                                  mr: 1
                                                }}
                                                variant={isSelected ? 'default' : 'outlined'}
                                                color={isSelected ? 'primary' : 'default'}
                                                key={ind}
                                                className={`${pre ? 'selectProblemActive' : 'selectProblem'}`}
                                                label={val.allergyName}
                                                onClick={() => {
                                                  let med = {
                                                    _id: val._id,
                                                    allergyName: val.allergyName,
                                                    since: ''
                                                  };
                                                  patientAllergy.food.forEach((v) => {
                                                    if (v.allergyName === val.allergyName && v._id === val._id && v.since !== '') {
                                                      med = v;
                                                    }
                                                  });
                                                  setFoodInputData(med);
                                                  setOpenFoodAllergiesData(true);
                                                  setOpenGeneralAllergiesData(false);
                                                  setOpenDrugAllergiesData(false);
                                                }}
                                                onDelete={
                                                  pre
                                                    ? () => {
                                                        let medPro = [];
                                                        patientAllergy.food.forEach((vM) => {
                                                          if (vM.allergyName !== val.allergyName) {
                                                            medPro.push(vM);
                                                          }
                                                        });
                                                        setPatientAllergy((prev) => {
                                                          return {
                                                            ...prev,
                                                            food: medPro
                                                          };
                                                        });
                                                      }
                                                    : undefined
                                                }
                                                deleteIcon={pre ? <Close /> : undefined}
                                              />
                                            );
                                          })}
                                        </Box>
                                      ) : (
                                        <h4 className="noFoundOPd" style={{ paddingTop: '-20px' }}>
                                          Not Found
                                        </h4>
                                      )}
                                    </>
                                  )}
                                </Box>
                              )}
                              {tabIndex === 2 && (
                                <Box>
                                  <h4 style={{ margin: '15px 0 10px 0' }}>Drug Allergies</h4>
                                  <Input
                                    className="search_patient_data"
                                    type="search"
                                    placeholder="Search..."
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <Search className="search_patient_data_icon" />
                                      </InputAdornment>
                                    }
                                    onChange={handleSearchDrug}
                                    value={searchValueDrug}
                                  />
                                  <Button
                                    style={{ marginLeft: '2px', display: 'inline-block' }}
                                    className="button-87"
                                    onClick={() => {
                                      setOpenAddDrugAllergy(true);
                                      setOpenSelectAllergy(false);
                                      setOpenDrugEditDataDetail(false);
                                      setOpenDrugEditHandler(false);
                                      setOpenDrugDeleteHandler(false);
                                    }}
                                  >
                                    Add
                                  </Button>

                                  {allAllergies.drug.length > 0 && (
                                    <IconButton
                                      style={{ marginLeft: '2px' }}
                                      title="Edit Drug Allergy"
                                      onClick={() => {
                                        setOpenAddDrugAllergy(false);
                                        setOpenSelectAllergy(false);
                                        setOpenDrugEditDataDetail(false);
                                        setOpenDrugEditHandler(true);
                                        setOpenDrugDeleteHandler(false);
                                      }}
                                    >
                                      <Edit fontSize="small" style={{ color: 'blue' }} />
                                    </IconButton>
                                  )}

                                  {allAllergies.drug.length > 0 && (
                                    <IconButton
                                      style={{ marginLeft: '2px' }}
                                      title="Delete Drug Allergy"
                                      onClick={() => {
                                        setOpenAddDrugAllergy(false);
                                        setOpenSelectAllergy(false);
                                        setOpenDrugEditDataDetail(false);
                                        setOpenDrugEditHandler(false);
                                        setOpenDrugDeleteHandler(true);
                                      }}
                                    >
                                      <Delete fontSize="small" style={{ color: 'red' }} />
                                    </IconButton>
                                  )}
                                  {allAllergies.drug.length === 0 ? (
                                    <>
                                      <h4 className="noFoundOPd">Drug Allergy Not Available, Please Add...</h4>
                                    </>
                                  ) : (
                                    <>
                                      {allergies.drug.length > 0 ? (
                                        <Box className="allergyChip">
                                          {allergies.drug.map((val, ind) => {
                                            let pre = false;
                                            patientAllergy.drug !== undefined &&
                                              patientAllergy.drug.forEach((v) => {
                                                if (val.allergyName === v.allergyName && val._id === v._id && val.since !== '') {
                                                  pre = true;
                                                }
                                              });

                                            let isSelected = val.allergyName === drugInputData.allergyName; // Check if selected

                                            return (
                                              <Chip
                                                sx={{
                                                  borderWidth: 2, // Increase border thickness
                                                  borderColor: isSelected ? 'primary.main' : 'secondary.main',
                                                  borderStyle: 'solid',
                                                  mr: 1
                                                }}
                                                variant={isSelected ? 'default' : 'outlined'}
                                                color={isSelected ? 'primary' : 'default'}
                                                key={ind}
                                                className={`${pre ? 'selectProblemActive' : 'selectProblem'}`}
                                                label={val.allergyName}
                                                onClick={() => {
                                                  let med = {
                                                    _id: val._id,
                                                    allergyName: val.allergyName,
                                                    since: ''
                                                  };
                                                  patientAllergy.drug.forEach((v) => {
                                                    if (v.allergyName === val.allergyName && v._id === val._id && v.since !== '') {
                                                      med = v;
                                                    }
                                                  });
                                                  setDrugInputData(med);
                                                  setOpenDrugAllergiesData(true);
                                                  setOpenFoodAllergiesData(false);
                                                  setOpenGeneralAllergiesData(false);
                                                }}
                                                onDelete={
                                                  pre
                                                    ? () => {
                                                        let medPro = [];
                                                        patientAllergy.drug.forEach((vM) => {
                                                          if (vM.allergyName !== val.allergyName) {
                                                            medPro.push(vM);
                                                          }
                                                        });
                                                        setPatientAllergy((prev) => {
                                                          return {
                                                            ...prev,
                                                            drug: medPro
                                                          };
                                                        });
                                                      }
                                                    : undefined
                                                }
                                                deleteIcon={pre ? <Close /> : undefined}
                                              />
                                            );
                                          })}
                                        </Box>
                                      ) : (
                                        <h4 className="noFoundOPd">Not Found</h4>
                                      )}
                                    </>
                                  )}
                                </Box>
                              )}
                              {tabIndex === 3 && (
                                <Box>
                                  <div style={{ marginTop: '10px' }}>
                                    <h4>Other</h4>
                                  </div>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="other"
                                    value={patientAllergy.other}
                                    onChange={(e) => {
                                      setPatientAllergy((prev) => {
                                        return {
                                          ...prev,
                                          other: e.target.value
                                        };
                                      });
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>

                            <Button
                              className="addBtn"
                              onClick={() => {
                                setPatientHistory((prev) => {
                                  return {
                                    ...prev,
                                    allergies: { ...prev.allergies, which: patientAllergy }
                                  };
                                });
                                setOpenSelectAllergy(false);
                              }}
                              style={{ marginTop: '10px' }}
                              variant="contained"
                            >
                              Save
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                </Grid>
              )}

              <Dialog
                open={openGeneralAllergiesData || openFoodAllergiesData || openDrugAllergiesData}
                maxWidth="md" // xs, sm, md, lg, xl
              >
                {/* general allergy data after selecting chip */}
                <DialogContent>
                  <Box>
                    {/* GENERAL ALLEGY DATA  */}
                    {openGeneralAllergiesData && (
                      <Box sx={{ width: 500 }} className="selectedPtCategory">
                        <h4>How long have patient has allargy with {generalInputData.allergyName}?</h4>
                        <Box className="sinceFormat" sx={{ mt: 2 }}>
                          {since?.map((v, inx) => {
                            let sinceData = v?.since;
                            if (v.since.includes('Month')) {
                              sinceData = sinceData.replace(' Month', 'M');
                            }
                            if (v.since.includes('Year')) {
                              sinceData = sinceData.replace(' Year', 'Y');
                            }
                            if (v.since.includes('Week')) {
                              sinceData = sinceData.replace(' Week', 'W');
                            }

                            let isSelected = v === generalInputData.since; // Check if selected

                            return (
                              <Chip
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: isSelected ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1
                                }}
                                variant={isSelected ? 'default' : 'outlined'}
                                color={isSelected ? 'primary' : 'default'}
                                style={{ margin: '5px' }}
                                key={inx}
                                className={`${isSelected ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={sinceData}
                                onDelete={() => deleteSince(v._id)}
                                onClick={() => {
                                  setGeneralInputData((prev) => {
                                    return { ...prev, since: v };
                                  });
                                }}
                                deleteIcon={<Close style={{ color: isSelected ? 'white' : 'inherit', fontSize: '14px' }} />}
                              />
                            );
                          })}
                          <Button
                            className="button-87"
                            onClick={() => {
                              setSinceOpen(true);
                              setOpenGeneralAllergiesData(false);
                            }}
                          >
                            Add
                          </Button>
                        </Box>

                        <Button
                          variant="contained"
                          className="addBtn"
                          style={{ marginTop: '10px' }}
                          onClick={() => {
                            if (generalInputData.since !== '') {
                              let sM =
                                patientAllergy.general !== undefined
                                  ? [
                                      ...patientAllergy.general,
                                      {
                                        ...generalInputData,
                                        since: generalInputData.since
                                      }
                                    ]
                                  : [
                                      {
                                        ...generalInputData,
                                        since: generalInputData.since
                                      }
                                    ];
                              sM = [...new Map(sM.map((item) => [item['allergyName'], item])).values()];
                              setPatientAllergy((prev) => {
                                return {
                                  ...prev,
                                  general: sM
                                };
                              });
                            }

                            setGeneralInputData({ _id: '', allergyName: '', since: '' });
                            setOpenGeneralAllergiesData(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          sx={{ ml: 2, mt: 1.3 }}
                          variant="contained"
                          onClick={() => {
                            setOpenGeneralAllergiesData(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}

                    {/* DRUG ALLERIGIES DATA */}
                    {openDrugAllergiesData && (
                      <Box sx={{ width: 500 }} className="selectedPtCategory">
                        <h4>How long have patient has {drugInputData.allergyName}?</h4>
                        <Box className="sinceFormat" sx={{ mt: 2 }}>
                          {since?.map((v, inx) => {
                            let sinceData = v.since;
                            if (v.since.includes('Month')) {
                              sinceData = sinceData.replace(' Month', 'M');
                            }
                            if (v.since.includes('Year')) {
                              sinceData = sinceData.replace(' Year', 'Y');
                            }
                            if (v.since.includes('Week')) {
                              sinceData = sinceData.replace(' Week', 'W');
                            }

                            let isSelected = v === drugInputData.since; // Check if selected

                            return (
                              <Chip
                                sx={{
                                  margin: '5px',
                                  backgroundColor: isSelected ? '#126078' : '', // Highlight selected chip
                                  color: isSelected ? '#fff' : '',
                                  px: 2
                                }}
                                key={inx}
                                className={`${isSelected ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={sinceData}
                                onDelete={() => deleteSince(v._id)}
                                onClick={() => {
                                  setDrugInputData((prev) => ({ ...prev, since: v }));
                                }}
                                deleteIcon={<Close style={{ color: isSelected ? 'white' : 'inherit', fontSize: '14px' }} />}
                              />
                            );
                          })}

                          <Button
                            className="button-87"
                            onClick={() => {
                              setSinceOpen(true);
                              setOpenDrugAllergiesData(false);
                            }}
                          >
                            Add
                          </Button>
                        </Box>

                        <Button
                          variant="contained"
                          className="addBtn"
                          style={{ marginTop: '10px' }}
                          onClick={() => {
                            if (drugInputData.since !== '') {
                              let sM =
                                patientAllergy.drug !== undefined
                                  ? [...patientAllergy.drug, { ...drugInputData, since: drugInputData.since }]
                                  : [{ ...drugInputData, since: drugInputData.since }];
                              sM = [...new Map(sM.map((item) => [item['allergyName'], item])).values()];
                              setPatientAllergy((prev) => {
                                return {
                                  ...prev,
                                  drug: sM
                                };
                              });
                            }

                            setDrugInputData({
                              _id: '',
                              allergyName: '',
                              since: ''
                            });
                            setOpenDrugAllergiesData(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          sx={{ ml: 2, mt: 1.3 }}
                          variant="contained"
                          onClick={() => {
                            setOpenDrugAllergiesData(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}

                    {/* Food Allergies Data */}
                    {openFoodAllergiesData && (
                      <Box sx={{ width: 500 }} className="selectedPtCategory">
                        <h4>How long have patient has {foodInputData.allergyName}?</h4>
                        <Box className="sinceFormat" sx={{ mt: 2 }}>
                          {since.map((v, inx) => {
                            let sinceData = v.since;
                            if (v.since.includes('Month')) {
                              sinceData = sinceData.replace(' Month', 'M');
                            }
                            if (v.since.includes('Year')) {
                              sinceData = sinceData.replace(' Year', 'Y');
                            }
                            if (v.since.includes('Week')) {
                              sinceData = sinceData.replace(' Week', 'W');
                            }

                            let isSelected = v === foodInputData.since; // Check if selected

                            return (
                              <Chip
                                key={inx}
                                className={isSelected ? 'selectProblemWithActive' : 'selectProblemWith'}
                                sx={{
                                  margin: '5px',
                                  backgroundColor: isSelected ? '#126078' : '', // Highlight selected chip
                                  color: isSelected ? '#fff' : '',
                                  px: 2
                                }}
                                label={sinceData}
                                onDelete={() => deleteSince(v._id)}
                                onClick={() => {
                                  setFoodInputData((prev) => {
                                    return { ...prev, since: v };
                                  });
                                }}
                                deleteIcon={<Close style={{ color: isSelected ? 'white' : 'inherit', fontSize: '14px' }} />}
                              />
                            );
                          })}

                          <Button
                            className="button-87"
                            onClick={() => {
                              setSinceOpen(true);
                              setOpenFoodAllergiesData(false);
                            }}
                          >
                            Add
                          </Button>
                        </Box>

                        <Button
                          variant="contained"
                          className="addBtn"
                          style={{ marginTop: '10px' }}
                          onClick={() => {
                            if (foodInputData.since !== '') {
                              let sM =
                                patientAllergy.food !== undefined
                                  ? [...patientAllergy.food, { ...foodInputData, since: foodInputData.since }]
                                  : [{ ...foodInputData, since: foodInputData.since }];
                              sM = [...new Map(sM.map((item) => [item['allergyName'], item])).values()];
                              setPatientAllergy((prev) => {
                                return {
                                  ...prev,
                                  food: sM
                                };
                              });
                            }

                            setFoodInputData({
                              _id: '',
                              allergyName: '',
                              since: ''
                            });
                            setOpenFoodAllergiesData(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          sx={{ ml: 2, mt: 1.3 }}
                          variant="contained"
                          onClick={() => {
                            setOpenFoodAllergiesData(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}

                    {sinceOpen && (
                      <Grid item xs={4} className="ptData">
                        <Box sx={{ marginLeft: '4rem', width: 400, boxShadow: 3, p: 2 }}>
                          <h3>Add Since</h3>
                          <TextField
                            fullWidth
                            label="Since"
                            variant="outlined"
                            name="since"
                            value={sinceValue}
                            onChange={(e) => {
                              setSinceValue(e.target.value);
                            }}
                            sx={{ my: 2 }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button variant="contained" className="addBtn" sx={{ marginTop: '10px' }} onClick={handleSinceSubmit}>
                              Save
                            </Button>
                            <Button variant="contained" className="addBtn" sx={{ marginTop: '10px', ml: 2 }} onClick={handleSinceClose}>
                              Cancel
                            </Button>
                          </div>
                        </Box>
                      </Grid>
                    )}
                  </Box>
                </DialogContent>
              </Dialog>
            </Box>

            <Dialog
              open={openAddGeneralAllergy|| openAddDrugAllergy || openAddFoodAllergy}
              maxWidth="md" // xs, sm, md, lg, xl
            >
              {/* add allergies */}
              <DialogContent>
                <Box>
                  {openAddGeneralAllergy && (
                    <Box item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                      <Box className="selectedPtCategory">
                        <h4>Add General Allergy</h4>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="allergyName"
                          value={allergyName}
                          onChange={(e) => {
                            setAllergyName(e.target.value);
                            setError('');
                          }}
                          error={error !== '' ? true : false}
                          helperText={error}
                          style={{ margin: '10px 0' }}
                        />
                        <Button style={{ marginTop: '10px' }} className="addBtn" onClick={handleSubmitGeneralAllergy} variant="contained">
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => {
                            setOpenAddGeneralAllergy(false);
                            setOpenSelectAllergy(true);
                          }}
                          sx={{ ml: 2, mt: 1.3 }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {openAddFoodAllergy && (
                    <Box item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                      <Box className="selectedPtCategory">
                        <h4>Add Food Allergy</h4>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="allergyName"
                          value={allergyName}
                          onChange={(e) => {
                            setAllergyName(e.target.value);
                            setError('');
                          }}
                          error={error !== '' ? true : false}
                          helperText={error}
                          style={{ margin: '10px 0' }}
                        />
                        <Button style={{ marginTop: '10px' }} className="addBtn" variant="contained" onClick={handleSubmitFoodAllergy}>
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => {
                            setOpenAddFoodAllergy(false);
                            setOpenSelectAllergy(true);
                          }}
                          sx={{ ml: 2, mt: 1.3 }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {openAddDrugAllergy && (
                    <Box item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                      <Box className="selectedPtCategory">
                        <h4>Add Drug Allergy</h4>
                        <TextField
                          sx={{ mt: 2 }}
                          variant="outlined"
                          name="allergyName"
                          value={allergyName}
                          onChange={(e) => {
                            setAllergyName(e.target.value);
                            setError('');
                          }}
                          error={error !== '' ? true : false}
                          helperText={error}
                          fullWidth
                        />
                        <Button variant="contained" style={{ marginTop: '10px' }} className="addBtn" onClick={handleSubmitDrugAllergy}>
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => {
                            setOpenAddDrugAllergy(false);
                            setOpenSelectAllergy(true);
                          }}
                          sx={{ ml: 2, mt: 1.3 }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </DialogContent>
            </Dialog>
          </Box>
        </Box>

        <Dialog
          open={openGeneralEditHandler}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* edit general allergies */}
          <DialogContent>
            {openGeneralEditHandler && (
              <Box item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                <Box className="selectedPtCategory">
                  <h4>Edit General Allergy</h4>
                  <Box className="selectedCategory">
                    {allAllergies.general.map((val, ind) => {
                      return (
                        <Chip
                          key={ind}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: 'secondary.main',
                            borderStyle: 'solid',
                            m: 1
                          }}
                          variant={'outlined'}
                          color={'primary'}
                          className="selectProblem"
                          label={val.allergyName}
                          onClick={() => {
                            setOpenGeneralEditHandler(false);
                            setOpenGeneralEditDataDetail(true);
                            setOpenSelectAllergy(false);
                            setAllergyName(val.allergyName);
                            setEditId(val._id);
                            setOpenGeneralDeleteHandler(false);
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenGeneralEditHandler(false);
                    setOpenSelectAllergy(true);
                  }}
                  sx={{ m: 1 }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openGeneralEditDataDetail}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* update general allergy  */}
          <DialogContent>
            {openGeneralEditDataDetail && (
              <Box item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                <Box className="selectedPtCategory">
                  <h4>Update General Allergy</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="allergyName"
                    value={allergyName}
                    onChange={(e) => {
                      setAllergyName(e.target.value);
                      setError('');
                    }}
                    error={error !== '' ? true : false}
                    helperText={error}
                    style={{ margin: '10px 0' }}
                  />
                  <Button className="addBtn" onClick={handleSubmitUpdateGeneralAllergy} variant="contained">
                    Save
                  </Button>
                  <Button
                    className="addBtn"
                    onClick={() => {
                      setOpenGeneralEditDataDetail(false);
                      setOpenSelectAllergy(true);
                    }}
                    sx={{ ml: 1 }}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openGeneralDeleteHandler}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* delete general allergy  */}
          <DialogContent>
            {openGeneralDeleteHandler && (
              <Grid item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                <Box
                  style={{ width: '400px', marginLeft: '2rem', boxShadow: '-5px 0px 3px 0px #eee', padding: '1rem' }}
                  className="selectedPtCategory"
                >
                  <h4>Delete General Allergy</h4>
                  <Box className="selectedCategory">
                    {allAllergies.general.map((val, ind) => {
                      let exist = false;
                      deleteGeneralIds.forEach((v) => {
                        if (val._id === v) {
                          exist = true;
                        }
                      });
                      return (
                        <Chip
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: exist ? 'primary.main' : 'secondary.main',
                            borderStyle: 'solid',
                            m: 1
                          }}
                          variant={exist ? 'default' : 'outlined'}
                          color={exist ? 'primary' : 'default'}
                          style={{ margin: '5px' }}
                          key={ind}
                          className={exist ? 'selectProblemDelete' : 'selectProblem'}
                          label={val.allergyName}
                          onClick={() => {
                            let a = deleteGeneralIds;
                            if (val._id !== undefined) {
                              a.push(val._id);
                            }

                            let unique = [];
                            a.forEach((element) => {
                              if (!unique.includes(element)) {
                                unique.push(element);
                              }
                            });

                            setDeletedGeneralIds(unique);
                          }}
                          onDelete={
                            exist
                              ? () => {
                                  let aa = [];
                                  deleteGeneralIds.forEach((vM) => {
                                    if (vM !== val._id) {
                                      aa.push(vM);
                                    }
                                  });
                                  setDeletedGeneralIds(aa);
                                }
                              : undefined
                          }
                          deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                        />
                      );
                    })}
                  </Box>

                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeleteGeneralAllergy}>
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    className="addBtn"
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                    onClick={() => {
                      setOpenGeneralDeleteHandler(false);
                      setOpenSelectAllergy(true);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openFoodEditHandler}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* edit food allergy  */}
          <DialogContent>
            {openFoodEditHandler && (
              <Box item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                <Box className="selectedPtCategory">
                  <h4>Edit Food Allergy</h4>
                  <Box className="selectedCategory">
                    {allAllergies.food.map((val, ind) => {
                      return (
                        <Chip
                          key={ind}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: 'secondary.main',
                            borderStyle: 'solid',
                            m: 1
                          }}
                          variant={'outlined'}
                          color={'primary'}
                          className="selectProblem"
                          label={val.allergyName}
                          onClick={() => {
                            setOpenFoodEditHandler(false);
                            setOpenFoodEditDataDetail(true);
                            setOpenSelectAllergy(false);
                            setAllergyName(val.allergyName);
                            setEditId(val._id);
                            setOpenFoodDeleteHandler(false);
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  className="addBtn"
                  style={{ marginTop: '10px' }}
                  onClick={() => {
                    setOpenFoodEditHandler(false);
                    setOpenSelectAllergy(true);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openFoodEditDataDetail}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* update food data detail  */}
          <DialogContent>
            {openFoodEditDataDetail && (
              <Grid item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                <Box className="selectedPtCategory">
                  <h4>Update Food Allergy</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="allergyName"
                    value={allergyName}
                    onChange={(e) => {
                      setAllergyName(e.target.value);
                      setError('');
                    }}
                    error={error !== '' ? true : false}
                    helperText={error}
                    style={{ margin: '10px 0' }}
                  />
                  <Button className="addBtn" onClick={handleSubmitUpdateFoodAllergy} variant="contained">
                    Save
                  </Button>
                  <Button
                    className="addBtn"
                    onClick={() => {
                      setOpenFoodEditDataDetail(false);
                      setOpenSelectAllergy(true);
                    }}
                    sx={{ ml: 1 }}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openFoodDeleteHandler}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* delete food allergy  */}
          <DialogContent>
            {openFoodDeleteHandler && (
              <Box item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                <Box className="selectedPtCategory">
                  <h4>Delete Food Allergy</h4>
                  <Box className="selectedCategory">
                    {allAllergies.food.map((val, ind) => {
                      let exist = false;
                      deleteFoodIds.forEach((v) => {
                        if (val._id === v) {
                          exist = true;
                        }
                      });
                      return (
                        <Chip
                          key={ind}
                          className={exist ? 'selectProblemDelete' : 'selectProblem'}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: exist ? 'primary.main' : 'secondary.main',
                            borderStyle: 'solid',
                            m: 1
                          }}
                          variant={exist ? 'default' : 'outlined'}
                          color={exist ? 'primary' : 'default'}
                          label={val.allergyName}
                          onClick={() => {
                            let a = deleteFoodIds;
                            if (val._id !== undefined) {
                              a.push(val._id);
                            }

                            let unique = [];
                            a.forEach((element) => {
                              if (!unique.includes(element)) {
                                unique.push(element);
                              }
                            });

                            setDeletedFoodIds(unique);
                          }}
                          onDelete={
                            exist
                              ? () => {
                                  let aa = [];
                                  deleteFoodIds.forEach((vM) => {
                                    if (vM !== val._id) {
                                      aa.push(vM);
                                    }
                                  });
                                  setDeletedFoodIds(aa);
                                }
                              : undefined
                          }
                          deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                        />
                      );
                    })}
                  </Box>

                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeleteFoodAllergy}>
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    className="addBtn"
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                    onClick={() => {
                      setOpenFoodDeleteHandler(false);
                      setOpenSelectAllergy(true);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDrugEditHandler}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* edit drug allergies*/}
          <DialogContent>
            {openDrugEditHandler && (
              <Box item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                <Box className="selectedPtCategory">
                  <h4>Edit Drug Allergy</h4>
                  <Box className="selectedCategory">
                    {allAllergies.drug.map((val, ind) => {
                      return (
                        <Chip
                          key={ind}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: 'secondary.main',
                            borderStyle: 'solid',
                            m: 1
                          }}
                          variant={'outlined'}
                          color={'primary'}
                          className="selectProblem"
                          label={val.allergyName}
                          onClick={() => {
                            setOpenDrugEditHandler(false);
                            setOpenDrugEditDataDetail(true);
                            setOpenSelectAllergy(false);
                            setAllergyName(val.allergyName);
                            setEditId(val._id);
                            setOpenDrugDeleteHandler(false);
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  className="addBtn"
                  style={{ marginTop: '10px', marginLeft: '10px' }}
                  onClick={() => {
                    setOpenDrugEditHandler(false);
                    setOpenSelectAllergy(true);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDrugEditDataDetail}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* update drug allergy */}
          <DialogContent>
            {openDrugEditDataDetail && (
              <Box item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                <Box className="selectedPtCategory">
                  <h4>Update Drug Allergy</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="allergyName"
                    value={allergyName}
                    onChange={(e) => {
                      setAllergyName(e.target.value);
                      setError('');
                    }}
                    error={error !== '' ? true : false}
                    helperText={error}
                    style={{ margin: '10px 0' }}
                  />
                  <Button className="addBtn" onClick={handleSubmitUpdateDrugAllergy} variant="contained">
                    Save
                  </Button>
                  <Button
                    className="addBtn"
                    onClick={() => {
                      setOpenDrugEditDataDetail(false);
                      setOpenSelectAllergy(true);
                    }}
                    sx={{ ml: 1 }}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={openDrugDeleteHandler}
          maxWidth="md" // xs, sm, md, lg, xl
        >
          {/* delete drug allergy  */}
          <DialogContent>
            {openDrugDeleteHandler && (
              <Box item xs={8} sm={8} md={8.3} lg={9.2} className="ptData">
                <Box className="selectedPtCategory">
                  <h4>Delete Drug Allergy</h4>
                  <Box className="selectedCategory">
                    {allAllergies.drug.map((val, ind) => {
                      let exist = false;
                      deleteDrugIds.forEach((v) => {
                        if (val._id === v) {
                          exist = true;
                        }
                      });
                      return (
                        <Chip
                          key={ind}
                          className={exist ? 'selectProblemDelete' : 'selectProblem'}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: exist ? 'primary.main' : 'secondary.main',
                            borderStyle: 'solid',
                            m: 1
                          }}
                          variant={exist ? 'default' : 'outlined'}
                          color={exist ? 'primary' : 'default'}
                          label={val.allergyName}
                          onClick={() => {
                            let a = deleteDrugIds;
                            if (val._id !== undefined) {
                              a.push(val._id);
                            }

                            let unique = [];
                            a.forEach((element) => {
                              if (!unique.includes(element)) {
                                unique.push(element);
                              }
                            });

                            setDeletedDrugIds(unique);
                          }}
                          onDelete={
                            exist
                              ? () => {
                                  let aa = [];
                                  deleteDrugIds.forEach((vM) => {
                                    if (vM !== val._id) {
                                      aa.push(vM);
                                    }
                                  });
                                  setDeletedDrugIds(aa);
                                }
                              : undefined
                          }
                          deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                        />
                      );
                    })}
                  </Box>

                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeleteDrugAllergy}>
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    className="addBtn"
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                    onClick={() => {
                      setOpenDrugDeleteHandler(false);
                      setOpenSelectAllergy(true);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Grid>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Allergies;
