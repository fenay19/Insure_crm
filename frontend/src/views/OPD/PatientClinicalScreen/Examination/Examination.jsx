import {
  Box,
  Button,
  Chip,
  Divider,
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
  Typography,
  DialogContent,
  Dialog,
  DialogActions,
  DialogTitle,
  Select,
  MenuItem,
  Card,
  CardContent,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import Accordion from 'react-bootstrap/Accordion';
import React from 'react';
import './Examination.css';
import { AddBox, Cancel, Close, Edit, KeyboardArrowDown, KeyboardArrowUp, Search, Add, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { get, put, remove, retrieveToken } from 'api/api';
import REACT_APP_BASE_URL from 'api/api';
import axios from 'axios';
import { useEffect } from 'react';
import SystematicDiagram from './SystematicDiagram';
import Loader from 'component/Loader/Loader';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import VisionComponent from './VisionComponent';
import FindingsComponent from './FindingComponent';
import AutoRefractionComponent from './AutoRefrectaion';
import { Table } from 'react-bootstrap';
import EditVision from './VisionComponent/EditVision';
import EditFinding from './FindingComponent/EditFinding';
import EditAutoRefractionComponent from './AutoRefrectaion/EditAutoRefracation';
import GlassPrescription from '../MedicalPrescription/GlassPrescription';
import RemarkSection from '../MedicalPrescription/Remark';
import Dialated from './AutoRefrectaion/Dilated';
import EditDilatedComponent from './AutoRefrectaion/EditDilated';
import DisplayGlassPrescription from '../MedicalPrescription/PatientGlassPrescription/DisplayGlassPrescription';

let pExam = {
  local: [],
  general: [],
  systematic: [],
  other: []
};

const Examination = ({ selectedMenu, editData }) => {
  const token = retrieveToken();
  const departmentId = editData.departmentId._id;
  const [openDialog, setOpenDialog] = useState(false);
  const [systemicDialog, setSystemicDialog] = useState(false);
  const [systemicDialogDelete, setSystemicDialogDelete] = useState(false);
  const [systemicAddDialog, setSystemicAddDialog] = useState(false);
  const [localAddDialog, setLocalAddDialog] = useState(false);
  const [digramSaved, setDiagramSaved] = useState(false);

  const [openGeneralEditHandler, setOpenGeneralEditHandler] = useState(false);
  const [openGeneralDeleteHandler, setOpenGeneralDeleteHandler] = useState(false);
  const [openGeneralEditDataDetail, setOpenGeneralEditDataDetail] = useState(false);
  const [deleteGeneralIds, setDeletedGeneralIds] = useState([]);
  const [openEditGeneralDisorder, setOpenEditGeneralDisorder] = useState(false);
  const [openDeleteGeneralDisorder, setOpenDeleteGeneralDisorder] = useState(false);
  const [openEditGeneralDisorderDetail, setOpenEditGeneralDisorderDetail] = useState(false);

  const [openLocalEditHandler, setOpenLocalEditHandler] = useState(false);
  const [openLocalDeleteHandler, setOpenLocalDeleteHandler] = useState(false);
  const [openLocalEditDataDetail, setOpenLocalEditDataDetail] = useState(false);
  const [deleteLocalIds, setDeletedLocalIds] = useState([]);
  const [openEditLocalDisorder, setOpenEditLocalDisorder] = useState(false);
  const [openDeleteLocalDisorder, setOpenDeleteLocalDisorder] = useState(false);
  const [openEditLocalDisorderDetail, setOpenEditLocalDisorderDetail] = useState(false);

  const [openSystemicEditHandler, setOpenSystemicEditHandler] = useState(false);
  const [openSystemicDeleteHandler, setOpenSystemicDeleteHandler] = useState(false);
  const [openSystemicEditDataDetail, setOpenSystemicEditDataDetail] = useState(false);
  const [deleteSystemicIds, setDeletedSystemicIds] = useState([]);
  const [openEditSystemicDisorder, setOpenEditSystemicDisorder] = useState(false);
  const [openDeleteSystemicDisorder, setOpenDeleteSystemicDisorder] = useState(false);
  const [openEditSystemicDisorderDetail, setOpenEditSystemicDisorderDetail] = useState(false);

  const [allGeneral, setAllGeneral] = useState([]);
  const [mostGeneral, setMostGeneral] = useState([]);
  const [showGeneral, setShowGeneral] = useState([]);

  const [allLocal, setAllLocal] = useState([]);
  const [mostLocal, setMostLocal] = useState([]);
  const [showLocal, setShowLocal] = useState([]);

  const [allSystematic, setAllSystematic] = useState([]);
  const [mostSystematic, setMostSystematic] = useState([]);
  const [showSystematic, setShowSystematic] = useState([]);
  const [allOther, setAllOther] = useState([]);
  const [mostOther, setMostOther] = useState([]);
  const [showOther, setShowOther] = useState([]);
  const [loader, setLoader] = useState(true);
  const [patientExamination, setPatientExamination] = useState({
    general: [],
    local: [],
    systematic: [],
    other: []
  });

  const [layer4, setLayer4] = useState({
    editLayer4: false,
    deleteLayer4: false,
    layer4Data: []
  });

  const [layer3Edit, setLayer3Edit] = useState(false);
  const [layer3Delete, setLayer3Delete] = useState(false);
  const [open3Layer, setOpen3Layer] = useState({
    edit3Layer: false,
    delete3Layer: false,
    layer3Data: []
  });

  const [openLayer4EditDialog, setOpenLayer4EditDialog] = useState(false);
  const [openLayer4DeleteDialog, setOpenLayer4DeleteDialog] = useState(false);

  const [layer3ChipSelectedFor4Index, setLayer3ChipSelectedFor4Index] = useState(null);
  const [layer3Data, setLayer3Data] = useState([]);
  const [layer4Add, setLayer4Add] = useState(false);
  const [layer2index, setLayer2index] = useState(null);
  const [chipInputValue, setChipInputValue] = useState('');
  const [selectedChips, setSelectedChips] = useState([]);

  const [selectedChipIndex, setSelectedChipIndex] = useState(null);
  const [expanded, setExpanded] = React.useState('0');
  const [searchValueGeneral, setSearchValueGeneral] = useState([]);
  const [searchValueLocal, setSearchValueLocal] = useState('');

  const [addData, setAddData] = useState({});
  const [openAddGeneral, setOpenAddGeneral] = useState(false);
  const [openAddLocal, setOpenAddLocal] = useState(false);

  const [error, setError] = useState('');
  const [tempData, setTempData] = useState({});
  const [searchValueSystematic, setSearchValueSystematic] = useState([]);
  const [openAddSystematic, setOpenAddSystematic] = useState(false);
  const [openAddSystematicDisorder, setOpenAddSystematicDisorder] = useState(false);
  const [openAddGeneralDisorder, setOpenAddGeneralDisorder] = useState(false);

  const [sysGenErr, setSysGenErr] = React.useState({
    disorder: '',
    subDisorder: [
      {
        name: '',
        count: 0
      }
    ]
  });
  const [openAddLocalDisorder, setOpenAddLocalDisorder] = useState(false);

  const [err, setErr] = React.useState([
    {
      name: ''
    }
  ]);
  const [inputVal, setInputVal] = React.useState([
    {
      name: '',
      count: 0,
      answerType: 'Subjective',
      objective: []
    }
  ]);
  const [searchValueOther, setSearchValueOther] = useState('');
  const [openAddExamOther, setOpenAddExamOther] = useState(false);
  const [openAddExamOtherData, setOpenAddExamOtherData] = useState(false);
  const [openData, setOpenData] = useState({});
  const [openSubDisorderGeneralP, setOpenSubDisorderGeneralP] = useState(false);
  const [openSubDisorderLocalP, setOpenSubDisorderLocalP] = useState(false);
  const [openSubDisorderSystemicP, setOpenSubDisorderSystemicP] = useState(false);

  const [open4General, setOpen4General] = useState(false);
  const [generalOpen4LayerDataAdd, setGeneralOpen4LayerDataAdd] = useState(false);
  const [dataGeneral4Layer, setDataGeneral4Layer] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [open4Local, setOpen4Local] = useState(false);
  const [localOpen4LayerDataAdd, setLocalOpen4LayerDataAdd] = useState(false);
  const [dataLocal4Layer, setDataLocal4Layer] = useState({});

  const [open4Systemic, setOpen4Systemic] = useState(false);
  const [systemicOpen4LayerDataAdd, setSystemicOpen4LayerDataAdd] = useState(false);
  const [dataSystemic4Layer, setDataSystemic4Layer] = useState({});

  const [openDataSelectObjective, setOpenDataSelectObjective] = useState({});

  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(``); // Replace 'your-image.jpg' with your image source
  const [patientExist, setPatientExist] = useState(false);
  const [alreadyExistId, setAlreadyExistId] = useState('');

  const [openOtherEditHandler, setOpenOtherEditHandler] = useState(false);
  const [openOtherDeleteHandler, setOpenOtherDeleteHandler] = useState(false);
  const [openOtherEditDataDetail, setOpenOtherEditDataDetail] = useState(false);
  const [deleteOtherIds, setDeletedOtherIds] = useState([]);

  const [isActive, setIsActive] = useState(null); // State to track if the accordion is active
  const patient = useSelector((state) => state.patient.selectedPatient);
  const toggleAccordion = (index) => {
    setIsActive(isActive === index ? null : index);
  };
  const [base64Img, setBase64Img] = useState('');

  // Function to handle file selection and convert to Base64
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      convertImageToBase64Edit(file);
    }
  };

  // Ophthalmology States
  // console.log( window.localStorage.getItem('departmentName'))
  // const isOphthalmology =
  //  dep?.toLowerCase()?.trim()?.includes('ophthalmology')&&"ophthalmology"||  (editData?.department?.toLowerCase()?.trim().includes('ophthalmology') && 'ophthalmology' );;
  const dep = window.localStorage.getItem('departmentName');
  const isOphthalmology =
    (dep?.toLowerCase().trim().includes('ophthalmology') && 'ophthalmology') ||
    (editData?.department?.toLowerCase().trim().includes('ophthalmology') && 'ophthalmology') ||
    '';

  console.log('ISOpthalmology', isOphthalmology);
  console.log('edit Data', editData);

  // Convert image file to Base64
  const convertImageToBase64Edit = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64Img(reader.result);
    };
  };

  useEffect(() => {
    setIsActive(+expanded);
  }, [expanded]);

  //add the new test input field
  const addInputVal = (index) => {
    const rows = [...inputVal];
    rows[index].objective = [...rows[index].objective, { data: '' }];
    setInputVal(rows);
  };

  //remove the one test data
  const removeInputVal = (index, inxx) => {
    const rows = [...inputVal];
    const del = rows[index].objective;
    del.splice(inxx, 1);
    setInputVal(rows);
  };

  //add the new test input field
  const addInputVal4 = () => {
    let rows = [...inputVal];
    rows = [...rows, { data: '' }];
    setInputVal(rows);
  };

  //remove the one test data
  const removeInputVal4 = (inxx) => {
    let rows = [...inputVal];
    rows.splice(inxx, 1);
    setInputVal(rows);
  };

  function objectsAreEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (typeof val1 === 'object' && typeof val2 === 'object') {
        if (!objectsAreEqual(val1, val2)) {
          return false;
        }
      } else if (val1 !== val2) {
        return false;
      }
    }
    return true;
  }

  const getPatientExamination = async () => {
    if (!patient) return;
    console.log(patient?.patientId?._id);

    try {
      const response = await axios.get(`${REACT_APP_BASE_URL}patient-examination/${patient?.patientId?._id}`, {
        headers: { Authorization: 'Bearer ' + token }
      });

      const responseData = response?.data?.data || [];
      console.log(responseData?.[0]);

      if (responseData?.[0]) {
        setAlreadyExistId(responseData?.[0]._id);
        // let res = responseData.map((v) => {
        //   return {
        //     systematic: v.systematic,
        //     general: v.general,
        //     local: v.local,
        //     other: v.other
        //   };
        // });

        setPatientExamination(responseData?.[0]);
        setPatientExist(true);
      } else {
        setPatientExamination({
          general: [],
          local: [],
          systematic: [],
          other: []
        });
        setAlreadyExistId('');

        setPatientExist(false);
      }
    } catch (error) {
      console.error('Error fetching patient examination:', error);
    }
  };

  useEffect(() => {
    getPatientExamination();
  }, [patient]);

  const getExamination = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}opd/general-examination`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setAllGeneral(res);

        let ptExam = [];
        res.forEach((v) => {
          let sub = [];
          v.exam.subDisorder.forEach((vv) => {
            sub.push({ name: vv.name, option: 'No' });
          });
          ptExam.push({
            _id: v._id,
            disorder: v.exam.disorder,
            notes: '',
            subDisorder: sub
          });
        });
        pExam = { ...pExam, general: ptExam };
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/general-examination/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setShowGeneral(res);
        setMostGeneral(res);
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/local-examination`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setAllLocal(res);

        let ptExam = [];
        res.forEach((v) => {
          let sub = [];
          v.exam.subDisorder.forEach((vv) => {
            sub.push({ name: vv.name, option: 'No' });
          });
          ptExam.push({
            _id: v._id,
            disorder: v.exam.disorder,
            notes: '',
            subDisorder: sub
          });
        });
        pExam = { ...pExam, local: ptExam };
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/local-examination/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setShowLocal(res);
        setMostLocal(res);
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/systematic-examination`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setAllSystematic(res);

        let ptExam = [];
        res.forEach((v) => {
          let sub = [];
          v.exam.subDisorder.forEach((vv) => {
            sub.push({ name: vv.name, option: 'No' });
          });
          ptExam.push({
            _id: v._id,
            disorder: v.exam.disorder,
            notes: '',
            subDisorder: sub,
            diagram: ''
          });
        });
        pExam = { ...pExam, systematic: ptExam };
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/systematic-examination/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v, ind) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });

        setShowSystematic(res);
        setMostSystematic(res);
      })
      .catch((error) => {});

    let ptExam = [];
    await axios
      .get(`${REACT_APP_BASE_URL}opd/other-examination`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setAllOther(res);

        res.forEach((v) => {
          ptExam.push({ _id: v._id, exam: v.exam, notes: '' });
        });
        pExam = { ...pExam, other: ptExam };
      })
      .catch((error) => {});

    await axios
      .get(`${REACT_APP_BASE_URL}opd/other-examination/most-used/${departmentId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .then((response) => {
        let res = [];
        response.data.data.forEach((v) => {
          if (v.departmentId === departmentId) {
            res.push(v);
          }
        });
        setShowOther(res);
        setMostOther(res);
      })
      .catch((error) => {});

    await getPatientExamination();
    setLoader(false);
  };

  useEffect(() => {
    getExamination();
    // eslint-disable-next-line
  }, [digramSaved]);

  const closeForm = () => {
    setAddData({});
    setError('');
    setOpenAddSystematicDisorder(false);
    setOpenAddGeneralDisorder(false);
    setOpenEditGeneralDisorder(false);
    setOpenEditGeneralDisorderDetail(false);
    setOpenDeleteGeneralDisorder(false);
    setOpenEditSystemicDisorder(false);
    setOpenEditSystemicDisorderDetail(false);
    setOpenDeleteSystemicDisorder(false);
    setOpenEditLocalDisorder(false);
    setOpenEditLocalDisorderDetail(false);
    setOpenDeleteLocalDisorder(false);
    setOpenAddLocalDisorder(false);
    setOpenAddSystematic(false);
    setOpenAddGeneral(false);
    setOpenAddLocal(false);
    setOpenSubDisorderGeneralP(false);
    setOpenGeneralEditDataDetail(false);
    setOpenGeneralEditHandler(false);
    setOpenGeneralDeleteHandler(false);
    setDeletedGeneralIds([]);
    setOpenSubDisorderLocalP(false);
    setOpenLocalEditDataDetail(false);
    setOpenLocalEditHandler(false);
    setOpenLocalDeleteHandler(false);
    setDeletedLocalIds([]);
    setOpenSubDisorderSystemicP(false);
    setOpenSystemicEditDataDetail(false);
    setOpenSystemicEditHandler(false);
    setOpenSystemicDeleteHandler(false);
    setDeletedSystemicIds([]);
    setOpenOtherEditHandler(false);
    setOpenOtherDeleteHandler(false);
    setOpenOtherEditDataDetail(false);
    setDeletedOtherIds([]);
    setOpenData({});
    setSysGenErr({
      disorder: '',
      subDisorder: [
        {
          name: ''
        }
      ]
    });

    setErr([
      {
        name: ''
      }
    ]);
    setInputVal([
      {
        name: '',
        answerType: 'Subjective',
        objective: []
      }
    ]);
    setOpenAddExamOther(false);
    setOpenAddExamOtherData(false);
    setOpen4General(false);
    setGeneralOpen4LayerDataAdd(false);
    setDataGeneral4Layer({});

    setOpen4Local(false);
    setLocalOpen4LayerDataAdd(false);
    setDataLocal4Layer({});

    setOpen4Systemic(false);
    setSystemicOpen4LayerDataAdd(false);
    setDataSystemic4Layer({});

    setOpenDataSelectObjective({});
  };

  useEffect(() => {
    let s = [];
    for (let i = 0; i < showSystematic.length; i++) {
      s.push('');
    }
    setSearchValueSystematic(s);

    // eslint-disable-next-line
  }, [openAddSystematicDisorder]);

  useEffect(() => {
    let s1 = [];
    for (let i = 0; i < showGeneral.length; i++) {
      s1.push('');
    }
    setSearchValueGeneral(s1);
    // eslint-disable-next-line
  }, [openAddGeneralDisorder]);

  useEffect(() => {
    let s1 = [];
    for (let i = 0; i < showLocal.length; i++) {
      s1.push('');
    }
    setSearchValueLocal(s1);
    // eslint-disable-next-line
  }, [openAddLocalDisorder]);

  const handleDataSubdisorder = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputVal];
    if (name === 'answerType') {
      list[index][name] = value;
      if (value === 'Objective') {
        list[index].objective = [{ data: '' }];
      } else {
        list[index].objective = [];
      }
    } else {
      list[index][name] = value;
    }
    setInputVal(list);
    const er = [...err];
    er[index][name] = '';
    setErr(er);
  };

  const addSystematicDisorderHandler = () => {
    closeForm();
    setOpenAddSystematicDisorder(true);
    setAddData({ disorder: '', subDisorder: [] });
    handleDialogOpen();
  };

  const editSystemicDisorderExamHandler = () => {
    closeForm();
    setOpenEditSystemicDisorder(true);
    setAddData({ disorder: '', subDisorder: [] });
    handleDialogOpen();
  };

  const deleteSystemicDisorderExamHandler = () => {
    closeForm();
    setOpenDeleteSystemicDisorder(true);
    setAddData({ disorder: '', subDisorder: [] });
    handleDialogOpen();
  };

  const addGeneralDisorderHandler = () => {
    closeForm();
    setOpenAddGeneralDisorder(true);
    setAddData({ disorder: '', subDisorder: [] });
    handleDialogOpen();
  };

  const editGeneralDisorderExamHandler = () => {
    closeForm();
    setOpenEditGeneralDisorder(true);
    setAddData({ disorder: '', subDisorder: [] });
    handleDialogOpen();
  };

  const deleteGeneralDisorderExamHandler = () => {
    closeForm();
    setOpenDeleteGeneralDisorder(true);
    setAddData({ disorder: '', subDisorder: [] });
    handleDialogOpen();
  };

  const addLocalDisorderHandler = () => {
    closeForm();
    setOpenAddLocalDisorder(true);
    setAddData({ disorder: '', subDisorder: [] });
    handleDialogOpen();
  };

  const editLocalDisorderExamHandler = () => {
    closeForm();
    setOpenEditLocalDisorder(true);
    setAddData({ disorder: '', subDisorder: [] });
    handleDialogOpen();
  };

  const deleteLocalDisorderExamHandler = () => {
    closeForm();
    setOpenDeleteLocalDisorder(true);
    setAddData({ disorder: '', subDisorder: [] });
    handleDialogOpen();
  };

  const addSystematicExamHandler = (data) => {
    closeForm();
    setOpenAddSystematic(true);
    setAddData({
      _id: data._id,
      disorder: data.exam.disorder,
      subDisorder: [],
      diagram: ''
    });
  };

  const editSystemicExamHandler = (data, sub) => {
    closeForm();
    setOpenAddSystematic(false);
    setAddData({
      _id: data._id,
      disorder: data.exam.disorder,
      subDisorder: sub,
      diagram: data.exam.diagram
    });
    setOpenSystemicEditDataDetail(false);
    setOpenSystemicEditHandler(true);
    setOpenSystemicDeleteHandler(false);
  };

  const deleteSystemicExamHandler = (data, subDisorder) => {
    closeForm();
    setOpenAddSystematic(false);
    setAddData({
      _id: data._id,
      disorder: data.exam.disorder,
      subDisorder: subDisorder,
      diagram: data.exam.diagram
    });
    setOpenSystemicEditDataDetail(false);
    setOpenSystemicEditHandler(false);
    setOpenSystemicDeleteHandler(true);
  };

  const addGeneralExamHandler = (data) => {
    closeForm();
    setOpenAddGeneral(true);
    setAddData({
      _id: data._id,
      disorder: data.exam.disorder,
      subDisorder: []
    });
    setOpenGeneralEditDataDetail(false);
    setOpenGeneralEditHandler(false);
    setOpenGeneralDeleteHandler(false);
  };

  const editGeneralExamHandler = (data, sub) => {
    closeForm();
    setOpenAddGeneral(false);
    setAddData({
      _id: data._id,
      disorder: data.exam.disorder,
      subDisorder: sub
    });
    setOpenGeneralEditDataDetail(false);
    setOpenGeneralEditHandler(true);
    setOpenGeneralDeleteHandler(false);
  };

  const deleteGeneralExamHandler = (data, subDisorder) => {
    closeForm();
    setOpenAddGeneral(false);
    setAddData({
      _id: data._id,
      disorder: data.exam.disorder,
      subDisorder: subDisorder
    });
    setOpenGeneralEditDataDetail(false);
    setOpenGeneralEditHandler(false);
    setOpenGeneralDeleteHandler(true);
  };

  const addLocalExamHandler = (data) => {
    closeForm();
    setOpenAddLocal(true);
    setAddData({
      _id: data._id,
      disorder: data.exam.disorder,
      subDisorder: []
    });
  };

  const editLocalExamHandler = (data, sub) => {
    closeForm();
    setOpenAddLocal(false);
    setAddData({
      _id: data._id,
      disorder: data.exam.disorder,
      subDisorder: sub
    });
    setOpenLocalEditDataDetail(false);
    setOpenLocalEditHandler(true);
    setOpenLocalDeleteHandler(false);
  };

  const deleteLocalExamHandler = (data, subDisorder) => {
    closeForm();
    setOpenAddLocal(false);
    setAddData({
      _id: data._id,
      disorder: data.exam.disorder,
      subDisorder: subDisorder
    });
    setOpenLocalEditDataDetail(false);
    setOpenLocalEditHandler(false);
    setOpenLocalDeleteHandler(true);
  };

  const handleSearchGeneral = (e, dta, ind) => {
    const list = [...searchValueGeneral];
    list[ind] = e.target.value;
    setSearchValueGeneral(list);
    const updatedSearch = [...searchValueGeneral];
    updatedSearch[inx] = e.target.value;
    setSearchValueGeneral(updatedSearch);
    if (e.target.value === '') {
      setShowGeneral(mostGeneral);
    } else {
      let serchM = [];
      allGeneral[ind].exam.subDisorder.forEach((v) => {
        if (v.name.toLowerCase().includes(e.target.value.toLowerCase())) {
          serchM.push(v);
        }
      });
      const sys = [...showGeneral];
      sys[ind] = { ...dta, exam: { ...sys[ind].exam, subDisorder: serchM } };
      setShowGeneral(sys);
    }
  };

  const handleSearchLocal = (e, dta, inx) => {
    const updatedSearch = [...searchValueLocal];
    updatedSearch[inx] = e.target.value;
    setSearchValueLocal(updatedSearch);
    const list = [...searchValueLocal];
    list[ind] = e.target.value;
    setSearchValueLocal(list);
    if (e.target.value === '') {
      setShowLocal(mostLocal);
    } else {
      let serchM = [];
      allLocal[ind].exam.subDisorder.forEach((v) => {
        if (v.name.toLowerCase().includes(e.target.value.toLowerCase())) {
          serchM.push(v);
        }
      });
      const sys = [...showLocal];
      sys[ind] = { ...dta, exam: { ...sys[ind].exam, subDisorder: serchM } };
      setShowLocal(sys);
    }
  };

  const handleSearchSystematic = (e, dta, ind) => {
    const updatedSearch = [...searchValueSystematic];
    updatedSearch[ind] = e.target.value;
    setSearchValueSystematic(updatedSearch);
    setSearchValueSystematic(updatedSearch);
    list[ind] = e.target.value;
    setSearchValueSystematic(list);
    if (e.target.value === '') {
      setShowSystematic(mostSystematic);
    } else {
      let serchM = [];
      allSystematic[ind].exam.subDisorder.forEach((v) => {
        if (v.name.toLowerCase().includes(e.target.value.toLowerCase())) {
          serchM.push(v);
        }
      });
      const sys = [...showSystematic];
      sys[ind] = { ...dta, exam: { ...sys[ind].exam, subDisorder: serchM } };
      setShowSystematic(sys);
    }
  };

  const handleGeneralDisorderSubmit = async () => {
    if (addData.disorder === '') {
      setSysGenErr((prev) => {
        return { ...prev, disorder: 'Enter the disorder' };
      });
    } else {
      //call api to store exam
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/general-examination`,
          {
            exam: addData,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();
          closeForm();
          handleClose();
          toast.success('General Examination Disorder Created Successfully!!');
          setExpanded('0');
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleLocalDisorderSubmit = async () => {
    if (addData.disorder === '') {
      setSysGenErr((prev) => {
        return { ...prev, disorder: 'Enter the disorder' };
      });
    } else {
      //call api to store exam
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/local-examination`,
          {
            exam: addData,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();
          closeForm();
          handleClose();
          toast.success('Local Examination Disorder Created Successfully!!');
          setExpanded('1');
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  //convert diagram into base64
  async function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      // Read the file as a data URL (base64 encoded)
      reader.readAsDataURL(file);
    });
  }

  const handleSubmitGeneralSubdisorder = async () => {
    const er = [...err];
    let already = true;
    inputVal.forEach((val, ind) => {
      if (val.name === '') {
        er[ind].name = 'Please Enter Subdisorder...';
      } else {
        addData.subDisorder.forEach((s) => {
          if (s.name.toLowerCase() === val.name.toLowerCase()) {
            already = false;
            er[ind].name = 'This subdisorder is already exist...';
          }
        });
      }
    });
    setErr(er);

    let result = true;
    for (let i = 0; i < inputVal.length; i++) {
      let data = inputVal[i];
      let t = Object.values(data).every((val) => val !== '');
      if (!t) {
        result = false;
      }
    }
    if (result && already) {
      let ddta = [];
      inputVal.forEach((vv) => {
        let a = [];
        vv.objective.forEach((av) => {
          if (av.data !== '') {
            a.push(av);
          }
        });
        ddta.push({ ...vv, objective: a });
      });

      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/general-examination/${addData._id}`,
          {
            subDisorder: ddta
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();
          handleClose();
          closeForm();
          toast.success(`Subdisorder Created Successfully!!`);
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleSubmitLocalSubdisorder = async () => {
    const er = [...err];
    let already = true;
    inputVal.forEach((val, ind) => {
      if (val.name === '') {
        er[ind].name = 'Please Enter Subdisorder...';
      } else {
        addData.subDisorder.forEach((s) => {
          if (s.name.toLowerCase() === val.name.toLowerCase()) {
            already = false;
            er[ind].name = 'This subdisorder is already exist...';
          }
        });
      }
    });
    setErr(er);

    let result = true;
    for (let i = 0; i < inputVal.length; i++) {
      let data = inputVal[i];
      let t = Object.values(data).every((val) => val !== '');
      if (!t) {
        result = false;
      }
    }
    if (result && already) {
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/local-examination/${addData._id}`,
          {
            subDisorder: inputVal
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();
          handleClose();
          closeForm();
          toast.success(`Subdisorder Created Successfully!!`);
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleSystematicDisorderSubmit = async () => {
    if (addData.disorder === '') {
      setSysGenErr((prev) => {
        return { ...prev, disorder: 'Enter the disorder' };
      });
    } else {
      //call api to store exam
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/systematic-examination`,
          {
            exam: addData,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();
          closeForm();
          handleClose();

          toast.success('Systemic Examination Disorder Created Successfully!!');
          setExpanded('2');
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleSubmitSystematicSubdisorder = async () => {
    const er = [...err];
    let already = true;
    inputVal.forEach((val, ind) => {
      if (val.name === '') {
        er[ind].name = 'Please Enter Subdisorder...';
      } else {
        addData.subDisorder.forEach((s) => {
          if (s.name.toLowerCase() === val.name.toLowerCase()) {
            already = false;
            er[ind].name = 'This subdisorder is already exist...';
          }
        });
      }
    });
    setErr(er);

    let result = true;
    for (let i = 0; i < inputVal.length; i++) {
      let data = inputVal[i];
      let t = Object.values(data).every((val) => val !== '');
      if (!t) {
        result = false;
      }
    }
    if (result && already) {
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/systematic-examination/${addData._id}`,
          {
            subDisorder: inputVal
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();
          handleClose();

          closeForm();
          toast.success(`Subdisorder Created Successfully!!`);
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const addExamOtherHandler = () => {
    closeForm();
    setOpenAddExamOther(true);
    setAddData({ exam: '' });
    handleDialogOpen();
  };

  const editExamOtherHandler = () => {
    closeForm();
    setOpenOtherEditHandler(true);
    setAddData({ exam: '' });
    handleDialogOpen();
  };

  const deleteExamOtherHandler = () => {
    closeForm();
    setOpenOtherDeleteHandler(true);
    setAddData({ exam: '' });
    handleDialogOpen();
  };

  const handleSearchOther = (e) => {
    setSearchValueOther(e.target.value);
    if (e.target.value === '') {
      setShowOther(mostOther);
    } else {
      let serchM = [];
      allOther.forEach((v) => {
        if (v.exam.toLowerCase().includes(e.target.value.toLowerCase())) {
          serchM.push(v);
        }
      });
      setShowOther(serchM);
    }
  };

  const handleOtherSubmit = async () => {
    if (addData.exam === '') {
      setError('Enter the other examination');
    } else {
      //call api to store exam
      await axios
        .post(
          `${REACT_APP_BASE_URL}opd/other-examination`,
          {
            exam: addData.exam,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();
          let sM = [addData, ...showOther];
          sM = [...new Map(sM.map((item) => [item['exam'], item])).values()];
          setShowOther(sM);
          closeForm();
          handleClose();
          toast.success('Other Examination Created Successfully!!');
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleOtherUpdateSubmit = async () => {
    if (addData.exam === '') {
      setError('Enter the other examination');
    } else {
      //call api to store exam
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/other-examination/${addData._id}`,
          {
            exam: addData.exam,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();

          closeForm();
          handleClose();
          toast.success('Other Examination Update Successfully!!');
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleOtherPatientSubmit = () => {
    if (addData.notes === '') {
      setError('Enter the description');
    } else {
      let sM = [...patientExamination.other, addData];
      sM = [...new Map(sM.map((item) => [item['exam'], item])).values()];
      handlePatientSubmit({ ...patientExamination, other: sM });

      closeForm();
      handleClose();
    }
  };

  const handlePatientCreateSubmit = async (submittedData) => {
    resetSelection();
    await axios
      .post(
        `${REACT_APP_BASE_URL}patient-examination`,
        {
          patientId: patient?.patientId?._id,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          departmentId,
          ...submittedData
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then(async (response) => {
        getPatientExamination();
        closeForm();
        if (!objectsAreEqual(submittedData, pExam)) {
          toast.success(`Patient Examination Successfully Submitted!!`);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handlePatientEditSubmit = async (submittedData) => {
    resetSelection();
    await axios
      .put(
        `${REACT_APP_BASE_URL}patient-examination/${alreadyExistId}`,
        {
          departmentId,
          patientId: patient?.patientId?._id,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          ...submittedData
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then(async (response) => {
        getPatientExamination();
        closeForm();
        toast.success(`Patient Examination Successfully Updated!!`);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handlePatientSubmit = async (submittedData) => {
    if (!patientExist) {
      handlePatientCreateSubmit(submittedData);
      setPatientExist(true);
    } else {
      handlePatientEditSubmit(submittedData);
    }
  };

  const handleSelect = (eventKey) => {
    setExpanded(eventKey);
  };

  const handleButtonClickAddImg = () => {
    document.getElementById('fileInput').click();
  };

  const editDiagramHandler = async (adatadia, diagram) => {
    resetSelection();
    await axios
      .put(
        `${REACT_APP_BASE_URL}opd/systematic-examination-diagram/${adatadia._id}`,
        {
          diagram
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then(async (response) => {
        await getExamination();
        setBase64Img('');
        toast.success(`Image Successfully Added!!`);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };
  const handleDeleteSystemicDialogDelete = async (adatadia) => {
    resetSelection();
    await axios
      .put(
        `${REACT_APP_BASE_URL}opd/systematic-examination-diagram-delete/${adatadia._id}`,
        {
          diagram: null
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then(async (response) => {
        await getExamination();
        toast.success(`Deleted Successfully!!`);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };
  const handleDeleteLocalDialogDelete = async (data) => {
    try {
      resetSelection();
      await axios.put(
        `${REACT_APP_BASE_URL}opd/local-examination-diagram-delete/${data._id}`,
        { diagram: '' },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      );

      await getExamination();
      setBase64Img('');
      setSystemicDialogDelete(false);

      // ✅ Fixed Toast Message
      toast.success('Deleted Successfully!');
    } catch (error) {
      toast.error('Something went wrong, Please try again later!');
    }
  };
  const editDiagramHandlerLocal = async (adatadia, diagram) => {
    resetSelection();
    await axios
      .put(
        `${REACT_APP_BASE_URL}opd/local-examination-diagram/${adatadia._id}`,
        {
          diagram
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )
      .then(async (response) => {
        await getExamination();
        setBase64Img('');
        toast.success(`Image Successfully Added!!`);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleGeneralDisorderUpdate = async () => {
    resetSelection();
    if (addData.disorder === '') {
      setSysGenErr((prev) => {
        return { ...prev, disorder: 'Enter the disorder' };
      });
    } else {
      //call api to store exam
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/general-examination-all/${addData._id}`,
          {
            exam: addData,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();
          closeForm();
          handleClose();
          toast.success('General Examination Disorder Update Successfully!!');
          setExpanded('0');
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleGeneralDisorderDelete = () => {
    resetSelection();
    let data = {
      ids: deleteGeneralIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/general-examination`, {
        headers,
        data
      })
      .then((response) => {
        getExamination();
        setDeletedGeneralIds([]);
        closeForm();
        handleClose();
        toast.success('General Disorder Deleted Successfully!!');
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleGeneralSubdisorderDelete = (id) => {
    resetSelection();
    let data = {
      deleteIds: deleteGeneralIds,
      id: id
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/general-examination/sub-disorder`, {
        headers,
        data
      })
      .then((response) => {
        getExamination();
        setDeletedGeneralIds([]);
        closeForm();
        toast.success('General Subdisorder Deleted Successfully!!');
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleUpdateGeneralSubdisorder = async (mainId, id, aainputVal) => {
    resetSelection();
    const er = [...err];
    let already = true;
    aainputVal.forEach((val, ind) => {
      if (val.name === '') {
        er[ind].name = 'Please Enter Subdisorder...';
      }
    });
    setErr(er);

    let result = true;
    for (let i = 0; i < aainputVal.length; i++) {
      let data = aainputVal[i];
      let t = Object.values(data).every((val) => val !== '');
      if (!t) {
        result = false;
      }
    }
    if (result && already) {
      let ddta = [];
      aainputVal.forEach((vv) => {
        let a = [];
        vv.objective.forEach((av) => {
          if (av.data !== '') {
            a.push(av);
          }
        });
        ddta.push({ ...vv, objective: a });
      });

      await axios
        .put(`${REACT_APP_BASE_URL}opd/general-examination/sub-disorder/${mainId}/${id}`, ddta[0], {
          headers: { Authorization: 'Bearer ' + token }
        })
        .then(async (response) => {
          await getExamination();

          closeForm();
          toast.success(`Subdisorder Updated Successfully!!`);
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleLocalDisorderUpdate = async () => {
    if (addData.disorder === '') {
      setSysGenErr((prev) => {
        return { ...prev, disorder: 'Enter the disorder' };
      });
    } else {
      resetSelection();
      //call api to store exam
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/local-examination-all/${addData._id}`,
          {
            exam: addData,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();
          closeForm();
          handleClose();
          toast.success('Local Examination Disorder Update Successfully!!');
          setExpanded('1');
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleLocalDisorderDelete = () => {
    resetSelection();
    let data = {
      ids: deleteLocalIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/local-examination`, {
        headers,
        data
      })
      .then((response) => {
        getExamination();
        handleClose();
        setDeletedLocalIds([]);
        closeForm();
        toast.success('Local Disorder Deleted Successfully!!');
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleLocalSubdisorderDelete = (id) => {
    resetSelection();
    let data = {
      deleteIds: deleteLocalIds,
      id: id
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/local-examination/sub-disorder`, {
        headers,
        data
      })
      .then((response) => {
        getExamination();
        setDeletedLocalIds([]);
        closeForm();
        toast.success('Local Subdisorder Deleted Successfully!!');
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleUpdateLocalSubdisorder = async (mainId, id, aainputVal) => {
    resetSelection();

    const er = [...err];
    let already = true;
    aainputVal.forEach((val, ind) => {
      if (val.name === '') {
        er[ind].name = 'Please Enter Subdisorder...';
      }
    });
    setErr(er);

    let result = true;
    for (let i = 0; i < aainputVal.length; i++) {
      let data = aainputVal[i];
      let t = Object.values(data).every((val) => val !== '');
      if (!t) {
        result = false;
      }
    }
    if (result && already) {
      let ddta = [];
      aainputVal.forEach((vv) => {
        let a = [];
        vv.objective.forEach((av) => {
          if (av.data !== '') {
            a.push(av);
          }
        });
        ddta.push({ ...vv, objective: a });
      });

      await axios
        .put(`${REACT_APP_BASE_URL}opd/local-examination/sub-disorder/${mainId}/${id}`, ddta[0], {
          headers: { Authorization: 'Bearer ' + token }
        })
        .then(async (response) => {
          await getExamination();

          closeForm();
          toast.successs(`Subdisorder Updated Successfully!!`);
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleSystemicDisorderUpdate = async () => {
    resetSelection();

    if (addData.disorder === '') {
      setSysGenErr((prev) => {
        return { ...prev, disorder: 'Enter the disorder' };
      });
    } else {
      //call api to store exam
      await axios
        .put(
          `${REACT_APP_BASE_URL}opd/systematic-examination-all/${addData._id}`,
          {
            exam: addData,
            departmentId
          },
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )
        .then(async (response) => {
          await getExamination();
          closeForm();
          handleClose();

          toast.success('Systemic Examination Disorder Update Successfully!!');
          setExpanded('2');
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleSystemicDisorderDelete = () => {
    resetSelection();

    let data = {
      ids: deleteSystemicIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/systematic-examination`, {
        headers,
        data
      })
      .then((response) => {
        getExamination();
        setDeletedSystemicIds([]);
        handleClose();

        closeForm();
        toast.success('Systemic Disorder Deleted Successfully!!');
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleSystemicSubdisorderDelete = (id) => {
    resetSelection();

    let data = {
      deleteIds: deleteSystemicIds,
      id: id
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/systematic-examination/sub-disorder`, {
        headers,
        data
      })
      .then((response) => {
        getExamination();
        setDeletedSystemicIds([]);
        closeForm();
        toast.success('Systemic Subdisorder Deleted Successfully!!');
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleUpdateSystemicSubdisorder = async (mainId, id, aainputVal) => {
    resetSelection();

    const er = [...err];
    let already = true;
    aainputVal.forEach((val, ind) => {
      if (val.name === '') {
        er[ind].name = 'Please Enter Subdisorder...';
      }
    });
    setErr(er);

    let result = true;
    for (let i = 0; i < aainputVal.length; i++) {
      let data = aainputVal[i];
      let t = Object.values(data).every((val) => val !== '');
      if (!t) {
        result = false;
      }
    }
    if (result && already) {
      let ddta = [];
      aainputVal.forEach((vv) => {
        let a = [];
        vv.objective.forEach((av) => {
          if (av.data !== '') {
            a.push(av);
          }
        });
        ddta.push({ ...vv, objective: a });
      });

      await axios
        .put(`${REACT_APP_BASE_URL}opd/systematic-examination/sub-disorder/${mainId}/${id}`, ddta[0], {
          headers: { Authorization: 'Bearer ' + token }
        })
        .then(async (response) => {
          await getExamination();

          closeForm();
          toast.success(`Subdisorder Updated Successfully!!`);
        })
        .catch((error) => {
          toast.error('Something went wrong, Please try later!!');
        });
    }
  };

  const handleSaveDeleteOtherExamination = () => {
    resetSelection();

    let data = {
      ids: deleteOtherIds
    };
    let headers = { Authorization: 'Bearer ' + token };
    axios
      .delete(`${REACT_APP_BASE_URL}opd/other-examination`, { headers, data })
      .then((response) => {
        getExamination();
        closeForm();
        handleClose();
        toast.success('Other Examination Deleted Successfully!!');
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };
  function handleClose() {
    setOpenDialog(false);
  }
  function handleDialogOpen() {
    setOpenDialog(true);
  }
  const handleChipSelection = (index, chipData) => {
    setSelectedChipIndex(index);
    setChipInputValue(chipData);
  };

  function resetSelection() {
    setSelectedChipIndex(null);
    setChipInputValue('');
    setLayer2index(null);
    setLayer3ChipSelectedFor4Index(null);
    setSelectedChips([]);
    setOpenLayer4EditDialog(false);
    setOpenLayer4DeleteDialog(false);
    setOpenDialog(false);
    setLayer3Edit(false);
    setLayer3Edit(false);
  }

  useEffect(() => {
    let filteredData = [];

    switch (activeTab) {
      case 0:
        filteredData = allGeneral?.filter((data) => data?._id === openData?._id);
        break;
      case 1:
        filteredData = allLocal?.filter((data) => data?._id === openData?._id);
        break;
      case 2:
        filteredData = allSystematic?.filter((data) => data?._id === openData?._id);
        break;
      default:
        filteredData = []; // Handle unexpected cases
    }

    setLayer3Data(filteredData);
  }, [activeTab, allGeneral, allLocal, allSystematic, openData]);

  const handleSaveUpdatelayer4 = async () => {
    resetSelection();
    if (selectedChipIndex === null) return;

    try {
      const res = await put(`opd/examination-update-fourth-layer/${layer3Data?.[0]?._id}`, {
        secondIndex: layer2index,
        thirdIndex: layer3ChipSelectedFor4Index,
        innerDataIndex: selectedChipIndex,
        data: chipInputValue,
        activeTab
      });

      if (res.success) {
        toast.success('Objective updated successfully!'); // Show success toast
        setOpenLayer4DeleteDialog(false);
        setOpenLayer4EditDialog(false);
        await Promise.all([getExamination()]);

        setLayer4({
          deleteLayer4: false
        });
      } else {
        toast.error('Failed to update objective.'); // Handle API failure case
      }
    } catch (error) {
      console.error('Error updating objective:', error);
      toast.error('Something went wrong!'); // Show error toast
    }
  };
  const handleSaveUpdatelayer3 = async () => {
    resetSelection();
    if (selectedChipIndex === null) return;

    try {
      const res = await put(`opd/examination-update-third-layer/${layer3Data?.[0]?._id}`, {
        secondIndex: layer2index,
        thirdIndex: selectedChipIndex,
        data: chipInputValue,
        activeTab
      });

      if (res.success) {
        toast.success('Objective updated successfully!'); // Show success toast
        setOpenLayer4DeleteDialog(false);
        setOpenLayer4EditDialog(false);
        await Promise.all([getExamination()]);

        setLayer4({
          deleteLayer4: false
        });
      } else {
        toast.error('Failed to update objective.'); // Handle API failure case
      }
    } catch (error) {
      console.error('Error updating objective:', error);
      toast.error('Something went wrong!'); // Show error toast
    }
  };

  const handleChipClick = (itemIndex) => {
    setSelectedChips(
      (prevSelected) =>
        prevSelected.includes(itemIndex)
          ? prevSelected.filter((index) => index !== itemIndex) // Deselect if already selected
          : [...prevSelected, itemIndex] // Select if not selected
    );
  };

  const handleDeleteGeneralExaminationLayer4 = async () => {
    resetSelection();
    try {
      const payload = {
        secondIndex: layer2index,
        thirdIndex: layer3ChipSelectedFor4Index,
        innerDataIndexes: selectedChips,
        activeTab
      };

      const res = await remove(`opd/examination-delete-fourth-layer/${layer3Data?.[0]?._id}`, payload);

      if (res.success) {
        toast.success('Deleted successfully!');
        await Promise.all([getExamination()]);
        setSelectedChipIndex(null);
        setLayer2index(null);
        setLayer3ChipSelectedFor4Index(null);
        setSelectedChips([]);
        setLayer4((prev) => ({ ...prev, deleteLayer4: false }));
      } else {
        toast.error(res.msg || 'Failed to delete objectives');
      }
    } catch (error) {
      console.error('Error deleting objectives:', error);
      toast.error('Error deleting objectives. Please try again.');
    }
  };
  const handleDeleteGeneralExaminationLayer3 = async () => {
    setLayer3Edit(false);
    setLayer3Delete(false);
    setOpenDialog(false);
    setOpen3Layer({
      edit3Layer: false,
      delete3Layer: false
    });
    resetSelection();
    try {
      const payload = {
        secondIndex: layer2index,
        thirdIndex: selectedChips,
        activeTab
      };

      const res = await remove(`opd/examination-delete-third-layer/${layer3Data?.[0]?._id}`, payload);

      if (res.success) {
        toast.success('Deleted successfully!');
        await Promise.all([getExamination()]);
        setSelectedChipIndex(null);
        setLayer2index(null);
        setLayer3ChipSelectedFor4Index(null);
        setSelectedChips([]);
        setLayer3Edit(false);
        setLayer3Delete(false);
        setOpenDialog(false);
        setOpen3Layer({
          edit3Layer: false,
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

  const [patientOpthalmicData, setPatientOpthalmicData] = useState({
    visionData: [],
    findingData: [],
    autoRefractionData: []
  });
  const [allReadyOpthalmicId, setAllReadyOpthalmicId] = useState({
    vision: null,
    finding: null,
    autoRef: null
  });
  async function getOpthalmicData() {
    try {
      const res = await get(`patient-opthelmic/${patient?.patientId?._id}`);
      if (res?.data) {
        setPatientOpthalmicData({
          visionData: res?.data?.visionData || [],
          findingData: res?.data?.findingData || [],
          autoRefractionData: res?.data?.autoRefractionData || []
        });
        setAllReadyOpthalmicId({
          vision: res?.data?.visionData?.[0]?._id,
          finding: res?.data?.findingData?.[0]?._id,
          autoRef: res?.data?.autoRefractionData?.[0]?._id
        });
      }
    } catch (error) {
      console.error('Error fetching ophthalmic data:', error);
    }
  }

  async function handleDeleteOpthalmic(type, id) {
    if (!id) {
      toast.error('Invalid ID');
      return;
    }
    const patientId = patient?.patientId?._id;
    try {
      const res = await remove(`patient-opthelmic/${patientId}/${type}/${id}`);

      if (res.success) {
        toast.success('Deleted successfully!');
        getOpthalmicData();
      } else {
        toast.error(res.message || 'Failed to delete.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }

  const [openDialogOpthalmic, setOpenDialogOpthalmic] = useState(false);
  const [dialogComponent, setDialogComponent] = useState(null);
  const [editDataOpthalmic, setEditDataOpthalmic] = useState(null);
  const handleCloseDialog = () => {
    setOpenDialogOpthalmic(false);
    setDialogComponent(null);
    setEditDataOpthalmic(null);
  };

  async function handleEditOpthalmic(type, data) {
    console.log('DATAAAAAAA', data);
    setEditDataOpthalmic(data); // Store the data for editing

    switch (type) {
      case 'vision':
        setDialogComponent(<EditVision editData={data} getOpthalmicData={getOpthalmicData} handleCloseDialogg={handleCloseDialog} />);
        break;
      case 'finding':
        setDialogComponent(<EditFinding editData={data} getOpthalmicData={getOpthalmicData} handleCloseDialogg={handleCloseDialog} />);
        break;
      case 'autoRefraction':
        setDialogComponent(
          data?.eyeDrop?.length > 0 ? (
            <EditDilatedComponent editData={data} getOpthalmicData={getOpthalmicData} handleCloseDialogg={handleCloseDialog} />
          ) : (
            <EditAutoRefractionComponent editData={data} getOpthalmicData={getOpthalmicData} handleCloseDialogg={handleCloseDialog} />
          )
        );
        break;
      // Add more cases if needed
      default:
        setDialogComponent(null);
    }

    setOpenDialogOpthalmic(true); // Open the dialog
  }

  useEffect(() => {
    getOpthalmicData();
  }, [patient]);
  useEffect(() => {
    setPatientExist(false);
  }, [patient]);
  const [patientGlassP, setPatientGlassP] = useState([]);
  const getGlassPrescription = async () => {
    if (!patient) return;

    try {
      const response = await get(`patient-glass-prescription/${patient.patientId._id}`, {
        headers: { Authorization: 'Bearer ' + token }
      });

      if (response?.data) {
        setPatientGlassP(response.data);
      }
    } catch (error) {
      console.error('Error fetching glass prescription:', error);
    }
  };

  useEffect(() => {
    getGlassPrescription();
    // eslint-disable-next-line

  }, [patient]);
  return (
    <Box className="paticularSection">
      {loader ? (
        <Loader />
      ) : (
        <Grid container justifyContent="space-between" height="inherit">
          <Grid item xs={8} height="inherit" style={{ paddingBottom: '5px' }}>
            <Grid
              item
              sx={{
                backgroundColor: '#e8f0fe',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                height: 'inherit'
              }}
            >
              {selectedMenu !== 'All' && (
                <Typography variant="h5" className="popupHead" sx={{ mb: 2, fontWeight: 'bold', color: '#2c3e50' }}>
                  Examination
                </Typography>
              )}

              <Box sx={{ width: '100%', padding: 2 }}>
                {/* Tabs Navigation */}
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    '& .MuiTabs-indicator': { backgroundColor: '#126078' },
                    mb: 3
                  }}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab
                    label="General Examination"
                    sx={{
                      color: activeTab === 0 ? '#fff !important' : '#555',
                      fontWeight: activeTab === 0 ? 'bold' : 'normal',
                      backgroundColor: activeTab === 0 ? '#126078' : 'transparent',
                      borderRadius: '8px'
                    }}
                  />
                  <Tab
                    label={isOphthalmology?.toLowerCase()?.trim() === 'ophthalmology' ? 'Eye Examination' : 'Local Examination'}
                    sx={{
                      color: activeTab === 1 ? '#fff !important' : '#555',
                      fontWeight: activeTab === 1 ? 'bold' : 'normal',
                      backgroundColor: activeTab === 1 ? '#126078' : 'transparent',
                      borderRadius: '8px'
                    }}
                  />
                  <Tab
                    label="Systemic Examination"
                    sx={{
                      color: activeTab === 2 ? '#fff !important' : '#555',
                      fontWeight: activeTab === 2 ? 'bold' : 'normal',
                      backgroundColor: activeTab === 2 ? '#126078' : 'transparent',
                      borderRadius: '8px'
                    }}
                  />
                  <Tab
                    label="Other Examination"
                    sx={{
                      color: activeTab === 3 ? '#fff !important' : '#555',
                      fontWeight: activeTab === 3 ? 'bold' : 'normal',
                      backgroundColor: activeTab === 3 ? '#126078' : 'transparent',
                      borderRadius: '8px'
                    }}
                  />

                  {isOphthalmology?.toLowerCase()?.trim() === 'ophthalmology' && (
                    <Tab
                      label="Ophthalmic Examination"
                      sx={{
                        color: activeTab === 4 ? '#fff !important' : '#555',
                        fontWeight: activeTab === 4 ? 'bold' : 'normal',
                        backgroundColor: activeTab === 4 ? '#126078' : 'transparent',
                        borderRadius: '8px'
                      }}
                    />
                  )}
                </Tabs>

                {/* General Examination Tab Content */}
                {activeTab === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Button variant="contained" color="primary" onClick={addGeneralDisorderHandler}>
                          + Add Disorder for Examination
                        </Button>
                        {allGeneral.length > 0 && (
                          <>
                            <IconButton color="primary" onClick={editGeneralDisorderExamHandler}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton color="error" onClick={deleteGeneralDisorderExamHandler}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                      {allGeneral.length === 0 && (
                        <Typography variant="h6" color="textSecondary" mb={2}>
                          General Examination Not Available, Please Add...
                        </Typography>
                      )}
                      <Grid container spacing={2}>
                        {showGeneral.map((sVal, inx) => (
                          <Grid item xs={12} md={6} key={inx}>
                            <Box p={2} mb={2} sx={{ boxShadow: 3, backgroundColor: '#fff', borderRadius: 3 }}>
                              <Typography variant="h6" color="primary" mb={1}>
                                {sVal?.exam?.disorder}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1} justifyContent="space-between">
                                <Input
                                  type="search"
                                  sx={{ width: 170 }}
                                  placeholder="Search..."
                                  value={searchValueGeneral[inx] || ''} // fallback to empty string
                                  onChange={(e) => handleSearchGeneral(e, sVal, inx)}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <Search color="disabled" />
                                    </InputAdornment>
                                  }
                                />

                                <Box>
                                  <IconButton
                                    color="success"
                                    onClick={() => {
                                      addGeneralExamHandler(sVal);
                                      handleDialogOpen();
                                    }}
                                  >
                                    <Add fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    color="primary"
                                    onClick={() => {
                                      editGeneralExamHandler(sVal, sVal.exam.subDisorder);
                                      handleDialogOpen();
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() => {
                                      deleteGeneralExamHandler(sVal, sVal.exam.subDisorder);
                                      handleDialogOpen();
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              {sVal.exam.subDisorder.length > 0 ? (
                                <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                                  {sVal.exam.subDisorder
                                    .filter((val, index) => {
                                      const query = (searchValueGeneral[inx] || '').toLowerCase();
                                      const name = val.name?.toLowerCase() || '';
                                      const isMatch = name.includes(query);
                                      return query ? isMatch : index < 5;
                                    })
                                    .map((val, ind) => {
                                      let pre = false;
                                      let sub = val;

                                      openData?.subDisorder?.forEach((op) => {
                                        if (op?._id === val?._id) {
                                          pre = true;
                                        } else {
                                          pre = false;
                                        }
                                      });

                                      return (
                                        <Chip
                                          key={ind}
                                          label={val.name}
                                          sx={{
                                            borderWidth: 2,
                                            borderColor: pre ? 'primary.main' : 'secondary.main',
                                            borderStyle: 'solid',
                                            mr: 1,
                                            my: 1
                                          }}
                                          variant={pre ? 'default' : 'outlined'}
                                          color={pre ? 'primary' : 'default'}
                                          onClick={() => {
                                            setLayer2index(ind);
                                            closeForm();
                                            handleDialogOpen();
                                            setOpenSubDisorderGeneralP(true);
                                            setAddData({
                                              disorder: sVal,
                                              subDisorder: val.answerType === 'Objective' ? val : sub
                                            });

                                            let med = {
                                              disorder: sVal.exam.disorder,
                                              subDisorder: [
                                                { _id: val._id, name: val.name, answerType: val.answerType, objective: [], value: '' }
                                              ],
                                              _id: sVal._id
                                            };

                                            patientExamination.general.forEach((v) => {
                                              if (v.disorder === sVal.exam.disorder && v._id === sVal._id) {
                                                med = v;
                                              }
                                            });

                                            setOpenData(med);
                                          }}
                                        />
                                      );
                                    })}
                                </Box>
                              ) : (
                                <Typography variant="body2" color="textSecondary" mt={1}>
                                  Not Found
                                </Typography>
                              )}

                              {showGeneral.length > inx + 1 && <hr className="hrExam" />}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/* Local Examination Tab Content */}
                {activeTab === 1 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Button variant="contained" color="primary" onClick={addLocalDisorderHandler} sx={{ mr: 1 }}>
                          + Add Disorder for Examination
                        </Button>
                        {allLocal.length > 0 && (
                          <>
                            <IconButton title="Edit Disorder Heading" onClick={editLocalDisorderExamHandler}>
                              <Edit color="primary" fontSize="small" />
                            </IconButton>
                            <IconButton title="Delete Disorder Heading" onClick={deleteLocalDisorderExamHandler}>
                              <Delete color="error" fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                      {allLocal.length === 0 && (
                        <Typography variant="h6" color="textSecondary" textAlign="center" mb={2}>
                          Local Examination Not Available, Please Add...
                        </Typography>
                      )}
                      <Grid container spacing={2}>
                        {showLocal.map((sVal, inx) => (
                          <Grid item xs={12} md={6} key={inx}>
                            <Box key={inx} mb={2} p={2} sx={{ boxShadow: 3, borderRadius: 3, backgroundColor: '#fff' }}>
                              <Typography variant="h6" gutterBottom>
                                {sVal?.exam?.disorder}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Input
                                  type="search"
                                  placeholder="Search..."
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <Search color="action" />
                                    </InputAdornment>
                                  }
                                  onChange={(e) => handleSearchLocal(e, sVal, inx)}
                                  value={searchValueLocal[inx]}
                                  sx={{ mb: 2 }}
                                />

                                <Box display="flex" alignItems="center" gap={1}>
                                  {!sVal.exam.diagram && (
                                    <Button
                                      sx={{ height: 40, fontSize: '0.7rem', width: 70 }}
                                      onClick={() => {
                                        setLocalAddDialog(true);
                                        setTempData(sVal);
                                        handleButtonClickAddImg();
                                      }}
                                      variant="contained"
                                    >
                                      Add Image
                                    </Button>
                                  )}
                                  <IconButton
                                    title="Add Subdisorder"
                                    onClick={() => {
                                      addLocalExamHandler(sVal);
                                      handleDialogOpen();
                                    }}
                                  >
                                    <Add sx={{ color: '#089bab' }} fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    title="Edit Subdisorder"
                                    onClick={() => {
                                      editLocalExamHandler(sVal, sVal.exam.subDisorder);
                                      handleDialogOpen();
                                    }}
                                  >
                                    <Edit color="primary" fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    title="Delete Subdisorder"
                                    onClick={() => {
                                      deleteLocalExamHandler(sVal, sVal.exam.subDisorder);
                                      handleDialogOpen();
                                    }}
                                  >
                                    <Delete color="error" fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>

                              {sVal.exam.diagram && (
                                <Box
                                  display="flex"
                                  mt={1}
                                  sx={{
                                    gap: 2,
                                    alignItems: 'center',
                                    boxShadow: 3,
                                    width: 200,
                                    ml: 'auto',
                                    justifyContent: 'center',
                                    p: 1,
                                    border: '1px solid #666', // Adds a light gray border
                                    borderRadius: 2 // Rounded corners (adjust as needed)
                                  }}
                                >
                                  <img
                                    alt="localDiaImage"
                                    src={sVal.exam.diagram}
                                    className="systematicDiaImage"
                                    onClick={() => {
                                      setOpen(true);
                                      document.getElementById('bodyId').style.zoom = '1';
                                      setImageSrc({
                                        ...sVal,
                                        exam: {
                                          ...sVal.exam,
                                          subDisorder: patientExamination.local.find((v) => v._id === sVal._id)?.subDisorder || []
                                        }
                                      });
                                    }}
                                  />

                                  <Edit
                                    fontSize="small"
                                    sx={{ cursor: 'pointer', color: 'blue', ml: 1 }}
                                    onClick={() => {
                                      setSystemicDialog(true);
                                      setTempData(sVal);
                                      document.getElementById('fileInput1').click();
                                    }}
                                  />
                                  <Delete
                                    fontSize="small"
                                    sx={{ cursor: 'pointer', color: 'red', ml: 1 }}
                                    onClick={() => {
                                      setSystemicDialogDelete(true);
                                      handleDeleteLocalDialogDelete(sVal);
                                    }}
                                  />

                                  <Dialog open={systemicDialog} onClose={() => setSystemicDialog(false)}>
                                    <DialogContent>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'block', marginBottom: '10px' }}
                                        onChange={handleFileChange}
                                      />

                                      {/* Show selected image preview */}
                                      {base64Img && (
                                        <div style={{ textAlign: 'center' }}>
                                          <Typography variant="body2" color="textSecondary">
                                            Selected Image:
                                          </Typography>
                                          <img
                                            src={base64Img}
                                            alt="Selected"
                                            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '10px' }}
                                          />
                                        </div>
                                      )}
                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={() => setSystemicDialog(false)} color="secondary">
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          if (base64Img) {
                                            editDiagramHandlerLocal(sVal, base64Img); // Pass Base64 image to edit function
                                          }
                                          setSystemicDialog(false);
                                        }}
                                        color="primary"
                                        disabled={!base64Img} // Disable upload if no file selected
                                      >
                                        Upload
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
                                </Box>
                              )}

                              {sVal.exam.subDisorder.length > 0 ? (
                                <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                                  {sVal.exam.subDisorder
                                    .filter((val, index) => {
                                      const query = (searchValueLocal[inx] || '').toLowerCase();
                                      const name = val.name?.toLowerCase() || '';
                                      const isMatch = name.includes(query);
                                      return query ? isMatch : index < 5;
                                    })
                                    .map((val, ind) => {
                                      let pre = false;
                                      let sub = val;

                                      openData?.subDisorder?.forEach((op) => {
                                        if (op?._id === val?._id) {
                                          pre = true;
                                        } else {
                                          pre = false;
                                        }
                                      });

                                      return (
                                        <Chip
                                          key={ind}
                                          label={val.name}
                                          sx={{
                                            borderWidth: 2,
                                            borderColor: pre ? 'primary.main' : 'secondary.main',
                                            borderStyle: 'solid',
                                            mr: 1,
                                            my: 1
                                          }}
                                          variant={pre ? 'default' : 'outlined'}
                                          color={pre ? 'primary' : 'default'}
                                          onClick={() => {
                                            setLayer2index(ind);
                                            closeForm();
                                            handleDialogOpen();
                                            setOpenSubDisorderLocalP(true);
                                            setAddData({
                                              disorder: sVal,
                                              subDisorder: val.answerType === 'Objective' ? val : sub
                                            });

                                            let med = {
                                              disorder: sVal.exam.disorder,
                                              subDisorder: [
                                                { _id: val._id, name: val.name, answerType: val.answerType, objective: [], value: '' }
                                              ],
                                              _id: sVal._id
                                            };

                                            patientExamination.local.forEach((v) => {
                                              if (v.disorder === sVal.exam.disorder && v._id === sVal._id) {
                                                med = v;
                                              }
                                            });

                                            setOpenData(med);
                                          }}
                                        />
                                      );
                                    })}
                                </Box>
                              ) : (
                                <Typography variant="body2" color="textSecondary" mt={1}>
                                  Not Found
                                </Typography>
                              )}
                              {/* {showLocal.length > inx + 1 && <Box mt={2} borderBottom={1} borderColor="grey.300" />} */}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {/* Systemic  Examination Tab Content*/}
                {activeTab === 2 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          className="addBtn"
                          sx={{ mb: 2 }}
                          title="Add Disorders for Examination"
                          onClick={addSystematicDisorderHandler}
                        >
                          + Add Disorder for Examination
                        </Button>

                        {allSystematic.length > 0 && (
                          <Box display="flex" gap={1} alignItems="center" mb={2} ml={1}>
                            <IconButton title="Edit Disorder Heading for Systemic Examination" onClick={editSystemicDisorderExamHandler}>
                              <Edit fontSize="small" sx={{ color: 'blue' }} />
                            </IconButton>
                            <IconButton
                              title="Delete Disorder Heading for Systemic Examination"
                              onClick={deleteSystemicDisorderExamHandler}
                            >
                              <Delete fontSize="small" sx={{ color: 'red' }} />
                            </IconButton>
                          </Box>
                        )}

                        {allSystematic.length === 0 && (
                          <Typography variant="h6" sx={{ mb: 2, color: 'gray' }} className="noFoundOPd">
                            Systemic Examination Not Available, Please Add...
                          </Typography>
                        )}
                      </Box>
                      {/* systemic examination disoders */}
                      <Grid container spacing={2}>
                        {showSystematic.map((sVal, inx) => (
                          <Grid item xs={12} md={6} key={inx}>
                            <Box key={inx} sx={{ p: 2, boxShadow: 3, backgroundColor: '#fff', mt: 2, borderRadius: 3 }}>
                              <Typography variant="h6" sx={{ mb: 1 }} className="systematicNameNote">
                                {sVal?.exam?.disorder}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1} justifyContent="space-between">
                                <Input
                                  className="search_patient_data"
                                  type="search"
                                  placeholder="Search..."
                                  value={searchValueSystematic[inx] || ''}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <Search className="search_patient_data_icon" />
                                    </InputAdornment>
                                  }
                                  onChange={(e) => handleSearchSystematic(e, sVal, inx)}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {!sVal.exam.diagram && (
                                    <Button
                                      className="addBtn imgbtn"
                                      onClick={() => {
                                        setSystemicAddDialog(true);
                                        setTempData(sVal);
                                        handleButtonClickAddImg();
                                      }}
                                      variant="contained"
                                    >
                                      Add Image
                                    </Button>
                                  )}
                                  <IconButton
                                    title={`Add ${sVal.disorder} Subdisorder`}
                                    onClick={() => {
                                      addSystematicExamHandler(sVal);
                                      handleDialogOpen();
                                    }}
                                  >
                                    <Add fontSize="small" sx={{ color: '#089bab' }} />
                                  </IconButton>
                                  <IconButton
                                    title={`Edit ${sVal.disorder} Subdisorder`}
                                    onClick={() => {
                                      editSystemicExamHandler(sVal, sVal.exam.subDisorder);
                                      handleDialogOpen();
                                    }}
                                  >
                                    <Edit fontSize="small" sx={{ color: 'blue' }} />
                                  </IconButton>
                                  <IconButton
                                    title={`Delete ${sVal.disorder} Subdisorder`}
                                    onClick={() => {
                                      deleteSystemicExamHandler(sVal, sVal.exam.subDisorder);
                                      handleDialogOpen();
                                    }}
                                  >
                                    <Delete fontSize="small" sx={{ color: 'red' }} />
                                  </IconButton>
                                </Box>
                              </Box>
                              {sVal.exam.diagram && (
                                <Box
                                  display="flex"
                                  justifyContent="flex-end"
                                  mt={1}
                                  sx={{
                                    gap: 2,
                                    alignItems: 'center',
                                    boxShadow: 3,
                                    width: 200,
                                    ml: 'auto',
                                    justifyContent: 'center',
                                    p: 1,
                                    border: '1px solid #666', // Adds a light gray border
                                    borderRadius: 2 // Rounded corners (adjust as needed)
                                  }}
                                >
                                  <img
                                    alt="systematicDiaImage"
                                    src={sVal.exam.diagram}
                                    className="systematicDiaImage"
                                    onClick={() => {
                                      setOpen(true);
                                      document.getElementById('bodyId').style.zoom = '1';
                                      setImageSrc({
                                        ...sVal,
                                        exam: {
                                          ...sVal.exam,
                                          subDisorder: patientExamination.systematic.find((v) => v._id === sVal._id)?.subDisorder || []
                                        }
                                      });
                                    }}
                                  />

                                  <Edit
                                    fontSize="small"
                                    sx={{ cursor: 'pointer', color: 'blue', ml: 1 }}
                                    onClick={() => {
                                      setSystemicDialog(true);
                                      setTempData(sVal);
                                      document.getElementById('fileInput1').click();
                                    }}
                                  />
                                  <Delete
                                    fontSize="small"
                                    sx={{ cursor: 'pointer', color: 'red', ml: 1 }}
                                    onClick={() => {
                                      handleDeleteSystemicDialogDelete(sVal);
                                    }}
                                  />

                                  <Dialog open={systemicDialog} onClose={() => setSystemicDialog(false)}>
                                    <DialogContent>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'block', marginBottom: '10px' }}
                                        onChange={handleFileChange}
                                      />

                                      {/* Show selected image preview */}
                                      {base64Img && (
                                        <div style={{ textAlign: 'center' }}>
                                          <Typography variant="body2" color="textSecondary">
                                            Selected Image:
                                          </Typography>
                                          <img
                                            src={base64Img}
                                            alt="Selected"
                                            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '10px' }}
                                          />
                                        </div>
                                      )}
                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={() => setSystemicDialog(false)} color="secondary">
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          if (base64Img) {
                                            editDiagramHandler(sVal, base64Img); // Pass Base64 image to edit function
                                          }
                                          setSystemicDialog(false);
                                        }}
                                        color="primary"
                                        disabled={!base64Img} // Disable upload if no file selected
                                      >
                                        Upload
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
                                </Box>
                              )}

                              {sVal.exam.subDisorder.length > 0 ? (
                                <Box className="inputChip" mt={2}>
                                  {sVal.exam.subDisorder
                                    .filter((val, index) => {
                                      const query = (searchValueSystematic[inx] || '').toLowerCase();
                                      const name = val.name?.toLowerCase() || '';
                                      return query ? name.includes(query) : index < 5;
                                    })
                                    .map((val, ind) => {
                                      // Check if this chip is pre-selected (in openData)
                                      const isPreSelected = openData?.subDisorder?.some((op) => op?._id === val?._id) || false;

                                      // Check if it's already selected in patientExamination
                                      const isSelected =
                                        patientExamination.systematic
                                          .find((v) => v._id === sVal._id)
                                          ?.subDisorder?.some((sV) => sV.name === val.name) || false;

                                      return (
                                        <Chip
                                          key={ind}
                                          label={val.name}
                                          sx={{
                                            borderWidth: 2,
                                            borderColor: isPreSelected ? 'primary.main' : 'secondary.main',
                                            borderStyle: 'solid',
                                            mr: 1,
                                            my: 1
                                          }}
                                          variant={isPreSelected ? 'default' : 'outlined'}
                                          color={isPreSelected ? 'primary' : 'default'}
                                          className={isSelected ? 'selectProblemActive' : 'selectProblem'}
                                          onClick={() => {
                                            setLayer2index(ind);
                                            handleDialogOpen();
                                            closeForm();
                                            setOpenSubDisorderSystemicP(true);
                                            setAddData({ disorder: sVal, subDisorder: val });

                                            const found = patientExamination.systematic.find((v) => v._id === sVal._id);

                                            setOpenData(
                                              found || {
                                                disorder: sVal.exam.disorder,
                                                subDisorder: [
                                                  {
                                                    _id: val._id,
                                                    name: val.name,
                                                    answerType: val.answerType,
                                                    objective: [],
                                                    value: ''
                                                  }
                                                ],
                                                _id: sVal._id
                                              }
                                            );
                                          }}
                                        />
                                      );
                                    })}
                                </Box>
                              ) : (
                                <Typography variant="body2" color="textSecondary" mt={1}>
                                  Not Found
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {activeTab === 3 && (
                  <Grid sx={{ boxShadow: 3, borderRadius: 3, mt: 2, backgroundColor: '#fff', p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Input
                        className="search_patient_data"
                        type="search"
                        placeholder="Search..."
                        endAdornment={
                          <InputAdornment position="end">
                            <Search className="search_patient_data_icon" />
                          </InputAdornment>
                        }
                        onChange={handleSearchOther}
                        value={searchValueOther}
                        sx={{ flex: 1 }}
                      />
                      <IconButton title="Add Other Examination" onClick={addExamOtherHandler}>
                        <Add fontSize="small" sx={{ color: '#089bab' }} />
                      </IconButton>
                      {allOther.length > 0 && (
                        <>
                          <IconButton title="Edit Other Examination" onClick={editExamOtherHandler}>
                            <Edit fontSize="small" sx={{ color: 'blue' }} />
                          </IconButton>
                          <IconButton title="Delete Other Examination" onClick={deleteExamOtherHandler}>
                            <Delete fontSize="small" sx={{ color: 'red' }} />
                          </IconButton>
                        </>
                      )}
                    </Box>

                    {allOther.length === 0 ? (
                      <Typography variant="h6" sx={{ color: 'gray', mb: 2 }} className="noFoundOPd">
                        Other Examination Not Available, Please Add...
                      </Typography>
                    ) : (
                      <>
                        {showOther.length > 0 ? (
                          <Box className="inputChip">
                            {showOther.map((val, ind) => {
                              let pre = false;
                              let dta = {
                                _id: val._id,
                                exam: val.exam,
                                notes: ''
                              };
                              if (addData?._id === val?._id) {
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
                                  label={val.exam}
                                  onClick={() => {
                                    setLayer2index(ind);

                                    closeForm();
                                    handleDialogOpen();
                                    setOpenAddExamOtherData(true);
                                    setAddData(dta);
                                  }}
                                />
                              );
                            })}
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: 'gray', mt: 2 }}>
                            Not Found
                          </Typography>
                        )}
                      </>
                    )}
                  </Grid>
                )}

                {/* Ophthalmology Examination*/}
                {activeTab === 4 && (
                  <Grid container justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        boxShadow: 3,
                        borderRadius: 3,
                        backgroundColor: '#fff',
                        p: 4
                      }}
                    >
                      <Typography variant="h4" sx={{ my: 3, textAlign: 'center', fontWeight: 'bold' }}>
                        Visual Acuity
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <VisionComponent
                          departmentId={departmentId}
                          getOpthalmicData={getOpthalmicData}
                          allReadyOpthalmicId={allReadyOpthalmicId}
                        />
                      </Box>

                      <Box sx={{ mt: 4 }}>
                        <FindingsComponent
                          departmentId={departmentId}
                          getOpthalmicData={getOpthalmicData}
                          allReadyOpthalmicId={allReadyOpthalmicId}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        boxShadow: 3,
                        borderRadius: 3,
                        backgroundColor: '#fff',
                        p: 4
                      }}
                      mt={3}
                    >
                      <Box>
                        <AutoRefractionComponent
                          departmentId={departmentId}
                          getOpthalmicData={getOpthalmicData}
                          allReadyOpthalmicId={allReadyOpthalmicId}
                        />
                        <br />
                        <Dialated
                          departmentId={departmentId}
                          getOpthalmicData={getOpthalmicData}
                          allReadyOpthalmicId={allReadyOpthalmicId}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <GlassPrescription
                        patientGlassP={patientGlassP}
                        patient={patient}
                        departmentId={departmentId}
                        getGlassPrescription={getGlassPrescription}
                        isExamination={true}
                      />
                      <RemarkSection departmentId={departmentId} />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>
          {
            <>
              <Grid md={3.5} item style={{ height: selectedMenu !== 'All' && '100%' }}>
                {(patientExamination.general.length > 0 ||
                  patientExamination.local.length > 0 ||
                  patientExamination.systematic.length > 0 ||
                  patientExamination.other.some((obj) => obj.notes !== '')) && (
                  <Box className="selectedPtCategory">
                    {patientExamination.general.length > 0 && (
                      <Box className="ptSpecficExam" sx={{ pb: 2 }}>
                        {/* Heading */}
                        <Typography
                          variant="h6"
                          className="examHeading"
                          onClick={toggleAccordion}
                          sx={{
                            mb: 2,
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: '#1976d2'
                          }}
                        >
                          General Examination
                        </Typography>

                        {patientExamination.general.map((sVal, inx) => (
                          <Box key={inx} sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#f5f5f5', boxShadow: 1 }}>
                            {/* Disorder Name */}
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
                              {sVal.disorder}:
                            </Typography>

                            {sVal.subDisorder.map((val, ind) => (
                              <>
                                <Box key={ind} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1, alignItems: 'center' }}>
                                  {/* Display Data in One Row */}
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {val.name} {val.objective?.map((obj) => `-> ${obj.data}`)}
                                    {val?.value ? `-> ${val.value}` : ''}
                                    {val.objective?.flatMap((obj) => obj.innerData?.map((inner) => `-> ${inner.data}`))}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                  {/* Edit Icon */}
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setOpenDialog(true);
                                      closeForm();
                                      setOpenSubDisorderGeneralP(true);

                                      let matchedSubDisorder = null;
                                      allGeneral.forEach((av) => {
                                        if (av._id === sVal._id) {
                                          av.exam.subDisorder.forEach((subo) => {
                                            if (subo.name === val.name && subo.answerType === 'Objective') {
                                              matchedSubDisorder = subo;
                                            }
                                          });
                                        }
                                      });

                                      setAddData({
                                        disorder: { exam: sVal, _id: sVal._id },
                                        subDisorder: matchedSubDisorder || val
                                      });
                                      setOpenData(sVal);
                                    }}
                                  >
                                    <Edit sx={{ fontSize: 18, color: '#1976d2' }} />
                                  </IconButton>

                                  {/* Delete Icon */}
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      closeForm();
                                      let medPro = {};
                                      let afterDel = [];

                                      patientExamination.general.forEach((v) => {
                                        if (v.disorder === sVal.disorder && v._id === sVal._id) {
                                          medPro = {
                                            _id: v._id,
                                            disorder: v.disorder,
                                            subDisorder: v.subDisorder,
                                            notes: v.notes
                                          };
                                        }
                                      });

                                      medPro.subDisorder.forEach((vM) => {
                                        if (vM.name !== val.name) {
                                          afterDel.push(vM);
                                        }
                                      });

                                      if (afterDel.length === 0) {
                                        let a = [];
                                        patientExamination.general.forEach((vM) => {
                                          if (vM.disorder !== sVal.disorder) {
                                            a.push(vM);
                                          }
                                        });
                                        handlePatientSubmit({
                                          ...patientExamination,
                                          general: a
                                        });
                                      } else {
                                        let sys = [...patientExamination.general, { ...medPro, subDisorder: afterDel }];
                                        sys = [...new Map(sys.map((item) => [item['disorder'], item])).values()];
                                        handlePatientSubmit({
                                          ...patientExamination,
                                          general: sys
                                        });
                                      }
                                    }}
                                  >
                                    <Close sx={{ fontSize: 18, color: '#d32f2f' }} />
                                  </IconButton>
                                </Box>
                              </>
                            ))}

                            {patientExamination.general.length > inx + 1 && <Divider sx={{ my: 2, bgcolor: '#ddd' }} />}
                          </Box>
                        ))}
                      </Box>
                    )}

                    {patientExamination.local.length > 0 && (
                      <Box className="ptSpecficExam" sx={{ pb: 2 }}>
                        {/* Heading */}
                        <Typography
                          variant="h6"
                          className="examHeading"
                          onClick={toggleAccordion}
                          sx={{
                            mb: 2,
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: '#1976d2'
                          }}
                        >
                          Local Examination
                        </Typography>

                        {patientExamination?.local?.map((sVal, inx) => (
                          <Box key={inx} sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#f5f5f5', boxShadow: 1 }}>
                            {/* Disorder Name */}
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
                              {sVal?.disorder}:
                            </Typography>

                            {sVal?.subDisorder.map((val, ind) => (
                              <>
                                <Box key={ind} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1, alignItems: 'center' }}>
                                  {/* Display Data in One Row */}
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {val.name} {val.objective?.map((obj) => `-> ${obj.data}`)}
                                    {val.objective?.flatMap((obj) => obj.innerData?.map((inner) => `-> ${inner.data}`))}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                  {/* Edit Icon */}
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setOpenDialog(true);

                                      closeForm();
                                      setOpenSubDisorderLocalP(true);

                                      let matchedSubDisorder = null;
                                      allLocal.forEach((av) => {
                                        if (av._id === sVal._id) {
                                          av.exam.subDisorder.forEach((subo) => {
                                            if (subo.name === val.name && subo.answerType === 'Objective') {
                                              matchedSubDisorder = subo;
                                            }
                                          });
                                        }
                                      });

                                      setAddData({
                                        disorder: { exam: sVal, _id: sVal._id },
                                        subDisorder: matchedSubDisorder || val
                                      });
                                      setOpenData(sVal);
                                    }}
                                  >
                                    <Edit sx={{ fontSize: 18, color: '#1976d2' }} />
                                  </IconButton>

                                  {/* Delete Icon */}
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      closeForm();
                                      let medPro = {};
                                      let afterDel = [];

                                      patientExamination.local.forEach((v) => {
                                        if (v.disorder === sVal.disorder && v._id === sVal._id) {
                                          medPro = {
                                            _id: v._id,
                                            disorder: v.disorder,
                                            subDisorder: v.subDisorder,
                                            notes: v.notes
                                          };
                                        }
                                      });

                                      medPro.subDisorder.forEach((vM) => {
                                        if (vM.name !== val.name) {
                                          afterDel.push(vM);
                                        }
                                      });

                                      if (afterDel.length === 0) {
                                        let a = [];
                                        patientExamination.local.forEach((vM) => {
                                          if (vM.disorder !== sVal.disorder) {
                                            a.push(vM);
                                          }
                                        });
                                        handlePatientSubmit({
                                          ...patientExamination,
                                          local: a
                                        });
                                      } else {
                                        let sys = [...patientExamination.local, { ...medPro, subDisorder: afterDel }];
                                        sys = [...new Map(sys.map((item) => [item['disorder'], item])).values()];
                                        handlePatientSubmit({
                                          ...patientExamination,
                                          local: sys
                                        });
                                      }
                                    }}
                                  >
                                    <Close sx={{ fontSize: 18, color: '#d32f2f' }} />
                                  </IconButton>
                                </Box>
                              </>
                            ))}

                            {patientExamination.local.length > inx + 1 && <Divider sx={{ my: 2, bgcolor: '#ddd' }} />}
                          </Box>
                        ))}
                      </Box>
                    )}
                    {patientExamination.systematic.length > 0 && (
                      <Box className="ptSpecficExam" sx={{ pb: 2 }}>
                        {/* Heading */}
                        <Typography
                          variant="h6"
                          className="examHeading"
                          onClick={toggleAccordion}
                          sx={{
                            mb: 2,
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: '#1976d2'
                          }}
                        >
                          Systemic Examination
                        </Typography>

                        {patientExamination?.systematic.map((sVal, inx) => (
                          <Box key={inx} sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#f5f5f5', boxShadow: 1 }}>
                            {/* Disorder Name */}
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
                              {sVal.disorder}:
                            </Typography>

                            {sVal.subDisorder.map((val, ind) => (
                              <>
                                <Box key={ind} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1, alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {val.name} {val.objective?.map((obj) => `-> ${obj.data}`)}
                                    {val.objective?.flatMap((obj) => obj.innerData?.map((inner) => `-> ${inner.data}`))}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setOpenDialog(true);

                                      closeForm();
                                      setOpenSubDisorderSystemicP(true);

                                      let matchedSubDisorder = null;
                                      allSystematic.forEach((av) => {
                                        if (av._id === sVal._id) {
                                          av.exam.subDisorder.forEach((subo) => {
                                            if (subo.name === val.name && subo.answerType === 'Objective') {
                                              matchedSubDisorder = subo;
                                            }
                                          });
                                        }
                                      });

                                      setAddData({
                                        disorder: { exam: sVal, _id: sVal._id },
                                        subDisorder: matchedSubDisorder || val
                                      });
                                      setOpenData(sVal);
                                    }}
                                  >
                                    <Edit sx={{ fontSize: 18, color: '#1976d2' }} />
                                  </IconButton>

                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      closeForm();
                                      let medPro = {};
                                      let afterDel = [];

                                      patientExamination.systematic.forEach((v) => {
                                        if (v.disorder === sVal.disorder && v._id === sVal._id) {
                                          medPro = {
                                            _id: v._id,
                                            disorder: v.disorder,
                                            subDisorder: v.subDisorder,
                                            notes: v.notes
                                          };
                                        }
                                      });

                                      medPro.subDisorder.forEach((vM) => {
                                        if (vM.name !== val.name) {
                                          afterDel.push(vM);
                                        }
                                      });

                                      if (afterDel.length === 0) {
                                        let a = [];
                                        patientExamination.systematic.forEach((vM) => {
                                          if (vM.disorder !== sVal.disorder) {
                                            a.push(vM);
                                          }
                                        });
                                        handlePatientSubmit({
                                          ...patientExamination,
                                          systematic: a
                                        });
                                      } else {
                                        let sys = [...patientExamination.systematic, { ...medPro, subDisorder: afterDel }];
                                        sys = [...new Map(sys.map((item) => [item['disorder'], item])).values()];
                                        handlePatientSubmit({
                                          ...patientExamination,
                                          systematic: sys
                                        });
                                      }
                                    }}
                                  >
                                    <Close sx={{ fontSize: 18, color: '#d32f2f' }} />
                                  </IconButton>
                                </Box>
                              </>
                            ))}

                            {/* Edit and Delete Icons at Bottom */}
                          </Box>
                        ))}
                      </Box>
                    )}

                    {patientExamination.other.map(
                      (val, ind) =>
                        val.notes !== '' && (
                          <Box key={ind} sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#f5f5f5', boxShadow: 1 }}>
                            <Typography
                              variant="h6"
                              className="examHeading"
                              onClick={toggleAccordion}
                              sx={{
                                mb: 2,
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                color: '#1976d2'
                              }}
                            >
                              Other Examination
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 'bold', color: '#333', cursor: 'pointer' }}
                              onClick={() => {
                                closeForm();
                                setOpenAddExamOtherData(true);
                                setAddData(val);
                              }}
                            >
                              {val.exam} {`${'->'}`} {val.notes}
                            </Typography>

                            {/* Edit and Delete Icons */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setAddData(val);
                                }}
                              >
                                <Edit sx={{ fontSize: 18, color: '#1e88e5' }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  closeForm();
                                  const updatedExams = patientExamination.other.filter((vM) => vM.exam !== val.exam);
                                  handlePatientSubmit({
                                    ...patientExamination,
                                    other: updatedExams
                                  });
                                }}
                              >
                                <Close sx={{ fontSize: 18, color: '#d32f2f' }} />
                              </IconButton>
                            </Box>
                          </Box>
                        )
                    )}
                  </Box>
                )}

                <Grid>
                  <Box>
                    {/* Patient Vision Data */}

                    {patientOpthalmicData?.visionData?.length > 0 &&
                      patientOpthalmicData?.visionData?.map(
                        (d) =>
                          d.vision?.length > 0 && (
                            <TableContainer sx={{ mb: 3, borderRadius: 2, boxShadow: 1, border: '1px solid #ddd' }}>
                              <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
                                Vision Details
                              </Typography>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Unaided RE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Unaided LE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Corrected RE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Corrected LE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Pinhole RE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Pinhole LE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Near Vision RE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Near Vision LE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Action</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {patientOpthalmicData?.visionData.map((item) =>
                                    item.vision.map((vision) => (
                                      <TableRow key={vision._id}>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{vision.unaidedRE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{vision.unaidedLE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{vision.correctedRE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{vision.correctedLE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{vision.pinholeRE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{vision.pinholeLE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{vision?.nearVisionRE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{vision?.nearVisionLE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd', display: 'flex' }}>
                                          <IconButton size="small" color="primary" onClick={() => handleEditOpthalmic('vision', vision)}>
                                            <Edit fontSize="small" />
                                          </IconButton>
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteOpthalmic('vision', vision?._id)}
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )
                      )}

                    {/* Patient Finding Data */}
                    {patientOpthalmicData?.findingData &&
                      patientOpthalmicData?.findingData?.map(
                        (d) =>
                          d?.findings?.length > 0 && (
                            <TableContainer sx={{ borderRadius: 2, boxShadow: 1, mt: 3, border: '1px solid #ddd' }}>
                              <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
                                Findings Details
                              </Typography>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>IOP Method</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>IOP RE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>IOP LE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Color Method</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Color RE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Color LE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Contrast Method</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Contrast RE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Contrast LE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Action</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {patientOpthalmicData?.findingData?.map((item) =>
                                    item.findings.map((finding) => (
                                      <TableRow key={finding._id}>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{finding.iopMethod || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{finding.iopRE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{finding.iopLE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{finding.colorMethod || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{finding.colorRE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{finding.colorLE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{finding.contrastMethod || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{finding.contrastRE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{finding.contrastLE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd', display: 'flex', gap: 0.5 }}>
                                          <IconButton size="small" color="primary" onClick={() => handleEditOpthalmic('finding', finding)}>
                                            <Edit fontSize="small" />
                                          </IconButton>
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteOpthalmic('finding', finding?._id)}
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )
                      )}

                    {/* Auto Refraction Table */}
                    {patientOpthalmicData?.autoRefractionData &&
                      patientOpthalmicData?.autoRefractionData?.map(
                        (d) =>
                          d?.autoRefraction?.length > 0 && (
                            <TableContainer sx={{ borderRadius: 2, boxShadow: 1, mt: 3, border: '1px solid #ddd' }} key={patient._id}>
                              <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
                                AutoRefraction Details
                              </Typography>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Spherical RE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Spherical LE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Cylinder RE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Cylinder LE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Axis RE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Axis LE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Eye Drop</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>Action</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {patientOpthalmicData?.autoRefractionData?.map((item) =>
                                    item?.autoRefraction?.map((refraction) => (
                                      <TableRow key={refraction._id}>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{refraction.sphericalRE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{refraction.sphericalLE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{refraction.cylinderRE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{refraction.cylinderLE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{refraction.axisRE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{refraction.axisLE || 'N/A'}</TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd' }}>{refraction.eyeDrop || 'N/A'}</TableCell>
                                        <TableCell
                                          sx={{
                                            border: '1px solid #ddd',
                                            display: 'flex',
                                            gap: 0.5,
                                            alignItems: 'center'
                                          }}
                                        >
                                          <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditOpthalmic('autoRefraction', refraction)}
                                          >
                                            <Edit fontSize="small" />
                                          </IconButton>
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteOpthalmic('autoRefraction', refraction?._id)}
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )
                      )}

                    {patientGlassP?.[0]?.length>0 &&<>


                      <Typography sx={{ mb: 2, mt: 4 }} variant={'h4'}>
                      Glass Prescription
                    </Typography>
                    <DisplayGlassPrescription editData={patientGlassP?.[0]} getGlassPrescription={getGlassPrescription} />
                    </>}
                  </Box>
                </Grid>
              </Grid>
            </>
          }
        </Grid>
      )}

      <Dialog open={openDialog}>
        <DialogContent>
          {openAddGeneralDisorder && (
            <Box className="selectedPtCategory" style={{ width: '97%' }}>
              <h4>Add Disorder General Examination</h4>

              <TextField
                variant="outlined"
                name="disorder"
                label="Disorder"
                margin="normal"
                value={addData.disorder}
                onChange={(e) => {
                  setAddData((prev) => {
                    return { ...prev, disorder: e.target.value };
                  });
                  setSysGenErr((prev) => {
                    return { ...prev, disorder: '' };
                  });
                }}
                error={sysGenErr.disorder !== '' ? true : false}
                helperText={sysGenErr.disorder}
                fullWidth
              />

              <Button className="addBtn" onClick={handleGeneralDisorderSubmit} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openEditGeneralDisorder && (
            <Box className="selectedPtCategory">
              <h4>Edit General Examination Heading</h4>
              <Box className="selectedCategory">
                {allGeneral.map((val, ind) => {
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
                      label={val.exam.disorder}
                      onClick={() => {
                        setOpenEditGeneralDisorder(false);
                        setOpenEditGeneralDisorderDetail(true);
                        setOpenDeleteGeneralDisorder(false);
                        setAddData({ ...val.exam, _id: val._id });
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {openEditGeneralDisorderDetail && (
            <Box className="selectedPtCategory" style={{ width: '97%' }}>
              <h4>Update Disorder General Examination</h4>

              <TextField
                variant="outlined"
                name="disorder"
                label="Disorder"
                margin="normal"
                value={addData.disorder}
                onChange={(e) => {
                  setAddData((prev) => {
                    return { ...prev, disorder: e.target.value };
                  });
                  setSysGenErr((prev) => {
                    return { ...prev, disorder: '' };
                  });
                }}
                error={sysGenErr.disorder !== '' ? true : false}
                helperText={sysGenErr.disorder}
                fullWidth
              />

              <Button className="addBtn" onClick={handleGeneralDisorderUpdate} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openDeleteGeneralDisorder && (
            <Box className="selectedPtCategory">
              <h4>Delete General Examination Disorder</h4>
              <Box className="selectedCategory">
                {allGeneral.map((val, ind) => {
                  let exist = false;
                  deleteGeneralIds.forEach((v) => {
                    if (val._id === v) {
                      exist = true;
                    }
                  });
                  return (
                    <Chip
                      key={ind}
                      sx={{
                        borderWidth: 2, // Increase border thickness
                        borderColor: exist ? 'primary.main' : 'secondary.main',
                        borderStyle: 'solid',
                        mr: 1,
                        my: 1
                      }}
                      variant={exist ? 'default' : 'outlined'}
                      color={exist ? 'primary' : 'default'}
                      className={exist ? 'selectProblemDelete' : 'selectProblem'}
                      label={val.exam.disorder}
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

              <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleGeneralDisorderDelete}>
                Save
              </Button>
            </Box>
          )}

          {openAddGeneral && (
            <Box className="selectedPtCategory" sx={{ boxShadow: 3, borderRadius: 3, mt: 2, p: 2 }}>
              <h4 style={{ marginBottom: '5px' }}>Add Subdisorder for {addData.disorder}</h4>
              <Grid container spacing={2}>
                {inputVal.map((data, index) => {
                  return (
                    <Grid item xs={12} key={index} className="withExamC">
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="name"
                          value={data.name}
                          onChange={(evnt) => handleDataSubdisorder(index, evnt)}
                          error={err[index].name !== '' ? true : false}
                          helperText={err[index].name}
                        />
                        <FormControl style={{ margin: '5px', width: '100%' }}>
                          <FormLabel>Answer Type:</FormLabel>
                          <RadioGroup
                            row
                            name="answerType"
                            value={data.answerType}
                            onChange={(e) => {
                              handleDataSubdisorder(index, e);
                            }}
                          >
                            <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                            <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                            <FormControlLabel value="Calender" control={<Radio size="small" />} label="Calender" />
                          </RadioGroup>
                        </FormControl>

                        {data.answerType === 'Objective' && (
                          <div style={{ marginBottom: '10px' }}>
                            {data.objective.map((dd, innx) => {
                              return (
                                <Grid item xs={12} key={innx} className="withChiefC">
                                  <Grid item xs={10}>
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      name="data"
                                      value={dd.data}
                                      margin="dense"
                                      onChange={(e) => {
                                        const { name, value } = e.target;
                                        const list = [...inputVal];
                                        list[index].objective[innx][name] = value;
                                        setInputVal(list);
                                      }}
                                      // error={err[index].data !== "" ? true : false}
                                      // helperText={err[index].data}
                                    />
                                  </Grid>

                                  <Grid item xs={1}>
                                    <IconButton
                                      title="Remove Option"
                                      onClick={() => {
                                        removeInputVal(index, innx);
                                      }}
                                      className="btnDelete"
                                    >
                                      <Cancel className="btnDelete" />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              );
                            })}
                            <IconButton
                              variant="contained"
                              onClick={() => {
                                addInputVal(index);
                              }}
                              title="Add Option"
                              className="addBox"
                            >
                              <AddBox />
                            </IconButton>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>

              <br />
              <Button className="addBtn" onClick={handleSubmitGeneralSubdisorder} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openGeneralEditHandler && (
            <Box className="selectedPtCategory">
              <h4>Edit General Examination Subdisorder</h4>
              <Box className="selectedCategory" sx={{ mt: 2 }}>
                {addData.subDisorder.map((val, ind) => {
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
                      label={val.name}
                      onClick={() => {
                        setOpenGeneralEditHandler(false);
                        setOpenGeneralEditDataDetail(true);
                        setOpenGeneralDeleteHandler(false);
                        setInputVal([val]);
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {openGeneralEditDataDetail && (
            <Box className="selectedPtCategory" style={{ width: '97%' }}>
              <h4>Update General Examination Subdisorder</h4>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {inputVal.map((data, index) => {
                  return (
                    <Grid item xs={12} key={index} className="withExamC">
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="name"
                          value={data.name}
                          onChange={(evnt) => handleDataSubdisorder(index, evnt)}
                          error={err[index].name !== '' ? true : false}
                          helperText={err[index].name}
                        />
                        <FormControl style={{ margin: '5px', width: '100%' }}>
                          <FormLabel>Answer Type:</FormLabel>
                          <RadioGroup
                            row
                            name="answerType"
                            value={data.answerType}
                            onChange={(e) => {
                              handleDataSubdisorder(index, e);
                            }}
                          >
                            <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                            <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                            <FormControlLabel value="Calender" control={<Radio size="small" />} label="Calender" />
                          </RadioGroup>
                        </FormControl>

                        {data.answerType === 'Objective' && (
                          <div style={{ marginBottom: '10px' }}>
                            {data.objective.map((dd, innx) => {
                              return (
                                <Grid item xs={12} key={innx} className="withChiefC">
                                  <Grid item xs={10}>
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      name="data"
                                      value={dd.data}
                                      margin="dense"
                                      onChange={(e) => {
                                        const { name, value } = e.target;
                                        const list = [...inputVal];
                                        list[index].objective[innx][name] = value;
                                        setInputVal(list);
                                      }}
                                    />
                                  </Grid>

                                  <Grid item xs={1}>
                                    <IconButton
                                      title="Remove Option"
                                      onClick={() => {
                                        removeInputVal(index, innx);
                                      }}
                                      className="btnDelete"
                                    >
                                      <Cancel className="btnDelete" />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              );
                            })}
                            <IconButton
                              variant="contained"
                              onClick={() => {
                                addInputVal(index);
                              }}
                              title="Add Option"
                              className="addBox"
                            >
                              <AddBox />
                            </IconButton>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>

              <br />
              <Button
                className="addBtn"
                onClick={() => {
                  handleUpdateGeneralSubdisorder(addData._id, inputVal[0]._id, inputVal);
                  handleClose();
                }}
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          )}

          {openGeneralDeleteHandler && (
            <Box className="selectedPtCategory">
              <h4>Delete General Examination Subdisorder</h4>
              <Box className="selectedCategory" sx={{ mt: 2 }}>
                {addData.subDisorder.map((val, ind) => {
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
                        mr: 1,
                        my: 1
                      }}
                      variant={exist ? 'default' : 'outlined'}
                      color={exist ? 'primary' : 'default'}
                      key={ind}
                      className={exist ? 'selectProblemDelete' : 'selectProblem'}
                      label={val.name}
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

              <Button
                variant="contained"
                className="addBtn"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  handleGeneralSubdisorderDelete(addData._id);
                  handleClose();
                }}
              >
                Save
              </Button>
            </Box>
          )}

          {openAddLocalDisorder && (
            <Box className="selectedPtCategory" style={{ width: '97%' }}>
              <h4>Add Disorder Local Examination</h4>

              <TextField
                variant="outlined"
                name="disorder"
                label="Disorder"
                margin="normal"
                value={addData.disorder}
                onChange={(e) => {
                  setAddData((prev) => {
                    return { ...prev, disorder: e.target.value };
                  });
                  setSysGenErr((prev) => {
                    return { ...prev, disorder: '' };
                  });
                }}
                error={sysGenErr.disorder !== '' ? true : false}
                helperText={sysGenErr.disorder}
                fullWidth
              />

              <TextField
                fullWidth
                type="file"
                label="Diagram"
                variant="outlined"
                name="diagram"
                onChange={async (e) => {
                  const file = e.target.files[0];

                  try {
                    const base64String = await convertImageToBase64(file);

                    // Update state with the base64 string
                    setAddData((prev) => {
                      return { ...prev, diagram: base64String };
                    });
                  } catch (error) {
                    console.error('Error converting image to base64:', error);
                  }
                }}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{ accept: 'image/*' }}
                margin="normal"
              />

              <Button className="addBtn" onClick={handleLocalDisorderSubmit} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openEditLocalDisorder && (
            <Box className="selectedPtCategory">
              <h4>Edit Local Examination Heading</h4>
              <Box className="selectedCategory">
                {allLocal.map((val, ind) => {
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
                      label={val.exam.disorder}
                      onClick={() => {
                        setOpenEditLocalDisorder(false);
                        setOpenEditLocalDisorderDetail(true);
                        setOpenDeleteLocalDisorder(false);
                        setAddData({ ...val.exam, _id: val._id });
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {openEditLocalDisorderDetail && (
            <Box className="selectedPtCategory" style={{ width: '97%' }}>
              <h4>Update Disorder Local Examination</h4>

              <TextField
                variant="outlined"
                name="disorder"
                label="Disorder"
                margin="normal"
                value={addData.disorder}
                onChange={(e) => {
                  setAddData((prev) => {
                    return { ...prev, disorder: e.target.value };
                  });
                  setSysGenErr((prev) => {
                    return { ...prev, disorder: '' };
                  });
                }}
                error={sysGenErr.disorder !== '' ? true : false}
                helperText={sysGenErr.disorder}
                fullWidth
              />

              <Button className="addBtn" onClick={handleLocalDisorderUpdate} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openDeleteLocalDisorder && (
            <Box className="selectedPtCategory">
              <h4>Delete Local Examination Disorder</h4>
              <Box className="selectedCategory">
                {allLocal.map((val, ind) => {
                  let exist = false;
                  deleteLocalIds.forEach((v) => {
                    if (val._id === v) {
                      exist = true;
                    }
                  });
                  return (
                    <Chip
                      key={ind}
                      sx={{
                        borderWidth: 2, // Increase border thickness
                        borderColor: exist ? 'primary.main' : 'secondary.main',
                        borderStyle: 'solid',
                        mr: 1,
                        my: 1
                      }}
                      variant={exist ? 'default' : 'outlined'}
                      color={exist ? 'primary' : 'default'}
                      className={exist ? 'selectProblemDelete' : 'selectProblem'}
                      label={val.exam.disorder}
                      onClick={() => {
                        let a = deleteLocalIds;
                        if (val._id !== undefined) {
                          a.push(val._id);
                        }

                        let unique = [];
                        a.forEach((element) => {
                          if (!unique.includes(element)) {
                            unique.push(element);
                          }
                        });

                        setDeletedLocalIds(unique);
                      }}
                      onDelete={
                        exist
                          ? () => {
                              let aa = [];
                              deleteLocalIds.forEach((vM) => {
                                if (vM !== val._id) {
                                  aa.push(vM);
                                }
                              });
                              setDeletedLocalIds(aa);
                            }
                          : undefined
                      }
                      deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                    />
                  );
                })}
              </Box>

              <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleLocalDisorderDelete}>
                Save
              </Button>
            </Box>
          )}

          {openAddLocal && (
            <Box className="selectedPtCategory" style={{ width: '97%' }} sx={{ boxShadow: 3, borderRadius: 3, mt: 2, p: 2 }}>
              <h4 style={{ marginBottom: '5px' }}>Add Subdisorder for {addData.disorder}</h4>
              <Grid container spacing={2}>
                {inputVal.map((data, index) => {
                  return (
                    <Grid item xs={12} key={index} className="withExamC">
                      <Grid item xs={10}>
                        <TextField
                          mt={2}
                          fullWidth
                          variant="outlined"
                          name="name"
                          value={data.name}
                          onChange={(evnt) => handleDataSubdisorder(index, evnt)}
                          error={err[index].name !== '' ? true : false}
                          helperText={err[index].name}
                        />
                        <FormControl style={{ margin: '5px', width: '100%' }}>
                          <FormLabel>Answer Type:</FormLabel>
                          <RadioGroup
                            row
                            name="answerType"
                            value={data.answerType}
                            onChange={(e) => {
                              handleDataSubdisorder(index, e);
                            }}
                          >
                            <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                            <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                            <FormControlLabel value="Calender" control={<Radio size="small" />} label="Calender" />
                          </RadioGroup>
                        </FormControl>

                        {data.answerType === 'Objective' && (
                          <div style={{ marginBottom: '10px' }}>
                            {data.objective.map((dd, innx) => {
                              return (
                                <Grid item xs={12} key={innx} className="withChiefC">
                                  <Grid item xs={10}>
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      name="data"
                                      value={dd.data}
                                      margin="dense"
                                      onChange={(e) => {
                                        const { name, value } = e.target;
                                        const list = [...inputVal];
                                        list[index].objective[innx][name] = value;
                                        setInputVal(list);
                                      }}
                                      // error={err[index].data !== "" ? true : false}
                                      // helperText={err[index].data}
                                    />
                                  </Grid>

                                  <Grid item xs={1}>
                                    <IconButton
                                      title="Remove Option"
                                      onClick={() => {
                                        removeInputVal(index, innx);
                                      }}
                                      className="btnDelete"
                                    >
                                      <Cancel className="btnDelete" />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              );
                            })}
                            <IconButton
                              variant="contained"
                              onClick={() => {
                                addInputVal(index);
                              }}
                              title="Add Option"
                              className="addBox"
                            >
                              <AddBox />
                            </IconButton>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>

              <br />
              <Button className="addBtn" onClick={handleSubmitLocalSubdisorder} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openLocalEditHandler && (
            <Box className="selectedPtCategory">
              <h4>Edit Local Examination Subdisorder</h4>
              <Box className="selectedCategory">
                {addData.subDisorder.map((val, ind) => {
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
                      label={val.name}
                      onClick={() => {
                        setOpenLocalEditHandler(false);
                        setOpenLocalEditDataDetail(true);
                        setOpenLocalDeleteHandler(false);
                        setInputVal([val]);
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {openLocalEditDataDetail && (
            <Box className="selectedPtCategory" style={{ width: '97%' }}>
              <h4>Update Local Examination Subdisorder</h4>
              <Grid container spacing={2}>
                {inputVal.map((data, index) => {
                  return (
                    <Grid item xs={12} key={index} className="withExamC">
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="name"
                          value={data.name}
                          onChange={(evnt) => handleDataSubdisorder(index, evnt)}
                          error={err[index].name !== '' ? true : false}
                          helperText={err[index].name}
                        />
                        <FormControl style={{ margin: '5px', width: '100%' }}>
                          <FormLabel>Answer Type:</FormLabel>
                          <RadioGroup
                            row
                            name="answerType"
                            value={data.answerType}
                            onChange={(e) => {
                              handleDataSubdisorder(index, e);
                            }}
                          >
                            <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                            <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                            <FormControlLabel value="Calender" control={<Radio size="small" />} label="Calender" />
                          </RadioGroup>
                        </FormControl>

                        {data.answerType === 'Objective' && (
                          <div style={{ marginBottom: '10px' }}>
                            {data.objective.map((dd, innx) => {
                              return (
                                <Grid item xs={12} key={innx} className="withChiefC">
                                  <Grid item xs={10}>
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      name="data"
                                      value={dd.data}
                                      margin="dense"
                                      onChange={(e) => {
                                        const { name, value } = e.target;
                                        const list = [...inputVal];
                                        list[index].objective[innx][name] = value;
                                        setInputVal(list);
                                      }}
                                    />
                                  </Grid>

                                  <Grid item xs={1}>
                                    <IconButton
                                      title="Remove Option"
                                      onClick={() => {
                                        removeInputVal(index, innx);
                                      }}
                                      className="btnDelete"
                                    >
                                      <Cancel className="btnDelete" />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              );
                            })}
                            <IconButton
                              variant="contained"
                              onClick={() => {
                                addInputVal(index);
                              }}
                              title="Add Option"
                              className="addBox"
                            >
                              <AddBox />
                            </IconButton>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>

              <br />
              <Button
                className="addBtn"
                onClick={() => {
                  handleUpdateLocalSubdisorder(addData._id, inputVal[0]._id, inputVal);
                  handleClose();
                }}
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          )}

          {openLocalDeleteHandler && (
            <Box className="selectedPtCategory">
              <h4>Delete Local Examination Subdisorder</h4>
              <Box className="selectedCategory">
                {addData.subDisorder.map((val, ind) => {
                  let exist = false;
                  deleteLocalIds.forEach((v) => {
                    if (val._id === v) {
                      exist = true;
                    }
                  });
                  return (
                    <Chip
                      key={ind}
                      sx={{
                        borderWidth: 2, // Increase border thickness
                        borderColor: exist ? 'primary.main' : 'secondary.main',
                        borderStyle: 'solid',
                        mr: 1,
                        my: 1
                      }}
                      variant={exist ? 'default' : 'outlined'}
                      color={exist ? 'primary' : 'default'}
                      className={exist ? 'selectProblemDelete' : 'selectProblem'}
                      label={val.name}
                      onClick={() => {
                        let a = deleteLocalIds;
                        if (val._id !== undefined) {
                          a.push(val._id);
                        }

                        let unique = [];
                        a.forEach((element) => {
                          if (!unique.includes(element)) {
                            unique.push(element);
                          }
                        });

                        setDeletedLocalIds(unique);
                      }}
                      onDelete={
                        exist
                          ? () => {
                              let aa = [];
                              deleteLocalIds.forEach((vM) => {
                                if (vM !== val._id) {
                                  aa.push(vM);
                                }
                              });
                              setDeletedLocalIds(aa);
                            }
                          : undefined
                      }
                      deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                    />
                  );
                })}
              </Box>

              <Button
                variant="contained"
                className="addBtn"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  handleLocalSubdisorderDelete(addData._id);
                  handleClose();
                }}
              >
                Save
              </Button>
            </Box>
          )}

          {openAddSystematicDisorder && (
            <Box className="selectedPtCategory" style={{ width: '97%' }}>
              <h4>Add Disorder Systemic Examination</h4>

              <TextField
                variant="outlined"
                name="disorder"
                label="Disorder"
                margin="normal"
                value={addData.disorder}
                onChange={(e) => {
                  setAddData((prev) => {
                    return { ...prev, disorder: e.target.value };
                  });
                  setSysGenErr((prev) => {
                    return { ...prev, disorder: '' };
                  });
                }}
                error={sysGenErr.disorder !== '' ? true : false}
                helperText={sysGenErr.disorder}
                fullWidth
              />
              <TextField
                fullWidth
                type="file"
                label="Diagram"
                variant="outlined"
                name="diagram"
                onChange={async (e) => {
                  const file = e.target.files[0];

                  try {
                    const base64String = await convertImageToBase64(file);

                    // Update state with the base64 string
                    setAddData((prev) => {
                      return { ...prev, diagram: base64String };
                    });
                  } catch (error) {
                    console.error('Error converting image to base64:', error);
                  }
                }}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{ accept: 'image/*' }}
                margin="normal"
              />

              <Button className="addBtn" onClick={handleSystematicDisorderSubmit} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openEditSystemicDisorder && (
            <Box className="selectedPtCategory">
              <h4>Edit Systemic Examination Heading</h4>
              <Box className="selectedCategory">
                {allSystematic.map((val, ind) => {
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
                      label={val.exam.disorder}
                      onClick={() => {
                        setOpenEditSystemicDisorder(false);
                        setOpenEditSystemicDisorderDetail(true);
                        setOpenDeleteSystemicDisorder(false);
                        setAddData({ ...val.exam, _id: val._id });
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {openEditSystemicDisorderDetail && (
            <Box className="selectedPtCategory" style={{ width: '97%' }}>
              <h4>Update Disorder Systemic Examination</h4>

              <TextField
                variant="outlined"
                name="disorder"
                label="Disorder"
                margin="normal"
                value={addData.disorder}
                onChange={(e) => {
                  setAddData((prev) => {
                    return { ...prev, disorder: e.target.value };
                  });
                  setSysGenErr((prev) => {
                    return { ...prev, disorder: '' };
                  });
                }}
                error={sysGenErr.disorder !== '' ? true : false}
                helperText={sysGenErr.disorder}
                fullWidth
              />

              <Button className="addBtn" onClick={handleSystemicDisorderUpdate} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openDeleteSystemicDisorder && (
            <Box className="selectedPtCategory">
              <h4>Delete Systemic Examination Disorder</h4>
              <Box className="selectedCategory">
                {allSystematic.map((val, ind) => {
                  let exist = false;
                  deleteSystemicIds.forEach((v) => {
                    if (val._id === v) {
                      exist = true;
                    }
                  });
                  return (
                    <Chip
                      key={ind}
                      sx={{
                        borderWidth: 2, // Increase border thickness
                        borderColor: exist ? 'primary.main' : 'secondary.main',
                        borderStyle: 'solid',
                        mr: 1,
                        my: 1
                      }}
                      variant={exist ? 'default' : 'outlined'}
                      color={exist ? 'primary' : 'default'}
                      className={exist ? 'selectProblemDelete' : 'selectProblem'}
                      label={val.exam.disorder}
                      onClick={() => {
                        let a = deleteSystemicIds;
                        if (val._id !== undefined) {
                          a.push(val._id);
                        }

                        let unique = [];
                        a.forEach((element) => {
                          if (!unique.includes(element)) {
                            unique.push(element);
                          }
                        });

                        setDeletedSystemicIds(unique);
                      }}
                      onDelete={
                        exist
                          ? () => {
                              let aa = [];
                              deleteSystemicIds.forEach((vM) => {
                                if (vM !== val._id) {
                                  aa.push(vM);
                                }
                              });
                              setDeletedSystemicIds(aa);
                            }
                          : undefined
                      }
                      deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                    />
                  );
                })}
              </Box>

              <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSystemicDisorderDelete}>
                Save
              </Button>
            </Box>
          )}

          {openAddSystematic && (
            <Box className="selectedPtCategory" style={{ width: '97%' }} sx={{ boxShadow: 3, borderRadius: 3, mt: 2, p: 2 }}>
              <h4 style={{ marginBottom: '5px' }}>Add Subdisorder for {addData.disorder}</h4>
              <Grid container spacing={2}>
                {inputVal.map((data, index) => {
                  return (
                    <Grid item xs={12} key={index} className="withExamC">
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="name"
                          value={data.name}
                          onChange={(evnt) => handleDataSubdisorder(index, evnt)}
                          error={err[index].name !== '' ? true : false}
                          helperText={err[index].name}
                        />
                        <FormControl style={{ margin: '5px', width: '100%' }}>
                          <FormLabel>Answer Type:</FormLabel>
                          <RadioGroup
                            row
                            name="answerType"
                            value={data.answerType}
                            onChange={(e) => {
                              handleDataSubdisorder(index, e);
                            }}
                          >
                            <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                            <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                            <FormControlLabel value="Calender" control={<Radio size="small" />} label="Calender" />
                          </RadioGroup>
                        </FormControl>

                        {data.answerType === 'Objective' && (
                          <div style={{ marginBottom: '10px' }}>
                            {data.objective.map((dd, innx) => {
                              return (
                                <Grid item xs={12} key={innx} className="withChiefC">
                                  <Grid item xs={10}>
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      name="data"
                                      value={dd.data}
                                      margin="dense"
                                      onChange={(e) => {
                                        const { name, value } = e.target;
                                        const list = [...inputVal];
                                        list[index].objective[innx][name] = value;
                                        setInputVal(list);
                                      }}
                                      // error={err[index].data !== "" ? true : false}
                                      // helperText={err[index].data}
                                    />
                                  </Grid>

                                  <Grid item xs={1}>
                                    <IconButton
                                      title="Remove Option"
                                      onClick={() => {
                                        removeInputVal(index, innx);
                                      }}
                                      className="btnDelete"
                                    >
                                      <Cancel className="btnDelete" />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              );
                            })}
                            <IconButton
                              variant="contained"
                              onClick={() => {
                                addInputVal(index);
                              }}
                              title="Add Option"
                              className="addBox"
                            >
                              <AddBox />
                            </IconButton>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>

              <br />
              <Button className="addBtn" onClick={handleSubmitSystematicSubdisorder} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openSystemicEditHandler && (
            <Box className="selectedPtCategory">
              <h4>Edit Systemic Examination Subdisorder</h4>
              <Box className="selectedCategory">
                {addData.subDisorder.map((val, ind) => {
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
                      label={val.name}
                      onClick={() => {
                        setOpenSystemicEditHandler(false);
                        setOpenSystemicEditDataDetail(true);
                        setOpenSystemicDeleteHandler(false);
                        setInputVal([val]);
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {openSystemicEditDataDetail && (
            <Box className="selectedPtCategory" style={{ width: '97%' }}>
              <h4>Update Systemic Examination Subdisorder</h4>
              <Grid container spacing={2}>
                {inputVal.map((data, index) => {
                  return (
                    <Grid item xs={12} key={index} className="withExamC">
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="name"
                          value={data.name}
                          onChange={(evnt) => handleDataSubdisorder(index, evnt)}
                          error={err[index].name !== '' ? true : false}
                          helperText={err[index].name}
                        />
                        <FormControl style={{ margin: '5px', width: '100%' }}>
                          <FormLabel>Answer Type:</FormLabel>
                          <RadioGroup
                            row
                            name="answerType"
                            value={data.answerType}
                            onChange={(e) => {
                              handleDataSubdisorder(index, e);
                            }}
                          >
                            <FormControlLabel value="Subjective" control={<Radio size="small" />} label="Subjective" />
                            <FormControlLabel value="Objective" control={<Radio size="small" />} label="Objective" />
                            <FormControlLabel value="Calender" control={<Radio size="small" />} label="Calender" />
                          </RadioGroup>
                        </FormControl>

                        {data.answerType === 'Objective' && (
                          <div style={{ marginBottom: '10px' }}>
                            {data.objective.map((dd, innx) => {
                              return (
                                <Grid item xs={12} key={innx} className="withChiefC">
                                  <Grid item xs={10}>
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      name="data"
                                      value={dd.data}
                                      margin="dense"
                                      onChange={(e) => {
                                        const { name, value } = e.target;
                                        const list = [...inputVal];
                                        list[index].objective[innx][name] = value;
                                        setInputVal(list);
                                      }}
                                    />
                                  </Grid>

                                  <Grid item xs={1}>
                                    <IconButton
                                      title="Remove Option"
                                      onClick={() => {
                                        removeInputVal(index, innx);
                                      }}
                                      className="btnDelete"
                                    >
                                      <Cancel className="btnDelete" />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              );
                            })}
                            <IconButton
                              variant="contained"
                              onClick={() => {
                                addInputVal(index);
                              }}
                              title="Add Option"
                              className="addBox"
                            >
                              <AddBox />
                            </IconButton>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>

              <br />
              <Button
                className="addBtn"
                onClick={() => {
                  handleUpdateSystemicSubdisorder(addData._id, inputVal[0]._id, inputVal);
                  handleClose();
                }}
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          )}

          {openSystemicDeleteHandler && (
            <Box className="selectedPtCategory">
              <h4>Delete Systemic Examination Subdisorder</h4>
              <Box className="selectedCategory">
                {addData.subDisorder.map((val, ind) => {
                  let exist = false;
                  deleteSystemicIds.forEach((v) => {
                    if (val._id === v) {
                      exist = true;
                    }
                  });
                  return (
                    <Chip
                      key={ind}
                      sx={{
                        borderWidth: 2, // Increase border thickness
                        borderColor: exist ? 'primary.main' : 'secondary.main',
                        borderStyle: 'solid',
                        mr: 1,
                        my: 1
                      }}
                      variant={exist ? 'default' : 'outlined'}
                      color={exist ? 'primary' : 'default'}
                      className={exist ? 'selectProblemDelete' : 'selectProblem'}
                      label={val.name}
                      onClick={() => {
                        let a = deleteSystemicIds;
                        if (val._id !== undefined) {
                          a.push(val._id);
                        }

                        let unique = [];
                        a.forEach((element) => {
                          if (!unique.includes(element)) {
                            unique.push(element);
                          }
                        });

                        setDeletedSystemicIds(unique);
                      }}
                      onDelete={
                        exist
                          ? () => {
                              let aa = [];
                              deleteSystemicIds.forEach((vM) => {
                                if (vM !== val._id) {
                                  aa.push(vM);
                                }
                              });
                              setDeletedSystemicIds(aa);
                            }
                          : undefined
                      }
                      deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                    />
                  );
                })}
              </Box>

              <Button
                variant="contained"
                className="addBtn"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  handleSystemicSubdisorderDelete(addData._id);
                  handleClose();
                }}
              >
                Save
              </Button>
            </Box>
          )}

          {openSubDisorderGeneralP && (
            <Box className="selectedPtCategory" sx={{ boxShadow: 3, p: 2, width: 400 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{addData.subDisorder.name} </h4>
                {inputVal.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setLayer3Edit(true);
                        setLayer3Delete(false);
                        setOpen3Layer({
                          edit3Layer: true,
                          delete3Layer: false,
                          layer3Data: layer3Data
                        });

                        handleClose();
                      }}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => {
                        setLayer3Edit(false);
                        setLayer3Delete(true);
                        setOpen3Layer({
                          edit3Layer: false,
                          delete3Layer: true,
                          layer3Data: layer3Data
                        });
                        handleClose();
                      }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setLayer4Add(true);
                        setOpen4General(true);
                        setOpenSubDisorderGeneralP(false);
                        handleDialogOpen(true);
                      }}
                    >
                      <Add />
                    </IconButton>
                  </div>
                )}
              </Box>
              {addData.subDisorder.objective.length > 0 && (
                <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                  {addData.subDisorder.objective.map((v, inx) => {
                    let exist = false;
                    openData.subDisorder.forEach((op) => {
                      op.objective.forEach((aop) => {
                        if (aop.data === v.data) {
                          exist = true;
                        }
                      });
                    });
                    return (
                      <Chip
                        key={inx}
                        className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                        label={v.data}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: exist ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        variant={exist ? 'default' : 'outlined'}
                        color={exist ? 'primary' : 'default'}
                        onClick={() => {
                          setOpenDataSelectObjective(v);
                          setLayer3ChipSelectedFor4Index(inx);
                          handleDialogOpen();
                          let a = [...openData.subDisorder];
                          const existingIndex = a.findIndex((av) => av.name === addData.subDisorder.name);

                          if (existingIndex > -1) {
                            a[existingIndex].objective = [...a[existingIndex].objective, { ...v, innerData: [] }];
                          } else {
                            a.push({
                              ...addData.subDisorder,
                              objective: [{ ...v, innerData: [] }]
                            });
                          }
                          setOpenData((prev) => ({
                            ...prev,
                            subDisorder: a
                          }));
                        }}
                        onDelete={
                          exist
                            ? () => {
                                let a = [...openData.subDisorder];
                                const existingIndex = a.findIndex((av) => av.name === addData.subDisorder.name);

                                if (existingIndex > -1) {
                                  a[existingIndex].objective = a[existingIndex].objective.filter((obj) => obj.data !== v.data);
                                }

                                setOpenData((prev) => ({
                                  ...prev,
                                  subDisorder: a
                                }));
                              }
                            : undefined
                        }
                        deleteIcon={exist ? <Close style={{ color: 'white', fontSize: '14px' }} /> : undefined}
                      />
                    );
                  })}
                  {Object.entries(openDataSelectObjective).length > 0 && openDataSelectObjective.innerData !== undefined && (
                    <>
                      <Box style={{ width: '100%' }}>
                        <hr style={{ margin: '10px 0' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4>{openDataSelectObjective.data}</h4>
                          {inputVal.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <IconButton
                                color="secondary"
                                onClick={() => {
                                  setLayer4({
                                    deleteLayer4: false,
                                    editLayer4: true,
                                    layer4Data: layer3Data
                                  });
                                  setOpenLayer4EditDialog(true);
                                  handleClose();
                                }}
                              >
                                <Edit />
                              </IconButton>

                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLayer4({
                                    deleteLayer4: true,
                                    editLayer4: false,
                                    layer4Data: layer3Data
                                  });
                                  setOpenLayer4DeleteDialog(true);
                                  handleClose();
                                }}
                              >
                                <Delete />
                              </IconButton>
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  setLayer4Add(true);
                                }}
                              >
                                <Add />
                              </IconButton>
                            </div>
                          )}
                        </Box>
                        {openDataSelectObjective.innerData.map((op, indd) => {
                          let exist = false;

                          openData.subDisorder.forEach((ad, inx) => {
                            if (ad.name === addData.subDisorder.name) {
                              ad.objective.forEach((ad1, indx) => {
                                if (openDataSelectObjective.data === ad1.data) {
                                  ad1.innerData.forEach((ad2, indx) => {
                                    if (ad2.data === op.data) {
                                      exist = true;
                                    }
                                  });
                                }
                              });
                            }
                          });

                          return (
                            <Chip
                              sx={{
                                backgroundColor: exist ? '#126078' : '',
                                color: exist ? '#fff' : '#555',
                                px: 2,
                                mr: 1
                              }}
                              key={indd}
                              className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                              label={op.data}
                              onClick={() => {
                                setOpenData((prevOpenData) => {
                                  const newOpenData = JSON.parse(JSON.stringify(prevOpenData)); // Deep copy to avoid mutation

                                  newOpenData.subDisorder.forEach((ad, inx) => {
                                    if (ad.name === addData.subDisorder.name) {
                                      // Deduplicate the `objective` array by `data` property
                                      const uniqueObjectives = [];
                                      const seenData = new Set();

                                      ad.objective.forEach((ad1, indx) => {
                                        if (!seenData.has(ad1.data)) {
                                          seenData.add(ad1.data);
                                          uniqueObjectives.push(ad1);
                                        }
                                      });

                                      newOpenData.subDisorder[inx].objective = uniqueObjectives;

                                      newOpenData.subDisorder[inx].objective.forEach((ad1, indx) => {
                                        if (openDataSelectObjective.data === ad1.data) {
                                          if (!ad1.innerData) {
                                            ad1.innerData = [];
                                          }

                                          let mergedInnerData = [...ad1.innerData, op];

                                          const uniqueInnerData = [];
                                          const seenInnerData = new Set();

                                          mergedInnerData.forEach((item) => {
                                            if (!seenInnerData.has(item.data)) {
                                              seenInnerData.add(item.data);
                                              uniqueInnerData.push(item);
                                            }
                                          });

                                          ad1.innerData = uniqueInnerData;
                                        }
                                      });
                                    }
                                  });

                                  return newOpenData; // Ensures state is updated and component re-renders
                                });

                                handleDialogOpen();
                              }}
                              onDelete={
                                exist
                                  ? () => {
                                      setOpenData((prevOpenData) => {
                                        const newOpenData = JSON.parse(JSON.stringify(prevOpenData));

                                        newOpenData.subDisorder.forEach((ad, inx) => {
                                          if (ad.name === addData.subDisorder.name) {
                                            ad.objective.forEach((ad1, indx) => {
                                              if (openDataSelectObjective.data === ad1.data) {
                                                if (!newOpenData.subDisorder[inx].objective[indx].innerData) {
                                                  newOpenData.subDisorder[inx].objective[indx].innerData = [];
                                                }

                                                newOpenData.subDisorder[inx].objective[indx].innerData = newOpenData.subDisorder[
                                                  inx
                                                ].objective[indx].innerData.filter((item) => item.data !== op.data);
                                              }
                                            });
                                          }
                                        });

                                        return newOpenData;
                                      });
                                    }
                                  : undefined
                              }
                              deleteIcon={exist ? <Close style={{ color: 'white', fontSize: '14px' }} /> : undefined}
                            />
                          );
                        })}
                      </Box>
                    </>
                  )}
                </Box>
              )}

              {addData.subDisorder.objective.length === 0 && (
                <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                  <TextField
                    variant="outlined"
                    name="value"
                    value={addData.subDisorder.value}
                    fullWidth={addData.subDisorder.answerType === 'Calender' ? false : true}
                    type={addData.subDisorder.answerType === 'Calender' ? 'date' : 'text'}
                    multiline={addData.subDisorder.answerType === 'Calender' ? false : true}
                    rows={5}
                    onChange={(e) => {
                      let a = [...openData.subDisorder];
                      const existingIndex = a.findIndex((av) => av.name === addData.subDisorder.name);

                      if (existingIndex > -1) {
                        a[existingIndex].value = e.target.value;
                      } else {
                        a.push({
                          ...addData.subDisorder,
                          value: e.target.value
                        });
                      }
                      setAddData((prev) => {
                        return {
                          ...prev,
                          subDisorder: {
                            ...prev.subDisorder,
                            value: e.target.value
                          }
                        };
                      });
                      setOpenData((prev) => ({
                        ...prev,
                        subDisorder: a
                      }));
                    }}
                  />
                </Box>
              )}

              <Button
                className="addBtn"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  let aa = [...patientExamination.general, openData];
                  aa = [...new Map(aa.map((item) => [item['_id'], item])).values()];
                  handlePatientSubmit({
                    ...patientExamination,
                    general: aa
                  });

                  handleClose();
                  setOpenLayer4EditDialog(false);
                  setOpenLayer4DeleteDialog(false);
                }}
                variant="contained"
              >
                Save
              </Button>
              <Button
                variant="contained"
                sx={{ ml: 2, mt: 1.3 }}
                onClick={() => {
                  setOpenSubDisorderGeneralP(false);
                  handleClose();
                  setOpenLayer4EditDialog(false);
                  setOpenLayer4DeleteDialog(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          )}

          {open4General && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>{addData.subDisorder.name}</h4>

              {addData.subDisorder.objective.length > 0 && (
                <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                  {addData.subDisorder.objective.map((v, inx) => {
                    return (
                      <Chip
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        variant={'outlined'}
                        color={'default'}
                        key={inx}
                        className={`${'selectProblemWith'}`}
                        label={v.data}
                        onClick={() => {
                          setGeneralOpen4LayerDataAdd(true);
                          setOpen4General(false);
                          setInputVal(v.innerData === undefined || v.innerData.length === 0 ? [{ data: '' }] : v.innerData);
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
                          setErr(e);
                          setDataGeneral4Layer({
                            ...addData,
                            objective: v
                          });
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          )}

          {generalOpen4LayerDataAdd && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>Add data for {dataGeneral4Layer.objective.data}</h4>
              <Grid container spacing={2}>
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
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const list = [...inputVal];
                            list[index][name] = value;
                            setInputVal(list);
                          }}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton
                          title="Remove Option"
                          onClick={() => {
                            removeInputVal4(index);
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
                  addInputVal4();
                }}
                title="Add Option"
                className="addBox"
              >
                <AddBox />
              </IconButton>
              <br />
              <Button
                className="addBtn"
                onClick={() => {
                  //check changes
                  dataGeneral4Layer.subDisorder.objective.forEach((v, inx) => {
                    if (v.data === dataGeneral4Layer.objective.data) {
                      dataGeneral4Layer.subDisorder.objective[inx].innerData = [...inputVal];
                      dataGeneral4Layer.subDisorder.objective[inx].innerData = [
                        ...new Map(dataGeneral4Layer.subDisorder.objective[inx].innerData.map((item) => [item['data'], item])).values()
                      ];
                    }
                  });

                  let aa = [dataGeneral4Layer.subDisorder];
                  aa = [...new Map(aa.map((item) => [item['_id'], item])).values()];
                  handleUpdateGeneralSubdisorder(addData.disorder._id, dataGeneral4Layer.subDisorder._id, aa);
                  handleClose();
                }}
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          )}

          {openSubDisorderLocalP && (
            <Box className="selectedPtCategory" sx={{ boxShadow: 3, borderRadius: 3, mt: 2, p: 2, width: 400 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{addData.subDisorder.name} </h4>
                {inputVal.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setLayer3Edit(true);
                        setLayer3Delete(false);
                        setOpen3Layer({
                          edit3Layer: true,
                          delete3Layer: false,
                          layer3Data: layer3Data
                        });

                        handleClose();
                      }}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => {
                        setLayer3Edit(false);
                        setLayer3Delete(true);
                        setOpen3Layer({
                          edit3Layer: false,
                          delete3Layer: true,
                          layer3Data: layer3Data
                        });
                        handleClose();
                      }}
                    >
                      <Delete />
                    </IconButton>
                    {addData.subDisorder.objective.length > 0 && (
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setLayer4Add(true);
                          setOpen4Local(true);
                          setOpenSubDisorderLocalP(false);
                          handleDialogOpen(true);
                        }}
                      >
                        <Add />
                      </IconButton>
                    )}
                  </div>
                )}
              </Box>

              {addData.subDisorder.objective.length > 0 && (
                <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                  {addData.subDisorder.objective.map((v, inx) => {
                    let exist = false;

                    openData.subDisorder.forEach((op) => {
                      op.objective.forEach((aop) => {
                        if (aop.data === v.data) {
                          exist = true;
                        }
                      });
                    });
                    return (
                      <Chip
                        key={inx}
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
                        label={v.data}
                        onClick={() => {
                          handleDialogOpen();
                          setLayer3ChipSelectedFor4Index(inx);

                          setOpenDataSelectObjective(v);
                          let a = [...openData.subDisorder];
                          const existingIndex = a.findIndex((av) => av.name === addData.subDisorder.name);

                          if (existingIndex > -1) {
                            a[existingIndex].objective = [...a[existingIndex].objective, { ...v, innerData: [] }];
                          } else {
                            a.push({
                              ...addData.subDisorder,
                              objective: [{ ...v, innerData: [] }]
                            });
                          }
                          setOpenData((prev) => ({
                            ...prev,
                            subDisorder: a
                          }));
                        }}
                        onDelete={
                          exist
                            ? () => {
                                let a = [...openData.subDisorder];
                                const existingIndex = a.findIndex((av) => av.name === addData.subDisorder.name);

                                if (existingIndex > -1) {
                                  a[existingIndex].objective = a[existingIndex].objective.filter((obj) => obj.data !== v.data);
                                }

                                setOpenData((prev) => ({
                                  ...prev,
                                  subDisorder: a
                                }));
                              }
                            : undefined
                        }
                        deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                      />
                    );
                  })}
                  {Object.entries(openDataSelectObjective).length > 0 && openDataSelectObjective.innerData !== undefined && (
                    <>
                      <Box style={{ width: '100%' }}>
                        <hr style={{ margin: '10px 0' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4>{openDataSelectObjective.data}</h4>
                          {inputVal.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <IconButton
                                color="secondary"
                                onClick={() => {
                                  setLayer4({
                                    deleteLayer4: false,
                                    editLayer4: true,
                                    layer4Data: layer3Data
                                  });

                                  setOpenLayer4EditDialog(true);
                                  handleClose();
                                }}
                              >
                                <Edit />
                              </IconButton>

                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLayer4({
                                    deleteLayer4: true,
                                    editLayer4: false,
                                    layer4Data: layer3Data
                                  });

                                  setOpenLayer4DeleteDialog(true);
                                  handleClose();
                                }}
                              >
                                <Delete />
                              </IconButton>
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  setLayer4Add(true);
                                }}
                              >
                                <Add />
                              </IconButton>
                            </div>
                          )}
                        </Box>
                        {openDataSelectObjective.innerData.map((op, indd) => {
                          let exist = false;

                          openData.subDisorder.forEach((ad) => {
                            if (ad.name === addData.subDisorder.name) {
                              ad.objective.forEach((ad1) => {
                                if (openDataSelectObjective.data === ad1.data) {
                                  ad1.innerData.forEach((ad2) => {
                                    if (ad2.data === op.data) {
                                      exist = true;
                                    }
                                  });
                                }
                              });
                            }
                          });

                          return (
                            <Chip
                              key={indd}
                              className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                              label={op.data}
                              sx={{
                                borderWidth: 2, // Increase border thickness
                                borderColor: exist ? 'primary.main' : 'secondary.main',
                                borderStyle: 'solid',
                                mr: 1,
                                my: 1
                              }}
                              variant={exist ? 'default' : 'outlined'}
                              color={exist ? 'primary' : 'default'}
                              onClick={() => {
                                handleDialogOpen();

                                setOpenData((prevOpenData) => {
                                  const newOpenData = JSON.parse(JSON.stringify(prevOpenData)); // Deep copy

                                  newOpenData.subDisorder.forEach((ad, inx) => {
                                    if (ad.name === addData.subDisorder.name) {
                                      // Deduplicate `objective` array by `data` property
                                      const uniqueObjectives = [];
                                      const seenData = new Set();

                                      ad.objective.forEach((ad1) => {
                                        if (!seenData.has(ad1.data)) {
                                          seenData.add(ad1.data);
                                          uniqueObjectives.push(ad1);
                                        }
                                      });

                                      newOpenData.subDisorder[inx].objective = uniqueObjectives;

                                      newOpenData.subDisorder[inx].objective.forEach((ad1) => {
                                        if (openDataSelectObjective.data === ad1.data) {
                                          if (!ad1.innerData) {
                                            ad1.innerData = [];
                                          }

                                          let mergedInnerData = [...ad1.innerData, op];

                                          // Deduplicate `innerData`
                                          const uniqueInnerData = [];
                                          const seenInnerData = new Set();

                                          mergedInnerData.forEach((item) => {
                                            if (!seenInnerData.has(item.data)) {
                                              seenInnerData.add(item.data);
                                              uniqueInnerData.push(item);
                                            }
                                          });

                                          ad1.innerData = uniqueInnerData;
                                        }
                                      });
                                    }
                                  });

                                  return newOpenData; // Updates state to trigger re-render
                                });
                              }}
                              onDelete={
                                exist
                                  ? () => {
                                      setOpenData((prevOpenData) => {
                                        const newOpenData = JSON.parse(JSON.stringify(prevOpenData)); // Deep copy

                                        newOpenData.subDisorder.forEach((ad, inx) => {
                                          if (ad.name === addData.subDisorder.name) {
                                            ad.objective.forEach((ad1, indx) => {
                                              if (openDataSelectObjective.data === ad1.data) {
                                                if (!newOpenData.subDisorder[inx].objective[indx].innerData) {
                                                  newOpenData.subDisorder[inx].objective[indx].innerData = [];
                                                }

                                                // Remove `op` from `innerData`
                                                newOpenData.subDisorder[inx].objective[indx].innerData = newOpenData.subDisorder[
                                                  inx
                                                ].objective[indx].innerData.filter((item) => item.data !== op.data);
                                              }
                                            });
                                          }
                                        });

                                        return newOpenData; // Updates state
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
                </Box>
              )}

              {addData.subDisorder.objective.length === 0 && (
                <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                  <TextField
                    variant="outlined"
                    name="value"
                    value={addData.subDisorder.value}
                    fullWidth={addData.subDisorder.answerType === 'Calender' ? false : true}
                    type={addData.subDisorder.answerType === 'Calender' ? 'date' : 'text'}
                    multiline={addData.subDisorder.answerType === 'Calender' ? false : true}
                    rows={5}
                    onChange={(e) => {
                      let a = [...openData.subDisorder];
                      const existingIndex = a.findIndex((av) => av.name === addData.subDisorder.name);

                      if (existingIndex > -1) {
                        a[existingIndex].value = e.target.value;
                      } else {
                        a.push({
                          ...addData.subDisorder,
                          value: e.target.value
                        });
                      }
                      setAddData((prev) => {
                        return {
                          ...prev,
                          subDisorder: {
                            ...prev.subDisorder,
                            value: e.target.value
                          }
                        };
                      });
                      setOpenData((prev) => ({
                        ...prev,
                        subDisorder: a
                      }));
                    }}
                  />
                </Box>
              )}

              <Button
                className="addBtn"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  let aa = [...patientExamination.local, openData];
                  aa = [...new Map(aa.map((item) => [item['_id'], item])).values()];
                  handlePatientSubmit({
                    ...patientExamination,
                    local: aa
                  });
                  handleClose();
                  setOpenLayer4EditDialog(false);
                  setOpenLayer4DeleteDialog(false);
                }}
                variant="contained"
              >
                Save
              </Button>

              {/* <Button
                    variant="contained"
                    sx={{ ml: 2, mt: 1.3 }}
                    onClick={() => {
                      setOpenSubDisorderLocalP(false);
                      handleClose()
                    }}
                  >
                    Cancel
                  </Button> */}
            </Box>
          )}

          {open4Local && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>{addData.subDisorder.name}</h4>

              {addData.subDisorder.objective.length > 0 && (
                <Box className="sinceFormat">
                  {addData.subDisorder.objective.map((v, inx) => {
                    return (
                      <Chip
                        key={inx}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        variant={'outlined'}
                        color={'default'}
                        className={`${'selectProblemWith'}`}
                        label={v.data}
                        onClick={() => {
                          handleDialogOpen();
                          setLocalOpen4LayerDataAdd(true);
                          setOpen4Local(false);
                          setInputVal(v.innerData === undefined || v.innerData.length === 0 ? [{ data: '' }] : v.innerData);
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
                          setErr(e);
                          setDataLocal4Layer({ ...addData, objective: v });
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          )}

          {localOpen4LayerDataAdd && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>Add data for {dataLocal4Layer.objective.data}</h4>
              <Grid container spacing={2}>
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
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const list = [...inputVal];
                            list[index][name] = value;
                            setInputVal(list);
                          }}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton
                          title="Remove Option"
                          onClick={() => {
                            removeInputVal4(index);
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
                  addInputVal4();
                }}
                title="Add Option"
                className="addBox"
              >
                <AddBox />
              </IconButton>
              <br />
              <Button
                className="addBtn"
                onClick={() => {
                  //check changes
                  dataLocal4Layer.subDisorder.objective.forEach((v, inx) => {
                    if (v.data === dataLocal4Layer.objective.data) {
                      dataLocal4Layer.subDisorder.objective[inx].innerData = [...inputVal];
                      dataLocal4Layer.subDisorder.objective[inx].innerData = [
                        ...new Map(dataLocal4Layer.subDisorder.objective[inx].innerData.map((item) => [item['data'], item])).values()
                      ];
                    }
                  });

                  let aa = [dataLocal4Layer.subDisorder];
                  aa = [...new Map(aa.map((item) => [item['_id'], item])).values()];
                  handleUpdateLocalSubdisorder(addData.disorder._id, dataLocal4Layer.subDisorder._id, aa);
                  handleClose();
                }}
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          )}

          {openSubDisorderSystemicP && (
            <Box className="selectedPtCategory" sx={{ boxShadow: 3, borderRadius: 3, mt: 2, p: 2, width: 400 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{addData.subDisorder.name} </h4>
                {inputVal.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setLayer3Edit(true);
                        setLayer3Delete(false);
                        setOpen3Layer({
                          edit3Layer: true,
                          delete3Layer: false,
                          layer3Data: layer3Data
                        });

                        handleClose();
                      }}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => {
                        setLayer3Edit(false);
                        setLayer3Delete(true);
                        setOpen3Layer({
                          edit3Layer: false,
                          delete3Layer: true,
                          layer3Data: layer3Data
                        });
                        handleClose();
                      }}
                    >
                      <Delete />
                    </IconButton>
                    {addData.subDisorder.objective.length > 0 && (
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setLayer4Add(true);
                          setOpen4Systemic(true);
                          setOpenSubDisorderSystemicP(false);
                          handleDialogOpen(true);
                        }}
                      >
                        <Add />
                      </IconButton>
                    )}
                  </div>
                )}
              </Box>

              {addData.subDisorder.objective.length > 0 && (
                <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                  {addData.subDisorder.objective.map((v, inx) => {
                    let exist = false;

                    openData.subDisorder.forEach((op) => {
                      op.objective.forEach((aop) => {
                        if (aop.data === v.data) {
                          exist = true;
                        }
                      });
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
                        key={inx}
                        className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                        label={v.data}
                        onClick={() => {
                          handleDialogOpen();
                          setOpenDataSelectObjective(v);
                          setLayer3ChipSelectedFor4Index(inx);

                          let a = [...openData.subDisorder];
                          const existingIndex = a.findIndex((av) => av.name === addData.subDisorder.name);

                          if (existingIndex > -1) {
                            a[existingIndex].objective = [...a[existingIndex].objective, { ...v, innerData: [] }];
                          } else {
                            a.push({
                              ...addData.subDisorder,
                              objective: [{ ...v, innerData: [] }]
                            });
                          }
                          setOpenData((prev) => ({
                            ...prev,
                            subDisorder: a
                          }));
                        }}
                        onDelete={
                          exist
                            ? () => {
                                let a = [...openData.subDisorder];
                                const existingIndex = a.findIndex((av) => av.name === addData.subDisorder.name);

                                if (existingIndex > -1) {
                                  a[existingIndex].objective = a[existingIndex].objective.filter((obj) => obj.data !== v.data);
                                }

                                setOpenData((prev) => ({
                                  ...prev,
                                  subDisorder: a
                                }));
                              }
                            : undefined
                        }
                        deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                      />
                    );
                  })}
                  {Object.entries(openDataSelectObjective).length > 0 && openDataSelectObjective.innerData !== undefined && (
                    <>
                      <Box style={{ width: '100%' }}>
                        <hr style={{ margin: '10px 0' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4>{openDataSelectObjective.data}</h4>
                          {inputVal.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <IconButton
                                color="secondary"
                                onClick={() => {
                                  setLayer4({
                                    deleteLayer4: false,
                                    editLayer4: true,
                                    layer4Data: layer3Data
                                  });
                                  setOpenLayer4EditDialog(true);
                                  handleClose();
                                }}
                              >
                                <Edit />
                              </IconButton>

                              <IconButton
                                color="error"
                                onClick={() => {
                                  setLayer4({
                                    deleteLayer4: true,
                                    editLayer4: false,
                                    layer4Data: layer3Data
                                  });
                                  setOpenLayer4DeleteDialog(true);
                                  handleClose();
                                }}
                              >
                                <Delete />
                              </IconButton>
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  setLayer4Add(true);
                                }}
                              >
                                <Add />
                              </IconButton>
                            </div>
                          )}
                        </Box>
                        {openDataSelectObjective.innerData.map((op, indd) => {
                          let exist = false;

                          openData.subDisorder.forEach((ad) => {
                            if (ad.name === addData.subDisorder.name) {
                              ad.objective.forEach((ad1) => {
                                if (openDataSelectObjective.data === ad1.data) {
                                  ad1.innerData.forEach((ad2) => {
                                    if (ad2.data === op.data) {
                                      exist = true;
                                    }
                                  });
                                }
                              });
                            }
                          });

                          return (
                            <Chip
                              key={indd}
                              className={`${exist ? 'selectProblemWithActive' : 'selectProblemWith'}`}
                              label={op.data}
                              sx={{
                                borderWidth: 2, // Increase border thickness
                                borderColor: exist ? 'primary.main' : 'secondary.main',
                                borderStyle: 'solid',
                                mr: 1,
                                my: 1
                              }}
                              variant={exist ? 'default' : 'outlined'}
                              color={exist ? 'primary' : 'default'}
                              onClick={() => {
                                handleDialogOpen();

                                setOpenData((prevOpenData) => {
                                  const newOpenData = JSON.parse(JSON.stringify(prevOpenData)); // Deep copy

                                  newOpenData.subDisorder.forEach((ad, inx) => {
                                    if (ad.name === addData.subDisorder.name) {
                                      // Deduplicate `objective` array by `data` property
                                      const uniqueObjectives = [];
                                      const seenData = new Set();

                                      ad.objective.forEach((ad1) => {
                                        if (!seenData.has(ad1.data)) {
                                          seenData.add(ad1.data);
                                          uniqueObjectives.push(ad1);
                                        }
                                      });

                                      newOpenData.subDisorder[inx].objective = uniqueObjectives;

                                      newOpenData.subDisorder[inx].objective.forEach((ad1) => {
                                        if (openDataSelectObjective.data === ad1.data) {
                                          if (!ad1.innerData) {
                                            ad1.innerData = [];
                                          }

                                          let mergedInnerData = [...ad1.innerData, op];

                                          // Deduplicate `innerData`
                                          const uniqueInnerData = [];
                                          const seenInnerData = new Set();

                                          mergedInnerData.forEach((item) => {
                                            if (!seenInnerData.has(item.data)) {
                                              seenInnerData.add(item.data);
                                              uniqueInnerData.push(item);
                                            }
                                          });

                                          ad1.innerData = uniqueInnerData;
                                        }
                                      });
                                    }
                                  });

                                  return newOpenData; // Updates state to trigger re-render
                                });
                              }}
                              onDelete={
                                exist
                                  ? () => {
                                      setOpenData((prevOpenData) => {
                                        const newOpenData = JSON.parse(JSON.stringify(prevOpenData)); // Deep copy

                                        newOpenData.subDisorder.forEach((ad, inx) => {
                                          if (ad.name === addData.subDisorder.name) {
                                            ad.objective.forEach((ad1, indx) => {
                                              if (openDataSelectObjective.data === ad1.data) {
                                                if (!newOpenData.subDisorder[inx].objective[indx].innerData) {
                                                  newOpenData.subDisorder[inx].objective[indx].innerData = [];
                                                }

                                                // Remove `op` from `innerData`
                                                newOpenData.subDisorder[inx].objective[indx].innerData = newOpenData.subDisorder[
                                                  inx
                                                ].objective[indx].innerData.filter((item) => item.data !== op.data);
                                              }
                                            });
                                          }
                                        });

                                        return newOpenData; // Updates state
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
                </Box>
              )}

              {addData.subDisorder.objective.length === 0 && (
                <Box className="sinceFormat" style={{ marginTop: '5px' }}>
                  <TextField
                    variant="outlined"
                    name="value"
                    value={addData.subDisorder.value}
                    fullWidth={addData.subDisorder.answerType === 'Calender' ? false : true}
                    type={addData.subDisorder.answerType === 'Calender' ? 'date' : 'text'}
                    multiline={addData.subDisorder.answerType === 'Calender' ? false : true}
                    rows={5}
                    onChange={(e) => {
                      let a = [...openData.subDisorder];
                      const existingIndex = a.findIndex((av) => av.name === addData.subDisorder.name);

                      if (existingIndex > -1) {
                        a[existingIndex].value = e.target.value;
                      } else {
                        a.push({
                          ...addData.subDisorder,
                          value: e.target.value
                        });
                      }
                      setAddData((prev) => {
                        return {
                          ...prev,
                          subDisorder: {
                            ...prev.subDisorder,
                            value: e.target.value
                          }
                        };
                      });
                      setOpenData((prev) => ({
                        ...prev,
                        subDisorder: a
                      }));
                    }}
                  />
                </Box>
              )}

              <Button
                variant="contained"
                className="addBtn"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  let aa = [...patientExamination.systematic, openData];
                  aa = [...new Map(aa.map((item) => [item['_id'], item])).values()];
                  handlePatientSubmit({
                    ...patientExamination,
                    systematic: aa
                  });
                  handleClose();
                  setOpenLayer4EditDialog(false);
                  setOpenLayer4DeleteDialog(false);
                }}
              >
                Save
              </Button>
            </Box>
          )}

          {open4Systemic && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>{addData.subDisorder.name}</h4>

              {addData.subDisorder.objective.length > 0 && (
                <Box className="sinceFormat" sx={{ marginTop: '5px' }}>
                  {addData.subDisorder.objective.map((v, inx) => {
                    return (
                      <Chip
                        key={inx}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        variant={'outlined'}
                        color={'default'}
                        className={`${'selectProblemWith'}`}
                        label={v.data}
                        onClick={() => {
                          handleDialogOpen();
                          setSystemicOpen4LayerDataAdd(true);
                          setOpen4Systemic(false);
                          setInputVal(v.innerData === undefined || v.innerData.length === 0 ? [{ data: '' }] : v.innerData);
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
                          setErr(e);
                          setDataSystemic4Layer({
                            ...addData,
                            objective: v
                          });
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          )}

          {systemicOpen4LayerDataAdd && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>Add data for {dataSystemic4Layer.objective.data}</h4>
              <Grid container spacing={2}>
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
                          onChange={(e) => {
                            const { name, value } = e.target;
                            const list = [...inputVal];
                            list[index][name] = value;
                            setInputVal(list);
                          }}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton
                          title="Remove Option"
                          onClick={() => {
                            removeInputVal4(index);
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
                  addInputVal4();
                }}
                title="Add Option"
                className="addBox"
              >
                <AddBox />
              </IconButton>
              <br />
              <Button
                className="addBtn"
                onClick={() => {
                  //check changes
                  dataSystemic4Layer.subDisorder.objective.forEach((v, inx) => {
                    if (v.data === dataSystemic4Layer.objective.data) {
                      dataSystemic4Layer.subDisorder.objective[inx].innerData = [...inputVal];
                      dataSystemic4Layer.subDisorder.objective[inx].innerData = [
                        ...new Map(dataSystemic4Layer.subDisorder.objective[inx].innerData.map((item) => [item['data'], item])).values()
                      ];
                    }
                  });

                  let aa = [dataSystemic4Layer.subDisorder];
                  aa = [...new Map(aa.map((item) => [item['_id'], item])).values()];
                  handleUpdateSystemicSubdisorder(addData.disorder._id, dataSystemic4Layer.subDisorder._id, aa);
                  handleClose();
                }}
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          )}

          {openAddExamOther && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>Add Other Examination Name</h4>
              <TextField
                variant="outlined"
                name="exam"
                value={addData.exam}
                fullWidth
                onChange={(e) => {
                  setAddData((prev) => {
                    return { ...prev, exam: e.target.value };
                  });
                  setError('');
                }}
                error={error !== '' ? true : false}
                helperText={error}
                style={{ margin: '10px 0' }}
              />
              <Button className="addBtn" onClick={handleOtherSubmit} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openAddExamOtherData && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>Add {addData.exam} Description</h4>
              <TextField
                variant="outlined"
                name="notes"
                value={addData.notes}
                onChange={(e) => {
                  setAddData((prev) => {
                    return { ...prev, notes: e.target.value };
                  });
                }}
                error={error !== '' ? true : false}
                helperText={error}
                style={{ margin: '10px 0', width: '100%' }}
                multiline
                rows={4}
              />

              <Button className="addBtn" onClick={handleOtherPatientSubmit} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openOtherEditHandler && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>Edit Other Examination</h4>
              <Box className="selectedCategory">
                {allOther.map((val, ind) => {
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
                      label={val.exam}
                      onClick={() => {
                        closeForm();
                        setAddData(val);
                        setOpenOtherEditDataDetail(true);
                        handleDialogOpen();
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {openOtherEditDataDetail && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>Update Other Examination Name</h4>
              <TextField
                variant="outlined"
                name="exam"
                value={addData.exam}
                fullWidth
                onChange={(e) => {
                  setAddData((prev) => {
                    return { ...prev, exam: e.target.value };
                  });
                  setError('');
                }}
                error={error !== '' ? true : false}
                helperText={error}
                style={{ margin: '10px 0' }}
              />
              <Button className="addBtn" onClick={handleOtherUpdateSubmit} variant="contained">
                Submit
              </Button>
            </Box>
          )}

          {openOtherDeleteHandler && (
            <Box className="selectedPtCategory" sx={{ width: 400 }}>
              <h4>Delete Other Examination</h4>
              <Box className="selectedCategory">
                {allOther.map((val, ind) => {
                  let exist = false;
                  deleteOtherIds.forEach((v) => {
                    if (val._id === v) {
                      exist = true;
                    }
                  });
                  return (
                    <Chip
                      key={ind}
                      sx={{
                        borderWidth: 2, // Increase border thickness
                        borderColor: exist ? 'primary.main' : 'secondary.main',
                        borderStyle: 'solid',
                        mr: 1,
                        my: 1
                      }}
                      variant={exist ? 'default' : 'outlined'}
                      color={exist ? 'primary' : 'default'}
                      className={exist ? 'selectProblemDelete' : 'selectProblem'}
                      label={val.exam}
                      onClick={() => {
                        handleDialogOpen();
                        let a = deleteOtherIds;
                        if (val._id !== undefined) {
                          a.push(val._id);
                        }

                        let unique = [];
                        a.forEach((element) => {
                          if (!unique.includes(element)) {
                            unique.push(element);
                          }
                        });

                        setDeletedOtherIds(unique);
                      }}
                      onDelete={
                        exist
                          ? () => {
                              let aa = [];
                              deleteOtherIds.forEach((vM) => {
                                if (vM !== val._id) {
                                  aa.push(vM);
                                }
                              });
                              setDeletedOtherIds(aa);
                            }
                          : undefined
                      }
                      deleteIcon={exist ? <Close style={{ color: 'white' }} /> : undefined}
                    />
                  );
                })}
              </Box>

              <Button variant="contained" className="addBtn" style={{ marginTop: '10px' }} onClick={handleSaveDeleteOtherExamination}>
                Save
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Systemic Add Image  */}
      <Dialog open={systemicAddDialog}>
        <DialogContent>
          <input type="file" accept="image/*" style={{ display: 'block', marginBottom: '10px' }} onChange={handleFileChange} />

          {/* Show selected image preview */}
          {base64Img && (
            <div style={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Selected Image:
              </Typography>
              <img
                src={base64Img}
                alt="Selected"
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '10px' }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSystemicAddDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            className="addBtn"
            onClick={() => {
              editDiagramHandler(tempData, base64Img); // Pass base64 image to submit function
              setSystemicAddDialog(false);
            }}
            color="primary"
            disabled={!base64Img}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Local Add Image */}
      <Dialog open={localAddDialog}>
        <DialogContent>
          <input type="file" accept="image/*" style={{ display: 'block', marginBottom: '10px' }} onChange={handleFileChange} />

          {/* Show selected image preview */}
          {base64Img && (
            <div style={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Selected Image:
              </Typography>
              <img
                src={base64Img}
                alt="Selected"
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '10px' }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocalAddDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            className="addBtn"
            onClick={() => {
              editDiagramHandlerLocal(tempData, base64Img); // Pass base64 image to submit function
              setLocalAddDialog(false);
            }}
            color="primary"
            variant="contained"
            disabled={!base64Img} // Disable submit if no image selected
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Layer 4 edit */}
      <Dialog open={openLayer4EditDialog}>
        <DialogContent>
          {layer4.editLayer4 && (
            <Grid item xs={4} className="ptData" sx={{ p: 2, borderRadius: 2, width: 400 }}>
              {/* Heading */}
              <Typography variant="h6" gutterBottom>
                Update Data
              </Typography>

              {/* Check if innerData exists and has length > 0 */}
              {layer4?.layer4Data?.[0]?.exam?.subDisorder?.[layer2index]?.objective?.[layer3ChipSelectedFor4Index]?.innerData?.length >
              0 ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {layer4?.layer4Data?.[0]?.exam?.subDisorder?.[layer2index]?.objective?.[layer3ChipSelectedFor4Index]?.innerData?.map(
                    (chip, index) => (
                      <Chip
                        key={index}
                        label={chip.data}
                        onClick={() => handleChipSelection(index, chip.data)}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: selectedChipIndex === index ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        variant={selectedChipIndex === index ? 'default' : 'outlined'}
                        color={selectedChipIndex === index ? 'primary' : 'default'}
                      />
                    )
                  )}
                </Box>
              ) : (
                <Typography variant="h4" sx={{ mt: 2 }}>
                  No available data to edit.
                </Typography>
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
                      Update
                    </Button>
                  </Box>
                </Box>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLayer4EditDialog(false)} variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Layer 3 edit */}
      <Dialog open={layer3Edit}>
        <DialogContent>
          {open3Layer.edit3Layer && (
            <Grid item xs={4} className="ptData" sx={{ p: 2, borderRadius: 2, width: 400 }}>
              {/* Heading */}
              <Typography variant="h6" gutterBottom>
                Update Data
              </Typography>

              {/* Check if data exists and has length > 0 */}
              {open3Layer?.layer3Data?.[0]?.exam?.subDisorder?.[layer2index]?.objective?.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {open3Layer?.layer3Data?.[0]?.exam?.subDisorder?.[layer2index]?.objective?.map((chip, index) => (
                    <Chip
                      key={index}
                      label={chip.data}
                      onClick={() => handleChipSelection(index, chip.data)}
                      sx={{
                        borderWidth: 2, // Increase border thickness
                        borderColor: selectedChipIndex === index ? 'primary.main' : 'secondary.main',
                        borderStyle: 'solid',
                        mr: 1,
                        my: 1
                      }}
                      variant={selectedChipIndex === index ? 'default' : 'outlined'}
                      color={selectedChipIndex === index ? 'primary' : 'default'}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="h4" sx={{ mt: 2 }}>
                  No available data to edit.
                </Typography>
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
                    <Button variant="contained" onClick={handleSaveUpdatelayer3}>
                      Update
                    </Button>
                  </Box>
                </Box>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLayer3Delete(false);
              setLayer3Edit(false);
              setOpen3Layer({
                edit3Layer: false,
                delete3Layer: false
              });
            }}
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* // Layer 4 delete */}
      <Dialog open={openLayer4DeleteDialog}>
        <DialogContent>
          {layer4.deleteLayer4 && (
            <Grid item xs={4} className="ptData" sx={{ px: 2, width: 400 }}>
              <Typography variant="h6" gutterBottom>
                Delete
              </Typography>

              {/* Check if innerData exists and has length > 0 */}
              {layer4?.layer4Data?.[0]?.exam?.subDisorder?.[layer2index]?.objective?.[layer3ChipSelectedFor4Index]?.innerData?.length >
              0 ? (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                  {layer4?.layer4Data?.[0]?.exam?.subDisorder?.[layer2index]?.objective?.[layer3ChipSelectedFor4Index]?.innerData?.map(
                    (innerItem, innerIndex) => (
                      <Chip
                        key={innerItem?.data || `inner-${innerIndex}`}
                        label={innerItem.data}
                        onClick={() => handleChipClick(innerIndex)}
                        sx={{
                          borderWidth: 2, // Increase border thickness
                          borderColor: selectedChips.includes(innerIndex) ? 'primary.main' : 'secondary.main',
                          borderStyle: 'solid',
                          mr: 1,
                          my: 1
                        }}
                        variant={selectedChips.includes(innerIndex) ? 'default' : 'outlined'}
                        color={selectedChips.includes(innerIndex) ? 'primary' : 'default'}
                      />
                    )
                  )}
                </Box>
              ) : (
                <Typography variant="h4" sx={{ mt: 2 }}>
                  No available data to delete.
                </Typography>
              )}

              {/* Buttons in One Line */}
              {selectedChips.length > 0 && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button variant="contained" onClick={handleDeleteGeneralExaminationLayer4}>
                    Delete
                  </Button>
                </Box>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLayer4DeleteDialog(false)} variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Layer 3 Delete */}
      <Dialog open={layer3Delete}>
        <DialogContent>
          {open3Layer.delete3Layer && (
            <Grid item xs={4} className="ptData" sx={{ px: 2, width: 400 }}>
              <Typography variant="h6" gutterBottom>
                Delete
              </Typography>

              {/* Check if data exists and has length > 0 */}
              {open3Layer?.layer3Data?.[0]?.exam?.subDisorder?.[layer2index]?.objective?.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                  {open3Layer?.layer3Data?.[0]?.exam?.subDisorder?.[layer2index]?.objective?.map((item, index) => (
                    <Chip
                      key={item?.data || `chip-${index}`}
                      label={item.data}
                      onClick={() => handleChipClick(index)}
                      sx={{
                        borderWidth: 2, // Increase border thickness
                        borderColor: selectedChips.includes(index) ? 'primary.main' : 'secondary.main',
                        borderStyle: 'solid',
                        mr: 1,
                        my: 1
                      }}
                      variant={selectedChips.includes(index) ? 'default' : 'outlined'}
                      color={selectedChips.includes(index) ? 'primary' : 'default'}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="h4" sx={{ mt: 2 }}>
                  No available data to delete.
                </Typography>
              )}

              {/* Buttons in One Line */}
              {selectedChips.length > 0 && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button variant="contained" onClick={handleDeleteGeneralExaminationLayer3}>
                    Delete
                  </Button>
                </Box>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLayer3Delete(false);
              setLayer3Edit(false);
              setOpen3Layer({
                edit3Layer: false,
                delete3Layer: false
              });
            }}
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <>
        {/* Dialog Wrapper */}
        <Dialog open={open} maxWidth="md" fullWidth>
          <DialogTitle>{activeTab === 1 ? 'Local' : 'Systematic'} Diagram</DialogTitle>
          <DialogContent>
            <SystematicDiagram
              imageSrc={imageSrc}
              setImageSrc={setImageSrc}
              patientExamination={patientExamination}
              handlePatientSubmit={handlePatientSubmit}
              activeTab={activeTab}
              setDiagramSaved={setDiagramSaved}
              getExamination={getExamination}
              onClose={() => setOpen(false)}
              localData={mostLocal}
              systematicData={mostSystematic}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
      <Dialog open={openDialogOpthalmic} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogContent>{dialogComponent}</DialogContent>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

export default Examination;
