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

const LiefStyle = ({
  departmentId,
  medicalCategory,
  activeStep,
  patientHistory,
  setPatientHistory,
  allLifeStyle,
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
  const [dataForAddOption, setdataForAddOption] = useState(null);
  console.log("dataForAddOption",dataForAddOption)
  const [inputVal, setInputVal] = React.useState([]);
  const [err, setErr] = React.useState([]);

  const [chipInputValue, setChipInputValue] = useState('');

  const [selectedChipIndex, setSelectedChipIndex] = useState(null);
  // const [chipInputValue, setChipInputValue] = useState("");
  const [lifestyles, setLifestyles] = useState([]);
  const [inputValOp, setInputValOp] = React.useState([]);

  const [errOp, setErrOp] = React.useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [mostusedlifeStyle, setmostusedlifeStyle] = useState([]);
  const [lifeStyle, setlifeStyle] = useState([]);

  const [selectedAnswerType, setSelectedAnswerType] = useState(''); // "Subjective" or "Objective"
  const [objectiveOptions, setObjectiveOptions] = useState([{ problem: '' }]);
  const [subjectiveInput, setSubjectiveInput] = useState([{ data: '' }]);
  const [layer2Data, setLayer2Data] = useState({
    objective: []
  });
  const [layerLastData, setLayerLastData] = useState({
    objective: []
  });

  const [openlifeStyle, setOpenlifeStyle] = useState(false);
  const [addOptions, setAddOptions] = useState(false);
  const [openData, setOpenData] = useState({});
  const [error, setError] = useState({ problem: '' });
  const [openAddlifeStyle, setOpenAddlifeStyle] = useState(false);
  const [loader, setLoader] = useState(true);

  const [openEditHandler, setOpenEditHandler] = useState(false);
  const [openDeleteHandler, setOpenDeleteHandler] = useState(false);
  const [openEditDataDetail, setOpenEditDataDetail] = useState(false);
  const [deleteIds, setDeletedIds] = useState([]);

  const [open4Layer, setOpen4Layer] = useState(false);
  const [open4LayerDataAdd, setOpen4LayerDataAdd] = useState(false);

  const [open5Layer, setOpen5Layer] = useState(false);
  const [open5LayerDataAdd, setOpen5LayerDataAdd] = useState(false);
  const [openDataSelectObjective, setOpenDataSelectObjective] = useState({});
  const [openDataSelectLastObjective, setOpenDataSelectLastObjective] = useState({});


  const token = retrieveToken();
  console.log('openDataSelectObjective----', openDataSelectObjective);
  const getlifeStyleProblem = async () => {
    console.log('------> getlifeStyleProblem');
    setLoader(true);

    await axios
      .get(`${REACT_APP_BASE_URL}opd/life-style/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setmostusedlifeStyle(res);
        setlifeStyle(res);
        setLoader(false);
      })
      .catch((error) => {});
  };

  console.log('layer2Data', layer2Data);
  useEffect(() => {
    getlifeStyleProblem();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      let medP = mostusedlifeStyle.slice(); // Copying mostusedlifeStyle to medP to avoid modifying it directly

      patientHistory?.lifeStyle?.forEach((vv) => {
        // Check if the problem in patientHistory.lifeStyle is not present in mostusedlifeStyle
        if (!medP.some((v) => v.problem === vv.problem)) {
          medP.unshift(vv); // Add the problem from patientHistory.lifeStyle to medP
        }
      });
      // if()
      setlifeStyle(medP);
    } else {
      let med = [];
      allLifeStyle.forEach((v) => {
        if (v.problem.toLowerCase().includes(e.target.value.toLowerCase())) {
          med.push(v);
        }
      });
      setlifeStyle(med);
    }
  };

  const closeForm = () => {
    setOpenlifeStyle(false);
    setError({ problem: '' });
    setOpenAddlifeStyle(false);
    setOpenData({});
    setOpenDeleteHandler(false);
    setOpenEditDataDetail(false);
    setOpenEditHandler(false);
    setOpen4Layer(false);
    setOpen4LayerDataAdd(false);
    setLayer2Data({});
    setOpenDataSelectObjective({});
  };

  const handleSubmitOptions = async () => {
    console.log('this is for add objective with anather objective', inputVal);
    console.log('inputValOp', inputValOp);
    // const er = [...errOp];
    // let already = true;
    // inputValOp.forEach((val, ind) => {
    //   if (val.data === '') {
    //     er[ind].data = 'Please Enter Option or remove it...';
    //   } else {
    //     inputVal.forEach((s) => {
    //       if (s.data.toLowerCase() === val.data.toLowerCase()) {
    //         already = false;
    //         er[ind].data = 'This Option is already exist...';
    //       }
    //     });
    //   }
    // });
    // setErrOp(er);
    // console.log(inputVal);
    // let result = true;
    // for (let i = 0; i < inputValOp.length; i++) {
    //   let data = inputValOp[i];
    //   let t = Object.values(data).every((val) => val);
    //   if (!t) {
    //     result = false;
    //   }
    // }

    // console.log(inputVal);
    // if (result && already) {
    await axios
      .put(
        `${REACT_APP_BASE_URL}opd/life-style/${openData._id}`,
        {
          // _id: openData._id,
          problem: openData.problem,
          answerType: openData.answerType,
          objective: inputValOp.map((item) => ({
            problem: item.data,
            answerType: openData.answerType
          }))
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then(async (response) => {
        await getlifeStyleProblem();
        toast.success(`Options Created Successfully!!`);
        setInputVal([...inputVal, ...inputValOp]);

        setInputValOp([]);
        setErrOp([]);
        setAddOptions(false);
        setOpenlifeStyle(true);
        getlifeStyleProblem();
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
    // }
  };

  
  const handleAddObjective = async () => {
    console.log('this is for add objective with anather objective', inputVal);
    console.log('inputValOp', inputValOp);
    // const er = [...errOp];
    // let already = true;
    // inputValOp.forEach((val, ind) => {
    //   if (val.data === '') {
    //     er[ind].data = 'Please Enter Option or remove it...';
    //   } else {
    //     inputVal.forEach((s) => {
    //       if (s.data.toLowerCase() === val.data.toLowerCase()) {
    //         already = false;
    //         er[ind].data = 'This Option is already exist...';
    //       }
    //     });
    //   }
    // });
    // setErrOp(er);
    // console.log(inputVal);
    // let result = true;
    // for (let i = 0; i < inputValOp.length; i++) {
    //   let data = inputValOp[i];
    //   let t = Object.values(data).every((val) => val);
    //   if (!t) {
    //     result = false;
    //   }
    // }

    // console.log(inputVal);
    // if (result && already) {
    await axios
      .put(
        `${REACT_APP_BASE_URL}opd/life-style/${openData._id}`,
        {
          // _id: openData._id,
          problem: openData.problem,
          answerType: openData.answerType,
          objective: inputValOp.map((item) => ({
            problem: item.data,
            answerType: openData.answerType
          }))
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then(async (response) => {
        await getlifeStyleProblem();
        toast.success(`Options Created Successfully!!`);
        setInputVal([...inputVal, ...inputValOp]);

        setInputValOp([]);
        setErrOp([]);
        setAddOptions(false);
        setOpenlifeStyle(true);
        getlifeStyleProblem();
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
    // }
  };

  console.log('openData', openData);
  console.log('layerLastData-----', layerLastData);

  const handleSubmitlifeStyle = async () => {
    console.log('------> handleSubmitlifeStyle');
    if (openData.problem === '') {
      setError((prev) => {
        return { ...prev, problem: 'Enter the Personal History' };
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

    console.log('openData', openData);
    console.log('lifestyles', lifestyles);

    if (openData.problem !== '' && result) {
      //call api to store Personal History
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/life-style`,
          {
            problem: openData.problem,
            answerType: openData.answerType,

            objective: [...lifestyles],
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getlifeStyleProblem();
          let sM = [response.data.data, ...lifeStyle];
          sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
          setlifeStyle(sM);
          closeForm();
          setInputVal([]);
          setErr([]);
          toast({
            title: ' Personal History Created Successfully!!',
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

  const handleLayer2Action = async () => {
    console.log('------> handleLayer2Action');

    console.log('-------->inputVal', layer2Data);

    console.log(' Add data for ----openData', openData);
    if (openData.problem === '') {
      setError((prev) => {
        return { ...prev, problem: 'Enter the Personal History' };
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
    console.log(inputVal);

    if (openData.problem !== '' && result) {
      //call api to store Personal History
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/life-style/${openData._id}`,
          {
            // problem: openData.problem,
            // answerType: openData.answerType,
            // objective: inputVal,
            // departmentId
            layer2Data
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getAllMasterData();
          await getlifeStyleProblem();

          closeForm();
          setInputVal([]);
          setErr([]);
          toast({
            title: ' Personal History Updated Successfully!!',
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

  const handleLayerLastAction = async () => {
    console.log('----> handleLayerLastAction Triggered', openData._id);
    console.log('----> Payload:', layerLastData);

    try {
      await axios.put(`${REACT_APP_BASE_URL}opd/life-style-lastLayer/${openData._id}`, layerLastData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await getAllMasterData();
      await getlifeStyleProblem();
      closeForm();
      setInputVal([]);
      setErr([]);

      toast({
        title: 'Personal History Updated Successfully!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
    } catch (error) {
      console.error('Update Error:', error);
      toast({
        title: 'Something went wrong, please try again later!',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
    }
  };

  //add the new test input field
  const addInputVal = () => {
    setLifestyles([
      ...lifestyles,
      {
        answerType: 'objective',
        problem: '',
        innerData: []
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
    const rows = [...lifestyles];
    rows.splice(index, 1);
    setLifestyles(rows);
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

  const handleData = (index, e, event) => {
    const { name, value } = e.target;
    const list = [...inputVal];
    list[index][name] = value;
    setInputVal(list);
    const er = err;
    er[index][name] = '';
    setErr(er);
  };


    const [layer1AddData, setlayer1AddData] = useState({});
    const handleDataOp = (index, e, eventType) => {
      const { name, value } = e.target;
    
      // Clone and update only the specific object at index
      const updatedInputValOp = [...inputValOp];
      updatedInputValOp[index] = {
        ...updatedInputValOp[index],
        [name]: value
      };
      setInputValOp(updatedInputValOp);
    
      // Clear corresponding error
      const updatedErrOp = [...errOp];
      updatedErrOp[index] = {
        ...updatedErrOp[index],
        [name]: ''
      };
      setErrOp(updatedErrOp);
    
      // Optional: update layer structure on add
      if (eventType === 'add--1') {
        setlayer1AddData({
          ...openData,
          objective: updatedInputValOp.map((item) => ({
            problem: item.data,
            answerType: 'objective',
            objective: []
          }))
        });
      }
    };
    


  console.log("layer1AddData---",layer1AddData)
  const handleSaveDeletelifeStyleHistory = () => {
    let data = {
      ids: deleteIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/life-style`, {
        headers,
        data
      })
      .then(async (response) => {
        await getAllMasterData();
        getlifeStyleProblem();
        closeForm();
        setOpenDeleteHandler(false);
        toast({
          title: 'Personal History Deleted Successfully!!',
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

  console.log('');
  // Handle saving updated data
  const handleSaveUpdate = async () => {
    console.log('------> handleSaveUpdate');
    if (selectedChipIndex === null) return;

    try {
      const res = await put(`opd/life-style/objective-data/${layer3Data?.[0]?._id}`, {
        index: selectedChipIndex,
        problem: chipInputValue
      });

      if (res.success) {
        toast.success('Objective updated successfully!'); // Show success toast
        resetSelection(); // Clear selection after saving
        getlifeStyleProblem();
        getAllMasterData();
        setOpen3Layer({
          edit3Layer: false
        });
      } else {
        toast.error('Failed to update objective.'); // Handle API failure case
      }
    } catch (error) {
      console.error('Error updating objective:', error);
      toast.error('Something went wrong!'); // Show error toast
    }
  };
  const handleSaveUpdatelayer4 = async () => {
    console.log('------> handleSaveUpdatelayer4');
    if (selectedChipIndex === null) return;

    try {
      const res = await put(`opd/life-style/inner-data/objective-data/${layer3Data?.[0]?._id}`, {
        objectiveIndex: layer3ChipSelectedFor4Index,
        innerDataIndex: selectedChipIndex,
        data: chipInputValue
      });

      if (res.success) {
        toast.success('Objective updated successfully!'); // Show success toast
        resetSelection(); // Clear selection after saving
        getlifeStyleProblem();
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
      const res = await remove(`opd/life-style/${layer3Data?.[0]?._id}`, selectedChips);

      if (res.success) {
        toast.success(' Deleted successfully!');
        getlifeStyleProblem();
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

      const res = await remove(`opd/life-style/inner-data/${layer3Data?.[0]?._id}`, payload);

      if (res.success) {
        toast.success('Deleted successfully!');
        await Promise.all([getlifeStyleProblem(), getAllMasterData()]);
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
    const layer3Data = lifeStyle?.filter((data) => {
      return data?._id === openData?._id;
    });
    setLayer3Data(layer3Data);
  }, [lifeStyle, openData]);
  console.log('patuent', patientHistory);
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
                setOpenlifeStyle(false);
                setOpenData({ problem: '', answerType: 'Subjective' });
                setInputVal([]);
                setOpenAddlifeStyle(true);
                setOpenEditDataDetail(false);
                setOpenEditHandler(false);
                setOpenDeleteHandler(false);
              }}
            >
              Add
            </Button>

            {allLifeStyle.length > 0 && (
              <IconButton
                style={{ marginLeft: '2px' }}
                title="Edit Personal History"
                onClick={() => {
                  setOpenlifeStyle(false);
                  setOpenData({ problem: '', answerType: 'Subjective' });
                  setInputVal([]);
                  setOpenAddlifeStyle(false);
                  setOpenEditDataDetail(false);
                  setOpenEditHandler(true);
                  setOpenDeleteHandler(false);
                }}
              >
                <Edit fontSize="small" style={{ color: 'blue' }} />
              </IconButton>
            )}

            {allLifeStyle.length > 0 && (
              <IconButton
                style={{ marginLeft: '2px' }}
                title="Delete Personal History"
                onClick={() => {
                  setOpenlifeStyle(false);
                  setOpenData({ problem: '', answerType: 'Subjective' });
                  setInputVal([]);
                  setOpenAddlifeStyle(false);
                  setOpenEditDataDetail(false);
                  setOpenEditHandler(false);
                  setOpenDeleteHandler(true);
                }}
              >
                <Delete fontSize="small" style={{ color: 'red' }} />
              </IconButton>
            )}

            {allLifeStyle.length === 0 ? (
              <h4 className="noFoundOPd">Personal History Not Available, Please Add...</h4>
            ) : (
              <>
                {lifeStyle.length > 0 ? (
                  <Box className="selectedCategory">
                    {lifeStyle?.map((val, ind) => {
                      let pre = false;
                      const ids = new Set(patientHistory?.lifeStyle?.map((d) => d._id));
                      if (ids?.has(val?._id) || openData?._id === val?._id) {
                        pre = true;
                      }
                      return (
                        <Chip
                          key={ind}
                          sx={{
                            borderWidth: 2,
                            borderColor: pre ? 'primary.main' : 'secondary.main',
                            borderStyle: 'solid',
                            mr: 1,
                            my: 1
                          }}
                          color={pre ? 'primary' : 'default'}
                          variant={pre ? 'default' : 'outlined'}
                          label={val.problem}
                          onClick={() => {
                            setOpen4LayerData({
                              edit4Layer: false,
                              delete4Layer: false,
                              layer4Data: []
                            });
                            closeForm();
                            setError({ problem: '', ans: '' });
                            let med = {
                              problem: val.problem,
                              answerType: val.answerType,
                              value: '',
                              objective: [],
                              _id: val._id
                            };
                            setInputVal(val.objective);
                            patientHistory?.lifeStyle !== undefined &&
                              patientHistory?.lifeStyle.forEach((v) => {
                                if (v.problem === val.problem && v._id === val._id) {
                                  med = v;
                                }
                              });
                            setOpenAddlifeStyle(false);
                            setOpenlifeStyle(true);
                            setOpenData(med);
                            setOpenDeleteHandler(false);
                            setOpenEditDataDetail(false);
                            setOpenEditHandler(false);
                          }}
                          onDelete={
                            pre
                              ? () => {
                                  setOpenlifeStyle(false);
                                  setOpenData({});
                                  let medPro = [];
                                  patientHistory?.lifeStyle.forEach((vM) => {
                                    if (vM.problem !== val.problem) {
                                      medPro.push(vM);
                                    }
                                  });
                                  setPatientHistory((prev) => {
                                    return { ...prev, lifeStyle: medPro };
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
            open={openAddlifeStyle}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* content */}
            <DialogContent>
              {openAddlifeStyle && (
                <Grid item xs={4} className="ptData">
                  <Box style={{ width: '400px' }} className="selectedPtCategory">
                    <h4>Add Personal History</h4>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="problem"
                      label="Personal History"
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
                            setLifestyles([
                              {
                                answerType: 'objective',
                                problem: '',
                                innerData: []
                              }
                            ]);
                            setErr([{ data: '' }]);
                          } else {
                            setLifestyles([]);
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
                        {lifestyles.map((data, index) => {
                          return (
                            <Grid item xs={12} key={index} className="withChiefC">
                              <Grid item xs={10}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  name="data"
                                  value={data?.problem}
                                  margin="dense"
                                  onChange={(evnt) => {
                                    const updatedLifestyles = [...lifestyles];
                                    updatedLifestyles[index].problem = evnt.target.value;
                                    setLifestyles(updatedLifestyles);

                                    const updatedErrors = [...err];
                                    updatedErrors[index].data = '';
                                    setErr(updatedErrors);
                                  }}
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

                    <Button className="addBtn" onClick={handleSubmitlifeStyle} style={{ margin: '8px 0' }} variant="contained">
                      Save
                    </Button>
                    <Button className="addBtn" onClick={() => closeForm()} style={{ margin: '8px' }} variant="contained">
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openEditHandler}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* edit personal history */}
            <DialogContent>
              {openEditHandler && (
                <Grid item xs={4} className="ptData">
                  <Box style={{ width: '400px' }} className="selectedPtCategory">
                    <h4>Edit Personal History</h4>
                    <Box className="selectedCategory">
                      {allLifeStyle.map((val, ind) => {
                        return (
                          <Chip
                            key={ind}
                            // style={{ margin: '5px' }}
                            color="secondary"
                            variant="outlined"
                            sx={{ borderWidth: 2, borderStyle: 'solid', borderColor: 'secondary.main', p: 1, mr: 1, mt: 1 }}
                            className="selectProblem"
                            label={val.problem}
                            onClick={() => {
                              setOpenEditHandler(false);
                              setOpenEditDataDetail(true);
                              setOpenlifeStyle(false);
                              setOpenAddlifeStyle(false);
                              setOpenData(val);
                              setInputVal(val.objective);
                              let e = [];
                              val.objective.forEach((vv) => {
                                e.push({ data: '' });
                              });
                              setErr(e);
                              setOpenDeleteHandler(false);
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                  <Button className="addBtn" onClick={() => setOpenEditHandler(false)} style={{ margin: '8px' }} variant="contained">
                    Cancel
                  </Button>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openEditDataDetail}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* update personal history */}
            <DialogContent>
              {openEditDataDetail && (
                <Grid item xs={4} className="ptData">
                  <Box style={{ width: '400px' }} className="selectedPtCategory">
                    <h4>Update Personal History</h4>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="problem"
                      label="Personal History"
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

                    <Button className="addBtn" onClick={handleLayer2Action} style={{ margin: '8px' }} variant="contained">
                      Save
                    </Button>
                    <Button className="addBtn" onClick={() => closeForm()} style={{ margin: '8px' }} variant="contained">
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDeleteHandler}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* delete personal history  */}
            <DialogContent>
              {openDeleteHandler && (
                <Grid item xs={4} className="ptData">
                  <Box style={{ width: '400px' }} className="selectedPtCategory">
                    <h4>Delete Personal History</h4>
                    <Box className="selectedCategory">
                      {allLifeStyle.map((val, ind) => {
                        let exist = false;
                        deleteIds.forEach((v) => {
                          if (val._id === v) {
                            exist = true;
                          }
                        });
                        return (
                          <Chip
                            // style={{ margin: '5px' }}
                            sx={{
                              borderWidth: 2,
                              borderColor: exist ? 'primary.main' : 'secondary.main',
                              borderStyle: 'solid',
                              mr: 1,
                              my: 1
                            }}
                            color={exist ? 'primary' : 'default'}
                            variant={exist ? 'default' : 'outlined'}
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

                    <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeletelifeStyleHistory}>
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      className="addBtn"
                      style={{ marginTop: '10px', marginLeft: '10px' }}
                      onClick={() => closeForm()}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
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
                <Grid item xs={4} className="ptData">
                  <Box style={{ width: '400px' }} className="selectedPtCategory">
                    <h4>Add Option for dddfff {dataForAddOption.title}</h4>
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
                                onChange={(evnt) => handleDataOp(index, evnt, 'add--1')}
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

                    <div>
                      <Button className="addBtn" onClick={handleAddObjective} variant="contained">
                        Save  
                      </Button>
                      <Button
                        className="addBtn"
                        sx={{ m: 1 }}
                        onClick={() => {
                          setAddOptions(false);
                        }}
                        variant="contained"
                      >
                        Cancel
                      </Button>
                    </div>
                  </Box>
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={openlifeStyle} maxWidth="md">
            {/* after clicking on personal history chip  */}
            <DialogContent>
              {openlifeStyle && (
                <Grid item xs={4} className="ptData">
                  <Box className="selectedPtCategory" sx={{ width: 400 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <h4>{openData.problem} --uyhtgfdsrett</h4>
                      {inputVal.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <IconButton
                            color="secondary"
                            onClick={() => {
                              setOpenlifeStyle(false);
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
                              setOpenlifeStyle(false);
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
                              setOpenlifeStyle(false);
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
                          let exist = openData.objective.length > 0 && openData.objective[0].problem === v.problem;
                          return (
                            <Chip
                              sx={{
                                borderWidth: 2,
                                borderColor: exist ? 'primary.main' : 'secondary.main',
                                borderStyle: 'solid',
                                mr: 1,
                                my: 1
                              }}
                              color={exist ? 'primary' : 'default'}
                              variant={exist ? 'default' : 'outlined'}
                              key={inx}
                              className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                              label={v.problem}
                              onClick={() => {
                                setLayer3ChipSelectedFor4Index(inx); // Set the selected index
                                // setOpen4Layer(true)
                                setOpenDataSelectObjective(v);
                                setOpenData({
                                  ...openData,
                                  objective: [{ ...v, objective: [] }] 
                                });
                              }}
                              onDelete={
                                exist
                                  ? () => {
                                      setOpenData({
                                        ...openData,
                                        objective: [] 
                                      });
                                    }
                                  : undefined
                              }
                              deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                            />
                          );
                        })}
                        kjdbs sf
                        <Chip
                          className={'selectProblemWith'}
                          style={{ margin: '5px' }}
                          sx={{
                            borderWidth: 2,
                            borderColor: 'secondary.main',
                            borderStyle: 'solid',
                            mr: 1,
                            my: 1
                          }}
                          color={'primary'}
                          variant={'outlined'}
                          label="+ Add"
                          onClick={() => {
                            setAddOptions(true);
                            setOpenlifeStyle(false);
                            setInputValOp([{ data: '' }]);
                            setErrOp([{ data: '' }]);
                            setdataForAddOption(() => ({
                              title: openData.problem,
                              openData
                            }));
                          }}
                        />
                        
                      </Box>

                      
                    )}
                    {Object.entries(openDataSelectObjective).length > 0 &&
                      openDataSelectObjective?.objective !== undefined &&
                      openDataSelectObjective?.objective.length > 0 && (
                        <>
                          <Box style={{ width: '100%' }}>
                            <hr style={{ margin: '10px 0' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <h4>{openDataSelectObjective?.problem}</h4> ssd
                              {inputVal.length > 0 && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <IconButton
                                    color="secondary"
                                    onClick={() => {
                                      setOpenlifeStyle(false);
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
                                      setOpenlifeStyle(false);
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
                                      setOpenlifeStyle(false);
                                    }}
                                  >
                                    <Add />
                                  </IconButton>
                                </div>
                              )}
                            </Box>

                            {openDataSelectObjective?.objective.map((op, indd) => {
                              // Check if this chip is selected
                              const exist =
                                Array.isArray(openData?.objective) &&
                                openData.objective.some(
                                  (ad) =>
                                    ad?.problem === openDataSelectObjective?.problem &&
                                    Array.isArray(ad.objective) &&
                                    ad.objective.some((ad1) => ad1.problem === op.problem)
                                );

                              return (
                                <Chip
                                  style={{ margin: '5px' }}
                                  key={indd}
                                  sx={{
                                    borderWidth: 2,
                                    borderColor: exist ? 'primary.main' : 'secondary.main',
                                    borderStyle: 'solid',
                                    mr: 1,
                                    my: 1
                                  }}
                                  color={exist ? 'primary' : 'default'}
                                  variant={exist ? 'default' : 'outlined'}
                                  className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                  label={op.problem}
                                  onClick={() => {

                                    setOpenDataSelectLastObjective(op)
                                    setOpenData((prev) => {
                                      // Clear objectives for this problem to ensure no initial selection
                                      const filteredObjectives = prev.objective.filter(
                                        (ad) => ad.problem !== openDataSelectObjective.problem
                                      );

                                      // Add only the clicked chip's objective
                                      return {
                                        ...prev,
                                        objective: [...filteredObjectives, { ...openDataSelectObjective, objective: [op] }]
                                      };
                                    });
                                  }}
                                  onDelete={
                                    exist
                                      ? () => {
                                          setOpenData((prev) => {
                                            const updatedObjectives = prev.objective.map((ad) => {
                                              if (ad.problem === openDataSelectObjective.problem) {
                                                return {
                                                  ...ad,
                                                  objective: ad.objective.filter((item) => item.problem !== op.problem)
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
                            
                            <Chip
                          className={'selectProblemWith'}
                          style={{ margin: '5px' }}
                          sx={{
                            borderWidth: 2,
                            borderColor: 'secondary.main',
                            borderStyle: 'solid',
                            mr: 1,
                            my: 1
                          }}
                          color={'primary'}
                          variant={'outlined'}
                          label="+ Add"
                          onClick={() => {
                            
                              setdataForAddOption(() => ({
                                addlayer:2,
                                title: openDataSelectObjective?.problem,
                                openDataSelectObjective
                              }));
                          
                            setAddOptions(true);
                            setOpenlifeStyle(false);
                            setInputValOp([{ data: '' }]);
                            setErrOp([{ data: '' }]);
                          }}
                          />

                            
                          </Box>
                          

                          
                        </>
                      )}

                      
                    {Object.entries(openDataSelectLastObjective).length > 0 &&
                      openDataSelectLastObjective?.objective !== undefined &&
                      openDataSelectLastObjective?.objective.length > 0 && (
                        <>
                          <Box style={{ width: '100%' }}>
                            <hr style={{ margin: '10px 0' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <h4>{openDataSelectLastObjective?.problem}</h4> ssd
                              {inputVal.length > 0 && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <IconButton
                                    color="secondary"
                                    onClick={() => {
                                      setOpenlifeStyle(false);
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
                                      setOpenlifeStyle(false);
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
                                      setOpenlifeStyle(false);
                                    }}
                                  >
                                    <Add />
                                  </IconButton>
                                </div>
                              )}
                            </Box>

                            {openDataSelectLastObjective?.objective.map((op, indd) => {
                              // Check if this chip is selected
                              const exist =
                                Array.isArray(openData?.objective) &&
                                openData.objective.some(
                                  (ad) =>
                                    ad?.problem === openDataSelectLastObjective?.problem &&
                                    Array.isArray(ad.objective) &&
                                    ad.objective.some((ad1) => ad1.problem === op.problem)
                                );

                              return (
                                <Chip
                                  style={{ margin: '5px' }}
                                  key={indd}
                                  sx={{
                                    borderWidth: 2,
                                    borderColor: exist ? 'primary.main' : 'secondary.main',
                                    borderStyle: 'solid',
                                    mr: 1,
                                    my: 1
                                  }}
                                  color={exist ? 'primary' : 'default'}
                                  variant={exist ? 'default' : 'outlined'}
                                  className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                  label={op.problem}
                                  onClick={() => {
                                    setOpenData((prev) => {
                                      // Clear objectives for this problem to ensure no initial selection
                                      const filteredObjectives = prev.objective.filter(
                                        (ad) => ad.problem !== openDataSelectObjective.problem
                                      );

                                      // Add only the clicked chip's objective
                                      return {
                                        ...prev,
                                        objective: [...filteredObjectives, { ...openDataSelectObjective, objective: [op] }]
                                      };
                                    });
                                  }}
                                  onDelete={
                                    exist
                                      ? () => {
                                          setOpenData((prev) => {
                                            const updatedObjectives = prev.objective.map((ad) => {
                                              if (ad.problem === openDataSelectObjective.problem) {
                                                return {
                                                  ...ad,
                                                  objective: ad.objective.filter((item) => item.problem !== op.problem)
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
                            <Chip
                          className={'selectProblemWith'}
                          style={{ margin: '5px' }}
                          sx={{
                            borderWidth: 2,
                            borderColor: 'secondary.main',
                            borderStyle: 'solid',
                            mr: 1,
                            my: 1
                          }}
                          color={'primary'}
                          variant={'outlined'}
                          label="+ Add"
                          onClick={() => {
                            setdataForAddOption(() => ({
                              addlayer:3,
                              title: openDataSelectLastObjective?.problem,
                              openDataSelectLastObjective
                            }));
                            setAddOptions(true);
                            setOpenlifeStyle(false);
                            setInputValOp([{ data: '' }]);
                            setErrOp([{ data: '' }]);
                          }}
                        />
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
                      style={{ marginTop: '10px' }}
                      variant="contained"
                      onClick={() => {
                        if (openData.value !== '' || openData.objective.length > 0) {
                          let sM = patientHistory.lifeStyle !== undefined ? [...patientHistory.lifeStyle, openData] : [openData];

                          sM = [...new Map(sM.map((item) => [item['problem'], item])).values()];
                          setPatientHistory((prev) => {
                            return {
                              ...prev,
                              lifeStyle: sM
                            };
                          });
                        }
                        setInputVal([]);
                        setOpenData({});
                        setOpenlifeStyle(false);
                        setOpenDataSelectLastObjective({})
                        setOpenDataSelectObjective({})
                      }}

                      
                    >
                      Save
                    </Button>
                    <Button
                      className="addBtn"
                      style={{ marginTop: '10px', marginLeft: '10px' }}
                      variant="contained"
                      onClick={() => {setOpenlifeStyle(false)
                        setOpenDataSelectLastObjective({})
                        setOpenDataSelectObjective({})
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
            open={open3Layer.edit3Layer}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* update data  */}
            <DialogContent>
              {open3Layer.edit3Layer && (
                <Box item xs={4} className="ptData" sx={{ width: 400 }}>
                  {/* Heading */}
                  <Typography variant="h6" gutterBottom>
                    Update Data
                  </Typography>

                  {/* Chips with Flex Wrap */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {open3Layer?.layer3Data?.[0]?.objective?.map((chip, index) => (
                      <Chip
                        key={index}
                        label={chip.problem}
                        onClick={() => handleChipSelection(index, chip.data)}
                        sx={{
                          borderWidth: 2,
                          borderColor: selectedChipIndex === index ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        color={selectedChipIndex === index ? 'primary' : 'default'}
                        variant={selectedChipIndex === index ? 'default' : 'outlined'}
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
            {/* delete */}
            <DialogContent>
              {open3Layer.delete3Layer && (
                <Box item xs={4} className="ptData">
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
                          borderWidth: 2,
                          borderColor: selectedChips.includes(index) ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        color={selectedChips.includes(index) ? 'primary' : 'default'}
                        variant={selectedChips.includes(index) ? 'default' : 'outlined'}
                      />
                    ))}
                  </Box>

                  {/* Buttons in One Line */}
                  {selectedChips.length > 0 && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Button variant="contained" onClick={handleDelete}>
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setSelectedChips([]);
                          setOpen3Layer({ delete3Layer: false, edit3Layer: false });
                          setOpenlifeStyle(true);
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
            open={open4LayerData.edit4Layer}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* update data  */}
            <DialogContent>
              {open4LayerData.edit4Layer && (
                <Box className="ptData">
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
                          borderWidth: 2,
                          borderColor: selectedChipIndex === index ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        color={selectedChipIndex === index ? 'primary' : 'default'}
                        variant={selectedChipIndex === index ? 'default' : 'outlined'}
                      />
                    ))}
                  </Box>
                  {selectedChipIndex == null && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setOpen4LayerData({
                          edit4Layer: false
                        });
                      }}
                    >
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
                        <Button
                          variant="contained"
                          onClick={() => {
                            setOpen4LayerData({
                              edit4Layer: false
                            });
                          }}
                        >
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
                <Grid item xs={4} className="ptData" sx={{ boxShadow: 3, px: 2 }}>
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
                          borderWidth: 2,
                          borderColor: selectedChips.includes(innerIndex) ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        color={selectedChips.includes(innerIndex) ? 'primary' : 'default'}
                        variant={selectedChips.includes(innerIndex) ? 'default' : 'outlined'}
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
                </Grid>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={open4Layer}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* second layer of data addition  */}
            <DialogContent>
              {open4Layer && (
                <Box item xs={4} className="ptData">
                  <Box style={{ width: '400px' }} className="selectedPtCategory">
                    <h4>{openData.problem}</h4>weswdesdsd
                    {inputVal.length > 0 && (
                      <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                        {inputVal.map((v, inx) => {
                          return (
                            <Chip
                              // style={{ margin: '5px' }}
                              color="secondary"
                              variant="outlined"
                              sx={{ borderWidth: 2, borderStyle: 'solid', borderColor: 'secondary.main', p: 1, mr: 1, mt: 1 }}
                              key={inx}
                              className={`${'selectProblemWith'}`}
                              label={v.problem}
                              onClick={() => {
                                setOpen4LayerDataAdd(true);
                                setOpen4Layer(false);
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
                                setLayer2Data({
                                  ...openData,
                                  objective: v
                                });
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                  <Button className="addBtn" variant="contained" sx={{ m: 1 }} onClick={() => setOpen4Layer(false)}>
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={open5Layer}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            <DialogContent>
              {open5Layer && (
                <Box item xs={4} className="ptData">
                  <Box style={{ width: '400px' }} className="selectedPtCategory">
                    <h4>{openDataSelectObjective?.problem}</h4>trctree
                    {Array.isArray(openDataSelectObjective.objective) &&
                      openDataSelectObjective.objective.map((op, indd) => {
                        let exist = openData?.objective?.some(
                          (ad) => ad.problem === openDataSelectObjective.problem && ad.objective.some((ad1) => ad1.problem === op.problem)
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
                            label={op.problem}
                            onClick={() => {
                              setLayerLastData({
                                lastlayer: true,
                                _id: openDataSelectObjective._id,
                                problem: openDataSelectObjective.problem,
                                objective: op
                              });
                              setInputValOp(op.objective || [{ data: '' }]); // Initialize input fields
                              setErrOp(op.objective?.map(() => ({ data: '' })) || [{ data: '' }]); // Initialize errors
                              setOpen5LayerDataAdd(true); // Open the dialog
                            }}
                          />
                        );
                      })}
                  </Box>
                  <Button className="addBtn" variant="contained" sx={{ m: 1 }} onClick={() => setOpen5Layer(false)}>
                    Cancel
                  </Button>
                </Box>
              )}
            </DialogContent>
          </Dialog>
          <Dialog open={open4LayerDataAdd} maxWidth="md">
            <DialogContent>
              {open4LayerDataAdd && (
                <Box className="ptData">
                  <Box sx={{ width: 400 }} className="selectedPtCategory">
                    <Typography variant="h6" gutterBottom>
                      Add data for "ljasdjnas" {layer2Data?.objective?.problem}
                    </Typography>

                    {/* Answer Type Selection */}
                    <FormControl fullWidth margin="dense">
                      <FormLabel>Answer Type:</FormLabel>
                      <RadioGroup row name="answerType" value={selectedAnswerType} onChange={(e) => setSelectedAnswerType(e.target.value)}>
                        <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                        <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                      </RadioGroup>
                    </FormControl>

                    {/* Objective Input List */}
                    {selectedAnswerType === 'Objective' && (
                      <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        {objectiveOptions.map((option, index) => (
                          <Grid container item spacing={1} key={index} alignItems="center">
                            <Grid item xs={10}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                value={option.problem}
                                margin="dense"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const updatedOptions = [...objectiveOptions];
                                  updatedOptions[index].problem = value;
                                  setObjectiveOptions(updatedOptions);

                                  // Update layer2Data structure properly
                                  setLayer2Data((prev) => ({
                                    ...prev,
                                    answerType: selectedAnswerType,
                                    objective: {
                                      ...prev.objective,
                                      answerType: selectedAnswerType,
                                      objective: updatedOptions.map((opt) => ({
                                        problem: opt.problem,
                                        answerType: selectedAnswerType
                                      }))
                                    }
                                  }));
                                }}
                              />
                            </Grid>

                            {/* Remove Option */}
                            <Grid item xs={2}>
                              <IconButton
                                title="Remove Option"
                                onClick={() => {
                                  const updatedOptions = [...objectiveOptions];
                                  updatedOptions.splice(index, 1);
                                  setObjectiveOptions(updatedOptions);
                                }}
                                className="btnDelete"
                              >
                                <Cancel className="btnDelete" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}

                        {/* Add Option */}
                        <Grid item xs={12} display="flex">
                          <IconButton
                            variant="contained"
                            onClick={() => setObjectiveOptions([...objectiveOptions, { problem: '' }])}
                            title="Add Option"
                            className="addBox"
                          >
                            <AddBox />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )}

                    {/* Subjective Input */}
                    {selectedAnswerType === 'Subjective' && (
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="subjectiveData"
                        value={subjectiveInput[0]?.data || ''}
                        margin="dense"
                        onChange={(e) => {
                          const value = e.target.value;
                          setSubjectiveInput([{ data: value }]);

                          setLayer2Data((prev) => ({
                            ...prev,
                            objective: [
                              {
                                problem: value,
                                answerType: selectedAnswerType
                              }
                            ]
                          }));
                        }}
                      />
                    )}

                    {/* Submit/Cancel */}
                    <Box display="flex" justifyContent="center">
                      <Button sx={{ my: 1 }} variant="contained" onClick={handleLayer2Action}>
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

          <Dialog
            open={open5LayerDataAdd}
            maxWidth="md" // xs, sm, md, lg, xl
          >
            {/* add data for  */}
            <DialogContent>
              {open5LayerDataAdd && (
                <Box className="ptData">
                  <Box sx={{ width: 400 }} className="selectedPtCategory">
                    <Typography variant="h6" gutterBottom>
                      Add data for ---- {layerLastData?.problem}
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
                            answerType,
                            innerData: answerType === 'Objective' ? [{ data: '' }] : []
                          }));

                          if (answerType === 'Objective') {
                            setInputValOp([{ data: '' }]);
                          } else {
                            setInputValOp([]);
                          }
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

                                  // 👇 LayerLastData update karte hue directly OBJECTIVE ke andar push
                                  setLayerLastData((prev) => {
                                    const updatedObjectives = [...(prev.objective?.objective || [])];
                                    updatedObjectives[index] = {
                                      problem: e.target.value,
                                      answerType: 'Objective',
                                      objective: []
                                    };

                                    return {
                                      ...prev,
                                      objective: {
                                        ...prev.objective,
                                        answerType: 'Objective',
                                        objective: updatedObjectives
                                      }
                                    };
                                  });
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
                      <Button sx={{ my: 1 }} variant="contained" className="addBtn" onClick={handleLayerLastAction}>
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
        </Grid>
      )}

      {/* <ToastContainer /> */}
    </>
  );
};

export default LiefStyle;
