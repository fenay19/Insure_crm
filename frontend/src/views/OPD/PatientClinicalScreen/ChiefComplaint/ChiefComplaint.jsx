import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';
import './ChiefComplaint.css';
import { Add, Close, Delete, Edit, AddBox, Cancel, Search, LogoDevRounded } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useEffect } from 'react';
import { get, post, put, remove, retrieveToken } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import PainScale from './PainScale';

import PainChips from './PainChips';
import axios from 'axios';
import REACT_APP_BASE_URL from 'api/api';
import EditIcon from '@mui/icons-material/Edit';
import { Stack } from 'react-bootstrap';
const ChiefComplaint = ({ selectedMenu, editData, isEmr = false }) => {
  const departmentId = editData.departmentId._id;

  const [inputVal, setInputVal] = React.useState([
    {
      with: ''
    }
  ]);
  const [inputValReliving, setInputValReliving] = React.useState([
    {
      data: ''
    }
  ]);
  const [err, setErr] = React.useState([
    {
      with: ''
    }
  ]);
  const [inputValDes, setInputValDes] = React.useState([
    {
      data: ''
    }
  ]);
  const [errDes, setErrDes] = React.useState([
    {
      data: ''
    }
  ]);

  const [inputValSince, setInputValSince] = React.useState([
    {
      data: ''
    }
  ]);
  const [errSince, setErrSince] = React.useState([
    {
      data: ''
    }
  ]);

  const [inputValTreat, setInputValTreat] = React.useState([
    {
      data: ''
    }
  ]);
  const [errTreat, setErrTreat] = React.useState([
    {
      data: ''
    }
  ]);
  const [openChiefDialogue, setOpenChiefDialogue] = React.useState(false);
  const [inputValLocation, setInputValLocation] = React.useState([]);
  const [errLocation, setErrLocation] = React.useState([]);
  const [duration, setDuration] = useState([]);
  const [natureOfPain, setNatureOfPain] = useState([]);
  const [aggravatingFactors, setAggravatingFactors] = useState([]);
  const [relievingFactors, setRelievingFactors] = useState([]);
  const [quality, setQuality] = useState([]);
  const [painScore, setPainScore] = useState(0);
  const [painType, setPainType] = useState('');
  const [openPainDetails, setOpenPainDetails] = useState(false);

  const [mostUsedChiefComplaint, setMostUsedChiefComplaint] = useState([]);
  const [allChiefComplaint, setAllChiefComplaint] = useState([]);
  const [showChiefComplaint, setShowChiefComplaint] = useState([]);
  const [error, setError] = useState('');
  const [patientChiefComplaint, setPatientChiefComplaint] = useState([]);
  const [patientPainChiefComplaint, setPatientPainChiefComplaint] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [openChiefComplaintDetail, setOpenChiefComplaintDetail] = useState(false);
  const [openAddChiefComplaintDetail, setOpenAddChiefComplaintDetail] = useState(false);
  const [painLevel, setPainLevel] = useState(0);

  const [chiefComplaint, setChiefComplaint] = useState('');
  const [openChiefComplaintData, setOpenChiefComplaintData] = useState({
    notes: '',
    chiefComplaint: '',
    symptoms: [],
    description: [],
    since: [],
    treatment: [],
    Location: [],
    isLocation: false,
    isScale: false,
    painScore: '',
    painType: ''
  });
  const [openPainChiefComplaintData, setOpenPainChiefComplaintData] = useState({
    notes: '',
    chiefComplaint: chiefComplaint,
    duration: [],
    natureOfPain: [],
    Location: [],
    aggravatingFactors: [],
    relievingFactors: [],
    quality: [],
    painType: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [isScale, setIsScale] = useState(false);
  const [openAddSymptoms, setOpenAddSymptoms] = useState(false);
  const [symptoms, setSymptoms] = useState([]);

  const [openAddDescription, setOpenAddDescription] = useState(false);
  const [description, setDescription] = useState([]);

  const [openAddSince, setOpenAddSince] = useState(false);
  const [since, setSince] = useState([]);

  const [openAddLocation, setOpenAddLocation] = useState(false);
  const [Location, setLocation] = useState([]);

  const [openAddTreatment, setOpenAddTreatment] = useState(false);
  const [treatment, setTreatment] = useState([]);

  const [alreadyExistId, setAlreadyExistId] = useState('');
  const [painChiefComplaint, setPainChiefComplaint] = useState([]);

  const [openEditHandler, setOpenEditHandler] = useState(false);
  const [openDeleteHandler, setOpenDeleteHandler] = useState(false);
  const [openEditDataDetail, setOpenEditDataDetail] = useState(false);
  const [deleteIds, setDeletedIds] = useState([]);
  const [editId, setEditId] = useState('');
  const [patientChiefComplaintData, setPatientChiefComplaintData] = useState([]);
  const [selectedPainParameters, setSelectedPainParameters] = useState([]);
  const [painShowData, setPainShowData] = useState([]);
  const patient = useSelector((state) => state.patient.selectedPatient);
  const [selectedPainId, setSelectedPainId] = useState(null);
  const [showPainChiefComplaint, setShowPainChiefComplaint] = useState([]);

  const getPatientChiefComplaintData = async () => {
    await get(`patient-chief-complaint/${departmentId}`)
      .then((response) => {
        setAllChiefComplaint(response.data);
        setShowChiefComplaint(response.data);
      })
      .catch((error) => {});
  };

  const getChiefComplaint = async () => {
    setLoader(true);
    await getPatientChiefComplaintData();

    await get(`opd/chief-complaint/${departmentId}`)
      .then((response) => {
        setAllChiefComplaint(response.data);
      })
      .catch((error) => {});
    await get(`opd/pain-chief-complaint/${departmentId}`)
      .then((response) => {
        setPainChiefComplaint(response?.data ?? []);
        setShowPainChiefComplaint(response?.data ?? []);
      })
      .catch((error) => {});
  };

  // useEffect(() => {
  //   setShowChiefComplaint((prev) =>([...prev, ...painChiefComplaint]));
  // }, [painChiefComplaint]);
  useEffect(() => {
    getChiefComplaint();
    getPatientChiefComplaintData();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    setSearchValue(searchValue);

    if (!searchValue) {
      // Reset both lists to show all data
      setShowChiefComplaint([...allChiefComplaint]);
      setShowPainChiefComplaint([...painChiefComplaint]);
      return;
    }

    // Search in both lists separately
    const filteredComplaints = allChiefComplaint.filter((v) => v.chiefComplaint.toLowerCase().includes(searchValue));

    const filteredPainComplaints = painChiefComplaint.filter((v) => v.chiefComplaint.toLowerCase().includes(searchValue));

    // Update both lists separately
    setShowChiefComplaint(filteredComplaints);
    setShowPainChiefComplaint(filteredPainComplaints);
  };

  const addInputVal = () => {
    setInputVal([
      ...inputVal,
      {
        with: ''
      }
    ]);
    setErr((prev) => {
      return [
        ...prev,
        {
          with: ''
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
  const addInputValDes = () => {
    setInputValDes([
      ...inputValDes,
      {
        data: ''
      }
    ]);
    setErrDes((prev) => {
      return [
        ...prev,
        {
          data: ''
        }
      ];
    });
  };

  //remove the one test data
  const removeInputValDes = (index) => {
    const rows = [...inputValDes];
    rows.splice(index, 1);
    setInputValDes(rows);
    const ee = [...errDes];
    ee.splice(index, 1);
    setErrDes(ee);
  };

  //add the new test input field
  const addInputValTreat = () => {
    setInputValTreat([
      ...inputValTreat,
      {
        data: ''
      }
    ]);
    setErrTreat((prev) => {
      return [
        ...prev,
        {
          data: ''
        }
      ];
    });
  };

  //remove the one test data
  const removeInputValTreat = (index) => {
    const rows = [...inputValTreat];
    rows.splice(index, 1);
    setInputValTreat(rows);
    const ee = [...errTreat];
    ee.splice(index, 1);
    setErrTreat(ee);
  };

  //add the new test input field
  const addInputValSince = () => {
    setInputValSince([
      ...inputValSince,
      {
        data: ''
      }
    ]);
    setErrSince((prev) => {
      return [
        ...prev,
        {
          data: ''
        }
      ];
    });
  };

  //remove the one test data
  const removeInputValSince = (index) => {
    const rows = [...inputValSince];
    rows.splice(index, 1);
    setInputValSince(rows);
    const ee = [...errSince];
    ee.splice(index, 1);
    setErrSince(ee);
  };

  //add the new test input field
  const addInputValLocation = () => {
    setInputValLocation([
      ...inputValLocation,
      {
        data: ''
      }
    ]);
    setErrLocation((prev) => {
      return [
        ...prev,
        {
          data: ''
        }
      ];
    });
  };

  //remove the one test data
  const removeInputValLocation = (index) => {
    const rows = [...inputValLocation];
    rows.splice(index, 1);
    setInputValLocation(rows);
    const ee = [...errLocation];
    ee.splice(index, 1);
    setErrLocation(ee);
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

  const handleDataDes = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputValDes];
    list[index][name] = value;
    setInputValDes(list);
    const er = errDes;
    er[index][name] = '';
    setErrDes(er);
  };

  const handleDataSince = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputValSince];
    list[index][name] = value;
    setInputValSince(list);
    const er = errSince;
    er[index][name] = '';
    setErrSince(er);
  };

  const handleDataLocation = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputValLocation];
    list[index][name] = value;
    setInputValLocation(list);
    const er = errLocation;
    er[index][name] = '';
    setErrLocation(er);
  };

  const handleDataTreat = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputValTreat];
    list[index][name] = value;
    setInputValTreat(list);
    const er = errTreat;
    er[index][name] = '';
    setErrTreat(er);
  };

  const addChiefComplaintHandler = () => {
    // setOpenChiefComplaintDetail(false);
    setOpenChiefDialogue(true);
    setChiefComplaint('');

    if (chiefComplaint?.toLowerCase()?.trim() === 'pain') {
      setOpenAddChiefComplaintDetail(false);
    } else {
      setOpenAddChiefComplaintDetail(true);
    }
    setOpenDeleteHandler(false);
    setOpenEditHandler(false);
    setOpenEditDataDetail(false);
    setInputVal([{ with: '' }]);
    setErr([{ with: '' }]);

    setInputValDes([{ data: '' }]);
    setErrDes([{ data: '' }]);

    setInputValLocation([{ data: '' }]);
    setErrLocation([{ data: '' }]);

    setInputValSince([{ data: '' }]);
    setErrSince([{ data: '' }]);

    setInputValTreat([{ data: '' }]);
    setErrTreat([{ data: '' }]);

    setIsLocation(false);
    setIsScale(false);
  };

  const editChiefComplaintHandler = () => {
    setOpenEditHandler(true);
    setOpenEditDataDetail(false);
    setOpenDeleteHandler(false);
    setOpenChiefComplaintDetail(false);
    setChiefComplaint('');
    setOpenAddChiefComplaintDetail(false);
  };

  const deleteChiefComplaintHandler = () => {
    setOpenDeleteHandler(true);
    setOpenEditHandler(false);
    setOpenEditDataDetail(false);
    setOpenChiefComplaintDetail(false);
    setChiefComplaint('');
    setOpenAddChiefComplaintDetail(false);
  };

  const handleSubmitSymptoms = async () => {
    const er = [...err];
    let already = true;
    inputVal.forEach((val, ind) => {
      if (val.with === '') {
        er[ind].with = 'Please Enter Symptoms or remove it...';
      } else {
        symptoms.forEach((s) => {
          if (s.with.toLowerCase() === val.with.toLowerCase()) {
            already = false;
            er[ind].with = 'This symptoms is already exist...';
          }
        });
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

    if (result && already) {
      await put(`opd/chief-complaint/${openChiefComplaintData._id}`, {
        symptoms: inputVal
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast.success(`Symptoms Created Successfully!!`);
          setSymptoms([...symptoms, ...inputVal]);
          setOpenChiefComplaintData((prev) => {
            return {
              ...prev,
              symptoms: [...openChiefComplaintData.symptoms, ...inputVal]
            };
          });

          setInputVal([
            {
              with: ''
            }
          ]);
          setErr([
            {
              with: ''
            }
          ]);
          setOpenAddSymptoms(false);
          setOpenChiefComplaintDetail(true);
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
  // HandleReleving Factors
  const handleRelevingFactor = async () => {
    const er = [...errDes];
    let already = true;
    inputValDes.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter  or remove it...';
      } else {
        relievingFactors.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = 'This  is already exist...';
          }
        });
      }
    });
    setErrDes(er);

    let result = true;
    for (let i = 0; i < inputValDes.length; i++) {
      let data = inputValDes[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }
    if (result && already) {
      await put(`opd/pain-chief-complaint/releving-factors/${openPainChiefComplaintData._id}`, {
        relievingFactors: inputValDes
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast.success(`Relieving Factors Created Successfully!!`);
          setRelievingFactors([...relievingFactors, ...inputValDes]);
          setOpenPainChiefComplaintData((prev) => {
            return {
              ...prev,
              relievingFactors: [...openPainChiefComplaintData.relievingFactors, ...inputValDes]
            };
          });

          setInputValDes([
            {
              data: ''
            }
          ]);
          setErrDes([
            {
              data: ''
            }
          ]);
          setOpenAddRelevingFactors(false);
          setOpenPainDetails(true);
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

  // Handle Quality
  const handlePainQuality = async () => {
    const er = [...errDes];
    let already = true;
    inputValDes.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Quality  or remove it...';
      } else {
        quality.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = 'This  is already exist...';
          }
        });
      }
    });
    setErrDes(er);

    let result = true;
    for (let i = 0; i < inputValDes.length; i++) {
      let data = inputValDes[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }
    if (result && already) {
      await put(`opd/pain-chief-complaint/quality/${selectedPainId}`, {
        quality: inputValDes
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast.success(`Qualities Created Successfully!!`);
          setQuality([...quality, ...inputValDes]);
          setOpenPainChiefComplaintData((prev) => {
            return {
              ...prev,
              quality: [...openPainChiefComplaintData.quality, ...inputValDes]
            };
          });

          setInputValDes([
            {
              data: ''
            }
          ]);
          setErrDes([
            {
              data: ''
            }
          ]);
          setOpenQuality(false);
          setOpenPainDetails(true);
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

  const handleSubmitDescription = async () => {
    const er = [...errDes];
    let already = true;
    inputValDes.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Description or remove it...';
      } else {
        description.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = 'This description is already exist...';
          }
        });
      }
    });
    setErrDes(er);

    let result = true;
    for (let i = 0; i < inputValDes.length; i++) {
      let data = inputValDes[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (result && already) {
      await put(`opd/chief-complaint/description/${openChiefComplaintData._id}`, {
        description: inputValDes
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast.success(`Description Created Successfully!!`);
          setDescription([...description, ...inputValDes]);
          setOpenChiefComplaintData((prev) => {
            return {
              ...prev,
              description: [...openChiefComplaintData.description, ...inputValDes]
            };
          });

          setInputValDes([
            {
              data: ''
            }
          ]);
          setErrDes([
            {
              data: ''
            }
          ]);
          setOpenAddDescription(false);
          setOpenChiefComplaintDetail(true);
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

  const handleSubmitSince = async () => {
    const er = [...errSince];
    let already = true;
    inputValSince.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Since or remove it...';
      } else {
        since.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = 'This since is already exist...';
          }
        });
      }
    });
    setErrSince(er);

    let result = true;
    for (let i = 0; i < inputValSince.length; i++) {
      let data = inputValSince[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (result && already) {
      await put(`opd/chief-complaint/since/${openChiefComplaintData._id}`, {
        since: inputValSince
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast(`Since Created Successfully!!`);
          setSince([...since, ...inputValSince]);
          setOpenChiefComplaintData((prev) => {
            return {
              ...prev,
              since: [...openChiefComplaintData.since, ...inputValSince]
            };
          });

          setInputValSince([
            {
              data: ''
            }
          ]);
          setErrSince([
            {
              data: ''
            }
          ]);
          setOpenAddSince(false);
          setOpenChiefComplaintDetail(true);
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
  const handlePainSince = async () => {
    const er = [...errSince];
    let already = true;
    inputValSince.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Since or remove it...';
      } else {
        duration.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = 'This since is already exist...';
          }
        });
      }
    });
    setErrSince(er);

    let result = true;
    for (let i = 0; i < inputValSince.length; i++) {
      let data = inputValSince[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (result && already) {
      await put(`opd/pain-chief-complaint/duration/${selectedPainId}`, {
        duration: inputValSince
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast(`Since Created Successfully!!`);
          setDuration([...duration, ...inputValSince]);
          setOpenPainChiefComplaintData((prev) => {
            return {
              ...prev,
              duration: [...openPainChiefComplaintData.duration, ...inputValSince]
            };
          });

          setInputValSince([
            {
              data: ''
            }
          ]);
          setErrSince([
            {
              data: ''
            }
          ]);
          setPainSince(false);
          setOpenPainDetails(true);
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

  const handleSubmitTreatment = async () => {
    const er = [...errTreat];
    let already = true;
    inputValTreat.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Treatment or remove it...';
      } else {
        treatment.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = 'This treatment is already exist...';
          }
        });
      }
    });
    setErrTreat(er);

    let result = true;
    for (let i = 0; i < inputValTreat.length; i++) {
      let data = inputValTreat[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (result && already) {
      await put(`opd/chief-complaint/treatment/${openChiefComplaintData._id}`, {
        treatment: inputValTreat
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast.success(`Treatment Created Successfully!!`);
          setTreatment([...treatment, ...inputValTreat]);
          setOpenChiefComplaintData((prev) => {
            return {
              ...prev,
              treatment: [...openChiefComplaintData.treatment, ...inputValTreat]
            };
          });

          setInputValTreat([
            {
              data: ''
            }
          ]);
          setErrTreat([
            {
              data: ''
            }
          ]);
          setOpenAddTreatment(false);
          setOpenChiefComplaintDetail(true);
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

  const handleSubmitLocation = async () => {
    const er = [...errLocation];
    let already = true;
    inputValLocation.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Location or remove it...';
      } else {
        Location.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = 'This Location is already exist...';
          }
        });
      }
    });
    setErrLocation(er);

    let result = true;
    for (let i = 0; i < inputValLocation.length; i++) {
      let data = inputValLocation[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (result && already) {
      await put(`opd/chief-complaint/Location/${openChiefComplaintData._id}`, {
        Location: inputValLocation
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast(`Location Created Successfully!!`);
          setLocation([...Location, ...inputValLocation]);
          setOpenChiefComplaintData((prev) => {
            return {
              ...prev,
              Location: [...openChiefComplaintData.Location, ...inputValLocation]
            };
          });

          setInputValLocation([
            {
              data: ''
            }
          ]);
          setErrLocation([
            {
              data: ''
            }
          ]);
          setOpenAddLocation(false);
          setOpenChiefComplaintDetail(true);
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

  const handlePainLocation = async () => {
    const er = [...errLocation];
    let already = true;
    inputValLocation.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Location or remove it...';
      } else {
        Location.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = 'This Location is already exist...';
          }
        });
      }
    });
    setErrLocation(er);

    let result = true;
    for (let i = 0; i < inputValLocation.length; i++) {
      let data = inputValLocation[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (result && already) {
      await put(`opd/pain-chief-complaint/location/${selectedPainId}`, {
        Location: inputValLocation
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast(`Location Created Successfully!!`);
          setLocation([...Location, ...inputValLocation]);
          setOpenPainChiefComplaintData((prev) => {
            return {
              ...prev,
              location: [...openPainChiefComplaintData.Location, ...inputValLocation]
            };
          });

          setInputValLocation([
            {
              data: ''
            }
          ]);
          setErrLocation([
            {
              data: ''
            }
          ]);
          setOpenPainLocation(false);
          setOpenPainDetails(true);
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
  const handleNatureOfPain = async () => {
    const er = [...errLocation];
    let already = true;
    inputValLocation.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Nature of pain or remove it...';
      } else {
        natureOfPain.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = 'This Location is already exist...';
          }
        });
      }
    });
    setErrLocation(er);

    let result = true;
    for (let i = 0; i < inputValLocation.length; i++) {
      let data = inputValLocation[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (result && already) {
      await put(`opd/pain-chief-complaint/nature-of-pain/${selectedPainId}`, {
        natureOfPain: inputValLocation
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast(` Created Successfully!!`);
          setNatureOfPain([...natureOfPain, ...inputValLocation]);
          setOpenPainChiefComplaintData((prev) => {
            return {
              ...prev,
              natureOfPain: [...openPainChiefComplaintData.natureOfPain, ...inputValLocation]
            };
          });

          setInputValLocation([
            {
              data: ''
            }
          ]);
          setErrLocation([
            {
              data: ''
            }
          ]);
          setOpenNatureOfPain(false);
          setOpenPainDetails(true);
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
  const handleAggrivatingFactors = async () => {
    const er = [...errLocation];
    let already = true;
    inputValLocation.forEach((val, ind) => {
      if (val.data === '') {
        er[ind].data = 'Please Enter Nature of pain or remove it...';
      } else {
        aggravatingFactors.forEach((s) => {
          if (s.data.toLowerCase() === val.data.toLowerCase()) {
            already = false;
            er[ind].data = 'This Location is already exist...';
          }
        });
      }
    });
    setErrLocation(er);

    let result = true;
    for (let i = 0; i < inputValLocation.length; i++) {
      let data = inputValLocation[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        result = false;
      }
    }

    if (result && already) {
      await put(`opd/pain-chief-complaint/agg-factors/${selectedPainId}`, {
        aggravatingFactors: inputValLocation
      })
        .then(async (response) => {
          await getChiefComplaint();
          toast(` Created Successfully!!`);
          setAggravatingFactors([...aggravatingFactors, ...inputValLocation]);
          setOpenPainChiefComplaintData((prev) => {
            return {
              ...prev,
              aggravatingFactors: [...openPainChiefComplaintData.aggravatingFactors, ...inputValLocation]
            };
          });

          setInputValLocation([
            {
              data: ''
            }
          ]);
          setErrLocation([
            {
              data: ''
            }
          ]);
          setOpenaggravatingFactors(false);
          setOpenPainDetails(true);
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

  const handleChangeChiefComplaint = (e) => {
    let { value } = e.target;
    setChiefComplaint(value);
    setError('');
  };

  const addSymptomsHandler = () => {
    setOpenChiefComplaintDetail(false);
    setOpenAddSymptoms(true);
    setInputVal([
      {
        with: ''
      }
    ]);
    setErr([
      {
        with: ''
      }
    ]);
  };
  const [openRelevingFactors, setOpenAddRelevingFactors] = useState(false);
  const [openQuality, setOpenQuality] = useState(false);
  const [openNatureOfPain, setOpenNatureOfPain] = useState(false);
  const [openaggravatingFactors, setOpenaggravatingFactors] = useState(false);
  const addRelevingFactors = () => {
    setOpenPainDetails(false);
    setOpenAddRelevingFactors(true);
    setInputValDes([
      {
        data: ''
      }
    ]);
    setErrDes([
      {
        data: ''
      }
    ]);
  };

  const [inputValQuality, setInputValQuality] = useState([{ data: '' }]);
  const [errQuality, setErrQuality] = useState([
    {
      data: ''
    }
  ]);

  const addPainQuality = () => {
    setOpenPainDetails(false);
    setOpenQuality(true);
    setInputValQuality([
      {
        data: ''
      }
    ]);
    setErrDes([
      {
        data: ''
      }
    ]);
  };
  const addNatureOfPain = () => {
    setOpenPainDetails(false);
    setOpenNatureOfPain(true);
    setInputValDes([
      {
        data: ''
      }
    ]);
    setErrDes([
      {
        data: ''
      }
    ]);
  };

  const addDescriptionHandler = () => {
    setOpenChiefComplaintDetail(false);
    setOpenAddDescription(true);
    setInputValDes([
      {
        data: ''
      }
    ]);
    setErrDes([
      {
        data: ''
      }
    ]);
  };

  const addSinceHandler = () => {
    setOpenChiefComplaintDetail(false);
    setOpenAddSince(true);
    setInputValSince([
      {
        data: ''
      }
    ]);
    setErrSince([
      {
        data: ''
      }
    ]);
  };
  const addAggravatingFactors = () => {
    setOpenPainDetails(false);
    setOpenaggravatingFactors(true);
    setInputValDes([
      {
        data: ''
      }
    ]);
    setErrDes([
      {
        data: ''
      }
    ]);
  };
  const [painSince, setPainSince] = useState(false);
  const addPainSince = () => {
    setOpenPainDetails(false);
    setPainSince(true);

    setInputValSince([
      {
        data: ''
      }
    ]);
    setErrSince([
      {
        data: ''
      }
    ]);
  };

  const addTreatmentHandler = () => {
    setOpenChiefComplaintDetail(false);
    setOpenAddTreatment(true);
    setInputValTreat([
      {
        data: ''
      }
    ]);
    setErrTreat([
      {
        data: ''
      }
    ]);
  };

  const addLocationHandler = () => {
    setOpenChiefComplaintDetail(false);
    setOpenAddLocation(true);
    setInputValLocation([
      {
        data: ''
      }
    ]);
    setErrLocation([
      {
        data: ''
      }
    ]);
  };
  const [openPainLocation, setOpenPainLocation] = useState(false);
  const addPainLocation = () => {
    setOpenPainDetails(false);
    setOpenPainLocation(true);
    setInputValLocation([
      {
        data: ''
      }
    ]);
    setErrLocation([
      {
        data: ''
      }
    ]);
  };

  const handleSaveAddChiefComplaint = async () => {
    if (chiefComplaint.length === 0) {
      setError('Please enter chief complaint');
    }
    setOpenChiefDialogue(false);
    const er = [...err];
    inputVal.forEach((val, ind) => {
      if (val.with === '') {
        er[ind].with = 'Please Enter Symptoms or remove it...';
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

    const erD = [...errDes];
    inputValDes.forEach((val, ind) => {
      if (val.data === '') {
        erD[ind].data = 'Please Enter Description or remove it...';
      }
    });
    setErrDes(erD);

    let resultD = true;
    for (let i = 0; i < inputValDes.length; i++) {
      let data = inputValDes[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        resultD = false;
      }
    }

    const erS = [...errSince];
    inputValSince.forEach((val, ind) => {
      if (val.data === '') {
        erS[ind].data = 'Please Enter Since or remove it...';
      }
    });
    setErrSince(erS);

    let resultS = true;
    for (let i = 0; i < inputValSince.length; i++) {
      let data = inputValSince[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        resultS = false;
      }
    }

    const erT = [...errTreat];
    inputValTreat.forEach((val, ind) => {
      if (val.data === '') {
        erT[ind].data = 'Please Enter Treatment or remove it...';
      }
    });
    setErrTreat(erT);

    let resultT = true;
    for (let i = 0; i < inputValTreat.length; i++) {
      let data = inputValTreat[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        resultT = false;
      }
    }

    let resultL = true;

    if (isLocation) {
      const erL = [...errLocation];
      inputValLocation.forEach((val, ind) => {
        if (val.data === '') {
          erL[ind].data = 'Please Enter Location or remove it...';
        }
      });
      setErrLocation(erL);
      for (let i = 0; i < inputValLocation.length; i++) {
        let data = inputValLocation[i];
        let t = Object.values(data).every((val) => val);
        if (!t) {
          resultL = false;
        }
      }
    }

    if (resultL && resultT && resultS && resultD && result && chiefComplaint.length !== 0) {
      await post(`opd/chief-complaint`, {
        chiefComplaint: chiefComplaint,
        symptoms: inputVal,
        description: inputValDes,
        since: inputValSince,
        treatment: inputValTreat,
        isLocation: isLocation,
        isScale: isScale,
        Location: inputValLocation,
        departmentId
      })
        .then(async (response) => {
          await getPatientChiefComplaintData();
          let sM = [response.data, ...showChiefComplaint];
          sM = [...new Map(sM.map((item) => [item['chiefComplaint'], item])).values()];
          setShowChiefComplaint(sM);
          setOpenAddChiefComplaintDetail(false);
          setSymptoms(inputVal);
          let e = [];
          inputVal.forEach(() => {
            e.push({ with: '' });
          });
          setErr(e);

          setDescription(inputValDes);
          let ed = [];
          inputValDes.forEach(() => {
            ed.push({ data: '' });
          });
          setErrDes(ed);

          setSince(inputValSince);
          let es = [];
          inputValSince.forEach(() => {
            es.push({ data: '' });
          });
          setErrSince(es);

          setLocation(inputValLocation);
          let el = [];
          inputValLocation.forEach(() => {
            el.push({ data: '' });
          });
          setErrLocation(el);

          setTreatment(inputValTreat);
          let et = [];
          inputValTreat.forEach(() => {
            et.push({ data: '' });
          });
          setErrTreat(et);

          let dta = {
            _id: response.data.data._id,
            notes: '',
            symptoms: [],
            description: [],
            since: [],
            treatment: [],
            Location: [],
            isLocation: isLocation,
            isScale: isScale,
            chiefComplaint: chiefComplaint
          };
          patientChiefComplaint.forEach((pC) => {
            if (pC.chiefComplaint === chiefComplaint) {
              dta = pC;
            }
          });
          setOpenChiefComplaintData(dta);
          setOpenChiefComplaintDetail(true);
          setOpenDeleteHandler(false);
          toast.success(`Chief Complaint Created Successfully!!`);
          setInputVal([
            {
              with: ''
            }
          ]);
          setInputValDes([
            {
              data: ''
            }
          ]);
          setInputValSince([
            {
              data: ''
            }
          ]);
          setInputValLocation([
            {
              data: ''
            }
          ]);
          setInputValTreat([
            {
              data: ''
            }
          ]);
          setIsLocation(false);
          setIsScale(false);
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

  const fetchPatientChiefComplaint = () => {
    if (patient) {
      // get(`patient-chief-complaint/getPatientChiefComplaint/${patient?.patientId?._id}`).then((res) => {
      //   setPatientChiefComplaintData(res?.data ?? []);
      //   setPatientChiefComplaint(res?.data ?? []);
      // });
      Promise.all([
        get(`patient-chief-complaint/getPatientChiefComplaint/${patient?.patientId?._id}`),
        get(`pain-patient-chief-complaint/${patient?.patientId?._id}`)
      ])
        .then(([patientChiefResponse, painPatientResponse]) => {
          setPatientChiefComplaintData(patientChiefResponse?.data || []);
          setPatientChiefComplaint(patientChiefResponse?.data || []);
          setPatientPainChiefComplaint(painPatientResponse?.data || []);
        })
        .catch((error) => {
          console.error('Error fetching patient complaints:', error);
        });
    }
  };
  useEffect(() => {
    fetchPatientChiefComplaint();
  }, [patient?.patientId?._id, patient]);

  const handleSaveUpdateChiefComplaint = async () => {
    if (chiefComplaint.length === 0) {
      setError('Please enter chief complaint');
    }

    const er = [...err];
    inputVal.forEach((val, ind) => {
      if (val.with === '') {
        er[ind].with = 'Please Enter Symptoms or remove it...';
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

    const erD = [...errDes];
    inputValDes.forEach((val, ind) => {
      if (val.data === '') {
        erD[ind].data = 'Please Enter Description or remove it...';
      }
    });
    setErrDes(erD);

    let resultD = true;
    for (let i = 0; i < inputValDes.length; i++) {
      let data = inputValDes[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        resultD = false;
      }
    }

    const erS = [...errSince];
    inputValSince.forEach((val, ind) => {
      if (val.data === '') {
        erS[ind].data = 'Please Enter Since or remove it...';
      }
    });
    setErrSince(erS);

    let resultS = true;
    for (let i = 0; i < inputValSince.length; i++) {
      let data = inputValSince[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        resultS = false;
      }
    }

    const erT = [...errTreat];
    inputValTreat.forEach((val, ind) => {
      if (val.data === '') {
        erT[ind].data = 'Please Enter Treatment or remove it...';
      }
    });
    setErrTreat(erT);

    let resultT = true;
    for (let i = 0; i < inputValTreat.length; i++) {
      let data = inputValTreat[i];
      let t = Object.values(data).every((val) => val);
      if (!t) {
        resultT = false;
      }
    }

    let resultL = true;
    if (isLocation) {
      const erL = [...errLocation];
      inputValLocation.forEach((val, ind) => {
        if (val.data === '') {
          erL[ind].data = 'Please Enter Location or remove it...';
        }
      });
      setErrLocation(erL);
      for (let i = 0; i < inputValLocation.length; i++) {
        let data = inputValLocation[i];
        let t = Object.values(data).every((val) => val);
        if (!t) {
          resultL = false;
        }
      }
    }

    if (resultL && resultT && resultS && resultD && result && chiefComplaint.length !== 0) {
      await put(`opd/chief-complaint/${editId}`, {
        chiefComplaint: chiefComplaint,
        symptoms: inputVal,
        description: inputValDes,
        since: inputValSince,
        treatment: inputValTreat,
        isLocation: isLocation,
        isScale: isScale,
        Location: inputValLocation,
        departmentId,
        patientId: patient?.patientId?._id
      })
        .then(async (response) => {
          await getChiefComplaint();
          fetchPatientChiefComplaint();
          setOpenEditDataDetail(false);
          setSymptoms(inputVal);
          let e = [];
          inputVal.forEach(() => {
            e.push({ with: '' });
          });
          setErr(e);

          setDescription(inputValDes);
          let ed = [];
          inputValDes.forEach(() => {
            ed.push({ data: '' });
          });
          setErrDes(ed);

          setSince(inputValSince);
          let es = [];
          inputValSince.forEach(() => {
            es.push({ data: '' });
          });
          setErrSince(es);

          setLocation(inputValLocation);
          let el = [];
          inputValLocation.forEach(() => {
            el.push({ data: '' });
          });
          setErrLocation(el);

          setTreatment(inputValTreat);
          let et = [];
          inputValTreat.forEach(() => {
            et.push({ data: '' });
          });
          setErrTreat(et);

          setOpenDeleteHandler(false);
          toast({
            title: `Chief Complaint Update Successfully!!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: 'bottom'
          });
          setInputVal([
            {
              with: ''
            }
          ]);
          setInputValDes([
            {
              data: ''
            }
          ]);
          setInputValSince([
            {
              data: ''
            }
          ]);
          setInputValLocation([
            {
              data: ''
            }
          ]);
          setInputValTreat([
            {
              data: ''
            }
          ]);
          setIsLocation(false);
          setIsScale(false);
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

  const handleSaveChiefComplaint = () => {
    let sM = [...patientChiefComplaint, openChiefComplaintData];
    sM = [...new Map(sM.map((item) => [item['chiefComplaint'] + item['_id'], item])).values()];
    if (patientChiefComplaint.length === 0) {
      handleSubmitChiefComplaint(sM);
    } else {
      handleSubmitEditChiefComplaint(openChiefComplaintData);
    }
  };

  const handleSavePainChiefComplaint = () => {
    let sM = [...patientPainChiefComplaint, openPainChiefComplaintData];
    sM = [...new Map(sM.map((item) => [item['chiefComplaint'] + item['_id'], item])).values()];
    if (patientPainChiefComplaint.length === 0) {
      handleSubmitPainChiefComplaint(sM);
    } else {
      handlePainEditCheifComplaint(openPainChiefComplaintData);
    }
  };

  const handleSubmitChiefComplaint = (sM) => {
    post(`patient-chief-complaint/${departmentId}`, {
      chiefComplaint: sM,
      patientId: patient?.patientId?._id,
      consultantId: patient?.consultantId,
      opdPatientId: patient?._id,
      departmentId
    })
      .then((response) => {
        getPatientChiefComplaintData();
        fetchPatientChiefComplaint();

        setOpenChiefComplaintDetail(false);
        setChiefComplaint('');
        setSymptoms([]);
        setDescription([]);
        setSince([]);
        setTreatment([]);
        setLocation([]);
        toast.success(`Chief Complaint Successfully Submitted!!`);
      })
      .catch((error) => {
        toast('Something went wrong, Please try later!!');
      });
  };
  const handleSubmitPainChiefComplaint = (sM) => {
    post(`pain-patient-chief-complaint`, {
      chiefComplaint: sM,
      patientId: patient?.patientId?._id,
      consultantId: patient?.consultantId,
      opdPatientId: patient?._id,
      departmentId
    })
      .then((response) => {
        getPatientChiefComplaintData();
        fetchPatientChiefComplaint();

        setOpenPainDetails(false);
        setRelievingFactors('');
        setAggravatingFactors([]);
        setNatureOfPain([]);
        setDuration([]);
        setQuality([]);

        setLocation([]);
        toast.success(`Chief Complaint Successfully Submitted!!`);
      })
      .catch((error) => {
        toast('Something went wrong, Please try later!!');
      });
  };

  const handleSubmitEditChiefComplaint = (sM) => {
    if (patient) {
      put(`patient-chief-complaint/${patient?.patientId?._id}`, {
        chiefComplaint: sM
      })
        .then((response) => {
          fetchPatientChiefComplaint();
          getPatientChiefComplaintData();
          setOpenChiefComplaintDetail(false);
          setChiefComplaint('');
          setSymptoms([]);
          setDescription([]);
          setSince([]);
          setTreatment([]);
          setLocation([]);
          toast({
            title: `Chief Complaint Successfully Updated!!`,
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
  const handlePainEditCheifComplaint = (sM) => {
    if (patient) {
      put(`pain-patient-chief-complaint/edit/${patient?.patientId?._id}`, {
        chiefComplaint: sM
      })
        .then((response) => {
          fetchPatientChiefComplaint();
          getPatientChiefComplaintData();
          setOpenPainChiefComplaintData({});
          setOpenPainDetails(false);
          setChiefComplaint('');
          setQuality([]);
          setDuration([]);
          setAggravatingFactors([]);
          setRelievingFactors([]);
          setNatureOfPain([]);
          setLocation([]);
          toast({
            title: `Chief Complaint Successfully Updated!!`,
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

  const handleSaveDeleteChiefComplaint = () => {
    let data = {
      ids: deleteIds
    };
    console.log(data);
    let headers = { Authorization: 'Bearer ' + retrieveToken() };
    
          axios.delete(`${REACT_APP_BASE_URL}/opd/chief-complaint`, {
            headers,
            data
          }) .then((response) => {
                getChiefComplaint();
                setDeletedIds([]);
                setOpenDeleteHandler(false);
                console.log(response);
                
                toast.success('Chief Complaint Deleted Successfully!!');
              })
              .catch((error) => {
                toast.error('Something went wrong, Please try later!!');
              });
  };

  useEffect(() => {
    if (chiefComplaint?.toLowerCase()?.trim() === 'pain') {
      setOpenChiefComplaintDetail(false);
    }
  }, [chiefComplaint]);

  const fethPainData = async () => {
    try {
      if (patient) {
        const res = await get(`pain-patient-chief-complaint/${patient?.patientId?._id}`);

        setPainShowData(res?.data ?? []);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fethPainData();
  }, [patient]);

  const handleSingleChiefDelete = async (id) => {
    try {
      let headers = { Authorization: 'Bearer ' + retrieveToken() };

      const response = await axios.delete(`${REACT_APP_BASE_URL}opd/chief-complaint-single/${id}`, { headers });
      toast.success(response?.msg || 'Deleted Successfully');

      await getChiefComplaint();
    } catch (error) {
      toast({
        title: 'Something went wrong, Please try later!!',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
    }
  };
  const handleSinglePainDelete = async (id) => {
    try {
      const res = await remove(`opd/pain-chief-complaint/${id}`);
      toast.success(res?.msg || 'Deleted Successfully');
      await getChiefComplaint();
    } catch (error) {
      toast({
        title: 'Something went wrong, Please try later!!',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
    }
  };

  const handleSetChiefComplaint = (data) => {
    setChiefComplaint(data.chiefComplaint);
    setOpenPainDetails(true);
    setOpenChiefComplaintDetail(false);
    setLocation(data.location || []);
    setDuration(data.duration || []);
    setNatureOfPain(data.natureOfPain || []);
    setAggravatingFactors(data.aggravatingFactors || []);
    setRelievingFactors(data.relievingFactors || []);
    setQuality(data.quality || []);
    setPainScore(data.painScore || 0);
    setPainType(data.painType || '');
    const formattedData = {
      _id: data?._id || '',
      chiefComplaint: data?.chiefComplaint || ''
    };
    setSelectedPainId(data?._id);
    setOpenPainChiefComplaintData((prev) => ({ ...prev, ...formattedData }));

    // Reset additional states
    setOpenAddSymptoms(false);
    setOpenAddDescription(false);
    setOpenAddSince(false);
    setOpenAddTreatment(false);
    setOpenAddLocation(false);
    setOpenAddChiefComplaintDetail(false);
  };

  const handlePatientChiefComplaintDelete = async (val, index) => {
    try {
      const Id = val?._id;
      if (!Id) {
        toast.error('Invalid patient complaint ID.');
        return;
      }

      const res = await remove(`patient-chief-complaint/${Id}?index=${index}`);

      if (res?.status) {
        toast.success('Patient chief complaint deleted successfully.');
        fetchPatientChiefComplaint();
      } else {
        throw new Error(res?.data?.message || 'Failed to delete complaint.');
      }
    } catch (error) {
      console.error('Error deleting patient chief complaint:', error);
      toast.error(error?.message || 'Something went wrong.');
    }
  };

  const handlePatientPainChiefComplaintDelete = async (val, ind) => {
    try {
      const Id = val?._id;
      if (!Id) {
        toast.error('Invalid pain complaint ID.');
        return;
      }

      const res = await remove(`pain-patient-chief-complaint/delete/${Id}?index=${ind}`);

      if (res?.status) {
        toast.success('Pain chief complaint deleted successfully.');
        fetchPatientChiefComplaint();
        // Optionally refresh the data or update state
      } else {
        throw new Error(res?.data?.message || 'Failed to delete pain complaint.');
      }
    } catch (error) {
      console.error('Error deleting pain chief complaint:', error);
      toast.error(error?.message || 'Something went wrong.');
    }
  };

  return (
    <Box className="paticularSection">
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid container spacing={2} height="inherit">
          <Grid item container spacing={2} xs={10} sm={10} md={9} px={2} height="inherit" style={{ minWidth: '600px' }}>
            <Grid item xs={7} height="inherit">
              {selectedMenu !== 'All' && (
                <h2 className="popupHead" style={{ marginBottom: '10px' }}>
                  Chief Complaint
                </h2>
              )}
              <hr />

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

              <Button style={{ display: 'inline-block' }} onClick={addChiefComplaintHandler} className="button-87">
                Add New
              </Button>

              {allChiefComplaint?.length > 0 && (
                <IconButton style={{ marginLeft: '2px' }} title="Edit Chief Complaint" onClick={editChiefComplaintHandler}>
                  <Edit fontSize="small" style={{ color: 'blue' }} />
                </IconButton>
              )}

              {allChiefComplaint?.length > 0 && (
                <IconButton style={{ marginLeft: '2px' }} title="Delete Chief Complaint" onClick={deleteChiefComplaintHandler}>
                  <Delete fontSize="small" style={{ color: 'red' }} />
                </IconButton>
              )}
              {allChiefComplaint?.length === 0 ? (
                <h4 className="noFoundOPd">Chief Complaint Not Available, Please Add...</h4>
              ) : (
                <>
                  {showChiefComplaint?.length > 0 ? (
                    <>
                      <Box className="selectedCategory">
                        {showChiefComplaint.map((val, ind) => {
                          let pre = false;

                          const ids = new Set(patientChiefComplaint?.flatMap((d) => d.chiefComplaint?.map((d) => d._id)));
                          if (ids.has(val?._id) || openChiefComplaintData?._id === val?._id) {
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
                              onDelete={() => handleSingleChiefDelete(val._id)}
                              deleteIcon={
                                <DeleteIcon
                                  sx={{
                                    color: pre ? 'primary ' : 'default'
                                  }}
                                />
                              }
                              className={
                                val.chiefComplaint === chiefComplaint
                                  ? 'selectProblem_selected'
                                  : pre
                                    ? 'selectProblemActive'
                                    : 'selectProblem'
                              }
                              label={val.chiefComplaint}
                              onClick={() => {
                                setOpenPainDetails(false);
                                setOpenAddSymptoms(false);
                                setOpenAddDescription(false);
                                setOpenAddSince(false);
                                setOpenAddTreatment(false);
                                setOpenAddLocation(false);
                                setOpenAddChiefComplaintDetail(false);
                                setChiefComplaint(val.chiefComplaint);
                                setSymptoms(val.symptoms);
                                let e = [];
                                val.symptoms.forEach(() => {
                                  e.push({ with: '' });
                                });
                                setErr(e);
                                setIsLocation(val.isLocation);
                                setIsScale(val.isScale);

                                setDescription(val.description);
                                let ed = [];
                                val.description.forEach(() => {
                                  ed.push({ data: '' });
                                });
                                setErrDes(ed);

                                setSince(val.since);
                                let es = [];
                                val.since.forEach(() => {
                                  es.push({ data: '' });
                                });
                                setErrSince(es);
                                setTreatment(val.treatment);
                                let et = [];
                                val.treatment.forEach(() => {
                                  et.push({ data: '' });
                                });
                                setErrTreat(et);
                                setLocation(val.Location);
                                let eL = [];
                                val.Location.forEach(() => {
                                  eL.push({ data: '' });
                                });
                                setErrLocation(eL);

                                let dta = {
                                  notes: '',
                                  symptoms: [],
                                  description: [],
                                  since: [],
                                  treatment: [],
                                  Location: [],
                                  isLocation: val.isLocation,
                                  isScale: val.isScale,
                                  painScore: '',
                                  chiefComplaint: val.chiefComplaint,
                                  _id: val._id
                                };
                                patientChiefComplaint.forEach((pC) => {
                                  if (pC.chiefComplaint === val.chiefComplaint) {
                                    dta = pC;
                                  }
                                });
                                setOpenChiefComplaintData(dta);
                                setOpenChiefComplaintDetail(true);
                                setOpenEditDataDetail(false);
                                setOpenEditHandler(false);
                                setOpenDeleteHandler(false);
                              }}
                            />
                          );
                        })}
                      </Box>
                    </>
                  ) : (
                    <h4 className="noFoundOPd">Not Found</h4>
                  )}
                </>
              )}
              <Box className="selectedCategory">
                {showPainChiefComplaint &&
                  showPainChiefComplaint?.map((val, ind) => {
                    let pre = false;
                    const ids = new Set(patientPainChiefComplaint?.flatMap((d) => d.chiefComplaint?.map((d) => d._id)));

                    if (ids?.has(val?._id) || openPainChiefComplaintData?._id === val?._id) {
                      pre = true;
                    }

                    return (
                      <Chip
                        key={ind}
                        // sx={{
                        //   marginRight: '10px',
                        //   backgroundColor: pre ? '#126078' : '#f0f0f0',
                        //   color: pre ? '#fff' : '#333',
                        //   border: pre ? '2px solid #1565C0' : '1px solid #ccc',
                        //   fontWeight: pre ? 'bold' : 'normal',
                        //   mt: 1
                        // }}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: pre ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          mt: 1
                        }}
                        color={pre ? 'primary' : 'default'}
                        variant={pre ? 'default' : 'outlined'}
                        onDelete={() => handleSinglePainDelete(val._id)}
                        deleteIcon={<DeleteIcon sx={{ color: pre ? '#fff !important' : '#333' }} />}
                        label={val.chiefComplaint}
                        onClick={() => handleSetChiefComplaint(val)}
                      />
                    );
                  })}
              </Box>
            </Grid>

            <Dialog
              open={openEditHandler}
              maxWidth="md" // xs, sm, md, lg, xl
            >
              {/* edit chief complaint  */}
              {openEditHandler && (
                <Box width={'100%'} style={{ padding: '20px' }}>
                  <h4>Edit Chief Complaint</h4>
                  <Box className="selectedCategory " width={'100%'} style={{ marginTop: '7px' }}>
                    {allChiefComplaint.map((val, ind) => {
                      return (
                        <Chip
                          style={{ marginRight: '10px', marginBottom: '10px' }}
                          key={ind}
                          className="selectProblem"
                          color="secondary"
                          variant="outlined"
                          sx={{ borderWidth: 2, borderStyle: 'solid', borderColor: 'primary.main' }}
                          label={val.chiefComplaint}
                          onClick={() => {
                            setOpenEditHandler(false);
                            setOpenEditDataDetail(true);
                            setOpenChiefComplaintDetail(false);
                            setChiefComplaint(val.chiefComplaint);
                            setOpenAddChiefComplaintDetail(false);
                            setOpenDeleteHandler(false);
                            setEditId(val._id);

                            if (val.isLocation) {
                              setErrLocation([{ data: '' }]);
                              setInputValLocation([{ data: '' }]);
                            } else {
                              setErrLocation([]);
                              setInputValLocation([]);
                            }
                            setIsLocation(val.isLocation);
                            setIsScale(val.isScale);

                            setInputValLocation(val.Location);
                            let sl = [];
                            val.Location.forEach((aa) => {
                              sl.push({ data: '' });
                            });
                            setErrLocation(sl);

                            setInputValDes(val.description);
                            let sld = [];
                            val.description.forEach((aa) => {
                              sld.push({ data: '' });
                            });
                            setErrDes(sld);

                            setInputValTreat(val.treatment);
                            let slt = [];
                            val.treatment.forEach((aa) => {
                              slt.push({ data: '' });
                            });
                            setErrTreat(slt);

                            setInputValSince(val.since);
                            let sls = [];
                            val.since.forEach((aa) => {
                              sls.push({ data: '' });
                            });
                            setErrSince(sls);

                            setInputVal(val.symptoms);
                            let slsy = [];
                            val.symptoms.forEach((aa) => {
                              slsy.push({ with: '' });
                            });
                            setErr(slsy);
                          }}
                        />
                      );
                    })}
                  </Box>
                  <Button variant="contained" color="primary" onClick={()=>setOpenEditHandler(false)}>
                    Cancel
                  </Button>
                </Box>
              )}
            </Dialog>
            <Dialog
              open={openEditDataDetail}
              fullWidth
              maxWidth="sm" // xs, sm, md, lg, xl
            >
              <DialogContent style={{ display: 'flex', justifyContent: 'center', padding:'20px' }} >
          {/* update chief complaint  */}
          {openEditDataDetail && (
                <Box sx={{width:'100%', }} >
                  <h4>Update Chief Complaint</h4>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="chiefComplaint"
                    label="Chief Complaint"
                    value={chiefComplaint}
                    onChange={handleChangeChiefComplaint}
                    error={error !== '' ? true : false}
                    helperText={error}
                    style={{ marginTop: '10px' }}
                  />

                  <FormGroup>
                    <FormControlLabel
                      style={{ marginTop: '10px' }}
                      control={
                        <Checkbox
                          checked={isLocation}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setErrLocation([{ data: '' }]);
                              setInputValLocation([{ data: '' }]);
                            } else {
                              setErrLocation([]);
                              setInputValLocation([]);
                            }
                            setIsLocation(e.target.checked);
                          }}
                        />
                      }
                      label="Show Location"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isScale}
                          onChange={(e) => {
                            setIsScale(e.target.checked);
                          }}
                        />
                      }
                      label="Show Scale"
                    />
                  </FormGroup>

                  {isLocation && (
                    <>
                      <h5 style={{ marginTop: '15px', fontWeight: 'normal' }}>Location:</h5>

                      <Box >
                        {inputValLocation.map((data, index) => {
                          return (
                            <Grid item  key={index} >
                              <Grid item >
                                <TextField
                                fullWidth
                                  variant="outlined"
                                  name="data"
                                  value={data.data}
                                  margin="dense"
                                  onChange={(evnt) => handleDataLocation(index, evnt)}
                                  error={errLocation[index].data !== '' ? true : false}
                                  helperText={errLocation[index].data}
                                />
                              </Grid>
                              {inputValLocation.length !== 1 && (
                                <Grid item xs={1}>
                                  <IconButton
                                    title="Remove Location"
                                    onClick={() => {
                                      removeInputValLocation(index);
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
                        <IconButton variant="contained" onClick={addInputValLocation} title="Add Location" className="addBox">
                          <AddBox />
                        </IconButton>
                      </Box>
                    </>
                  )}

                  <h5 style={{ marginTop: '15px', fontWeight: 'normal' }}>with Symptoms:</h5>

                  <Box >
                    {inputVal.map((data, index) => {
                      return (
                        <Grid item  key={index} >
                          <Grid item >
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="with"
                              value={data.with}
                              margin="dense"
                              onChange={(evnt) => handleData(index, evnt)}
                              error={err[index].with !== '' ? true : false}
                              helperText={err[index].with}
                            />
                          </Grid>
                          {inputVal.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Symptoms"
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
                    <IconButton variant="contained" onClick={addInputVal} title="Add Symptoms" className="addBox">
                      <AddBox />
                    </IconButton>
                  </Box>

                  <h5 style={{ marginTop: '15px', fontWeight: 'normal' }}>Description:</h5>

                  <Box >
                    {inputValDes.map((data, index) => {
                      return (
                        <Grid item  key={index} >
                          <Grid item >
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataDes(index, evnt)}
                              error={errDes[index].data !== '' ? true : false}
                              helperText={errDes[index].data}
                            />
                          </Grid>
                          {inputValDes.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Description"
                                onClick={() => {
                                  removeInputValDes(index);
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
                    <IconButton variant="contained" onClick={addInputValDes} title="Add Description" className="addBox">
                      <AddBox />
                    </IconButton>
                  </Box>

                  <h5 style={{ marginTop: '15px', fontWeight: 'normal' }}>Since:</h5>

                  <Box >
                    {inputValSince.map((data, index) => {
                      return (
                        <Grid item key={index} >
                          <Grid item >
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataSince(index, evnt)}
                              error={errSince[index].data !== '' ? true : false}
                              helperText={errSince[index].data}
                            />
                          </Grid>
                          {inputValSince.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Since"
                                onClick={() => {
                                  removeInputValSince(index);
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
                    <IconButton variant="contained" onClick={addInputValSince} title="Add Since" className="addBox">
                      <AddBox />
                    </IconButton>
                  </Box>

                  <h5 style={{ marginTop: '15px', fontWeight: 'normal' }}>Treatment:</h5>

                  <Box >
                    {inputValTreat.map((data, index) => {
                      return (
                        <Grid item key={index} >
                          <Grid item >
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataTreat(index, evnt)}
                              error={errTreat[index].data !== '' ? true : false}
                              helperText={errTreat[index].data}
                            />
                          </Grid>
                          {inputValTreat.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Treatment"
                                onClick={() => {
                                  removeInputValTreat(index);
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
                    <IconButton variant="contained" onClick={addInputValTreat} title="Add Treatment" className="addBox">
                      <AddBox />
                    </IconButton>
                  </Box>

                  <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveUpdateChiefComplaint}>
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    className="addBtn"
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                    onClick={() => setOpenEditDataDetail(false)}
                  >
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
              {/* delete complaints */}
              {openDeleteHandler && (
                <Box width={'100%'} style={{ padding: '20px' }}>
                  <Box className="selectedPtCategory">
                    <h4>Delete Chief Complaint</h4>
                    <Box className="selectedCategory">
                      {allChiefComplaint.map((val, ind) => {
                        let exist = false;
                        deleteIds.forEach((v) => {
                          if (val._id === v) {
                            exist = true;
                          }
                        });
                        return (
                          <Chip
                            key={ind}
                            // style={{ padding: '10px', marginLeft:'10px', marginTop:"10px", border:'2px' }}
                            color="secondary"
                            variant="outlined"
                            sx={{ borderWidth: 2, borderStyle: 'solid', borderColor: 'secondary.main', p: 1, mr: 1, mt: 1 }}
                            className={exist ? 'selectProblemDelete' : 'selectProblem'}
                            label={val.chiefComplaint}
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
                            deleteIcon={exist ? <Close style={{ color: 'primary' }} /> : undefined}
                          />
                        );
                      })}
                    </Box>

                    <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeleteChiefComplaint}>
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      className="addBtn"
                      style={{ marginTop: '10px', marginLeft: '10px' }}
                      onClick={() => setOpenDeleteHandler(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </Dialog>

            {/* // chief complaint dialogue  */}
            <Dialog open={openChiefDialogue} fullWidth>
              <DialogContent style={{ display: 'flex', justifyContent: 'center' }}>
                {/* add chief complaint detail */}
                 <Box width={'100%'}>
                    <h4>Add Chief Complaint</h4>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="chiefComplaint"
                      label="Chief Complaint"
                      value={chiefComplaint}
                      onChange={handleChangeChiefComplaint}
                      error={error !== '' ? true : false}
                      helperText={error}
                      style={{ marginTop: '10px' }}
                    />
                    {chiefComplaint?.toLowerCase()?.trim() === 'pain' ? (
                      <>
                        <Box container>
                          <PainScale
                            painLevel={painLevel}
                            setPainLevel={setPainLevel}
                            setOpenChiefComplaintData={setOpenChiefComplaintData}
                          />
                          <PainChips
                            painScore={painLevel}
                            chiefComplaint={chiefComplaint}
                            painType={openChiefComplaintData?.painType}
                            departmentId={departmentId}
                            getChiefComplaint={getChiefComplaint}
                            setOpenChiefDialogue={setOpenChiefDialogue}
                          />
                          {/* <Grid item xs={12}>
                    <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handlePainSave}>
                      Save
                    </Button>
                  </Grid> */}
                        </Box>
                      </>
                    ) : (
                      <Card style={{ padding: '1rem', width: '100%' }}>
                        <FormGroup>
                          <FormControlLabel
                            style={{ marginTop: '10px' }}
                            control={
                              <Checkbox
                                checked={isLocation}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setErrLocation([{ data: '' }]);
                                    setInputValLocation([{ data: '' }]);
                                  } else {
                                    setErrLocation([]);
                                    setInputValLocation([]);
                                  }
                                  setIsLocation(e.target.checked);
                                }}
                              />
                            }
                            label="Show Location"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isScale}
                                onChange={(e) => {
                                  setIsScale(e.target.checked);
                                }}
                              />
                            }
                            label="Show Scale"
                          />
                        </FormGroup>

                        {isLocation && (
                          <>
                            <h5 style={{ marginTop: '15px', fontWeight: 'normal' }}>Location:</h5>

                            <Box className="withChiefC">
                              {inputValLocation.map((data, index) => {
                                return (
                                  <Grid item xs={12} md={10} key={index} className="withChiefC">
                                    <Grid item xs={12}>
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="data"
                                        value={data.data}
                                        margin="dense"
                                        onChange={(evnt) => handleDataLocation(index, evnt)}
                                        error={errLocation[index].data !== '' ? true : false}
                                        helperText={errLocation[index].data}
                                      />
                                    </Grid>
                                    {inputValLocation.length !== 1 && (
                                      <Grid item xs={1}>
                                        <IconButton
                                          title="Remove Location"
                                          onClick={() => {
                                            removeInputValLocation(index);
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
                              <IconButton variant="contained" onClick={addInputValLocation} title="Add Location" className="addBox">
                                <AddBox />
                              </IconButton>
                            </Box>
                          </>
                        )}

                        <h5 style={{ marginTop: '15px', fontWeight: 'normal' }}>with Symptoms:</h5>

                        <Box className="withChiefC">
                          {inputVal.map((data, index) => {
                            return (
                              <Grid item xs={12} md={10} key={index} className="withChiefC">
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="with"
                                    value={data.with}
                                    margin="dense"
                                    onChange={(evnt) => handleData(index, evnt)}
                                    error={err[index].with !== '' ? true : false}
                                    helperText={err[index].with}
                                  />
                                </Grid>
                                {inputVal.length !== 1 && (
                                  <Grid item xs={1}>
                                    <IconButton
                                      title="Remove Symptoms"
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
                          <IconButton variant="contained" onClick={addInputVal} title="Add Symptoms" className="addBox">
                            <AddBox />
                          </IconButton>
                        </Box>

                        <h5 style={{ marginTop: '15px', fontWeight: 'normal' }}>Description:</h5>

                        <Box className="withChiefC">
                          {inputValDes.map((data, index) => {
                            return (
                              <Grid item xs={12} md={10} key={index} className="withChiefC">
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="data"
                                    value={data.data}
                                    margin="dense"
                                    onChange={(evnt) => handleDataDes(index, evnt)}
                                    error={errDes[index].data !== '' ? true : false}
                                    helperText={errDes[index].data}
                                  />
                                </Grid>
                                {inputValDes.length !== 1 && (
                                  <Grid item xs={1}>
                                    <IconButton
                                      title="Remove Description"
                                      onClick={() => {
                                        removeInputValDes(index);
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
                          <IconButton variant="contained" onClick={addInputValDes} title="Add Description" className="addBox">
                            <AddBox />
                          </IconButton>
                        </Box>

                        <h5 style={{ marginTop: '15px', fontWeight: 'normal' }}>Since:</h5>

                        <Box className="withChiefC">
                          {inputValSince.map((data, index) => {
                            return (
                              <Grid item xs={12} md={10} key={index} className="withChiefC">
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="data"
                                    value={data.data}
                                    margin="dense"
                                    onChange={(evnt) => handleDataSince(index, evnt)}
                                    error={errSince[index].data !== '' ? true : false}
                                    helperText={errSince[index].data}
                                  />
                                </Grid>
                                {inputValSince.length !== 1 && (
                                  <Grid item xs={1}>
                                    <IconButton
                                      title="Remove Since"
                                      onClick={() => {
                                        removeInputValSince(index);
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
                          <IconButton variant="contained" onClick={addInputValSince} title="Add Since" className="addBox">
                            <AddBox />
                          </IconButton>
                        </Box>

                        <h5 style={{ marginTop: '15px', fontWeight: 'normal' }}>Treatment:</h5>

                        <Box className="withChiefC">
                          {inputValTreat.map((data, index) => {
                            return (
                              <Grid item xs={12} md={10} key={index} className="withChiefC">
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="data"
                                    value={data.data}
                                    margin="dense"
                                    onChange={(evnt) => handleDataTreat(index, evnt)}
                                    error={errTreat[index].data !== '' ? true : false}
                                    helperText={errTreat[index].data}
                                  />
                                </Grid>
                                {inputValTreat.length !== 1 && (
                                  <Grid item xs={1}>
                                    <IconButton
                                      title="Remove Treatment"
                                      onClick={() => {
                                        removeInputValTreat(index);
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
                          <IconButton variant="contained" onClick={addInputValTreat} title="Add Treatment" className="addBox">
                            <AddBox />
                          </IconButton>
                        </Box>

                        <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveAddChiefComplaint}>
                          Save
                        </Button>
                      </Card>
                    )}
                  </Box>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={() => setOpenChiefDialogue(false)} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
            {openAddSymptoms && (
              <Grid item xs={5} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Symptoms for {openChiefComplaintData.chiefComplaint}</h4>
                  <Box className="withChiefC">
                    {inputVal.map((data, index) => {
                      return (
                        <Grid item xs={12} md={6} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="with"
                              value={data.with}
                              margin="dense"
                              onChange={(evnt) => handleData(index, evnt)}
                              error={err[index].with !== '' ? true : false}
                              helperText={err[index].with}
                            />
                          </Grid>
                          {inputVal.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Symptoms"
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
                  </Box>
                  <IconButton variant="contained" onClick={addInputVal} title="Add Releving Factors" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handleSubmitSymptoms}>
                      Submit
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}

            {openAddDescription && (
              <Grid item xs={5} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Description for {openChiefComplaintData.chiefComplaint}</h4>
                  <Box className="withChiefC">
                    {inputValDes.map((data, index) => {
                      return (
                        <Grid item xs={12} md={6} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataDes(index, evnt)}
                              error={errDes[index].data !== '' ? true : false}
                              helperText={errDes[index].data}
                            />
                          </Grid>
                          {inputValDes.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Description"
                                onClick={() => {
                                  removeInputValDes(index);
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
                  <IconButton variant="contained" onClick={addInputValDes} title="Add Description" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handleSubmitDescription}>
                      Submit
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}

            {/* ADD RELEVING FACTORS */}

            {openRelevingFactors && (
              <Grid item xs={5} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Relieving Factors for {openPainChiefComplaintData.chiefComplaint}</h4>
                  <Box className="withChiefC">
                    {inputValDes.map((data, index) => {
                      return (
                        <Grid item xs={12} md={6} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataDes(index, evnt)}
                              error={errDes[index].data !== '' ? true : false}
                              helperText={errDes[index].data}
                            />
                          </Grid>
                          {inputValDes.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove relievingFactors"
                                onClick={() => {
                                  removeInputValDes(index);
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
                  <IconButton variant="contained" onClick={addInputValDes} title="Add Description" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handleRelevingFactor}>
                      Submit
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}
            {/* Add Quality */}
            {openQuality && (
              <Grid item xs={5} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Quality for {openPainChiefComplaintData.chiefComplaint}</h4>
                  <Box className="withChiefC">
                    {inputValDes.map((data, index) => {
                      return (
                        <Grid item xs={12} md={6} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataDes(index, evnt)}
                              error={errDes[index].data !== '' ? true : false}
                              helperText={errDes[index].data}
                            />
                          </Grid>
                          {inputValDes.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Quality"
                                onClick={() => {
                                  removeInputValDes(index);
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
                  <IconButton variant="contained" onClick={addInputValDes} title="Add Description" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handlePainQuality}>
                      Submit
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}

            {openAddTreatment && (
              <Grid item xs={5} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Treatment for {openChiefComplaintData.chiefComplaint}</h4>
                  <Box className="withChiefC">
                    {inputValTreat.map((data, index) => {
                      return (
                        <Grid item xs={12} md={6} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataTreat(index, evnt)}
                              error={errTreat[index].data !== '' ? true : false}
                              helperText={errTreat[index].data}
                            />
                          </Grid>
                          {inputValTreat.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Treatment"
                                onClick={() => {
                                  removeInputValTreat(index);
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
                  <IconButton variant="contained" onClick={addInputValTreat} title="Add Treatment" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handleSubmitTreatment}>
                      Submit
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}

<Dialog
  open={openAddSince}
  maxWidth="md" // xs, sm, md, lg, xl
>
  {/* add since for */}
  <DialogContent>
  {openAddSince && (
              <Box >
                <Box className="selectedPtCategory">
                  <h4>Add Since for {openChiefComplaintData.chiefComplaint}</h4>
                  <Box >
                    {inputValSince.map((data, index) => {
                      return (
                        <Grid >
                          <Grid item >
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataSince(index, evnt)}
                              error={errSince[index].data !== '' ? true : false}
                              helperText={errSince[index].data}
                            />
                          </Grid>
                          {inputValSince.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Since"
                                onClick={() => {
                                  removeInputValSince(index);
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
                  <IconButton variant="contained" onClick={addInputValSince} title="Add Since" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handleSubmitSince}>
                      Submit
                    </Button>
                    <Button className="addBtn" onClick={() => setOpenAddSince(false)} style={{ marginLeft: '10px' }}> 
                      Cancel
                    </Button>
                  </div>
                </Box>
              </Box>
            )}
        </DialogContent>
</Dialog>


            
            {painSince && (
              <Grid item xs={5} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Since for {openChiefComplaintData.chiefComplaint}</h4>
                  <Box className="withChiefC">
                    {inputValSince.map((data, index) => {
                      return (
                        <Grid item xs={12} md={6} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataSince(index, evnt)}
                              error={errSince[index].data !== '' ? true : false}
                              helperText={errSince[index].data}
                            />
                          </Grid>
                          {inputValSince.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Since"
                                onClick={() => {
                                  removeInputValSince(index);
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
                  <IconButton variant="contained" onClick={addInputValSince} title="Add Since" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handlePainSince}>
                      Submit
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}

            {openAddLocation && (
              <Grid item xs={5} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Location for {openChiefComplaintData.chiefComplaint}</h4>
                  <Box className="withChiefC">
                    {inputValLocation.map((data, index) => {
                      return (
                        <Grid item xs={12} md={6} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataLocation(index, evnt)}
                              error={errLocation[index].data !== '' ? true : false}
                              helperText={errLocation[index].data}
                            />
                          </Grid>
                          {inputValLocation.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Location"
                                onClick={() => {
                                  removeInputValLocation(index);
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
                  <IconButton variant="contained" onClick={addInputValLocation} title="Add Location" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handleSubmitLocation}>
                      Submit
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}
            {openPainLocation && (
              <Grid item xs={5} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Location for {openPainChiefComplaintData.chiefComplaint}</h4>
                  <Box className="withChiefC">
                    {inputValLocation.map((data, index) => {
                      return (
                        <Grid item xs={12} md={6} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataLocation(index, evnt)}
                              error={errLocation[index].data !== '' ? true : false}
                              helperText={errLocation[index].data}
                            />
                          </Grid>
                          {inputValLocation.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Location"
                                onClick={() => {
                                  removeInputValLocation(index);
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
                  <IconButton variant="contained" onClick={addInputValLocation} title="Add Location" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handlePainLocation}>
                      Submit
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}
            {openNatureOfPain && (
              <Grid item xs={5} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Nature of Pain for {openPainChiefComplaintData.chiefComplaint}</h4>
                  <Box className="withChiefC">
                    {inputValLocation.map((data, index) => {
                      return (
                        <Grid item xs={12} md={6} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataLocation(index, evnt)}
                              error={errLocation[index].data !== '' ? true : false}
                              helperText={errLocation[index].data}
                            />
                          </Grid>
                          {inputValLocation.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove Location"
                                onClick={() => {
                                  removeInputValLocation(index);
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
                  <IconButton variant="contained" onClick={addInputValLocation} title="Add Location" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handleNatureOfPain}>
                      Submit
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}
            {openaggravatingFactors && (
              <Grid item xs={5} className="ptData" style={{ height: selectedMenu !== 'All' && '100%' }}>
                <Box className="selectedPtCategory">
                  <h4>Add Aggravating Factors for {openPainChiefComplaintData.chiefComplaint}</h4>
                  <Box className="withChiefC">
                    {inputValLocation.map((data, index) => {
                      return (
                        <Grid item xs={12} md={6} key={index} className="withChiefC">
                          <Grid item xs={10}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              name="data"
                              value={data.data}
                              margin="dense"
                              onChange={(evnt) => handleDataLocation(index, evnt)}
                              error={errLocation[index].data !== '' ? true : false}
                              helperText={errLocation[index].data}
                            />
                          </Grid>
                          {inputValLocation.length !== 1 && (
                            <Grid item xs={1}>
                              <IconButton
                                title="Remove aggravatingFactors"
                                onClick={() => {
                                  removeInputValLocation(index);
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
                  <IconButton variant="contained" onClick={addInputValLocation} title="Add Location" className="addBox">
                    <AddBox />
                  </IconButton>

                  <div>
                    <Button className="addBtn" onClick={handleAggrivatingFactors}>
                      Submit
                    </Button>
                  </div>
                </Box>
              </Grid>
            )}

            <Dialog
              open={openChiefComplaintDetail}
              maxWidth="md" // xs, sm, md, lg, xl
            >
              {/* open chief complaint detail */}
              {openChiefComplaintDetail && (
                <Box>
                  <Box sx={{ p: 3, ml: 1 }}>
                    <Grid item xs={12}>
                      <h4 style={{ color: 'blue' }}>{chiefComplaint} </h4>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        name="notes"
                        label="Notes"
                        value={openChiefComplaintData.notes}
                        onChange={(e) => {
                          setOpenChiefComplaintData((prev) => {
                            return { ...prev, notes: e.target.value };
                          });
                        }}
                        multiline
                        rows={2}
                      />
                    </Grid>

                    {openChiefComplaintData.isScale && (
                      <Grid item xs={12}>
                        <PainScale
                          painLevel={painLevel}
                          setPainLevel={setPainLevel}
                          setOpenChiefComplaintData={setOpenChiefComplaintData}
                        />
                      </Grid>
                    )}

                    {openChiefComplaintData.isLocation && (
                      <Grid item xs={12}>
                        <Box className="withChiefC withComplaintS">
                          <p
                            className="labelChief"
                            style={{
                              position: 'sticky',
                              top: '0',
                              background: 'white',
                              zIndex: '10',
                              padding: '0 5px 5px 0'
                            }}
                          >
                            Location:
                          </p>

                          {Location.length > 0 &&
                            Location.map((v, inx) => {
                              let pre = false;
                              openChiefComplaintData.Location.length > 0 &&
                                openChiefComplaintData.Location.forEach((o) => {
                                  if (o.data === v.data) {
                                    pre = true;
                                  }
                                });
                              return (
                                <Chip
                                  sx={{
                                    borderWidth: 2, // Increase border thickness
                                    borderColor: pre ? 'primary.main' : 'secondary.main',
                                    borderStyle: 'solid',
                                    m: 1
                                  }}
                                  variant={pre ? 'default' : 'outlined'}
                                  color={pre ? 'primary' : 'default'}
                                  key={inx}
                                  className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                  label={v.data}
                                  onClick={() => {
                                    let sM = [...openChiefComplaintData.Location, v];
                                    sM = [...new Map(sM.map((item) => [item['data'], item])).values()];
                                    setOpenChiefComplaintData((prev) => {
                                      return { ...prev, Location: sM };
                                    });
                                  }}
                                  onDelete={
                                    pre
                                      ? () => {
                                          let medPro = [];
                                          openChiefComplaintData.Location.forEach((vM) => {
                                            if (vM.data !== v.data) {
                                              medPro.push(vM);
                                            }
                                          });
                                          setOpenChiefComplaintData((prev) => {
                                            return { ...prev, Location: medPro };
                                          });
                                        }
                                      : undefined
                                  }
                                  deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                                />
                              );
                            })}
                          <Button onClick={addLocationHandler} className="selectProblemWith chiefBtn">
                            {inputValLocation.length > 0 ? '+ Add More' : '+ Add'}
                          </Button>
                        </Box>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Box className="withChiefC withComplaintS">
                        <p
                          className="labelChief"
                          style={{
                            position: 'sticky',
                            top: '0',
                            background: 'white',
                            zIndex: '10',
                            padding: '0 5px 5px 0'
                          }}
                        >
                          Description:
                        </p>

                        {description.length > 0 &&
                          description.map((v, inx) => {
                            let pre = false;
                            openChiefComplaintData.description.length > 0 &&
                              openChiefComplaintData.description.forEach((o) => {
                                if (o.data === v.data) {
                                  pre = true;
                                }
                              });
                            return (
                              <Chip
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: pre ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  my: 1,
                                 mr:1
                                }}
                                variant={pre ? 'default' : 'outlined'}
                                color={pre ? 'primary' : 'default'}
                                key={inx}
                                className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={v.data}
                                onClick={() => {
                                  let sM = [...openChiefComplaintData.description, v];
                                  sM = [...new Map(sM.map((item) => [item['data'], item])).values()];
                                  setOpenChiefComplaintData((prev) => {
                                    return { ...prev, description: sM };
                                  });
                                }}
                                onDelete={
                                  pre
                                    ? () => {
                                        let medPro = [];
                                        openChiefComplaintData.description.forEach((vM) => {
                                          if (vM.data !== v.data) {
                                            medPro.push(vM);
                                          }
                                        });
                                        setOpenChiefComplaintData((prev) => {
                                          return { ...prev, description: medPro };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        <Button onClick={addDescriptionHandler} className="selectProblemWith chiefBtn">
                          {inputValDes.length > 0 ? '+ Add More' : '+ Add'}
                        </Button>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box className="withChiefC withComplaintS">
                        <p
                          className="labelChief"
                          style={{
                            position: 'sticky',
                            top: '0',
                            background: 'white',
                            zIndex: '10',
                            padding: '0 5px 5px 0'
                          }}
                        >
                          Since:
                        </p>

                        {since.length > 0 &&
                          since.map((v, inx) => {
                            let pre = false;
                            openChiefComplaintData.since.length > 0 &&
                              openChiefComplaintData.since.forEach((o) => {
                                if (o.data === v.data) {
                                  pre = true;
                                }
                              });
                            return (
                              <Chip
                                key={inx}
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: pre ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1,
                                  my: 1
                                }}
                                variant={pre ? 'default' : 'outlined'}
                                color={pre ? 'primary' : 'default'}
                                className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={v.data}
                                onClick={() => {
                                  let sM = [...openChiefComplaintData.since, v];
                                  sM = [...new Map(sM.map((item) => [item['data'], item])).values()];
                                  setOpenChiefComplaintData((prev) => {
                                    return { ...prev, since: sM };
                                  });
                                }}
                                onDelete={
                                  pre
                                    ? () => {
                                        let medPro = [];
                                        openChiefComplaintData.since.forEach((vM) => {
                                          if (vM.data !== v.data) {
                                            medPro.push(vM);
                                          }
                                        });
                                        setOpenChiefComplaintData((prev) => {
                                          return { ...prev, since: medPro };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        <Button onClick={addSinceHandler} className="selectProblemWith chiefBtn">
                          {inputValSince.length > 0 ? '+ Add More' : '+ Add'}
                        </Button>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box className="withChiefC withComplaintS">
                        <p
                          className="labelChief"
                          style={{
                            position: 'sticky',
                            top: '0',
                            background: 'white',
                            zIndex: '10',
                            padding: '0 5px 5px 0'
                          }}
                        >
                          Treatment:
                        </p>

                        {treatment.length > 0 &&
                          treatment.map((v, inx) => {
                            let pre = false;
                            openChiefComplaintData.treatment.length > 0 &&
                              openChiefComplaintData.treatment.forEach((o) => {
                                if (o.data === v.data) {
                                  pre = true;
                                }
                              });
                            return (
                              <Chip
                                key={inx}
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: pre ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1,
                                  my: 1
                                }}
                                variant={pre ? 'default' : 'outlined'}
                                color={pre ? 'primary' : 'default'}
                                className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={v.data}
                                onClick={() => {
                                  let sM = [...openChiefComplaintData.treatment, v];
                                  sM = [...new Map(sM.map((item) => [item['data'], item])).values()];
                                  setOpenChiefComplaintData((prev) => {
                                    return { ...prev, treatment: sM };
                                  });
                                }}
                                onDelete={
                                  pre
                                    ? () => {
                                        let medPro = [];
                                        openChiefComplaintData.treatment.forEach((vM) => {
                                          if (vM.data !== v.data) {
                                            medPro.push(vM);
                                          }
                                        });
                                        setOpenChiefComplaintData((prev) => {
                                          return { ...prev, treatment: medPro };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        <Button onClick={addTreatmentHandler} className="selectProblemWith chiefBtn">
                          {inputValTreat.length > 0 ? '+ Add More' : '+ Add'}
                        </Button>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box className="withChiefC withComplaintS">
                        <p
                          className="labelChief"
                          style={{
                            position: 'sticky',
                            top: '0',
                            background: 'white',
                            zIndex: '10',
                            padding: '0 5px 5px 0'
                          }}
                        >
                          With:
                        </p>

                        {symptoms.length > 0 &&
                          symptoms.map((v, inx) => {
                            let pre = false;
                            openChiefComplaintData.symptoms.length > 0 &&
                              openChiefComplaintData.symptoms.forEach((o) => {
                                if (o.with === v.with) {
                                  pre = true;
                                }
                              });
                            return (
                              <Chip
                                key={inx}
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: pre ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1,
                                  my:1
                                }}
                                variant={pre ? 'default' : 'outlined'}
                                color={pre ? 'primary' : 'default'}
                                className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={v.with}
                                onClick={() => {
                                  let sM = [...openChiefComplaintData.symptoms, v];
                                  sM = [...new Map(sM.map((item) => [item['with'], item])).values()];
                                  setOpenChiefComplaintData((prev) => {
                                    return { ...prev, symptoms: sM };
                                  });
                                }}
                                onDelete={
                                  pre
                                    ? () => {
                                        let medPro = [];
                                        openChiefComplaintData.symptoms.forEach((vM) => {
                                          if (vM.with !== v.with) {
                                            medPro.push(vM);
                                          }
                                        });
                                        setOpenChiefComplaintData((prev) => {
                                          return { ...prev, symptoms: medPro };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        <Button onClick={addSymptomsHandler} className="selectProblemWith chiefBtn">
                          {inputVal.length > 0 ? '+ Add More' : '+ Add'}
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveChiefComplaint}>
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        className="addBtn"
                        style={{ marginTop: '10px', marginLeft: '10px' }}
                        onClick={() => setOpenChiefComplaintDetail(false)}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Box>
                </Box>
              )}
            </Dialog>

            <Dialog
              open={openPainDetails}
              maxWidth="md" // xs, sm, md, lg, xl
            >
              {/* pain details */}
              {openPainDetails && (
                <Box>
                  <Box sx={{ p: 3, ml: 1 }}>
                    <Grid>
                      <h4 style={{ color: 'blue' }}>{chiefComplaint} </h4>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="notes"
                        label="Notes"
                        value={openPainChiefComplaintData?.notes}
                        onChange={(e) => {
                          setOpenPainChiefComplaintData((prev) => {
                            return { ...prev, notes: e.target.value };
                          });
                        }}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <PainScale
                        painLevel={painLevel}
                        setPainLevel={setPainLevel}
                        setOpenChiefComplaintData={setOpenPainChiefComplaintData}
                      />
                    </Grid>
                    {/* LOCATION PAIN*/}
                    <Grid item xs={12} sx={{ my: 1 }}>
                      <Box className="withChiefC withComplaintS">
                        <p
                          className="labelChief"
                          style={{
                            position: 'sticky',
                            top: '0',
                            background: 'white',
                            zIndex: '10',
                            padding: '0 5px 5px 0'
                          }}
                        >
                          Location:
                        </p>

                        {Location?.length > 0 &&
                          Location?.map((v, inx) => {
                            let pre = false;
                            openPainChiefComplaintData?.Location?.length > 0 &&
                              openPainChiefComplaintData?.Location?.forEach((o) => {
                                if (o.data === v.data) {
                                  pre = true;
                                }
                              });
                            return (
                              <Chip
                                key={inx}
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: pre ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1
                                }}
                                variant={pre ? 'default' : 'outlined'}
                                color={pre ? 'primary' : 'default'}
                                className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={v.data}
                                onClick={() => {
                                  let sM = [...openPainChiefComplaintData.Location, v];
                                  sM = [...new Map(sM.map((item) => [item['data'], item])).values()];
                                  setOpenPainChiefComplaintData((prev) => {
                                    return { ...prev, Location: sM };
                                  });
                                }}
                                onDelete={
                                  pre
                                    ? () => {
                                        let medPro = [];
                                        openPainChiefComplaintData.Location.forEach((vM) => {
                                          if (vM.data !== v.data) {
                                            medPro.push(vM);
                                          }
                                        });
                                        setOpenPainChiefComplaintData((prev) => {
                                          return { ...prev, Location: medPro };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        <Button onClick={addPainLocation} className="selectProblemWith chiefBtn">
                          {inputValLocation.length > 0 ? '+ Add More' : '+ Add'}
                        </Button>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sx={{ my: 1 }}>
                      <Box className="withChiefC withComplaintS">
                        <p
                          className="labelChief"
                          style={{
                            position: 'sticky',
                            top: '0',
                            background: 'white',
                            zIndex: '10',
                            padding: '0 5px 5px 0'
                          }}
                        >
                          Nature Of Pain
                        </p>

                        {natureOfPain?.length > 0 &&
                          natureOfPain.map((v, inx) => {
                            let pre = false;
                            openPainChiefComplaintData?.natureOfPain?.length > 0 &&
                              openPainChiefComplaintData?.natureOfPain?.forEach((o) => {
                                if (o.data === v.data) {
                                  pre = true;
                                }
                              });
                            return (
                              <Chip
                                key={inx}
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: pre ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1
                                }}
                                variant={pre ? 'default' : 'outlined'}
                                color={pre ? 'primary' : 'default'}
                                className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={v.data}
                                onClick={() => {
                                  let sM = [...openPainChiefComplaintData.natureOfPain, v];
                                  sM = [...new Map(sM.map((item) => [item['data'], item])).values()];
                                  setOpenPainChiefComplaintData((prev) => {
                                    return { ...prev, natureOfPain: sM };
                                  });
                                }}
                                onDelete={
                                  pre
                                    ? () => {
                                        let medPro = [];
                                        openPainChiefComplaintData.natureOfPain.forEach((vM) => {
                                          if (vM.data !== v.data) {
                                            medPro.push(vM);
                                          }
                                        });
                                        setOpenPainChiefComplaintData((prev) => {
                                          return { ...prev, natureOfPain: medPro };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        <Button onClick={addNatureOfPain} className="selectProblemWith chiefBtn">
                          {inputValDes.length > 0 ? '+ Add More' : '+ Add'}
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ my: 1 }}>
                      <Box className="withChiefC withComplaintS">
                        <p
                          className="labelChief"
                          style={{
                            position: 'sticky',
                            top: '0',
                            background: 'white',
                            zIndex: '10',
                            padding: '0 5px 5px 0'
                          }}
                        >
                          Since:
                        </p>

                        {duration?.length > 0 &&
                          duration?.map((v, inx) => {
                            let pre = false;
                            openPainChiefComplaintData?.duration?.length > 0 &&
                              openPainChiefComplaintData?.duration?.forEach((o) => {
                                if (o.data === v.data) {
                                  pre = true;
                                }
                              });
                            return (
                              <Chip
                                key={inx}
                                className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: pre ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1
                                }}
                                variant={pre ? 'default' : 'outlined'}
                                color={pre ? 'primary' : 'default'}
                                label={v.data}
                                onClick={() => {
                                  let sM = [...openPainChiefComplaintData.duration, v];
                                  sM = [...new Map(sM.map((item) => [item['data'], item])).values()];
                                  setOpenPainChiefComplaintData((prev) => {
                                    return { ...prev, duration: sM };
                                  });
                                }}
                                onDelete={
                                  pre
                                    ? () => {
                                        let medPro = [];
                                        openPainChiefComplaintData.duration.forEach((vM) => {
                                          if (vM.data !== v.data) {
                                            medPro.push(vM);
                                          }
                                        });
                                        setOpenPainChiefComplaintData((prev) => {
                                          return { ...prev, duration: medPro };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        <Button onClick={addPainSince} className="selectProblemWith chiefBtn">
                          {inputValSince.length > 0 ? '+ Add More' : '+ Add'}
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ my: 1 }}>
                      <Box className="withChiefC withComplaintS">
                        <p
                          className="labelChief"
                          style={{
                            position: 'sticky',
                            top: '0',
                            background: 'white',
                            zIndex: '10',
                            padding: '0 5px 5px 0'
                          }}
                        >
                          Aggravating Factors:
                        </p>

                        {aggravatingFactors?.length > 0 &&
                          aggravatingFactors?.map((v, inx) => {
                            let pre = false;
                            openPainChiefComplaintData?.aggravatingFactors?.length > 0 &&
                              openPainChiefComplaintData?.aggravatingFactors?.forEach((o) => {
                                if (o.data === v.data) {
                                  pre = true;
                                }
                              });
                            return (
                              <Chip
                                key={inx}
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: pre ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1
                                }}
                                variant={pre ? 'default' : 'outlined'}
                                color={pre ? 'primary' : 'default'}
                                className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={v.data}
                                onClick={() => {
                                  let sM = [...openPainChiefComplaintData?.aggravatingFactors, v];
                                  sM = [...new Map(sM.map((item) => [item['data'], item])).values()];
                                  setOpenPainChiefComplaintData((prev) => {
                                    return { ...prev, aggravatingFactors: sM };
                                  });
                                }}
                                onDelete={
                                  pre
                                    ? () => {
                                        let medPro = [];
                                        openPainChiefComplaintData?.aggravatingFactors.forEach((vM) => {
                                          if (vM.data !== v.data) {
                                            medPro.push(vM);
                                          }
                                        });
                                        setOpenPainChiefComplaintData((prev) => {
                                          return { ...prev, aggravatingFactors: medPro };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        <Button onClick={addAggravatingFactors} className="selectProblemWith chiefBtn">
                          {inputValTreat.length > 0 ? '+ Add More' : '+ Add'}
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ my: 1 }}>
                      <Box className="withChiefC withComplaintS">
                        <p
                          className="labelChief"
                          style={{
                            position: 'sticky',
                            top: '0',
                            background: 'white',
                            zIndex: '10',
                            padding: '0 5px 5px 0'
                          }}
                        >
                          Quality :
                        </p>

                        {quality?.length > 0 &&
                          quality?.map((v, inx) => {
                            let pre = false;
                            openPainChiefComplaintData?.quality?.length > 0 &&
                              openPainChiefComplaintData?.quality?.forEach((o) => {
                                if (o.data === v.data) {
                                  pre = true;
                                }
                              });
                            return (
                              <Chip
                                key={inx}
                                className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                label={v.data}
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: pre ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1
                                }}
                                variant={pre ? 'default' : 'outlined'}
                                color={pre ? 'primary' : 'default'}
                                onClick={() => {
                                  let sM = [...openPainChiefComplaintData?.quality, v];
                                  sM = [...new Map(sM.map((item) => [item['data'], item])).values()];
                                  setOpenPainChiefComplaintData((prev) => {
                                    return { ...prev, quality: sM };
                                  });
                                }}
                                onDelete={
                                  pre
                                    ? () => {
                                        let medPro = [];
                                        openPainChiefComplaintData?.quality?.forEach((vM) => {
                                          if (vM.data !== v.data) {
                                            medPro.push(vM);
                                          }
                                        });
                                        setOpenPainChiefComplaintData((prev) => {
                                          return { ...prev, quality: medPro };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        <Button onClick={addPainQuality} className="selectProblemWith chiefBtn">
                          {inputVal.length > 0 ? '+ Add More' : '+ Add'}
                        </Button>
                      </Box>
                    </Grid>
                    {/* Releving Factors */}
                    <Grid item xs={12} sx={{ my: 1 }}>
                      <Box className="withChiefC withComplaintS">
                        <p
                          className="labelChief"
                          style={{
                            position: 'sticky',
                            top: '0',
                            background: 'white',
                            zIndex: '10',
                            padding: '0 5px 5px 0'
                          }}
                        >
                          Relieving Factors
                        </p>

                        {relievingFactors?.length > 0 &&
                          relievingFactors?.map((v, inx) => {
                            let pre = false;
                            openPainChiefComplaintData?.relievingFactors?.length > 0 &&
                              openPainChiefComplaintData?.relievingFactors?.forEach((o) => {
                                if (o.data === v.data) {
                                  pre = true;
                                }
                              });
                            return (
                              <Chip
                                key={inx}
                                className={`${pre ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                                sx={{
                                  borderWidth: 2, // Increase border thickness
                                  borderColor: pre ? 'primary.main' : 'secondary.main',
                                  borderStyle: 'solid',
                                  mr: 1
                                }}
                                variant={pre ? 'default' : 'outlined'}
                                color={pre ? 'primary' : 'default'}
                                label={v.data}
                                onClick={() => {
                                  let sM = [...openPainChiefComplaintData?.relievingFactors, v];
                                  sM = [...new Map(sM.map((item) => [item['data'], item])).values()];
                                  setOpenPainChiefComplaintData((prev) => {
                                    return { ...prev, relievingFactors: sM };
                                  });
                                }}
                                onDelete={
                                  pre
                                    ? () => {
                                        let medPro = [];
                                        openPainChiefComplaintData?.relievingFactors.forEach((vM) => {
                                          if (vM.data !== v.data) {
                                            medPro.push(vM);
                                          }
                                        });
                                        setOpenPainChiefComplaintData((prev) => {
                                          return { ...prev, relievingFactors: medPro };
                                        });
                                      }
                                    : undefined
                                }
                                deleteIcon={pre ? <Close style={{ color: 'white' }} /> : undefined}
                              />
                            );
                          })}
                        <Button onClick={addRelevingFactors} className="selectProblemWith chiefBtn">
                          {inputVal.length > 0 ? '+ Add More' : '+ Add'}
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ my: 1 }}>
                      <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSavePainChiefComplaint}>
                        Save
                      </Button>
                      <Button variant="contained" className="addBtn" style={{ marginTop: '10px', marginLeft:'10px' }} onClick={()=> setOpenPainDetails(false)}>
                        Cancel
                      </Button>
                    </Grid>
                  </Box>
                </Box>
              )}
            </Dialog>
          </Grid>
        </Grid>
        {/* Display  Chief Complaint */}

        <Box>
          {patientChiefComplaint.length > 0 &&
            patientChiefComplaint.map((val, ind) => {
              if (!Array.isArray(val.chiefComplaint) || val.chiefComplaint.length === 0) return null;

              return (
                <Box
                  key={ind}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    boxShadow: 2,
                    position: 'relative',
                    width: 300
                  }}
                >
                  {/* Delete Button */}

                  {/* Display Chief Complaints */}
                  {val.chiefComplaint.map((chiefComplaintData, idx) => (
                    <Box key={idx} sx={{ mb: 3, mt: 3.5 }}>
                      {/* Chief Complaint Title with Edit Icon */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: '#126078'
                          }}
                        >
                          {chiefComplaintData.chiefComplaint}
                        </Typography>

                        {/* Edit Icon */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton>
                            <EditIcon
                              sx={{
                                cursor: 'pointer',
                                color: 'gray',
                                '&:hover': { color: 'primary.main' }
                              }}
                              onClick={() => {
                                setOpenAddChiefComplaintDetail(false);
                                setChiefComplaint(chiefComplaintData.chiefComplaint);
                                setSymptoms(chiefComplaintData.symptoms || []);
                                setDescription(chiefComplaintData.description || []);
                                setSince(chiefComplaintData.since || []);
                                setLocation(chiefComplaintData.Location || []);
                                setTreatment(chiefComplaintData.treatment || []);
                                setIsLocation(chiefComplaintData.isLocation || false);
                                setIsScale(chiefComplaintData.isScale || false);

                                let dta = {
                                  notes: chiefComplaintData.notes || '',
                                  symptoms: chiefComplaintData.symptoms || [],
                                  description: chiefComplaintData.description || [],
                                  since: chiefComplaintData.since || [],
                                  treatment: chiefComplaintData.treatment || [],
                                  Location: chiefComplaintData.Location || [],
                                  isLocation: chiefComplaintData.isLocation || false,
                                  isScale: chiefComplaintData.isScale || false,
                                  painScore: chiefComplaintData.painScore || '',
                                  chiefComplaint: chiefComplaintData.chiefComplaint || '',
                                  _id: chiefComplaintData._id
                                };

                                setOpenChiefComplaintData(dta);
                                setOpenChiefComplaintDetail(true);
                                setOpenEditDataDetail(false);
                                setOpenEditHandler(false);
                                setOpenDeleteHandler(false);
                              }}
                            />
                          </IconButton>

                          <IconButton
                            sx={{
                              backgroundColor: 'transparent',
                              color: 'black',
                              '&:hover': {
                                backgroundColor: 'red',
                                color: 'white'
                              },
                              minWidth: '30px',
                              height: '30px'
                            }}
                            onClick={() => handlePatientChiefComplaintDelete(val, ind)}
                          >
                            <Close />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Display Details - One Per Line */}
                      <Box sx={{ mt: 1 }}>
                        {chiefComplaintData.notes && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Notes:</strong> {chiefComplaintData.notes}
                          </Typography>
                        )}

                        {chiefComplaintData.Location?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Location:</strong> {chiefComplaintData.Location.map((item) => item.data).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData.description?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Description:</strong> {chiefComplaintData.description.map((item) => item.data).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData.since?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Since:</strong> {chiefComplaintData.since.map((item) => item.data).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData.treatment?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Treatment:</strong> {chiefComplaintData.treatment.map((item) => item.data).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData.symptoms?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Symptoms:</strong> {chiefComplaintData.symptoms.map((item) => item.with).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData?.painType?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Pain Level:</strong> {chiefComplaintData?.painScore} : {chiefComplaintData?.painType}
                          </Typography>
                        )}
                      </Box>

                      {/* Divider after each chief complaint */}
                      {idx < val.chiefComplaint.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  ))}
                </Box>
              );
            })}
        </Box>

        {/* Display Pain Chief Complaint */}
        <Box ml={2}>
          {patientPainChiefComplaint.length > 0 &&
            patientPainChiefComplaint.map((val, ind) => {
              if (!Array.isArray(val.chiefComplaint) || val.chiefComplaint.length === 0) return null;

              return (
                <Box
                  key={ind}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    boxShadow: 2,
                    position: 'relative'
                  }}
                >
                  {/* Display Chief Complaints */}
                  {val.chiefComplaint.map((chiefComplaintData, idx) => (
                    <Box key={idx} sx={{ mb: 3, mt: 3.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Chief Complaint Title */}
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: '#126078'
                          }}
                        >
                          {chiefComplaintData.chiefComplaint}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {/* Edit Icon */}
                          <IconButton>
                            <EditIcon
                              sx={{
                                cursor: 'pointer',
                                color: 'gray',
                                '&:hover': { color: 'primary.main' }
                              }}
                              onClick={() => {
                                setOpenAddChiefComplaintDetail(false);
                                setChiefComplaint(chiefComplaintData?.chiefComplaint);
                                setQuality(chiefComplaintData?.quality || []);
                                setAggravatingFactors(chiefComplaintData?.aggravatingFactors || []);
                                setDuration(chiefComplaintData?.duration || []);
                                setLocation(chiefComplaintData?.Location || []);
                                setNatureOfPain(chiefComplaintData?.natureOfPain || []);
                                setRelievingFactors(chiefComplaintData?.relievingFactors || []);

                                let dta = {
                                  notes: chiefComplaintData.notes || '',
                                  quality: chiefComplaintData.quality || [],
                                  duration: chiefComplaintData.duration || [],
                                  natureOfPain: chiefComplaintData.natureOfPain || [],
                                  relievingFactors: chiefComplaintData.relievingFactors || [],
                                  painScore: chiefComplaintData.painScore || '',
                                  chiefComplaint: chiefComplaintData.chiefComplaint || '',
                                  _id: chiefComplaintData._id,
                                  aggravatingFactors: chiefComplaintData.aggravatingFactors || [],
                                  Location: chiefComplaintData.Location || []
                                };

                                setOpenPainChiefComplaintData(dta);
                                setOpenPainDetails(true);
                                setOpenEditDataDetail(false);
                                setOpenEditHandler(false);
                                setOpenDeleteHandler(false);
                              }}
                            />
                          </IconButton>
                          {/* Delete Button */}
                          <IconButton
                            sx={{
                              backgroundColor: 'transparent',
                              color: 'black',
                              '&:hover': {
                                backgroundColor: 'red',
                                color: 'white'
                              },
                              minWidth: '30px',
                              height: '30px'
                            }}
                            onClick={() => handlePatientPainChiefComplaintDelete(val, ind)}
                          >
                            <Close />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Display Details - One Per Line */}
                      <Box sx={{ mt: 1 }}>
                        {chiefComplaintData.notes && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Notes:</strong> {chiefComplaintData.notes}
                          </Typography>
                        )}

                        {chiefComplaintData.Location?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Location:</strong> {chiefComplaintData.Location.map((item) => item.data).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData.natureOfPain?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Nature Of Pain:</strong> {chiefComplaintData.natureOfPain.map((item) => item.data).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData.duration?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Since:</strong> {chiefComplaintData.duration.map((item) => item.data).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData.aggravatingFactors?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Aggravating Factors:</strong>{' '}
                            {chiefComplaintData.aggravatingFactors.map((item) => item.data).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData.quality?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Quality:</strong> {chiefComplaintData.quality.map((item) => item.data).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData.relievingFactors?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Relieving Factors:</strong> {chiefComplaintData.relievingFactors.map((item) => item.data).join(', ')}
                          </Typography>
                        )}

                        {chiefComplaintData.painType?.length > 0 && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Pain Level:</strong> {`${chiefComplaintData.painScore} : ${chiefComplaintData.painType}`}
                          </Typography>
                        )}
                      </Box>

                      {/* Divider after each chief complaint */}
                      {idx < val.chiefComplaint.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  ))}
                </Box>
              );
            })}
        </Box>
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default ChiefComplaint;
