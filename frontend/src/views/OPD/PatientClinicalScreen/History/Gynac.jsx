import { AddBox, Cancel, Close, Delete, Edit, Search, Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import REACT_APP_BASE_URL, { put, remove, retrieveToken } from 'api/api';
import axios from 'axios';
import Loader from 'component/Loader/Loader';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Stack } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

const Gynac = ({
  departmentId,
  medicalCategory,
  activeStep,
  patientHistory,
  setPatientHistory,
  allGynac,
  getAllMasterData,
  isFemale,
  isPed
}) => {
  // 3rd layer edit
  const [open3Layer, setOpen3Layer] = useState({
    edit3Layer: false,
    delete3Layer: false,
    layer3Data: []
  });
  const [open4LayerData, setOpen4LayerData] = useState({
    edit4Layer: false,
    delete4Layer: false,
    layer4Data: []
  });

  const [layer3ChipSelectedFor4Index, setLayer3ChipSelectedFor4Index] = useState(null);

  const [inputVal, setInputVal] = React.useState([]);
  const [err, setErr] = React.useState([]);

  const [chipInputValue, setChipInputValue] = useState('');

  const [selectedChipIndex, setSelectedChipIndex] = useState(null);
  // const [chipInputValue, setChipInputValue] = useState("");

  const [inputValOp, setInputValOp] = React.useState([]);
  const [errOp, setErrOp] = React.useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [mostusedGynac, setmostusedGynac] = useState([]);
  const [gynac, setGynac] = useState([]);

  const [openGynac, setOpenGynac] = useState(false);
  const [addOptions, setAddOptions] = useState(false);
  const [openData, setOpenData] = useState({});
  const [error, setError] = useState({ problem: '' });
  const [openAddGynac, setOpenAddGynac] = useState(false);
  const [loader, setLoader] = useState(true);

  const [openEditHandler, setOpenEditHandler] = useState(false);
  const [openDeleteHandler, setOpenDeleteHandler] = useState(false);
  const [openEditDataDetail, setOpenEditDataDetail] = useState(false);
  const [deleteIds, setDeletedIds] = useState([]);

  const [open4Layer, setOpen4Layer] = useState(false);
  const [open4LayerDataAdd, setOpen4LayerDataAdd] = useState(false);
  const [data4Layer, setData4Layer] = useState({});

  const [openDataSelectObjective, setOpenDataSelectObjective] = useState({});
  const [open5Layer, setOpen5Layer] = useState(false);
  const [open5LayerDataAdd, setOpen5LayerDataAdd] = useState(false);

  const token = retrieveToken();

  const getGynacProblem = async () => {
    setLoader(true);

    await axios
      .get(`${REACT_APP_BASE_URL}opd/gynac-history/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setmostusedGynac(res);
        setGynac(res);
        setLoader(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getGynacProblem();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      let medP = mostusedGynac.slice(); // Copying mostusedGynac to medP to avoid modifying it directly

      patientHistory.gynac.forEach((vv) => {
        // Check if the problem in patientHistory.gynac is not present in mostusedGynac
        if (!medP.some((v) => v.problem === vv.problem)) {
          medP.unshift(vv); // Add the problem from patientHistory.gynac to medP
        }
      });
      // if()
      setGynac(medP);
    } else {
      let med = [];
      allGynac.forEach((v) => {
        if (v.problem.toLowerCase().includes(e.target.value.toLowerCase())) {
          med.push(v);
        }
      });
      setGynac(med);
    }
  };

  const closeForm = () => {
    setOpenGynac(false);
    setError({ problem: '' });
    setOpenAddGynac(false);
    setOpenData({});
    setOpenDeleteHandler(false);
    setOpenEditDataDetail(false);
    setOpenEditHandler(false);
    setOpen4Layer(false);
    setOpen4LayerDataAdd(false);
    setData4Layer({});
    setOpenDataSelectObjective({});
  };

  // const handleSubmitOptions = async () => {
  //   const er = [...errOp];
  //   let already = true;
  //   inputValOp.forEach((val, ind) => {
  //     if (val.data === '') {
  //       er[ind].data = 'Please Enter Option or remove it...';
  //       result = false
  //     } else {
  //       inputVal.forEach((s) => {
  //         if (s.data.toLowerCase() === val.data.toLowerCase()) {
  //           already = false;
  //           er[ind].data = 'This Option is already exist...';
  //         }
  //       });
  //     }
  //   });
  //   setErrOp(er);

  //   let result = true;
  //   for (let i = 0; i < inputValOp.length; i++) {
  //     let data = inputValOp[i];
  //     let t = Object.values(data).every((val) => val);
  //     if (!t) {
  //       result = false;
  //     }
  //   }

  //   if (result && already) {
  //     await axios
  //       .put(
  //         `${REACT_APP_BASE_URL}opd/gynac-history/${openData._id}`,
  //         {
  //           objective: inputValOp
  //         },
  //         {
  //           headers: { Authorization: 'Bearer ' + token }
  //         }
  //       )
  //       .then(async (response) => {
  //         await getGynacProblem();
  //         toast.success(`Options Created Successfully!!`);
  //         setInputVal([...inputVal, ...inputValOp]);

  //         setInputValOp([]);
  //         setErrOp([]);
  //         setAddOptions(false);
  //         setOpenGynac(true);
  //       })
  //       .catch((error) => {
  //         toast({
  //           title: 'Something went wrong, Please try later!!',
  //           status: 'error',
  //           duration: 4000,
  //           isClosable: true,
  //           position: 'bottom'
  //         });
  //       });
  //   }
  // };

  const handleSubmitOptions = async () => {
    const er = [...errOp];
    let already = true;
    let result = true;

    // Validation & Duplicate Check
    inputValOp.forEach((val, ind) => {
      if (val.data.trim() === '') {
        er[ind].data = 'Please enter option or remove it...';
        result = false;
      } else {
        inputVal.forEach((s) => {
          if (s.data && val.data && s.data.trim().toLowerCase() === val.data.trim().toLowerCase()) {
            already = false;
            er[ind].data = 'This option already exists...';
            result = false;
          }
        });
      }
    });

    setErrOp(er);

    // Debug log
    // console.log("Submitting:", inputValOp);

    // Submit only if no error and no duplicates
    if (result && already) {
      const finalOptions = [...inputVal, ...inputValOp];
      try {
        await axios.put(
          `${REACT_APP_BASE_URL}opd/gynac-history/${openData._id}`,
          {
            objective: finalOptions
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        );

        await getGynacProblem(); // Refresh list
        toast.success(`Options created successfully!`);

        // Append new options to existing list
        setInputVal([...inputVal, ...inputValOp]);

        // Reset states
        setInputValOp([{ data: '' }]);
        setErrOp([{ data: '' }]);
        setAddOptions(false);
        setOpenGynac(true);
      } catch (error) {
        toast({
          title: 'Something went wrong, please try again!',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      }
    }
  };

  const handleSubmitGynac = async () => {
    if (openData.problem === '') {
      setError((prev) => {
        return { ...prev, problem: 'Enter the Gynac History' };
      });
    }

    const er = [...err];
    inputVal.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Option or remove it...';
      }
    });
    setErr(er);

    let result = true;
    for (let i = 0; i < inputVal.length; i++) {
      let data = inputVal[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (openData.problem !== '' && result) {
      //call api to store Gynac History
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/gynac-history`,
          {
            problem: openData.problem,
            answerType: openData.answerType,
            objective: inputVal,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getGynacProblem();
          let sM = [response.data.data, ...gynac];
          sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
          setGynac(sM);
          // closeForm();
          setOpenAddGynac(false);
          setInputVal([]);
          setErr([]);
          toast({
            title: ' Gynac History Created Successfully!!',
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

  //   const handleUpdateSubmitGynacHistory = async () => {
  //     if (openData.problem === '') {
  //       setError((prev) => {
  //         return { ...prev, problem: 'Enter the Gynac History' };
  //       });
  //     }

  //     console.log(openData  )

  //     const er = [...err];
  //     inputVal.forEach((val, ind) => {
  //       if (val.data === '') {
  //         er[ind].data = 'Please Enter Option or remove it...';
  //       }
  //     });
  //     setErr(er);

  //     let result = true;
  //     for (let i = 0; i < inputVal.length; i++) {
  //       let data = inputVal[i];
  //       let t = Object.values(data).every((val) => val);
  //       if (!t) {
  //         result = false;
  //       }
  //     }
  // console.log(inputVal)
  //     if (openData.problem !== '' && result) {
  //       //call api to store Gynac History
  //       await axios
  //         .put(
  //           `${REACT_APP_BASE_URL}opd/gynac-history/${openData._id}`,
  //           {
  //             problem: openData.problem,
  //             answerType: openData.answerType,
  //             objective: inputVal,
  //             departmentId
  //           },
  //           {
  //             headers: { Authorization: 'Bearer ' + token }
  //           }
  //         )
  //         .then(async (response) => {
  //           await getAllMasterData();
  //           await getGynacProblem();

  //           closeForm();
  //           setInputVal([]);
  //           setErr([]);
  //           toast({
  //             title: ' Gynac History Updated Successfully!!',
  //             status: 'success',
  //             duration: 4000,
  //             isClosable: true,
  //             position: 'bottom'
  //           });
  //         })
  //         .catch((error) => {
  //           toast({
  //             title: 'Something went wrong, Please try later!!',
  //             status: 'error',
  //             duration: 4000,
  //             isClosable: true,
  //             position: 'bottom'
  //           });
  //         });
  //     }
  //   };

  const handleUpdateSubmitGynacHistory = async () => {
    if (openData.problem === '') {
      setError((prev) => ({
        ...prev,
        problem: 'Enter the Gynac History'
      }));
    }

    console.log(openData);

    const er = [...err];
    inputVal.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Option or remove it...';
      }
    });
    setErr(er);

    let result = true;
    for (let i = 0; i < inputVal.length; i++) {
      let data = inputVal[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    console.log(inputVal);

    // Append answerType inside every object in inputVal if openData.answerType exists
    let updatedInputVal = inputVal.map((item) => ({
      ...item,
      answerType: openData.answerType || ''
    }));
    console.log(updatedInputVal);

    if (openData.problem !== '' && result) {
      // Call API to store Gynac History
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/gynac-history/${openData._id}`,
          {
            problem: openData.problem,
            answerType: openData.answerType,
            objective: updatedInputVal,
            // Use updated values
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getGynacProblem();

          closeForm();
          setInputVal([]);
          setErr([]);
          toast({
            title: 'Gynac History Updated Successfully!!',
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

  //add the new test input field
  const addInputVal = () => {
    setInputVal([
      ...inputVal,
      {
        data: ''
      }
    ]);
    setErr((prev) => {
      return [
        ...prev,
        {
          data: ''
        }
      ];
    });
  };

  //remove the one test data
  const removeInputVal = (index) => {
    const rows = [...inputVal];
    rows.splice(index, 1);
    setInputVal(rows);
    const ee = [...err];
    ee.splice(index, 1);
    setErr(ee);
  };

  //add the new test input field
  const addInputValOp = () => {
    setInputValOp([
      ...inputValOp,
      {
        data: ''
      }
    ]);
    setErrOp((prev) => {
      return [
        ...prev,
        {
          data: ''
        }
      ];
    });
  };

  //remove the one test data
  const removeInputValOp = (index) => {
    const rows = [...inputValOp];
    rows.splice(index, 1);
    setInputValOp(rows);
    const ee = [...errOp];
    ee.splice(index, 1);
    setErrOp(ee);
  };

  const handleData = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputVal];
    list[index][name] = value;
    setInputVal(list);
    const er = err;
    er[index][name] = '';
    setErr(er);
  };

  const handleDataOp = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputValOp];
    list[index][name] = value;
    setInputValOp(list);
    const er = errOp;
    er[index][name] = '';
    setErrOp(er);
  };

  const handleSaveDeleteGynacHistory = () => {
    let data = {
      ids: deleteIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/gynac-history`, {
        headers,
        data
      })
      .then(async (response) => {
        await getAllMasterData();
        getGynacProblem();
        closeForm();
        setOpenDeleteHandler(false);
        toast({
          title: 'Gynac History Deleted Successfully!!',
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

  // Handle chip selection using index
  const handleChipSelection = (index, chipData) => {
    setSelectedChipIndex(index); // Store selected chip index
    setChipInputValue(chipData); // Prefill text field with chip data
  };

  // Handle saving updated data
  const handleSaveUpdate = async () => {
    if (selectedChipIndex === null) return;

    try {
      const res = await put(`opd/gynac-history/objective-data/${layer3Data?.[0]?._id}`, {
        index: selectedChipIndex,
        data: chipInputValue
      });
      console.log(res);

      if (res.success) {
        setInputVal(res.updatedData.objective);
        toast.success('Objective updated successfully!'); // Show success toast
        resetSelection(); // Clear selection after saving
        getGynacProblem();
        getAllMasterData();
        setOpen3Layer({
          edit3Layer: false
        });
        setInputVal(res.updatedData.objective);
      } else {
        toast.error('Failed to update objective.'); // Handle API failure case
      }
    } catch (error) {
      console.error('Error updating objective:', error);
      toast.error('Something went wrong!'); // Show error toast
    }
  };
  const handleSaveUpdatelayer4 = async () => {
    if (selectedChipIndex === null) return;

    try {
      const res = await put(`opd/gynac-history/inner-data/objective-data/${layer3Data?.[0]?._id}`, {
        objectiveIndex: layer3ChipSelectedFor4Index,
        innerDataIndex: selectedChipIndex,
        data: chipInputValue
      });

      if (res.success) {
        toast.success('Objective updated successfully!'); // Show success toast
        resetSelection(); // Clear selection after saving
        getGynacProblem();
        getAllMasterData();
        setOpen4LayerData({
          edit4Layer: false
        });
      } else {
        toast.error('Failed to update objective.'); // Handle API failure case
      }
    } catch (error) {
      console.error('Error updating objective:', error);
      toast.error('Something went wrong!'); // Show error toast
    }
  };

  const resetSelection = () => {
    setSelectedChipIndex(null);
    setChipInputValue('');
    setOpen3Layer({
      edit3Layer: false
    });
    setOpenGynac(true);
  };
  const [selectedChips, setSelectedChips] = useState([]);
  const handleChipClick = (itemIndex) => {
    setSelectedChips(
      (prevSelected) =>
        prevSelected.includes(itemIndex)
          ? prevSelected.filter((index) => index !== itemIndex) // Deselect if already selected
          : [...prevSelected, itemIndex] // Select if not selected
    );
  };

  const handleDelete = async () => {
    try {
      console.log(layer3Data[0]._id);
      console.log(selectedChips);
      const token = retrieveToken();
      const res = await axios.delete(`${REACT_APP_BASE_URL}opd/gynac-history/${layer3Data[0]?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add your token here
          'Content-Type': 'application/json'
        },
        data: { ids: selectedChips }
      });

      if (res.data.success) {
        toast.success('Deleted successfully!');
        getGynacProblem();
        getAllMasterData();
        setOpen3Layer({
          delete3Layer: false
        });
      } else {
        toast.error(res.msg || 'Failed to delete objectives');
      }
    } catch (error) {
      console.error('Error deleting objectives:', error);
      toast.error('Error deleting objectives. Please try again.');
    }
  };

  const handleDeleteLayer4 = async () => {
    try {
      const payload = {
        objectiveIndex: layer3ChipSelectedFor4Index,
        innerDataIndex: selectedChips // Ensure this is an array
      };

      const res = await remove(`opd/gynac-history/inner-data/${layer3Data?.[0]?._id}`, payload);

      if (res.success) {
        toast.success('Deleted successfully!');
        await Promise.all([getGynacProblem(), getAllMasterData()]);
        setOpen4LayerData((prev) => ({ ...prev, delete4Layer: false }));
      } else {
        toast.error(res.msg || 'Failed to delete objectives');
      }
    } catch (error) {
      console.error('Error deleting objectives:', error);
      toast.error('Error deleting objectives. Please try again.');
    }
  };

  const [layer3Data, setLayer3Data] = useState([]);
  useEffect(() => {
    const layer3Data = gynac?.filter((data) => {
      return data?._id === openData?._id;
    });
    setLayer3Data(layer3Data);
  }, [gynac, openData]);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <Grid container spacing={2} width="40vw" height="100%">
          <Grid item xs={8} height="inherit">
            <h2 className="heading">
              {(!isFemale && !isPed
                ? activeStep > 4
                  ? activeStep - 3
                  : activeStep
                : !isFemale && isPed
                  ? activeStep > 5
                    ? activeStep - 2
                    : activeStep
                  : isFemale && !isPed
                    ? activeStep > 6
                      ? activeStep - 1
                      : activeStep
                    : activeStep) + 1}
              . {medicalCategory[activeStep].category}
            </h2>
            <Input
              className="search_patient_data"
              type="search"
              placeholder="Search..."
              endAdornment={
                <InputAdornment position="end">
                  <Search className="search_patient_data_icon" />
                </InputAdornment>
              }
              onChange={handleSearch}
              value={searchValue}
            />

            <Button
              style={{ marginLeft: '2px', display: 'inline-block' }}
              className="button-87"
              onClick={() => {
                setOpenGynac(false);
                setOpenData({ problem: '', answerType: 'Subjective' });
                setInputVal([]);
                setOpenAddGynac(true);
                setOpenEditDataDetail(false);
                setOpenEditHandler(false);
                setOpenDeleteHandler(false);
              }}
            >
              Add
            </Button>

            {allGynac.length > 0 && (
              <IconButton
                style={{ marginLeft: '2px' }}
                title="Edit Gynac History"
                onClick={() => {
                  setOpenGynac(false);
                  setOpenData({ problem: '', answerType: 'Subjective' });
                  setInputVal([]);
                  setOpenAddGynac(false);
                  setOpenEditDataDetail(false);
                  setOpenEditHandler(true);
                  setOpenDeleteHandler(false);
                }}
              >
                <Edit fontSize="small" style={{ color: 'blue' }} />
              </IconButton>
            )}

            {allGynac.length > 0 && (
              <IconButton
                style={{ marginLeft: '2px' }}
                title="Delete Gynac History"
                onClick={() => {
                  setOpenGynac(false);
                  setOpenData({ problem: '', answerType: 'Subjective' });
                  setInputVal([]);
                  setOpenAddGynac(false);
                  setOpenEditDataDetail(false);
                  setOpenEditHandler(false);
                  setOpenDeleteHandler(true);
                }}
              >
                <Delete fontSize="small" style={{ color: 'red' }} />
              </IconButton>
            )}

            {allGynac.length === 0 ? (
              <h4 className="noFoundOPd">Gynac History Not Available, Please Add...</h4>
            ) : (
              <>
                {gynac.length > 0 ? (
                  <Box className="selectedCategory">
                    {gynac.map((val, ind) => {
                      let pre = false;
                      const ids = new Set(patientHistory?.gynac?.map((d) => d._id));
                      if (ids?.has(val?._id) || openData?._id === val?._id) {
                        pre = true;
                      }
                      return (
                        <Chip
                          key={ind}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: pre ? 'primary.main' : 'secondary.main',
                            borderStyle: 'solid',
                            mr: 1,
                            my: 1
                          }}
                          variant={pre ? 'default' : 'outlined'}
                          color={pre ? 'primary' : 'default'}
                          label={val?.problem}
                          onClick={() => {
                            setOpen4LayerData({
                              edit4Layer: false,
                              delete4Layer: false,
                              layer4Data: []
                            });
                            closeForm();
                            setError({ problem: '', ans: '' });
                            let med = {
                              problem: val?.problem,
                              answerType: val?.answerType,
                              value: '',
                              objective: [],
                              _id: val._id
                            };
                            setInputVal(val.objective);
                            patientHistory.gynac !== undefined &&
                              patientHistory.gynac.forEach((v) => {
                                if (v.problem === val.problem && v._id === val._id) {
                                  med = v;
                                }
                              });
                            setOpenAddGynac(false);
                            setOpenGynac(true);
                            setOpenData(med);
                            setOpenDeleteHandler(false);
                            setOpenEditDataDetail(false);
                            setOpenEditHandler(false);
                          }}
                          onDelete={
                            pre
                              ? () => {
                                  setOpenGynac(false);
                                  setOpenData({});
                                  let medPro = [];
                                  patientHistory.gynac.forEach((vM) => {
                                    if (vM?._id !== val?._id) {
                                      medPro.push(vM);
                                    }
                                  });
                                  setPatientHistory((prev) => {
                                    return { ...prev, gynac: medPro };
                                  });
                                  setOpenDeleteHandler(false);
                                  setOpenEditDataDetail(false);
                                  setOpenEditHandler(false);
                                }
                              : undefined
                          }
                          deleteIcon={pre ? <Close sx={{ color: pre ? '#fff !important' : '#333' }} /> : undefined}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <h4 className="noFoundOPd">Not Found</h4>
                )}
              </>
            )}
          </Grid>

          <Dialog
            open={openAddGynac}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* add gynac history */}
            <DialogContent>
              {openAddGynac && (
                <Box style={{ width: '400px' }} className="selectedPtCategory">
                  <h4>Add Gynac History</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="problem"
                    label="Gynac History"
                    value={openData.problem}
                    onChange={(e) => {
                      setOpenData((prev) => {
                        return { ...prev, problem: e.target.value };
                      });
                      setError((prev) => {
                        return { ...prev, problem: '' };
                      });
                    }}
                    error={error.problem !== '' ? true : false}
                    helperText={error.problem}
                    style={{ margin: '10px 0' }}
                  />

                  <FormControl style={{ margin: '5px', width: '100%' }}>
                    <FormLabel>Answer Type:</FormLabel>
                    <RadioGroup
                      row
                      name="answerType"
                      value={openData.answerType}
                      onChange={(e) => {
                        setOpenData((prev) => {
                          return { ...prev, answerType: e.target.value };
                        });

                        if (e.target.value === 'Objective') {
                          setInputVal([{ data: '' }]);
                          setErr([{ data: '' }]);
                        } else {
                          setInputVal([]);
                          setErr([]);
                        }
                      }}
                    >
                      <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                      <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                      <FormControlLabel value="Calender" control={<Radio size="small" />} label="Calender" />
                    </RadioGroup>
                  </FormControl>

                  {openData.answerType === 'Objective' && (
                    <div style={{ marginBottom: '10px' }}>
                      {inputVal.map((data, index) => {
                        return (
                          <Grid item xs={12} key={index} className="withChiefC">
                            <Grid item xs={10}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="data"
                                value={data.data}
                                margin="dense"
                                onChange={(evnt) => handleData(index, evnt)}
                                error={err[index].data !== '' ? true : false}
                                helperText={err[index].data}
                              />
                            </Grid>
                            {inputVal.length !== 1 && (
                              <Grid item xs={1}>
                                <IconButton
                                  title="Remove Option"
                                  onClick={() => {
                                    removeInputVal(index);
                                  }}
                                  className="btnDelete"
                                >
                                  <Cancel className="btnDelete" />
                                </IconButton>
                              </Grid>
                            )}
                          </Grid>
                        );
                      })}
                      <IconButton variant="contained" onClick={addInputVal} title="Add Option" className="addBox">
                        <AddBox />
                      </IconButton>
                    </div>
                  )}

                  <Button className="addBtn" onClick={handleSubmitGynac} style={{ margin: '8px 0' }} variant="contained">
                    Save
                  </Button>
                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    onClick={() => {
                      setOpenAddGynac(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openEditHandler}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* edit gynac history */}
            <DialogContent>
              {openEditHandler && (
                <Box style={{ width: '400px' }} className="selectedPtCategory">
                  <h4>Edit Gynac History</h4>
                  <Box className="selectedCategory">
                    {allGynac.map((val, ind) => {
                      return (
                        <Chip
                          key={ind}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: 'secondary.main',
                            borderStyle: 'solid',
                            mr: 1,
                            my: 1
                          }}
                          variant={'outlined'}
                          color={'default'}
                          className="selectProblem"
                          label={val.problem}
                          onClick={() => {
                            setOpenEditHandler(false);
                            setOpenEditDataDetail(true);
                            setOpenGynac(false);
                            setOpenAddGynac(false);
                            setOpenData(val);
                            setInputVal(val.objective);
                            let e = [];
                            val.objective.forEach((vv) => {
                              e.push({ data: '' });
                            });
                            setErr(e);
                            setOpenEditHandler(false);
                          }}
                        />
                      );
                    })}
                  </Box>
                  <Button
                    sx={{ my: 2 }}
                    variant="contained"
                    onClick={() => {
                      setOpenEditHandler(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openEditDataDetail}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* update gynac history */}
            <DialogContent>
              {openEditDataDetail && (
                <Box style={{ width: '400px' }} className="selectedPtCategory">
                  <h4>Update Gynac History</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="problem"
                    label="Gynac History"
                    value={openData.problem}
                    onChange={(e) => {
                      setOpenData((prev) => {
                        return { ...prev, problem: e.target.value };
                      });
                      setError((prev) => {
                        return { ...prev, problem: '' };
                      });
                    }}
                    error={error.problem !== '' ? true : false}
                    helperText={error.problem}
                    style={{ margin: '10px 0' }}
                  />

                  <FormControl style={{ margin: '5px', width: '100%' }}>
                    <FormLabel>Answer Type:</FormLabel>
                    <RadioGroup
                      row
                      name="answerType"
                      value={openData.answerType}
                      onChange={(e) => {
                        setOpenData((prev) => {
                          return { ...prev, answerType: e.target.value };
                        });

                        if (e.target.value === 'Objective') {
                          setInputVal([{ data: '' }]);
                          setErr([{ data: '' }]);
                        } else {
                          setInputVal([]);
                          setErr([]);
                        }
                      }}
                    >
                      <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                      <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                      <FormControlLabel value="Calender" control={<Radio size="small" />} label="Calender" />
                    </RadioGroup>
                  </FormControl>

                  {openData.answerType === 'Objective' && (
                    <div style={{ marginBottom: '10px' }}>
                      {inputVal.map((data, index) => {
                        return (
                          <Grid item xs={12} key={index} className="withChiefC">
                            <Grid item xs={10}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="data"
                                value={data.data}
                                margin="dense"
                                onChange={(evnt) => handleData(index, evnt)}
                                error={err[index].data !== '' ? true : false}
                                helperText={err[index].data}
                              />
                            </Grid>
                            {inputVal.length !== 1 && (
                              <Grid item xs={1}>
                                <IconButton
                                  title="Remove Option"
                                  onClick={() => {
                                    removeInputVal(index);
                                  }}
                                  className="btnDelete"
                                >
                                  <Cancel className="btnDelete" />
                                </IconButton>
                              </Grid>
                            )}
                          </Grid>
                        );
                      })}
                      <IconButton variant="contained" onClick={addInputVal} title="Add Option" className="addBox">
                        <AddBox />
                      </IconButton>
                    </div>
                  )}

                  <Button className="addBtn" onClick={handleUpdateSubmitGynacHistory} style={{ margin: '8px 0' }} variant="contained">
                    Save
                  </Button>
                  <Button className="addBtn" onClick={() => setOpenEditDataDetail(false)} sx={{ ml: 1 }} variant="contained">
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDeleteHandler}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* delete gynac history */}
            <DialogContent>
              {openDeleteHandler && (
                <Box style={{ width: '400px' }} className="selectedPtCategory">
                  <h4>Delete Gynac History</h4>
                  <Box className="selectedCategory">
                    {allGynac.map((val, ind) => {
                      let exist = false;
                      deleteIds.forEach((v) => {
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
                            mr: 1,
                            my: 1
                          }}
                          variant={exist ? 'default' : 'outlined'}
                          color={exist ? 'primary' : 'default'}
                          key={ind}
                          className={exist ? 'selectProblemDelete' : 'selectProblem'}
                          label={val.problem}
                          onClick={() => {
                            let a = deleteIds;
                            if (val._id !== undefined) {
                              a.push(val._id);
                            }

                            let unique = [];
                            a.forEach((element) => {
                              if (!unique.includes(element)) {
                                unique.push(element);
                              }
                            });

                            setDeletedIds(unique);
                          }}
                          onDelete={
                            exist
                              ? () => {
                                  let aa = [];
                                  deleteIds.forEach((vM) => {
                                    if (vM !== val._id) {
                                      aa.push(vM);
                                    }
                                  });
                                  setDeletedIds(aa);
                                }
                              : undefined
                          }
                          deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                        />
                      );
                    })}
                  </Box>

                  <Button variant="contained" className="addBtn" onClick={handleSaveDeleteGynacHistory} sx={{ my: 1 }}>
                    Save
                  </Button>
                  <Button variant="contained" className="addBtn" sx={{ ml: 1, my: 1 }} onClick={() => setOpenDeleteHandler(false)}>
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={addOptions}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* add options for  */}
            <DialogContent>
              {addOptions && (
                <Box style={{ width: '400px' }} className="selectedPtCategory">
                  <h4>Add Option for {openData.problem}</h4>
                  <Box className="withChiefC">
                    {inputValOp.map((data, index) => {
                      return (
                        <Grid item xs={12} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataOp(index, evnt)}
                              error={errOp[index].data !== '' ? true : false}
                              helperText={errOp[index].data}
                            />
                          </Grid>
                          {inputValOp.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Options"
                                onClick={() => {
                                  removeInputValOp(index);
                                }}
                                className="btnDelete"
                              >
                                <Cancel className="btnDelete" />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      );
                    })}
                  </Box>
                  <IconButton variant="contained" onClick={addInputValOp} title="Add Options" className="addBox">
                    <AddBox />
                  </IconButton>

                  <Box>
                    <Button className="addBtn" onClick={handleSubmitOptions} variant="contained">
                      Save
                    </Button>
                    <Button
                      className="addBtn"
                      onClick={() => {
                        setAddOptions(false);
                        setOpenGynac(true);
                      }}
                      variant="contained"
                      sx={{ ml: 1 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openGynac}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* after clicking on gynac chips  */}
            <DialogContent>
              {openGynac && (
                <Box className="selectedPtCategory" sx={{ width: 400 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <h4>{openData.problem}</h4>
                    {inputVal.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <IconButton
                          color="secondary"
                          onClick={() => {
                            setOpenGynac(false);
                            setOpen3Layer({
                              delete3Layer: false,
                              edit3Layer: true,
                              layer3Data: layer3Data
                            });
                          }}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => {
                            setOpenGynac(false);
                            setOpen3Layer({
                              delete3Layer: true,
                              edit3Layer: false,
                              layer3Data: layer3Data
                            });
                          }}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setOpen4Layer(true);
                          }}
                        >
                          <Add />
                        </IconButton>
                      </div>
                    )}
                  </div>
                  {inputVal.length > 0 && (
                    <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                      {inputVal.map((v, inx) => {
                        let exist = openData.objective.length > 0 && openData.objective[0].data === v.data;
                        return (
                          <Chip
                            sx={{
                              borderWidth: 2, // Increase border thickness
                              borderColor: exist ? 'primary.main' : 'secondary.main',
                              borderStyle: 'solid',
                              mr: 1,
                              my: 1
                            }}
                            variant={exist ? 'default' : 'outlined'}
                            color={exist ? 'primary' : 'default'}
                            key={inx}
                            className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                            label={v.data}
                            onClick={() => {
                              setLayer3ChipSelectedFor4Index(inx); // Set the selected index

                              setOpenDataSelectObjective(v);
                              setOpenData({
                                ...openData,
                                objective: [{ ...v, innerData: [] }] // Ensure only one is selected at a time
                              });
                            }}
                            onDelete={
                              exist
                                ? () => {
                                    setOpenData({
                                      ...openData,
                                      objective: [] // Clear selection on delete
                                    });
                                  }
                                : undefined
                            }
                            deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                          />
                        );
                      })}
                      <Chip
                        className={'selectProblemWith'}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: 'secondary.main',
                          borderStyle: 'solid',
                          ml: 1,
                          my: 1
                        }}
                        variant={'outlined'}
                        color={'default'}
                        label="+ Add"
                        onClick={() => {
                          setAddOptions(true);
                          setOpenGynac(false);
                          setInputValOp([{ data: '' }]);
                          setErrOp([{ data: '' }]);
                        }}
                      />
                    </Box>
                  )}
                  {Object.entries(openDataSelectObjective).length > 0 &&
                    openDataSelectObjective.innerData !== undefined &&
                    openDataSelectObjective.innerData.length > 0 && (
                      <>
                        <Box style={{ width: '100%' }}>
                          <hr style={{ margin: '10px 0' }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4>{openDataSelectObjective.data}</h4>
                            {inputVal.length > 0 && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <IconButton
                                  color="secondary"
                                  onClick={() => {
                                    setOpenGynac(false);
                                    setOpen4LayerData({
                                      delete4Layer: false,
                                      edit4Layer: true,
                                      layer4Data: layer3Data
                                    });
                                  }}
                                >
                                  <Edit />
                                </IconButton>

                                <IconButton
                                  color="error"
                                  onClick={() => {
                                    setOpenGynac(false);
                                    setOpen4LayerData({
                                      delete4Layer: true,
                                      edit4Layer: false,
                                      layer4Data: layer3Data
                                    });
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                                <IconButton
                                  color="primary"
                                  onClick={() => {
                                    setOpen5Layer(true);
                                    setOpenGynac(false);
                                  }}
                                >
                                  <Add />
                                </IconButton>
                              </div>
                            )}
                          </Box>

                          {openDataSelectObjective.innerData.map((op, indd) => {
                            let exist = openData.objective.some(
                              (ad) => ad.data === openDataSelectObjective.data && ad.innerData.some((ad1) => ad1.data === op.data)
                            );

                            return (
                              <Chip
                                key={indd}
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: exist ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1,
                                  my: 1
                                }}
                                variant={exist ? 'default' : 'outlined'}
                                color={exist ? 'primary' : 'default'}
                                className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={op.data}
                                onClick={() => {
                                  setOpenData((prev) => {
                                    const updatedObjectives = prev.objective.map((ad) => {
                                      if (ad.data === openDataSelectObjective.data) {
                                        const newInnerData = [...ad.innerData, op];

                                        // Deduplicate `innerData`
                                        const uniqueInnerData = newInnerData.filter(
                                          (item, index, self) => index === self.findIndex((t) => t.data === item.data)
                                        );

                                        return { ...ad, innerData: uniqueInnerData };
                                      }
                                      return ad;
                                    });

                                    return {
                                      ...prev,
                                      objective: updatedObjectives.some((ad) => ad.data === openDataSelectObjective.data)
                                        ? updatedObjectives
                                        : [...updatedObjectives, { ...openDataSelectObjective, innerData: [op] }]
                                    };
                                  });
                                }}
                                onDelete={
                                  exist
                                    ? () => {
                                        setOpenData((prev) => {
                                          const updatedObjectives = prev.objective.map((ad) => {
                                            if (ad.data === openDataSelectObjective.data) {
                                              return {
                                                ...ad,
                                                innerData: ad.innerData.filter((item) => item.data !== op.data)
                                              };
                                            }
                                            return ad;
                                          });

                                          return {
                                            ...prev,
                                            objective: updatedObjectives
                                          };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        </Box>
                      </>
                    )}

                  {inputVal.length === 0 && (
                    <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                      <TextField
                        variant="outlined"
                        name="value"
                        value={openData.value}
                        fullWidth={openData.answerType === 'Calender' ? false : true}
                        type={openData.answerType === 'Calender' ? 'date' : 'text'}
                        multiline={openData.answerType === 'Calender' ? false : true}
                        rows={5}
                        onChange={(e) => {
                          setOpenData((prev) => {
                            return {
                              ...prev,
                              value: e.target.value
                            };
                          });
                        }}
                      />
                    </Box>
                  )}

                  <Button
                    className="addBtn"
                    variant="contained"
                    onClick={() => {
                      if (openData.value !== '' || openData.objective.length > 0) {
                        let sM = patientHistory.gynac !== undefined ? [...patientHistory.gynac, openData] : [openData];

                        sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
                        setPatientHistory((prev) => {
                          return {
                            ...prev,
                            gynac: sM
                          };
                        });
                      }
                      setInputVal([]);
                      setOpenData({});
                      setOpenGynac(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    className="addBtn"
                    sx={{ ml: 1, my: 1 }}
                    variant="contained"
                    onClick={() => {
                      setOpenGynac(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={open3Layer.edit3Layer}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* update data */}
            <DialogContent>
              {open3Layer.edit3Layer && (
                <Box className="ptData">
                  {/* Heading */}
                  <Typography variant="h6" gutterBottom>
                    Update Data
                  </Typography>

                  {/* Chips with Flex Wrap */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {open3Layer?.layer3Data?.[0]?.objective?.map((chip, index) => (
                      <Chip
                        key={index}
                        label={chip.data}
                        onClick={() => handleChipSelection(index, chip.data)}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: selectedChipIndex === index ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          ml: 1,
                          my: 1
                        }}
                        variant={selectedChipIndex === index ? 'default' : 'outlined'}
                        color={selectedChipIndex === index ? 'primary' : 'default'}
                      />
                    ))}
                  </Box>

                  {/* Show TextField & Buttons when a Chip is selected */}
                  {selectedChipIndex !== null && (
                    <Box sx={{ my: 2 }}>
                      <TextField
                        label="Selected Chip"
                        value={chipInputValue}
                        onChange={(e) => setChipInputValue(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                      />

                      {/* Save & Cancel Buttons */}
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button variant="contained" onClick={handleSaveUpdate}>
                          Save
                        </Button>
                        <Button variant="contained" onClick={resetSelection}>
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={open3Layer.delete3Layer}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* delete  */}
            <DialogContent>
              {open3Layer.delete3Layer && (
                <Box className="ptData">
                  <Typography variant="h6" gutterBottom>
                    Delete
                  </Typography>

                  {/* Chips with Flex Wrap */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {open3Layer?.layer3Data?.[0]?.objective?.map((item, index) => (
                      <Chip
                        key={item?._id}
                        label={item.data}
                        onClick={() => handleChipClick(index)}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: selectedChips.includes(index) ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          ml: 1,
                          my: 1
                        }}
                        variant={selectedChips.includes(index) ? 'default' : 'outlined'}
                        color={selectedChips.includes(index) ? 'primary' : 'default'}
                      />
                    ))}
                  </Box>

                  {/* Buttons in One Line */}
                  {selectedChips.length > 0 && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Button variant="contained" onClick={handleDelete}>
                        Delete
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              <Button
                variant="contained"
                sx={{ my: 1 }}
                onClick={() => {
                  setOpen3Layer({
                    delete3Layer: false
                  });
                }}
              >
                Cancel
              </Button>
            </DialogContent>
          </Dialog>

          <Dialog open={open4LayerData.edit4Layer} maxWidth="md">
            <DialogContent>
              {open4LayerData.edit4Layer && (
                <Box  className="ptData" >
                  {/* Heading */}
                  <Typography variant="h6" gutterBottom>
                    Update Data
                  </Typography>

                  {/* Chips with Flex Wrap */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {open4LayerData?.layer4Data?.[0]?.objective?.[layer3ChipSelectedFor4Index]?.innerData?.map((chip, index) => (
                      <Chip
                        key={index}
                        label={chip.data}
                        onClick={() => handleChipSelection(index, chip.data)}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: 'secondary.main',
                          borderStyle: 'solid',
                          ml: 1,
                          my: 1
                        }}
                        variant={'outlined'}
                        color={'primary'}
                      />
                    ))}
                  </Box>
                  {selectedChipIndex == null && (
                    <Button variant="contained" onClick={()=>{
                      setOpen4LayerData({
                        edit4Layer:false
                      })
                    }}>
                      Cancel
                    </Button>
                  )}
                  {/* Show TextField & Buttons when a Chip is selected */}
                  {selectedChipIndex !== null && (
                    <Box sx={{ my: 2 }}>
                      <TextField
                        label="Selected Chip"
                        value={chipInputValue}
                        onChange={(e) => setChipInputValue(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                      />

                      {/* Save & Cancel Buttons */}
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button variant="contained" onClick={handleSaveUpdatelayer4}>
                          Save
                        </Button>
                        <Button variant="contained" onClick={()=>{
                      setOpen4LayerData({
                        edit4Layer:false
                      })
                    }}>
                      Cancel
                    </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={open4LayerData.delete4Layer} maxWidth="md">
            <DialogContent>
              {open4LayerData.delete4Layer && (
                <Box className="ptData">
                  <Typography variant="h6" gutterBottom>
                    Delete
                  </Typography>

                  {/* Chips with Flex Wrap */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {open4LayerData?.layer4Data?.[0]?.objective?.[layer3ChipSelectedFor4Index]?.innerData?.map((innerItem, innerIndex) => (
                      <Chip
                        key={innerItem?.data || `inner-${innerIndex}`}
                        label={innerItem.data}
                        onClick={() => handleChipClick(innerIndex)}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: selectedChips.includes(innerIndex) ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          ml: 1,
                          my: 1
                        }}
                        variant={selectedChips.includes(innerIndex) ? 'default' : 'outlined'}
                        color={selectedChips.includes(innerIndex) ? 'primary' : 'default'}
                      />
                    ))}
                  </Box>
                  {selectedChips.length == 0 && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setOpen4LayerData({
                          delete4Layer: false
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  {/* Buttons in One Line */}
                  {selectedChips.length > 0 && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Button variant="contained" onClick={handleDeleteLayer4}>
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setOpen4LayerData({
                            delete4Layer: false
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={open4Layer}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* after clicking on add button of open gynac */}
            <DialogContent>
              {open4Layer && (
                <Box style={{ width: '400px' }} className="selectedPtCategory">
                  <h4>{openData.problem}</h4>

                  {inputVal.length > 0 && (
                    <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                      {inputVal.map((v, inx) => {
                        return (
                          <Chip
                            sx={{
                              borderWidth: 2, // Increase border thickness
                              borderColor: 'secondary.main',
                              borderStyle: 'solid',
                              ml: 1,
                              my: 1
                            }}
                            variant={'outlined'}
                            color={'default'}
                            key={inx}
                            className={`${'selectProblemWith'}`}
                            label={v.data}
                            onClick={() => {
                              setInputValOp(v.innerData === undefined || v.innerData.length === 0 ? [{ data: '' }] : v.innerData);
                              let e = [];
                              if (v.innerData === undefined || v.innerData.length === 0) {
                                e = [
                                  {
                                    data: ''
                                  }
                                ];
                              } else {
                                v.innerData.forEach((ai) => {
                                  e.push((prev) => {
                                    e.push({ data: '' });
                                  });
                                });
                              }
                              setErrOp(e);
                              setData4Layer({
                                ...openData,
                                objective: v
                              });
                              setOpen4LayerDataAdd(true);
                              setOpen4Layer(false);
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    sx={{ my: 1, ml: 1 }}
                    onClick={() => {
                      setSelectedChips([]);
                      setOpen4Layer(false);
                      setOpenGynac(true);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={open5Layer} maxWidth="md">
            <DialogContent>
              {
                <Box style={{ width: '400px' }} className="selectedPtCategory">
                  <h4>{openDataSelectObjective.data}</h4>
                  {console.log('openDataSelectObjective', openDataSelectObjective)}

                  {Array.isArray(openDataSelectObjective.innerData) &&
                    openDataSelectObjective.innerData.map((op, indd) => {
                      let exist = openData?.objective?.some(
                        (ad) => ad.data === openDataSelectObjective.data && ad.innerData.some((ad1) => ad1.data === op.data)
                      );

                      return (
                        <Chip
                          key={indd}
                          sx={{
                            borderWidth: 2, // Increase border thickness
                            borderColor: exist ? 'primary.main' : 'secondary.main',
                            borderStyle: 'solid',
                            mr: 1,
                            my: 1
                          }}
                          variant={exist ? 'default' : 'outlined'}
                          color={exist ? 'primary' : 'default'}
                          className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                          label={op.data}
                          onClick={() => {
                            setInputValOp(op.innerData || [{ data: '' }]); // Initialize input fields
                            setErrOp(op.innerData?.map(() => ({ data: '' })) || [{ data: '' }]); // Initialize errors
                            setOpen5LayerDataAdd(true); // Open the dialog
                          }}
                        />
                      );
                    })}
                  <Button
                    variant="contained"
                    sx={{ my: 1, ml: 1 }}
                    onClick={() => {
                      setSelectedChips([]);
                      setOpen5Layer(false);
                      setOpenGynac(true);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              }
            </DialogContent>
          </Dialog>
          <Dialog open={open5LayerDataAdd} maxWidth="md">
            <DialogContent>
              {open5LayerDataAdd && (
                <Box className="ptData">
                  <Box sx={{ width: 400 }} className="selectedPtCategory">
                    <Typography variant="h6" gutterBottom>
                      Add data for {openDataSelectObjective.data}
                    </Typography>

                    {/* Answer Type Selection */}
                    <FormControl fullWidth margin="dense">
                      <FormLabel>Answer Type:</FormLabel>
                      <RadioGroup
                        row
                        name="answerType"
                        value={openDataSelectObjective.answerType || ''}
                        onChange={(e) => {
                          const answerType = e.target.value;

                          setOpenDataSelectObjective((prev) => ({
                            ...prev,
                            answerType
                            // innerData: answerType === 'Objective' ? [{ data: '' }] : [],
                          }));

                          // if (answerType === 'Objective') {
                          //   setInputValOp([{ data: '' }]);
                          // } else {
                          //   setInputValOp([]);
                          // }
                        }}
                      >
                        <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                        <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                      </RadioGroup>
                    </FormControl>

                    {/* If Objective Type - Multiple Input Fields */}
                    {openDataSelectObjective.answerType === 'Objective' && (
                      <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        {inputValOp.map((data, index) => (
                          <Grid container item spacing={1} key={index} alignItems="center">
                            <Grid item xs={10}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="data"
                                value={data.data}
                                margin="dense"
                                onChange={(e) => {
                                  const updatedList = [...inputValOp];
                                  updatedList[index].data = e.target.value;
                                  setInputValOp(updatedList);

                                  // Set updated innerData
                                  setOpenDataSelectObjective((prev) => ({
                                    ...prev,
                                    innerData: updatedList
                                  }));
                                }}
                              />
                            </Grid>

                            <Grid item xs={2}>
                              <IconButton
                                title="Remove Option"
                                onClick={() => {
                                  const updatedRows = [...inputValOp];
                                  updatedRows.splice(index, 1);
                                  setInputValOp(updatedRows);

                                  // Update innerData in state
                                  setOpenDataSelectObjective((prev) => ({
                                    ...prev,
                                    innerData: updatedRows
                                  }));
                                }}
                                className="btnDelete"
                              >
                                <Cancel className="btnDelete" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}

                        <Grid item xs={12} display="flex">
                          <IconButton
                            variant="contained"
                            onClick={() => {
                              const updatedList = [...inputValOp, { data: '' }];
                              setInputValOp(updatedList);
                              setOpenDataSelectObjective((prev) => ({
                                ...prev,
                                innerData: updatedList
                              }));
                            }}
                            title="Add Option"
                            className="addBox"
                          >
                            <AddBox />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )}

                    {/* If Subjective Type - Single Input */}
                    {openDataSelectObjective.answerType === 'Subjective' && (
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="subjectiveData"
                        value={openDataSelectObjective.innerData?.[0]?.data || ''}
                        margin="dense"
                        onChange={(e) => {
                          const updatedValue = e.target.value;
                          setOpenDataSelectObjective((prev) => ({
                            ...prev,
                            innerData: [{ data: updatedValue }]
                          }));
                        }}
                      />
                    )}

                    {/* Submit and Cancel Buttons */}
                    <Box display="flex" justifyContent="center">
                      <Button
                        sx={{ my: 1 }}
                        variant="contained"
                        className="addBtn"
                        onClick={() => {
                          setOpen5LayerDataAdd(false);
                          toast.success('Data added successfully!');
                        }}
                      >
                        Submit
                      </Button>
                      <Button variant="contained" sx={{ my: 1, ml: 1 }} onClick={() => setOpen5LayerDataAdd(false)}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>
          </Dialog>
          {/* {open4LayerDataAdd && (
            <Grid item xs={4} className="ptData">
              <Box
                style={{ width: '97%', marginLeft: '2rem', boxShadow: '-5px 0px 3px 0px #eee', padding: '1rem' }}
                className="selectedPtCategory"
              >
                <h4>Add data for {data4Layer.objective.data}</h4>
                <Grid container spacing={2}>
                  {inputValOp.map((data, index) => {
                    return (
                      <Grid item xs={12} key={index} className="withChiefC">
                        <Grid item xs={10}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            name="data"
                            value={data.data}
                            margin="dense"
                            onChange={(e) => {
                              const { name, value } = e.target;
                              const list = [...inputValOp];
                              list[index][name] = value;
                              setInputValOp(list);
                              let a = [...inputVal];
                              a.forEach((ai, inx) => {
                                if (ai.data === data4Layer.objective.data) {
                                  a[inx].innerData = list;
                                }
                              });
                              setInputVal(a);
                            }}
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <IconButton
                            title="Remove Option"
                            onClick={() => {
                              const rows = [...inputValOp];
                              rows.splice(index, 1);
                              setInputValOp(rows);
                              const ee = [...errOp];
                              ee.splice(index, 1);
                              setErrOp(ee);

                              let a = [...inputVal];
                              a.forEach((ai, inx) => {
                                if (ai.data === data4Layer.objective.data) {
                                  a[inx].innerData = rows;
                                } else {
                                  a[inx].innerData = [];
                                }
                              });
                              setInputVal(a);
                            }}
                            className="btnDelete"
                          >
                            <Cancel className="btnDelete" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
                <IconButton
                  variant="contained"
                  onClick={() => {
                    addInputValOp();
                  }}
                  title="Add Option"
                  className="addBox"
                >
                  <AddBox />
                </IconButton>
                <br />
                <Button className="addBtn" onClick={handleUpdateSubmitGynacHistory}>
                  Submit
                </Button>
              </Box>
            </Grid>
          )} */}

          <Dialog
            open={open4LayerDataAdd}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* add data for  after clicking on chip of add button */}
            <DialogContent>
              {open4LayerDataAdd && (
                <Box className="ptData">
                  <Box
                    sx={{
                      width: 400
                    }}
                    className="selectedPtCategory"
                  >
                    <Typography variant="h6" gutterBottom>
                      Add data for {data4Layer.objective.data}
                      {console.log(inputVal)}
                    </Typography>

                    {/* Answer Type Selection */}
                    <FormControl fullWidth margin="dense">
                      <FormLabel>Answer Type:</FormLabel>
                      <RadioGroup
                        row
                        name="answerType"
                        value={openData.answerType}
                        onChange={(e) => {
                          setOpenData((prev) => ({ ...prev, answerType: e.target.value }));

                          // if (e.target.value === 'Objective') {
                          //   setInputVal([{ data: '' }]);
                          //   setErr([{ data: '' }]);
                          // } else {
                          //   setInputVal([{ data: '' }]);
                          //   setErr([{ data: '' }]);
                          // }
                        }}
                      >
                        <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                        <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                      </RadioGroup>
                    </FormControl>

                    {/* Conditionally Show Input Fields */}
                    {openData.answerType === 'Objective' && (
                      <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        {inputValOp.map((data, index) => (
                          <Grid container item spacing={1} key={index} alignItems="center">
                            <Grid item xs={10}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="data"
                                value={data.data}
                                margin="dense"
                                onChange={(e) => {
                                  const { name, value } = e.target;
                                  const updatedList = [...inputValOp];
                                  updatedList[index][name] = value;
                                  setInputValOp(updatedList);

                                  let updatedInputVal = [...inputVal];
                                  updatedInputVal.forEach((item, inx) => {
                                    if (item.data === data4Layer.objective.data) {
                                      updatedInputVal[inx].innerData = updatedList;
                                    }
                                  });
                                  setInputVal(updatedInputVal);
                                }}
                              />
                            </Grid>

                            {/* Remove Option Button */}
                            <Grid item xs={2}>
                              <IconButton
                                title="Remove Option"
                                onClick={() => {
                                  const updatedRows = [...inputValOp];
                                  updatedRows.splice(index, 1);
                                  setInputValOp(updatedRows);

                                  let updatedInputVal = [...inputVal];
                                  updatedInputVal.forEach((item, inx) => {
                                    if (item.data === data4Layer.objective.data) {
                                      updatedInputVal[inx].innerData = updatedRows;
                                    } else {
                                      updatedInputVal[inx].innerData = [];
                                    }
                                  });
                                  setInputVal(updatedInputVal);
                                }}
                                className="btnDelete"
                              >
                                <Cancel className="btnDelete" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}

                        {/* Add Option Button */}
                        <Grid item xs={12} display="flex">
                          <IconButton
                            variant="contained"
                            onClick={() => setInputValOp([...inputValOp, { data: '' }])}
                            title="Add Option"
                            className="addBox"
                          >
                            <AddBox />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )}

                    {openData.answerType === 'Subjective' && (
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="subjectiveData"
                        value={inputVal[0]?.data || ''}
                        margin="dense"
                        onChange={(e) => {
                          setInputVal([{ data: e.target.value }]);
                        }}
                      />
                    )}

                    <Box display="flex" justifyContent="center">
                      <Button sx={{ my: 1 }} variant="contained" className="addBtn" onClick={handleUpdateSubmitGynacHistory}>
                        Submit
                      </Button>
                      <Button variant="contained" sx={{ my: 1, ml: 1 }} onClick={() => setOpen4LayerDataAdd(false)}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>
          </Dialog>
        </Grid>
      )}

      {/* <ToastContainer /> */}
    </>
  );
};

export default Gynac;
