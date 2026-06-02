import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Card,
  Modal,
  Typography
} from '@mui/material';
import { FiSearch } from 'react-icons/fi';
import { Cancel, RemoveRedEye, Save } from '@mui/icons-material';
import REACT_APP_API_URL, { get, post } from 'api/api';
import { toast, ToastContainer } from 'react-toastify';
import PatientImpression from '../../../../../component/PatientImpression';
import OPDBilling from 'component/billing/OPDBilling';
import { retrieveToken } from 'api/api';
import { useSelector, useDispatch } from 'react-redux';
import { setBillingInfo } from 'reduxSlices/opdBillingSlice';
import PatientDetails from 'views/OPD/PatientClinicalScreen/MenuAll/PatientDetails';
import { Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { setBillType, setOpenBillingModal } from 'reduxSlices/opdBillingStates';

const ConfirmAppointment = ({ patientDetail, close, opdPatient, fetchAppointmentsAfterBilling }) => {
  const loginRole = window.localStorage.getItem('loginRole');
  const { opdBillingModal } = useSelector((state) => state.opdBillingStates);
  const dispatch = useDispatch();
  const [prefix, setPrefix] = useState([]);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [patient, setPatient] = useState([]);
  const [filterData, setFilterData] = useState([]);
  // const [openBillingModal, setOpenBillingModal] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [openImpression, setOpenImpression] = useState(false);
  const [data, setData] = useState({});
  const [patientImpression, setPatientImpression] = useState('');
  const [loader, setLoader] = useState(true);
  const [formType, setFormType] = useState('OPD');
  const [patientPayeeData, setPatientPayeeData] = useState([]);
  const [payeeCategoryData, setPayeeCategoryData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [patientInfo, setPatientInfo] = useState({});
  const [consultanta, setConsultanta] = useState([]);
  const [alreadyBookAppointment, setAlreadyBookAppointment] = useState([]);
  const [doctorAvailable, setDoctorAvailable] = useState([]);
  const [imageSrc, setImageSrc] = useState('');
  const [TpaData, setTpaData] = useState([]);
  const [search, setSearch] = useState('');
  const [opdPatientsData, setOpdPatientsData] = useState([]);
  const [billingData, setBillingData] = useState({});
  const [emergencyReference, setEmergencyReference] = useState({
    arrivalMode: '',
    ambulatory: '',
    nonAmbulatory: '',
    emergencyType: '',
    medicoLegalCase: '',
    arrivalStatus: '',
    broughtBy: '',
    contactPersonprefix: '',
    contactPersonName: '',
    contactPersonMobile: '',
    contactPersonAddress: '',
    contactPersonrelation: '',
    dateOfAdmission: '',
    admissionTime: '',
    emr_regNo: '',
    referByForEmergency: [
      {
        referBy: '',
        refferName: '',
        refferMobile: ''
      }
    ]
  });

  const [inputDateTime, setInputDateTime] = useState({
    date: '',
    time: ''
  });

  const [basicInfoFilled, setBasicInfoFilled] = useState(false);

  const [uhid, setUhid] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState(null);

  const [inputOpdData, setInputOpdData] = useState({
    packagesType: opdPatient?.packagesType || '',
    packageValidity: opdPatient?.packageValidity || '',
    marketingCommunity: opdPatient?.marketingCommunity || '',
    registrationDate: opdPatient?.registrationDate || '',
    registrationTime: opdPatient?.registrationTime || '',
    opd_regNo: opdPatient?.opd_regNo || ''
  });

  const [inputWalkinData, setInputWalkinData] = useState({
    walkinService: '',
    registrationDate: '',
    registrationTime: '',
    walkin_regNo: ''
  });

  const [inputDaycareData, setInputDaycareData] = useState({
    dischargeTime: '',
    daycareService: '',
    dateOfAdmission: '',
    admissionTime: '',
    daycare_regNo: ''
  });

  const [inputIpdData, setInputIpdData] = useState({
    mlcNonMlc: '',
    packagesType: '',
    packageValidity: '',
    marketingCommunity: '',
    note: '',
    dateOfAdmission: '',
    admissionTime: '',
    ipd_regNo: ''
  });

  const [lastUhidAndReg, setLastUhidAndReg] = useState({
    uhid: '',
    reg: ''
  });

  const navigate = useNavigate();

  const [inputData, setInputData] = useState({
    formType: formType,
    patientType: patientDetail?.consultationType || '',
    patientId: patientDetail?._id || '',
    prefix: patientDetail?.prefix || '',
    prefixId: patientDetail?.prefixId._id || '',
    patientFirstName: patientDetail?.patientFirstName || '',
    patientMiddleName: patientDetail?.patientMiddleName || '',
    patientLastName: patientDetail?.patientLastName || '',
    dob: null,
    age: patientDetail.age || '',
    gender: patientDetail.gender || '',
    mobile_no: patientDetail.contact || '',
    country: patientDetail.country || '',
    state: patientDetail.state || '',
    city: patientDetail.city || '',
    address: patientDetail.address || '',
    pincode: patientDetail.pincode || '',
    birthTime: opdPatient?.birthTime || '',
    martialStatus: opdPatient?.martialStatus || '',
    aadhar_no: opdPatient?.aadhar_no || '',
    aadhar_card: opdPatient?.aadhar_card || '',
    abha_no: opdPatient?.abha_no || '',
    abha_card: opdPatient?.abha_card || '',
    patientPhoto: opdPatient?.patientPhoto || '',
    patientImpression: opdPatient?.patientImpression || '',
    departmentName: patientDetail.departmentName || '',
    departmentId: patientDetail.departmentId?._id || '',
    consultantName: patientDetail?.consultantName || '',
    consultantId: patientDetail?.consultantId?._id || '',
    date: patientDetail?.date || '',
    time: patientDetail?.time || '',

    bedAllocation: opdPatient?.bedAllocation || '',
    payeeCategory: opdPatient?.payeeCategory || '',
    payeeCategoryId: opdPatient?.payeeCategoryId || '',
    patientPayee: opdPatient?.patientPayee || '',
    patientPayeeId: opdPatient?.patientPayeeId || '',
    referBy: opdPatient?.referBy || '',
    refferName: opdPatient?.refferName || '',
    refferMobile: opdPatient?.refferMobile || '',

    relativePrifix: opdPatient?.relativePrifix || '',
    relativePrifixId: opdPatient?.relativePrifixId || '',
    relative_name: opdPatient?.relative_name || '',
    relative_mobile: opdPatient?.relative_mobile || '',
    relation: opdPatient?.relation || '',
    note: opdPatient?.note || '',
    primaryConsultant: opdPatient?.primaryConsultant || '',
    secondaryConsultant: opdPatient?.secondaryConsultant || '',
    tpa: opdPatient?.tpa || '',
    tpaId: opdPatient?.tpaId || null,
    uhidNo: opdPatient?.uhid || uhid,
    cardNo: opdPatient?.cardNo || '',
    beneficiaryId: opdPatient?.beneficiaryId || '',
    beneficiaryName: opdPatient?.beneficiaryName || '',
    validity: opdPatient?.validity || '',
    sumAssured: opdPatient?.sumAssured || '',
    cardAttachment: opdPatient?.cardAttachment || null,
    policyNo: opdPatient?.policyNo || '',
    policyType: opdPatient?.policyType || '',
    schemeName: opdPatient?.schemeName || '',
    abhaNumber: '',
    employeeId: '',
    charityIndigent: opdPatient?.charityIndigent || '',
    charityWeaker: opdPatient?.charityWeaker || '',
    charityCamp: opdPatient?.charityCamp || '',
    charityDocument: opdPatient?.charityDocument || ''
  });
  const [err, setErr] = useState({
    prefix: '',

    patientFirstName: '',
    patientMiddleName: '',
    patientLastName: '',
    dob: '',
    age: '',
    mobile_no: '',
    gender: '',
    country: '',
    state: '',
    address: '',
    pincode: '',
    aadhar_no: '',
    aadhar_card: '',

    consultantId: '',
    departmentName: '',
    consultantName: '',
    uhidNo: ''
  });

  // Generate UHID

  const generateUHID = () => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const date = String(currentDate.getDate()).padStart(2, '0');

      let newSerialNumber = '0000001';

      // Use the last UHID to get the serial number
      if (lastUhidAndReg?.uhid) {
        const parts = lastUhidAndReg.uhid.split('-');
        if (parts.length === 2) {
          const lastSerial = parts[1];
          newSerialNumber = (parseInt(lastSerial, 10) + 1).toString().padStart(7, '0');
        }
      }

      const newUHID = `${year}${month}${date}-${newSerialNumber}`;

      // Save the new UHID and update the state
      setLastUhidAndReg((prev) => ({ ...prev, uhid: newUHID }));
      // if (inputData?.patientType !== 'Follow-Up') {
      setInputData((prev) => ({ ...prev, uhidNo: newUHID }));
      // }
      setUhid(newUHID);
    } catch (error) {
      console.error(error);
    }
  };
  // Generate Registration Number logic
  const generateRegistrationNumber = () => {
    try {
      const year = new Date().getFullYear();
      let newSerialNumber = '00001';

      // Ensure last registration number exists and is in the correct format
      if (lastUhidAndReg?.reg) {
        const parts = lastUhidAndReg.reg.split('-');

        // Check if it's correctly split into 3 parts and increment
        if (parts.length === 3) {
          const lastSerial = parts[2]; // Get the serial number part
          newSerialNumber = (parseInt(lastSerial, 10) + 1).toString().padStart(5, '0');
        }
      }

      const registrationNumber = `${formType}-${year}-${newSerialNumber}`;

      // Update the state with the new registration number
      setLastUhidAndReg((prev) => ({ ...prev, reg: registrationNumber }));

      if (formType === 'OPD') {
        setInputOpdData((prev) => ({ ...prev, opd_regNo: opdPatient?.opd_regNo || registrationNumber }));
      } else if (formType === 'IPD') {
        setInputIpdData((prev) => ({ ...prev, ipd_regNo: registrationNumber }));
      } else if (formType === 'Daycare') {
        setInputDaycareData((prev) => ({ ...prev, daycare_regNo: registrationNumber }));
      } else if (formType === 'Walkin') {
        setInputWalkinData((prev) => ({ ...prev, walkin_regNo: registrationNumber }));
      } else {
        setEmergencyReference((prev) => ({ ...prev, emr_regNo: registrationNumber }));
      }
      setRegistrationNumber(registrationNumber);
    } catch (error) {
      console.error('Error generating registration number: ', error);
    }
  };

  const [daycareService, setDaycareService] = useState([]);
  const [walkinService, setWalkinService] = useState([]);
  useEffect(() => {
    get('service-details-master').then((respose) => {
      let serData = [];
      respose.service.forEach((val, index) => {
        if (val.whichService === 'Service') {
          serData.push(val);
        }
      });
      const FilterDaycareService = serData.filter((val) => val.patientEncounter.includes('Daycare'));
      const FilterWalkinService = serData.filter((val) => val.patientEncounter.includes('Walk In'));
      setDaycareService(FilterDaycareService);
      setWalkinService(FilterWalkinService);
    });
  }, []);

  const handleFormType = (value) => {
    setInputData((prev) => ({ ...prev, formType: value }));
    setFormType(value);
  };

  const videoRef = useRef();
  const canvasRef = useRef();
  const docStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItens: 'center',
    color: 'blue'
  };

  useEffect(() => {
    get('appointmentSchedule-master').then((res) => {
      setDoctorAvailable(res.data);
    });

    get('opd').then((res) => {
      setAlreadyBookAppointment(res?.data);
    });

    get(`department-setup`).then((response) => {
      setDepartments(response.data);
    });

    get(`newConsultant`).then((response) => {
      setConsultanta(response?.data);
    });

    get(`prefix`).then((response) => {
      setPrefix(response.allPrefix);
    });

    if (formType === 'IPD') {
      get('ipd-patient/ipd-uhid-reg').then((res) => {
        if (res) {
          setLastUhidAndReg({
            uhid: res?.data?.uhid?.uhid,
            reg: res?.data?.reg?.ipd_regNo
          });
        }
      });
    } else if (formType === 'OPD') {
      get('opd-patient/uhid-reg').then((res) => {
        if (res) {
          setLastUhidAndReg({
            uhid: res?.data?.uhid?.uhid,
            reg: res?.data?.reg?.opd_regNo
          });
        }
      });
    } else if (formType === 'Daycare') {
      get('daycare-patient/daycare-uhid-reg').then((res) => {
        if (res) {
          setLastUhidAndReg({
            uhid: res?.data?.uhid?.uhid,
            reg: res?.data?.reg?.daycare_regNo
          });
        }
      });
    } else if (formType === 'Walkin') {
      get('walkin-patient/walkin-uhid-reg').then((res) => {
        if (res) {
          setLastUhidAndReg({
            uhid: res?.data?.uhid?.uhid,
            reg: res?.data?.reg?.walkin_regNo
          });
        }
      });
    } else {
      get('emergency-patient/emr-uhid-reg').then((res) => {
        if (res) {
          setLastUhidAndReg({
            uhid: res?.data?.uhid?.uhid,
            reg: res?.data?.reg?.emr_regNo
          });
        }
      });
    }
  }, [formType]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getPatient = () => {
    get(`confirm-appointment/patient-details`).then((res) => {
      let fil = [];
      res.data.forEach((val, index) => {
        fil.push({ ...val, sr: index + 1 });
      });
      setFilterData(fil);

      let addsr = [];
      const filteredData = res.data.filter((item) => {
        return item.mobile_no !== undefined && item.mobile_no.toLowerCase().includes();
      });
      filteredData.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setPatient(addsr);
      setLoader(false);
    });
  };

  useEffect(() => {
    getPatient();
    // eslint-disable-next-line
  }, []);

  const openRegistration = () => {
    setOpenRegistrationModal(true);
  };

  const closeRegistration = () => {
    close();
    setInputData({
      prefix: '',
      prefixId: '',

      patientFirstName: '',
      patientMiddleName: '',
      patientLastName: '',
      dob: null,
      age: '',
      birth_time: '',
      mobile_no: '',
      gender: '',
      country: '',
      state: '',
      city: '',
      address: '',
      pincode: '',
      aadhar_no: '',
      aadhar_card: '',
      abha_no: '',
      abha_card: '',
      relativePrifix: '',
      relative_name: '',
      relative_mobile: '',
      relation: '',
      patientPhoto: '',
      patientImpression: '',
      uhidNo: '',
      note: ''
    });
    setErr({
      prefix: '',

      patientFirstName: '',
      patientMiddleName: '',
      patientLastName: '',
      dob: '',
      age: '',
      mobile_no: '',
      gender: '',
      maritalStatus: '',
      nationality: '',
      country: '',
      state: '',
      area: '',
      address: '',
      pincode: '',
      aadhar_no: '',
      aadhar_card: '',

      bedAllocation: '',
      patientType: '',
      patientPayee: '',
      insuranceCompany: '',
      department: '',
      consultant: '',
      packagesType: '',
      packageValidity: '',
      referBy: '',
      marketingCommunity: '',
      mlcNonMlc: '',
      note: '',
      uhidNo: ''
    });
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    if (!date) {
      setErr((prev) => ({
        ...prev,
        dob: 'Please select a valid date.'
      }));
      return;
    }

    const diff_ms = Date.now() - new Date(date).getTime();
    const age_dt = new Date(diff_ms);
    const age = Math.abs(age_dt.getUTCFullYear() - 1970);

    setErr((prev) => ({
      ...prev,
      dob: '',
      age: ''
    }));

    setInputData((prev) => ({
      ...prev,
      dob: date,
      age: age.toString()
    }));
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    stopMediaStream();
  };

  const stopMediaStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
    }
  };

  const handleCaptureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const capturedImage = canvas.toDataURL('image/png');
    setInputData((prev) => {
      return { ...prev, patientPhoto: capturedImage };
    });
    setIsCameraOpen(false);
    stopMediaStream();
  };

  const handleCapturePhoto = () => {
    setIsCameraOpen(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setMediaStream(stream);
        })
        .catch((error) => {
          console.error('Error accessing the camera:', error);
        });
    }
  };

  const handleUploadPhoto = (event) => {
    const file = event.target.files[0];
    const img = new Image();
    const reader = new FileReader();

    reader.onloadend = () => {
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const width = 150;
        const height = 150;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/png');
        setInputData((prev) => ({
          ...prev,
          patientPhoto: compressedBase64
        }));
      };
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (event, section) => {
    const { name, value, files } = event.target;
    const updateInputData = (updates) => setInputData((prev) => ({ ...prev, ...updates }));

    const clearErrors = (fields) => {
      const updatedErrors = { ...err };
      fields.forEach((field) => {
        updatedErrors[field] = '';
      });
      setErr(updatedErrors);
    };

    setInputData({
      ...inputData,
      [section]: {
        ...inputData[section],
        [event.target.name]: event.target.value
      }
    });

    if (name === 'aadhar_no') {
      if (!value) {
        setErr((prev) => ({
          ...prev,
          aadhar_no: 'Aadhar number is required!'
        }));
      } else if (!/^\d{12}$/.test(value)) {
        setErr((prev) => ({
          ...prev,
          aadhar_no: 'Aadhar number must be exactly 12 digits!'
        }));
      } else {
        setErr((prev) => ({
          ...prev,
          aadhar_no: '' // Clear error if valid
        }));
      }
    }

    if (name === 'prefix') {
      const selectedPrefix = prefix.find((val) => val._id === value);
      updateInputData({
        prefixId: value,
        prefix: selectedPrefix ? selectedPrefix.prefix : ''
      });
    } else if (['aadhar_card', 'abha_card', 'cardAttachment', 'charityDocument'].includes(name)) {
      updateInputData({ [name]: files[0] });
    } else if (name === 'pincode') {
      updateInputData({ [name]: value });
      clearErrors(['pincode', 'country', 'state', 'city']);
    } else if (name === 'payeeCategory') {
      const selected = payeeCategoryData.find((val) => val._id === value);
      setInputData({ ...inputData, payeeCategory: selected ? selected.parentGroupName : '', payeeCategoryId: value });
    } else if (name === 'tpa') {
      const selected = TpaData.find((val) => val?._id === value);
      setInputData({ ...inputData, tpa: selected ? selected?.tpaCompanyName : null, tpaId: value });
    } else {
      updateInputData({ [name]: value });
    }
    clearErrors([name]);
  };
  const handleEmrChange = (event) => {
    const { name, value } = event.target;
    setEmergencyReference((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDaycareChange = (event) => {
    const { name, value } = event.target;
    setInputDaycareData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpdChange = (event) => {
    const { name, value } = event.target;
    setInputOpdData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIpdChange = (event) => {
    const { name, value } = event.target;
    setInputIpdData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWalkinChange = (event) => {
    const { name, value } = event.target;

    if (formType === 'Emergency') {
      setEmergencyReference((prev) => ({
        ...prev,
        [name]: value
      }));
    } else {
      setInputWalkinData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handledateTimeChange = (event) => {
    const { name, value } = event.target;

    if (formType === 'Emergency') {
      setEmergencyReference((prev) => ({
        ...prev,
        [name]: value
      }));
    } else if (formType === 'IPD') {
      setInputIpdData((prev) => ({
        ...prev,
        [name]: value
      }));
    } else if (formType === 'Daycare') {
      setInputDaycareData((prev) => ({
        ...prev,
        [name]: value
      }));
    } else if (formType === 'OPD') {
      setInputOpdData((prev) => ({
        ...prev,
        [name]: value
      }));
    } else {
      setInputWalkinData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRelativeRefrence = (event) => {
    const { name, value } = event.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === 'relativePrifix') {
      const selectedPrefix = prefix.find((val) => val._id === value);
      setInputData({ ...inputData, relativePrifix: selectedPrefix ? selectedPrefix.prefix : '', relativePrifixId: value });
    }
  };

  const handleEmergencyChange = (event, index) => {
    const { name, value } = event.target;

    setEmergencyReference((prev) => {
      const updatedReferences = [...prev.referByForEmergency];
      updatedReferences[index][name] = value;
      return {
        ...prev,
        referByForEmergency: updatedReferences
      };
    });
  };

  const openWalkInRModal = (item) => {
    dispatch(setOpenBillingModal());
    // setOpenBillingModal(true)
    setData({ patientId: item, paidAmount: 0 });
  };

  useEffect(() => {
    setInputData({ ...inputData, patientImpression });
  }, [patientImpression]);

  const validateFields = (mobile_no, aadhar_no) => {
    // Validate Mobile Number

    if (!/^\d{10}$/.test(mobile_no)) {
      if (mobile_no.length < 10) {
        toast.error('Mobile number must be 10 digits long!');
      } else {
        toast.error('Mobile number cannot exceed 10 digits!');
      }
      return false; // Stop further execution
    }
    // Validate Aadhar Number
    if (!/^\d{12}$/.test(aadhar_no)) {
      if (aadhar_no.length < 12) {
        toast.error('Aadhar number must be 12 digits long!');
      } else {
        toast.error('Aadhar number cannot exceed 12 digits!');
      }
      return false; // Stop further execution
    }

    return true; // Validation passed
  };

  const handleBasicInfo = () => {
    const { patientFirstName, patientLastName, patientMiddleName, aadhar_no, mobile_no } = inputData;

    // Check if any of the required fields are empty
    if ([patientFirstName, patientLastName, patientMiddleName]?.some((val) => val?.trim() === '')) {
      toast.error('Please fill all the required fields including Aadhar number!');
      return;
    }

    // Check if Aadhar number is exactly 12 digits
    const isValid = validateFields(mobile_no, aadhar_no);
    if (isValid) {
      if (!opdPatient) {
        generateUHID();
        generateRegistrationNumber();
      }
      setBasicInfoFilled(true);
    }
  };

  // console.log('patientInfooooooo', opdPatient);

  const handlePatientSubmit = async (event) => {
    event.preventDefault();

    if (!opdPatient) {
      const formData = new FormData();
      const { abha_card, aadhar_card, cardAttachment, charityDocument, ...otherData } = inputData;
      for (const [key, value] of Object.entries(otherData)) {
        formData.append(key, value || '');
      }
      if (aadhar_card) formData.append('aadhar_card', aadhar_card);
      if (abha_card) formData.append('abha_card', abha_card);
      if (cardAttachment) formData.append('cardAttachment', cardAttachment);
      if (charityDocument) formData.append('charityDocument', charityDocument);

      switch (formType) {
        case 'OPD':
          for (const [key, value] of Object.entries(inputOpdData)) {
            formData.append(key, value || '');
          }
          break;

        case 'Walkin':
          for (const [key, value] of Object.entries(inputWalkinData)) {
            formData.append(key, value || '');
          }
          break;

        case 'Daycare':
          for (const [key, value] of Object.entries(inputDaycareData)) {
            formData.append(key, value || '');
          }
          break;

        case 'Emergency':
          for (const [key, value] of Object.entries(emergencyReference)) {
            if (Array.isArray(value)) {
              value.forEach((item, index) => {
                for (const [subKey, subValue] of Object.entries(item)) {
                  formData.append(`referByForEmergency[${index}][${subKey}]`, subValue || '');
                }
              });
            } else {
              formData.append(key, value || '');
            }
          }
          break;

        case 'IPD':
          for (const [key, value] of Object.entries(inputIpdData)) {
            formData.append(key, value || '');
          }
          break;

        default:
          break;
      }

      try {
        const token = retrieveToken();
        const apiUrlMapping = {
          OPD: `${REACT_APP_API_URL}opd-patient`,
          Walkin: `${REACT_APP_API_URL}walkin-patient`,
          Daycare: `${REACT_APP_API_URL}daycare-patient`,
          Emergency: `${REACT_APP_API_URL}emr-patient`,
          IPD: `${REACT_APP_API_URL}ipd-patient`
        };

        const response = await fetch(apiUrlMapping[formType], {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to confirm the patient');
        }

        const data = await response.json();
        const billType = ['corporate private', 'corporate public', 'insurance', 'government scheme'].includes(
          patientDetail?.payeeCategory?.toLowerCase()?.trim()
        )
          ? 'Credit'
          : patientDetail?.payeeCategory?.toLowerCase()?.trim() === 'cash'
            ? 'Cash'
            : 'Other';

        if (data) {
          setBillingData({
            ...data?.patientRegistration,
            consultationType: patientDetail?.consultationType,
            registrationDate: patientDetail?.date
          });
          dispatch(
            setBillingInfo({
              ...data?.patientRegistration,
              consultationType: patientDetail?.consultationType,
              registrationDate: patientDetail?.date
            })
          );

          dispatch(setBillType(billType));
        }
        toast.success('Patient confirmed successfully!');
        openWalkInRModal(data?.patientRegistration);
        // closeRegistration();
      } catch (err) {
        if (err.name === 'TypeError') {
          toast.error('Network error. Please check your internet connection.');
        } else {
          toast.error(`Error confirming patient: ${err.message}`);
        }
        console.error('Error confirming patient:', err);
      }
    } else {
      // setOpenBillingModal(true)
      const billType = ['corporate private', 'corporate public', 'insurance', 'government scheme'].includes(
        patientDetail?.payeeCategory?.toLowerCase()?.trim()
      )
        ? 'Credit'
        : patientDetail?.payeeCategory?.toLowerCase()?.trim() === 'cash'
          ? 'Cash'
          : 'Other';

      dispatch(setBillType(billType));

      dispatch(
        setBillingInfo({
          ...opdPatient,
          consultationType: patientDetail?.consultationType,
          registrationDate: patientDetail?.date
        })
      );
    }
  };

  const handlePatientSubmitInSpecialCase = async (event) => {
    event.preventDefault();

    if (!opdPatient) {
      const formData = new FormData();
      const { abha_card, aadhar_card, cardAttachment, charityDocument, ...otherData } = inputData;
      for (const [key, value] of Object.entries(otherData)) {
        formData.append(key, value || '');
      }
      if (aadhar_card) formData.append('aadhar_card', aadhar_card);
      if (abha_card) formData.append('abha_card', abha_card);
      if (cardAttachment) formData.append('cardAttachment', cardAttachment);
      if (charityDocument) formData.append('charityDocument', charityDocument);

      switch (formType) {
        case 'OPD':
          for (const [key, value] of Object.entries(inputOpdData)) {
            formData.append(key, value || '');
          }
          break;

        case 'Walkin':
          for (const [key, value] of Object.entries(inputWalkinData)) {
            formData.append(key, value || '');
          }
          break;

        case 'Daycare':
          for (const [key, value] of Object.entries(inputDaycareData)) {
            formData.append(key, value || '');
          }
          break;

        case 'Emergency':
          for (const [key, value] of Object.entries(emergencyReference)) {
            if (Array.isArray(value)) {
              value.forEach((item, index) => {
                for (const [subKey, subValue] of Object.entries(item)) {
                  formData.append(`referByForEmergency[${index}][${subKey}]`, subValue || '');
                }
              });
            } else {
              formData.append(key, value || '');
            }
          }
          break;

        case 'IPD':
          for (const [key, value] of Object.entries(inputIpdData)) {
            formData.append(key, value || '');
          }
          break;

        default:
          break;
      }

      try {
        const token = retrieveToken();
        const apiUrlMapping = {
          OPD: `${REACT_APP_API_URL}opd-patient/for-special-case`,
          Walkin: `${REACT_APP_API_URL}walkin-patient`,
          Daycare: `${REACT_APP_API_URL}daycare-patient`,
          Emergency: `${REACT_APP_API_URL}emr-patient`,
          IPD: `${REACT_APP_API_URL}ipd-patient`
        };

        const response = await fetch(apiUrlMapping[formType], {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to confirm the patient');
        }

        const data = await response.json();

        if (data.success) {
          toast.success(data.message);
          setTimeout(() => {
            navigate('/confirm-patientForm');
          }, 2000);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        if (err.name === 'TypeError') {
          toast.error('Network error. Please check your internet connection.');
        } else {
          toast.error(`Error confirming patient: ${err.message}`);
        }
        console.error('Error confirming patient:', err);
      }
    }
  };

  const onBlurPincodeHandler = async () => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${inputData.pincode}`);
      const data = await response.json();
      if (data[0].Status === 'Success') {
        const { State, District, Country, Pincode } = data[0].PostOffice[0];
        setInputData((prevState) => ({
          ...prevState,
          state: State,
          city: District,
          country: Country,
          pincode: Pincode
        }));
      } else {
        console.error('Invalid Pincode');
      }
    } catch (error) {
      console.error('Error fetching pincode data:', error);
    }
  };

  const addReferenceHandler = () => {
    setEmergencyReference((prev) => ({
      ...prev,
      referByForEmergency: [...prev.referByForEmergency, { referBy: '', refferName: '', refferMobile: '' }]
    }));
  };

  const removeReferenceHandler = (index) => {
    setEmergencyReference((prev) => ({
      ...prev,
      referByForEmergency: prev.referByForEmergency.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    setBasicInfoFilled(false);
  }, [formType]);

  useEffect(() => {
    if (inputData.pincode > 5) {
      onBlurPincodeHandler();
    }
  }, [inputData.pincode]);

  useEffect(() => {
    if (patientDetail?.prefix) {
      setInputData({
        prefixId: patientDetail.prefixId._id,
        prefix: patientDetail.prefix
      });
    }
  }, [patientDetail?.prefix]);

  useEffect(() => {
    if (patientDetail) {
      const { prefixId, departmentId, consultantId } = patientDetail;

      const consultant = consultanta.find((c) => c._id === consultantId._id);

      const consultantName = consultant
        ? `${consultant.basicDetails?.firstName || ''} ${consultant.basicDetails?.middleName || ''} ${
            consultant.basicDetails?.lastName || ''
          }`
        : '';
      setInputData({
        ...inputData,
        prefixId: prefixId._id,
        departmentName: departmentId.departmentName,
        departmentId: departmentId._id,
        consultantName: consultantName,
        consultantId: consultantId._id
      });
    }
  }, [patientDetail, prefix, departments, consultanta]);

  const getTpaData = async () => {
    setLoader(true);
    await get('insurance-company/tpa').then((response) => {
      setTpaData(response.allTpaCompany);
    });
  };

  const fetchPatientPayeeData = async () => {
    setLoader(true);
    await get('category/patient-payee').then((response) => {
      setPatientPayeeData(response.data);
    });
  };

  const getPayeeCategoryData = async () => {
    setLoader(true);
    await get('category/parent-group').then((response) => {
      setPayeeCategoryData(response.data);
    });
  };

  const getOpdPatientData = async () => {
    await get('opd-patient').then((response) => {
      setOpdPatientsData(response?.data ?? []);
    });
  };

  // for follow up opd filter
  const filteredData = opdPatientsData?.filter((data) => {
    const uhidNo = data?.uhid?.trim();
    const mobileNo = data?.mobile_no?.toString().trim();
    const name = `${data?.patientFirstName}`;
    return uhidNo === search?.trim() || mobileNo === search?.trim() || name?.trim()?.toLowerCase() === search?.trim()?.toLowerCase();
  });

  useEffect(() => {
    // Check if the patientType is 'Follow-Up' and search is not empty
    if (inputData.patientType?.toLowerCase()?.trim() === 'follow-up' && search) {
      if (filteredData?.[0]) {
        setInputData((prevData) => {
          // Dynamically update each key with its value from filteredData[0]
          const updatedData = { ...prevData };

          Object.keys(updatedData).forEach((key) => {
            updatedData[key] = filteredData?.[0]?.[key] || updatedData[key] || '';
          });
          console.log('UPDATED DATA', updatedData);
          return updatedData;
        });
      }
    }
  }, [inputData.patientType, search]);

  useEffect(() => {
    if (inputData?.patientType?.toLowerCase()?.trim() !== 'new') {
      setInputOpdData({
        registrationDate: inputDateTime.date || '',
        registrationTime: inputDateTime.time || ''
      });
    } else {
      setInputOpdData({
        registrationDate: '',
        registrationTime: ''
      });
    }
  }, [inputData?.patientType]);

  useEffect(() => {
    getTpaData();
    fetchPatientPayeeData();
    getPayeeCategoryData();
    getOpdPatientData();
    // eslint-disable-next-line
  }, []);

  const [insuranceMasterData, setInsuranceMasterData] = useState([]);
  const [governmentCompanyData, setGovernmentCompanyData] = useState([]);
  const [corporateCompanyPrivate, setCorporateCompanyPrivate] = useState([]);
  const [corporateCompanyPublic, setCorporateCompanyPublic] = useState([]);
  const [charityPatitentPayees, setCharityPatientPayees] = useState(['Weaker', 'Indigenous']);
  const [generalCashPatientPayee, setGeneralCashPatientPayee] = useState(['Cash']);
  const [dataForPatientPayee, setDataForPatientPayee] = useState([]);
  const [gipsaaCompany, setGipsaaCompany] = useState([]);

  const [fingerPrintImage, setFingerPrintImage] = useState('');

  const fetchGipsaa = async () => {
    try {
      const response = await get('gipsaa-company/');
      setGipsaaCompany(response?.allGipsaaCompany || []);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchInsuranceMasterData = async () => {
    const response = await get('insurance-company');
    setInsuranceMasterData(response?.allInsuranceCompany?.length > 0 ? response.allInsuranceCompany : []);
  };

  const fetchGovernmentCompanyData = async () => {
    const response = await get('insurance-company/gov');
    setGovernmentCompanyData(response.allGovermentCompany.length > 0 ? response.allGovermentCompany : []);
  };

  const fetchCorporateCompanyPrivate = async () => {
    const response = await get('insurance-company/co-operative-private');
    setCorporateCompanyPrivate(response.allCooperativeCompany.length > 0 ? response.allCooperativeCompany : []);
  };

  const fetchCorporateCompanyPublic = async () => {
    const response = await get('insurance-company/co-operative');
    setCorporateCompanyPublic(response.allCooperativeCompany.length > 0 ? response.allCooperativeCompany : []);
  };

  useEffect(() => {
    fetchInsuranceMasterData();
    fetchGovernmentCompanyData();
    fetchCorporateCompanyPrivate();
    fetchCorporateCompanyPublic();
    fetchGipsaa();
  }, []);

  useEffect(() => {
    if (inputData.payeeCategory.trim().toLowerCase() === 'INSURANCE'.trim().toLowerCase()) {
      setDataForPatientPayee(insuranceMasterData?.map((item) => item.insuranceCompanyName));
    }
    if (inputData.payeeCategory.trim().toLowerCase() === 'gipsaa'.trim().toLowerCase()) {
      setDataForPatientPayee(gipsaaCompany?.map((item) => item?.gipsaaCompanyName));
    }

    if (inputData.payeeCategory.trim().toLowerCase() === 'GOVERNMENT SCHEME'.trim().toLowerCase()) {
      setDataForPatientPayee(governmentCompanyData?.map((item) => item.govermentCompanyName));
    }

    if (inputData.payeeCategory.trim().toLowerCase() === 'CORPORATE PRIVATE'.trim().toLowerCase()) {
      setDataForPatientPayee(corporateCompanyPrivate?.map((item) => item.cooperativeCompanyName));
    }

    if (inputData.payeeCategory.trim().toLowerCase() === 'CORPORATE PUBLIC'.trim().toLowerCase()) {
      setDataForPatientPayee(corporateCompanyPublic?.map((item) => item.cooperativeCompanyName));
    }

    if (inputData.payeeCategory.trim().toLowerCase() === 'Charity'.trim().toLocaleLowerCase()) {
      setDataForPatientPayee(charityPatitentPayees);
    }

    if (inputData.payeeCategory.trim().toLowerCase() === 'General Cash'.trim().toLowerCase()) {
      setDataForPatientPayee(generalCashPatientPayee);
    }
  }, [
    inputData.payeeCategory,
    insuranceMasterData,
    governmentCompanyData,
    corporateCompanyPublic,
    corporateCompanyPrivate,
    charityPatitentPayees,
    generalCashPatientPayee
  ]);

  const handleAddFingerPrint = async () => {
    const uri = 'https://localhost:8000/SGIFPCapture';

    fetch(uri, {
      method: 'POST'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        setFingerPrintImage(data.BMPBase64);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (opdPatient) {
      handleBasicInfo();
    }
  }, [opdPatient]);

  useEffect(() => {
    const billType = ['corporate private', 'corporate public', 'insurance', 'government scheme'].includes(
      inputData?.payeeCategory?.toLowerCase()?.trim()
    )
      ? 'Credit'
      : patientDetail?.payeeCategory?.toLowerCase()?.trim() === 'cash'
        ? 'Cash'
        : 'Other'; // Default case if no match

    // Dispatch the billType
    setInputData((prev) => ({
      ...prev,
      billType
    }));
  }, [inputData?.payeeCategory]);
  useEffect(() => {
    // Get current date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Format time to include AM/PM
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const currentTime = `${formattedHours}:${minutes}`;

    // Set the default values
    setInputDateTime({
      date: currentDate,
      time: currentTime
    });

    setInputData((prev) => ({
      ...prev,
      formFillingTime: `${formattedHours}:${minutes} ${ampm}`
    }));
  }, []);

  console.log(inputData);

  return (
    <div className="wideModal" style={{ height: `${basicInfoFilled ? '100vh' : '80vh'}`, margin: '3rem' }}>
      <form onSubmit={handlePatientSubmit}>
        <h1 style={{ textAlign: 'center' }}>UHID Registration</h1>

        <Card
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '1rem',
            paddingLeft: '1rem'
          }}
        >
          <Grid container spacing={2} mt={0.1}>
            <Grid item xs={12} sm={3} md={1.5}>
              <FormControl fullWidth>
                <InputLabel>Patient Type</InputLabel>
                <Select
                  label="Patient Type"
                  variant="standard"
                  name="patientType"
                  value={inputData.patientType}
                  onChange={handleChange}
                  required
                  //   error={!!errors.patientType}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Follow-Up">Follow-Up</MenuItem>
                </Select>
                {/* <span>{errors.patientType}</span> */}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className="Search-Card">
                <div className="Search-CardInner">
                  <div className="Search-container">
                    <div className="Search-InputContainer">
                      <input
                        name="search-uhid"
                        className="search-input"
                        placeholder="Search by UHID / Mobile Number / Name"
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div className="Search-Icon">
                      <FiSearch size={24} color="#657789" />
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'start',
                    alignItems: 'center',
                    marginLeft: '2rem'
                  }}
                >
                  <FormLabel style={{ marginRight: '6px' }}>
                    <strong>From Type:</strong>
                  </FormLabel>
                  <RadioGroup row name="formType" value={inputData.formType} onChange={(e) => handleFormType(e.target.value)}>
                    <FormControlLabel value="OPD" control={<Radio size="medium" />} label="OPD" />
                    <FormControlLabel
                      value="Walkin"
                      control={<Radio size="medium" />}
                      label="Walkin"
                      disabled={loginRole === 'Administrative' && true}
                    />
                    <FormControlLabel
                      value="Daycare"
                      control={<Radio size="medium" />}
                      label="Daycare"
                      disabled={loginRole === 'Administrative' && true}
                    />
                    <FormControlLabel
                      value="Emergency"
                      control={<Radio size="medium" />}
                      label="Emergency"
                      disabled={loginRole === 'Administrative' && true}
                    />
                    <FormControlLabel
                      value="IPD"
                      control={<Radio size="medium" />}
                      label="IPD"
                      disabled={loginRole === 'Administrative' && true}
                    />
                  </RadioGroup>
                </div>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3.5} sx={{ width: '300px !important' }}>
            <TextField
              fullWidth
              type="text"
              label="UHID NO "
              variant="outlined"
              name="uhidNo"
              onChange={handleChange}
              value={inputData?.patientType === 'Follow-Up' ? filteredData?.[0]?.uhid : inputData?.uhidNo || ''}
              // value={inputData?.patientType === 'Follow-Up' ? filteredData?.[0]?.uhid : uhid || ''}
              disabled
              error={!!err.uhidNo}
              helperText={err.uhidNo}
            />
          </Grid>

          {inputData?.patientType?.toLowerCase()?.trim() === 'new' && (
            <>
              <Grid item xs={12} sm={4} sx={{ margin: '0 1rem' }}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={inputDateTime.date}
                  // onChange={handleDaycareChange}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              {/* Time Input */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  name="dischargeTime"
                  value={inputDateTime.time}
                  // onChange={handleDaycareChange}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            </>
          )}
        </Card>

        <div style={{ marginBottom: '10px' }}>
          <Grid container spacing={2} mt={0.1}>
            <Grid item xs={12} sm={2} md={1.1}>
              <FormControl variant="outlined" fullWidth error={err.prefix !== '' ? true : false}>
                <InputLabel variant="outlined">Prefix</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  label="Prefix"
                  name="prefix"
                  value={inputData.prefixId}
                  onChange={handleChange}
                  variant="outlined"
                >
                  {prefix.map((val, ind) => {
                    return (
                      <MenuItem value={val._id} key={ind}>
                        {val.prefix}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>{err.prefix}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                id="PatientFirstName"
                label="Patient First Name"
                variant="outlined"
                name="patientFirstName"
                onChange={handleChange}
                value={inputData.patientFirstName}
                error={err.patientFirstName !== ''}
                helperText={err.patientFirstName}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                id="Patient Middle Name"
                label="Patient Middle Name"
                variant="outlined"
                name="patientMiddleName"
                onChange={handleChange}
                value={inputData.patientMiddleName}
                error={err.patientMiddleName !== '' ? true : false}
                helperText={err.patientMiddleName}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                id="Patient Last Name"
                label="Patient Last Name"
                variant="outlined"
                name="patientLastName"
                onChange={handleChange}
                value={inputData.patientLastName}
                error={err.patientLastName !== '' ? true : false}
                helperText={err.patientLastName}
              />
            </Grid>

            <Grid item xs={12} sm={2} md={1.5}>
              <TextField
                fullWidth
                id="date"
                label="DOB"
                variant="outlined"
                name="dob"
                onChange={handleDateChange}
                value={inputData.dob}
                error={err.dob !== ''}
                helperText={err.dob}
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2} md={1.1}>
              <TextField
                fullWidth
                id="age"
                label="Age"
                variant="outlined"
                name="age"
                onChange={handleChange}
                value={inputData.age}
                error={err.age !== '' ? true : false}
                helperText={err.age}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={2} md={1.5}>
              <TextField
                fullWidth
                type="time"
                id="birthTime"
                label="Birth time"
                variant="outlined"
                name="birthTime"
                value={inputData.birthTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel variant="outlined">Martial Status</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  label="Marital Status"
                  name="martialStatus"
                  value={inputData.martialStatus}
                  onChange={handleChange}
                  variant="outlined"
                >
                  {['Married', 'single', 'Divorced', 'Widowed', 'Separated'].map((val, ind) => {
                    return (
                      <MenuItem value={val} key={ind}>
                        {val}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3.2} md={2}>
              <FormControl fullWidth error={err.gender !== ''}>
                <InputLabel>Gender</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  label="Gender"
                  name="gender"
                  value={inputData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="TransGender">TransGender</MenuItem>
                </Select>
                <FormHelperText>{err.gender}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2} md={1.4}>
              <TextField
                fullWidth
                id="mobile_no"
                label="Mobile No"
                variant="outlined"
                name="mobile_no"
                onChange={handleChange}
                value={inputData.mobile_no}
                error={err.mobile_no !== '' ? true : false}
                helperText={err.mobile_no}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <TextField
                fullWidth
                id="address"
                label="Address"
                variant="outlined"
                name="address"
                onChange={handleChange}
                value={inputData.address}
                error={err.address !== '' ? true : false}
                helperText={err.address}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2} md={1.5}>
              <TextField
                fullWidth
                type="number"
                id="pincode"
                label="Pincode"
                variant="outlined"
                name="pincode"
                onChange={handleChange}
                value={inputData.pincode}
                error={err.pincode !== '' ? true : false}
                helperText={err.pincode}
                onBlur={onBlurPincodeHandler}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2} md={1.5}>
              <TextField fullWidth id="city" label="City" variant="outlined" name="city" onChange={handleChange} value={inputData.city} />
            </Grid>
            <Grid item xs={12} sm={2} md={1.8}>
              <TextField
                fullWidth
                id="state"
                label="State"
                variant="outlined"
                name="state"
                onChange={handleChange}
                value={inputData.state}
                error={err.state !== '' ? true : false}
                helperText={err.state}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={1.5}>
              <TextField
                fullWidth
                id="country"
                label="Country"
                variant="outlined"
                name="country"
                onChange={handleChange}
                value={inputData.country}
                error={err.country !== '' ? true : false}
                helperText={err.country}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3} md={1.8}>
              <TextField
                fullWidth
                id="aadhar_no"
                type="number"
                label="Aadhar Card No."
                variant="outlined"
                name="aadhar_no"
                onChange={handleChange}
                value={inputData.aadhar_no}
                error={err.aadhar_no !== '' ? true : false}
                helperText={err.aadhar_no}
                inputProps={{
                  minLength: 12,
                  maxLength: 12
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={1.8}>
              <TextField
                fullWidth
                label="Upload Adhar Card"
                type="file"
                id="attachment"
                inputProps={{ accept: '.pdf, .doc, .docx' }} // Set accepted file types
                name="aadhar_card"
                onChange={handleChange}
                error={err.aadhar_card !== '' ? true : false}
                helperText={err.aadhar_card}
                InputLabelProps={{
                  shrink: true
                }}
              />
              {inputData.aadhar_card !== '' && typeof inputData.aadhar_card === 'string' ? (
                <a
                  className="docFile"
                  href={`${REACT_APP_API_URL.replace('/api/', '')}/images/${inputData.aadhar_card}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={docStyle}
                >
                  <RemoveRedEye fontSize="small" style={{ marginRight: '5px' }} /> View Aadhar Card
                </a>
              ) : (
                inputData.aadhar_card !== '' && (
                  <a
                    className="docFile"
                    href={
                      inputData.aadhar_card instanceof Blob || inputData.aadhar_card instanceof File
                        ? URL.createObjectURL(inputData.aadhar_card)
                        : inputData.aadhar_card
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={docStyle}
                  >
                    <RemoveRedEye fontSize="small" style={{ marginRight: '5px' }} /> View Aadhar Card
                  </a>
                )
              )}
            </Grid>
            <Grid item xs={12} sm={3} md={1.7}>
              <TextField
                fullWidth
                id="abha"
                label="ABHA No."
                variant="outlined"
                name="abha_no"
                onChange={handleChange}
                value={inputData.abha_no}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={1.7}>
              <TextField
                label="Upload ABHA Card"
                fullWidth
                type="file"
                id="attachment"
                inputProps={{ accept: '.pdf, .doc, .docx' }} // Set accepted file types
                name="abha_card"
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true
                }}
              />
              {inputData.abha_card !== '' && typeof inputData.abha_card === 'string' ? (
                <a
                  className="docFile"
                  href={`${REACT_APP_API_URL.replace('/api/', '')}/images/${inputData.abha_card}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={docStyle}
                >
                  <RemoveRedEye fontSize="small" style={{ marginRight: '5px' }} />
                  View Abha Card
                </a>
              ) : (
                inputData.abha_card !== '' && (
                  <a
                    className="docFile"
                    href={
                      inputData.abha_card instanceof Blob || inputData.abha_card instanceof File
                        ? URL.createObjectURL(inputData.abha_card)
                        : inputData.abha_card
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={docStyle}
                  >
                    <RemoveRedEye fontSize="small" style={{ marginRight: '5px' }} /> View Abha Card
                  </a>
                )
              )}
            </Grid>
          </Grid>
        </div>

        <>
          <hr style={{ margin: '2rem 0' }} />
          <div style={{ margin: '20px 0' }}>
            <h4 style={{ textDecoration: 'underline' }}>Patient Photo</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3} md={2}>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    width: '350px'
                  }}
                >
                  <Button className="button-87" style={{ background: 'green' }} onClick={handleCapturePhoto}>
                    Capture Photo
                  </Button>{' '}
                  or{' '}
                  <label htmlFor="upload-photo">
                    <Button className="button-87" component="span" style={{ margin: '10px 0' }}>
                      Upload Photo
                    </Button>
                  </label>
                </div>
                <input accept="image/*" id="upload-photo" type="file" style={{ display: 'none' }} onChange={handleUploadPhoto} />

                {inputData.patientPhoto && (
                  <div>
                    <img
                      src={
                        typeof inputData.patientPhoto === 'string' ? inputData.patientPhoto : URL.createObjectURL(inputData.patientPhoto)
                      }
                      alt="Patient"
                      width="100"
                      height="100"
                    />
                  </div>
                )}
                <FormHelperText>{err.patientPhoto}</FormHelperText>
              </Grid>
            </Grid>
          </div>

          <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ textDecoration: 'underline' }}>Patient Signature</h4>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Grid item xs={12} sm={3} md={2}>
                <img src={patientImpression} alt="" style={{ width: '150px' }} />
                <Button
                  className="button-87"
                  onClick={() => {
                    document.getElementById('bodyId').style = 'zoom:1';
                    setOpenImpression(true);
                  }}
                >
                  Patient Sign
                </Button>
              </Grid>

              <Grid item xs={12} sm={3} md={2}>
                <img src={`data:image/bmp;base64,${fingerPrintImage}`} alt="" style={{ width: '150px' }} />
                <Button className="button-87" onClick={handleAddFingerPrint}>
                  Add Finger Print
                </Button>
              </Grid>
            </div>
          </div>
        </>

        <Grid item xs={12} sx={{ marginTop: '2rem', marginLeft: '10px' }}>
          <div className="btnGroup">
            <IconButton type="button" onClick={handleBasicInfo} title="Save" className="btnSave">
              <Save />
            </IconButton>
            <IconButton title="Cancel" onClick={closeRegistration} className="btnCancel">
              <Cancel />
            </IconButton>
          </div>
        </Grid>

        {basicInfoFilled && <hr style={{ margin: '2rem 0' }} />}

        {/* -------------------------------------------------------------------------------------------------------------------------------------------- */}

        {basicInfoFilled && (
          <>
            <h1 style={{ textAlign: 'center' }}>OPD Registration</h1>
            <Grid
              container
              style={{
                display: 'flex',
                margin: '1rem 0',
                marginBottom: '2rem',
                alignItems: 'center'
              }}
            >
              <Grid item xs={2} lg={1.5}>
                <TextField
                  label={
                    formType === 'Daycare'
                      ? 'Daycare No'
                      : formType === 'IPD'
                        ? 'IPD NO'
                        : formType === 'Emergency'
                          ? 'EMERGENCY NO'
                          : formType === 'OPD'
                            ? 'OPD NO'
                            : formType === 'Walkin' && 'WALKIN NO'
                  }
                  value={
                    formType === 'IPD'
                      ? inputIpdData?.ipd_regNo
                      : formType === 'Daycare'
                        ? inputDaycareData?.daycare_regNo
                        : formType === 'Walkin'
                          ? inputWalkinData?.walkin_regNo
                          : formType === 'Emergency'
                            ? emergencyReference?.emr_regNo
                            : opdPatient?.opd_regNo || inputOpdData?.opd_regNo
                  }
                  // value={inputData?.patientType === 'Follow-Up' ? filteredData?.[0]?.opd_regNo : registrationNumber || ''}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'red' // Text inside the input field
                    },
                    '& .MuiInputLabel-root': {
                      color: 'red' // Label color
                    },
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'red' // Border color
                    },
                    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'darkred' // Border color on hover
                    }
                  }}
                />
              </Grid>
              {/* <Grid item xs={2} lg={1.5}>
                <TextField
                  label={'Token No/Queue No'}
                  value={inputData?.tokenNo}
                  onChange={handleChange}
                  fullWidth
                  name="tokenNo"
                  sx={{ marginLeft: '1rem' }}
                />
              </Grid> */}
            </Grid>
          </>
        )}

        {basicInfoFilled && (
          <>
            <Grid container spacing={2}>
              {formType !== 'Walkin' && (
                <>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Department/Speciality"
                      name="departmentName"
                      value={inputData.departmentName}
                      onChange={handleChange}
                      error={!!err.departmentName}
                      helperText={err.departmentName}
                    />
                  </Grid>

                  {formType !== 'IPD' && formType !== 'Emergency' && (
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Consultant Name"
                        name="consultantName"
                        value={inputData.consultantName}
                        onChange={handleChange}
                        error={!!err.consultantName}
                        helperText={err.consultantName}
                      />
                    </Grid>
                  )}
                </>
              )}

              {(formType === 'IPD' || formType === 'Emergency') && (
                <>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Primary Consultant"
                      name="primaryConsultant"
                      value={inputData.primaryConsultant}
                      onChange={handleChange}
                      inputProps={{ maxLength: 20 }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Secondary Consultant"
                      name="secondaryConsultant"
                      value={inputData.secondaryConsultant}
                      onChange={handleChange}
                      inputProps={{ maxLength: 20 }}
                      fullWidth
                    />
                  </Grid>
                </>
              )}

              {/* Day Care Service */}
              {formType === 'Daycare' && (
                <>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Daycare Service</InputLabel>
                      <Select
                        MenuProps={{
                          PaperProps: {
                            style: { maxHeight: 300 }
                          }
                        }}
                        label="Daycare Service"
                        name="daycareService"
                        value={inputDaycareData.daycareService}
                        onChange={handleDaycareChange}
                      >
                        {daycareService &&
                          daycareService.map((item, index) => {
                            return (
                              <MenuItem key={index} value={item._id}>
                                {item.detailServiceName}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
              {/* Walkin Service */}
              {formType === 'Walkin' && (
                <>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Walkin Service</InputLabel>
                      <Select
                        MenuProps={{
                          PaperProps: {
                            style: { maxHeight: 300 }
                          }
                        }}
                        label="Walkin Service"
                        name="walkinService"
                        value={inputWalkinData.walkinService}
                        onChange={handleWalkinChange}
                        required
                      >
                        {walkinService &&
                          walkinService.map((item, index) => {
                            return (
                              <MenuItem key={index} value={item._id}>
                                {item.detailServiceName}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              {formType !== 'OPD' && formType !== 'Walkin' && (
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Bed Allocation"
                    name="bedAllocation"
                    value={inputData.bedAllocation}
                    onChange={handleChange}
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={2}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Payee Category</InputLabel>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 }
                      }
                    }}
                    label="Payee Category"
                    name="payeeCategory"
                    value={inputData.payeeCategoryId}
                    onChange={handleChange}
                    required
                  >
                    {payeeCategoryData &&
                      payeeCategoryData.map((item, index) => (
                        <MenuItem key={index} value={item._id}>
                          {item.parentGroupName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Render content for other categories */}
              {inputData?.payeeCategory?.toLowerCase()?.trim() !== 'cash'?.trim() && (
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Patient Payee</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      label="Patient Payee"
                      name="patientPayee"
                      value={inputData.patientPayee}
                      onChange={handleChange}
                      required
                    >
                      {dataForPatientPayee &&
                        dataForPatientPayee.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {(inputData?.payeeCategory.toLowerCase().trim() === 'INSURANCE'.toLowerCase().trim() ||
                inputData?.payeeCategory.toLowerCase().trim() === 'GIPSAA'.toLowerCase().trim()) && (
                <>
                  <Grid item xs={12} sm={2} md={3}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>TPA</InputLabel>
                      <Select
                        MenuProps={{
                          PaperProps: {
                            style: { maxHeight: 300 }
                          }
                        }}
                        label="TPA"
                        name="tpa"
                        value={inputData.tpaId}
                        onChange={handleChange}
                      >
                        {TpaData &&
                          TpaData?.map((item, index) => {
                            return (
                              <MenuItem key={index} value={item._id}>
                                {item?.tpaCompanyName}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              {formType !== 'OPD' && (
                <Grid item xs={2}>
                  <TextField
                    label="Note"
                    name="note"
                    value={inputData.note}
                    onChange={handleChange}
                    inputProps={{ maxLength: 100 }}
                    fullWidth
                  />
                </Grid>
              )}

              {/* Fields will be displayed based on condition of which payee category is selected */}
              <Grid container spacing={2} mt={1} ml={0.1}>
                {/* CGHS Fields */}
                {inputData.payeeCategory === 'CGHS' && (
                  <>
                    <Grid item xs={12} md={2}>
                      <TextField label="Card No." name="cardNo" value={inputData.cardNo} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Beneficiary ID"
                        name="beneficiaryId"
                        value={inputData.beneficiaryId}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Beneficiary Name"
                        name="beneficiaryName"
                        value={inputData.beneficiaryName}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Validity"
                        name="validity"
                        type="date"
                        value={inputData.validity}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Sum Assured"
                        name="sumAssured"
                        value={inputData.sumAssured}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Card Attachment"
                        type="file"
                        inputProps={{ accept: '.pdf, .doc, .docx' }}
                        name="cardAttachment"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                {/* Insurance/TPA Fields */}
                {inputData.payeeCategory.toLocaleLowerCase().trim() === 'INSURANCE'.toLowerCase().trim() && (
                  <>
                    <Grid item xs={12} md={2}>
                      <TextField label="Policy No." name="policyNo" value={inputData.policyNo} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField label="Policy Type" name="policyType" value={inputData.policyType} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField label="Card No." name="cardNo" value={inputData.cardNo} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Validity"
                        name="validity"
                        type="date"
                        value={inputData.validity}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Beneficiary Name"
                        name="beneficiaryName"
                        value={inputData.beneficiaryName}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Beneficiary ID"
                        name="beneficiaryId"
                        value={inputData.beneficiaryId}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Sum Assured"
                        name="sumAssured"
                        value={inputData.sumAssured}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Card Attachment"
                        type="file"
                        inputProps={{ accept: '.pdf, .doc, .docx' }}
                        name="cardAttachment"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                {/* Govt Scheme Fields */}
                {inputData.payeeCategory.toLowerCase().trim() === 'GOVERNMENT SCHEME'.toLowerCase().trim() && (
                  <>
                    <Grid item xs={12} md={2}>
                      <TextField label="Scheme Name" name="schemeName" value={inputData.schemeName} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Beneficiary ID"
                        name="beneficiaryId"
                        value={inputData.beneficiaryId}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Beneficiary Name"
                        name="beneficiaryName"
                        value={inputData.beneficiaryName}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Validity"
                        name="validity"
                        type="date"
                        value={inputData.validity}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="ABHA No./Ayushman Bharat No."
                        name="abhaNumber"
                        value={inputData.abhaNumber}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Card Attachment"
                        type="file"
                        inputProps={{ accept: '.pdf, .doc, .docx' }}
                        name="cardAttachment"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Sum Assured"
                        name="sumAssured"
                        value={inputData.sumAssured}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                {/* Corporate Fields */}
                {inputData.payeeCategory.toLowerCase().trim() === 'CORPORATE PRIVATE'.toLowerCase().trim() && (
                  <>
                    <Grid item xs={12} md={2}>
                      <TextField label="Employee ID" name="employeeId" value={inputData.employeeId} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Beneficiary ID"
                        name="beneficiaryId"
                        value={inputData.beneficiaryId}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Beneficiary Name"
                        name="beneficiaryName"
                        value={inputData.beneficiaryName}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Validity"
                        name="validity"
                        type="date"
                        value={inputData.validity}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Sum Assured"
                        name="sumAssured"
                        value={inputData.sumAssured}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Card Attachment"
                        type="file"
                        inputProps={{ accept: '.pdf, .doc, .docx' }}
                        name="cardAttachment"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}
                {inputData.payeeCategory.toLowerCase().trim() === 'CORPORATE PUBLIC'.toLowerCase().trim() && (
                  <>
                    <Grid item xs={12} md={2}>
                      <TextField label="Employee ID" name="employeeId" value={inputData.employeeId} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Beneficiary ID"
                        name="beneficiaryId"
                        value={inputData.beneficiaryId}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Beneficiary Name"
                        name="beneficiaryName"
                        value={inputData.beneficiaryName}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Validity"
                        name="validity"
                        type="date"
                        value={inputData.validity}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Sum Assured"
                        name="sumAssured"
                        value={inputData.sumAssured}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Card Attachment"
                        type="file"
                        inputProps={{ accept: '.pdf, .doc, .docx' }}
                        name="cardAttachment"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}
                {/* Charity Fields */}
                {inputData.payeeCategory.toLowerCase().trim() === 'CHARITY'.toLowerCase().trim() && (
                  <>
                    <Grid item xs={12} md={2}>
                      <TextField label="Camp" name="charityCamp" value={inputData.charityCamp} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={3} md={1.7}>
                      <TextField
                        label="Upload Documnet"
                        fullWidth
                        type="file"
                        id="attachment"
                        inputProps={{ accept: '.pdf, .doc, .docx' }} // Set accepted file types
                        name="charityDocument"
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                      {inputData.charityDocument !== '' && typeof inputData.charityDocument === 'string' ? (
                        <a
                          className="docFile"
                          href={`${REACT_APP_API_URL.replace('/api/', '')}/images/${inputData.charityDocument}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={docStyle}
                        >
                          <RemoveRedEye fontSize="small" style={{ marginRight: '5px' }} />
                          View Document
                        </a>
                      ) : (
                        inputData.charityDocument !== '' && (
                          <a
                            className="docFile"
                            href={
                              inputData.charityDocument instanceof Blob || inputData.charityDocument instanceof File
                                ? URL.createObjectURL(inputData.charityDocument)
                                : inputData.charityDocument
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            style={docStyle}
                          >
                            <RemoveRedEye fontSize="small" style={{ marginRight: '5px' }} /> View Document
                          </a>
                        )
                      )}
                    </Grid>
                  </>
                )}
              </Grid>

              <Grid container spacing={2} mt={0.1} sx={{ marginLeft: '0' }}>
                {/* Refer By Dropdown */}
                <Grid item xs={12} sm={3} md={2.5}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Refer By</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      label="Refer By"
                      name="referBy"
                      value={inputData.referBy}
                      onChange={handleChange}
                    >
                      <MenuItem value="">Select Refer By</MenuItem>
                      <MenuItem value="Organization">Organization</MenuItem>
                      <MenuItem value="Doctor">Doctor</MenuItem>
                      <MenuItem value="Employee">Employee</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Referred Name Input */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Referred Name"
                    variant="outlined"
                    name="refferName"
                    value={inputData.refferName}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Refer Mobile No. Input */}
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Refer Mobile No."
                    variant="outlined"
                    name="refferMobile"
                    value={inputData.refferMobile}
                    onChange={handleChange}
                  />
                </Grid>
                {/* Admission Date */}
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label={
                      formType === 'OPD' || formType === 'Walkin'
                        ? 'Registration Date'
                        : formType === 'Daycare'
                          ? 'Date of Daycare Admission'
                          : formType === 'Emergency'
                            ? 'Date Of Emergency Registartion'
                            : 'Date of Admission'
                    }
                    name={formType === 'OPD' || formType === 'Walkin' ? 'registrationDate' : 'dateOfAdmission'}
                    type="date"
                    value={
                      formType === 'Daycare'
                        ? inputDaycareData.dateOfAdmission
                        : formType === 'IPD'
                          ? inputIpdData.dateOfAdmission
                          : formType === 'Emergency'
                            ? emergencyReference.dateOfAdmission
                            : formType === 'OPD'
                              ? inputOpdData.registrationDate
                              : formType === 'Walkin' && inputWalkinData.registrationDate
                    }
                    onChange={handledateTimeChange}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>

                {/* Admission Time */}
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label={'Time'}
                    name={formType === 'OPD' || formType === 'Walkin' ? 'registrationTime' : 'admissionTime'}
                    type="time"
                    value={
                      formType === 'Daycare'
                        ? inputDaycareData.admissionTime
                        : formType === 'IPD'
                          ? inputIpdData.admissionTime
                          : formType === 'Emergency'
                            ? emergencyReference.admissionTime
                            : formType === 'OPD'
                              ? inputOpdData.registrationTime
                              : formType === 'Walkin' && inputWalkinData.registrationTime
                    }
                    onChange={handledateTimeChange}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
              </Grid>

              {formType === 'Emergency' && (
                <>
                  <Grid container spacing={3} sx={{ marginLeft: '0', marginTop: '5px' }}>
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          <h4 style={{ marginTop: '1rem' }}>Arrival Mode</h4>
                        </FormLabel>
                        <RadioGroup row name="arrivalMode" value={emergencyReference.arrivalMode} onChange={handleEmrChange}>
                          <FormControlLabel value="Ambulance" control={<Radio />} label="Ambulance" />
                          <FormControlLabel value="Car/Truck" control={<Radio />} label="Car/Truck" />
                          <FormControlLabel value="Motorized 2/3-Wheeler" control={<Radio />} label="Motorized 2/3-Wheeler" />
                          <FormControlLabel value="Public Transport" control={<Radio />} label="Public Transport" />
                          <FormControlLabel value="Walk" control={<Radio />} label="Walk" />
                          <FormControlLabel value="Other" control={<Radio />} label="Other" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                      <FormControl>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start',
                            alignItems: 'center'
                          }}
                        >
                          <FormLabel style={{ marginRight: '6px' }}>
                            <h4>Ambulatory</h4>
                          </FormLabel>
                          <RadioGroup row name="ambulatory" value={emergencyReference.ambulatory} onChange={handleEmrChange}>
                            <FormControlLabel value="Ambulatory" control={<Radio size="small" />} label="Ambulatory" />
                            <FormControlLabel value="Non-Ambulatory" control={<Radio size="small" />} label="Non-Ambulatory" />
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                      <FormControl>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start',
                            alignItems: 'center'
                          }}
                        >
                          <FormLabel style={{ marginRight: '6px' }}>
                            <h4>Condition</h4>
                          </FormLabel>
                          <RadioGroup row name="nonAmbulatory" value={emergencyReference.nonAmbulatory} onChange={handleEmrChange}>
                            <FormControlLabel value="Acute" control={<Radio size="small" />} label="Acute" />
                            <FormControlLabel value="Chronic" control={<Radio size="small" />} label="Chronic" />
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                      <FormControl>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start',
                            alignItems: 'center'
                          }}
                        >
                          <FormLabel style={{ marginRight: '6px' }}>
                            <h4>MLC / NON-MLC:</h4>
                          </FormLabel>
                          <RadioGroup row name="mlcNonMlc" value={emergencyReference.mlcNonMlc} onChange={handleEmrChange}>
                            <FormControlLabel value="MLC" control={<Radio size="small" />} label="MLC" />
                            <FormControlLabel value="NON-MLC" control={<Radio size="small" />} label="NON-MLC" />
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                      <FormControl>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start',
                            alignItems: 'center'
                          }}
                        >
                          <FormLabel style={{ marginRight: '6px' }}>
                            <h4>Emergency Type:</h4>
                          </FormLabel>
                          <RadioGroup row name="emergencyType" value={emergencyReference.emergencyType} onChange={handleEmrChange}>
                            <FormControlLabel value=" Single" control={<Radio size="small" />} label=" Single" />
                            <FormControlLabel value="Mass Casuality" control={<Radio size="small" />} label="Mass Casuality" />
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </Grid>

                    <Grid item xs={5}>
                      <FormControl>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start',
                            alignItems: 'center'
                          }}
                        >
                          <FormLabel style={{ marginRight: '6px' }}>
                            <h4>Status of arrival:</h4>
                          </FormLabel>
                          <RadioGroup row name="arrivalStatus" value={emergencyReference.arrivalStatus} onChange={handleEmrChange}>
                            <FormControlLabel value="ALIVE" control={<Radio size="small" />} label="ALIVE" />
                            <FormControlLabel
                              value="Brought in Death (BID)"
                              control={<Radio size="small" />}
                              label="Brought in Death (BID)"
                            />
                            <FormControlLabel
                              value="Death on Arrival (DOA)"
                              control={<Radio size="small" />}
                              label="Death on Arrival (DOA)"
                            />
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                      <FormControl>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start',
                            alignItems: 'center'
                          }}
                        >
                          <FormLabel style={{ marginRight: '6px' }}>
                            {' '}
                            <h4>Brought by:</h4>
                          </FormLabel>
                          <RadioGroup row name="broughtBy" value={emergencyReference.broughtBy} onChange={handleEmrChange}>
                            <FormControlLabel value="Relative" control={<Radio size="small" />} label="Relative" />
                            <FormControlLabel value="Other" control={<Radio size="small" />} label="Other" />
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </Grid>

                    {/* Contact Person Section */}
                    <Grid item xs={12}>
                      <h4 style={{ textDecoration: 'underline' }}>Arrival Contact Person</h4>
                    </Grid>

                    <Grid item xs={2}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel variant="outlined">Prefix</InputLabel>
                        <Select
                          MenuProps={{
                            PaperProps: {
                              style: { maxHeight: 300 }
                            }
                          }}
                          label="Prefix"
                          name="contactPersonprefix"
                          value={emergencyReference.contactPersonprefix}
                          onChange={handleEmrChange}
                          variant="outlined"
                        >
                          {prefix.map((val, ind) => {
                            return (
                              <MenuItem value={val._id} key={ind}>
                                {val.prefix}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        label="Person Name"
                        name="contactPersonName"
                        value={emergencyReference.contactPersonName}
                        onChange={handleEmrChange}
                        inputProps={{ maxLength: 25 }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        label="Person Mobile No."
                        name="contactPersonMobile"
                        value={emergencyReference.contactPersonMobile}
                        onChange={handleEmrChange}
                        inputProps={{ maxLength: 10 }}
                        type="number"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Person Address"
                        name="contactPersonAddress"
                        value={emergencyReference.contactPersonAddress}
                        onChange={handleEmrChange}
                        inputProps={{ maxLength: 25 }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Relation"
                        name="contactPersonrelation"
                        value={emergencyReference.contactPersonrelation}
                        onChange={handleEmrChange}
                        inputProps={{ maxLength: 20 }}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              {formType === 'IPD' && (
                <>
                  <Grid container spacing={3} sx={{ marginTop: '1rem', marginLeft: '0px' }}>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label={`IPD Packages Type`}
                        name="packagesType"
                        value={inputIpdData.packagesType}
                        onChange={handleIpdChange}
                        inputProps={{ maxLength: 20 }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <TextField
                        type="date"
                        label="Package Validity"
                        name="packageValidity"
                        value={inputIpdData.packageValidity}
                        onChange={handleIpdChange}
                        inputProps={{ maxLength: 20 }}
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Marketing Community"
                        name="marketingCommunity"
                        value={inputIpdData.marketingCommunity}
                        onChange={handleIpdChange}
                        inputProps={{ maxLength: 15 }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <FormControl>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'start',
                            alignItems: 'center'
                          }}
                        >
                          <FormLabel style={{ marginRight: '6px' }}>
                            <h4>MLC / NON-MLC:</h4>
                          </FormLabel>
                          <RadioGroup row name="mlcNonMlc" value={inputIpdData.mlcNonMlc} onChange={handleIpdChange}>
                            <FormControlLabel value="MLC" control={<Radio size="small" />} label="MLC" />
                            <FormControlLabel value="NON-MLC" control={<Radio size="small" />} label="NON-MLC" />
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              )}

              {formType === 'OPD' && (
                <>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="OPD Packages Type"
                      name="packagesType"
                      value={inputOpdData.packagesType}
                      onChange={handleOpdChange}
                      inputProps={{ maxLength: 20 }}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      type="date"
                      label="Package Validity"
                      name="packageValidity"
                      value={inputOpdData.packageValidity}
                      onChange={handleOpdChange}
                      inputProps={{ maxLength: 20 }}
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Marketing Community"
                      name="marketingCommunity"
                      value={inputOpdData.marketingCommunity}
                      onChange={handleOpdChange}
                      inputProps={{ maxLength: 15 }}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <TextField
                      label="Note"
                      name="note"
                      value={inputData.note}
                      onChange={handleChange}
                      inputProps={{ maxLength: 100 }}
                      fullWidth
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <div style={{ margin: '20px 0' }}>
              <h4 style={{ marginBottom: '15px', textDecoration: 'underline' }}>Patient Relative Reference /Contact Person</h4>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2} md={1.1}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="relativePrifix">Prefix</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      label="Prefix"
                      name="relativePrifix"
                      value={inputData.relativePrifixId}
                      onChange={handleRelativeRefrence}
                      variant="outlined"
                    >
                      {prefix.map((val, ind) => {
                        return (
                          <MenuItem value={val._id} key={ind}>
                            {val.prefix}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <TextField
                    fullWidth
                    id="relative_name"
                    label="Relative Name"
                    variant="outlined"
                    name="relative_name"
                    onChange={handleRelativeRefrence}
                    value={inputData.relative_name}
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <TextField
                    fullWidth
                    id="mobile_no"
                    label="Mobile No."
                    variant="outlined"
                    name="relative_mobile"
                    onChange={handleRelativeRefrence}
                    value={inputData.relative_mobile}
                  />
                </Grid>
                <Grid item xs={12} sm={2} md={3}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="relation">Relation</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      label="Relation"
                      name="relation"
                      value={inputData.relation}
                      onChange={handleRelativeRefrence}
                      variant="outlined"
                    >
                      <MenuItem value="Mother">Mother</MenuItem>
                      <MenuItem value="Father">Father</MenuItem>
                      <MenuItem value="Brother">Brother</MenuItem>
                      <MenuItem value="Sister">Sister</MenuItem>
                      <MenuItem value="Grandfather">Grandfather</MenuItem>
                      <MenuItem value="Grandmother">Grandmother</MenuItem>
                      <MenuItem value="Aunt">Aunt</MenuItem>
                      <MenuItem value="Uncle">Uncle</MenuItem>
                      <MenuItem value="Wife">Wife</MenuItem>
                      <MenuItem value="Husband">Husband</MenuItem>
                      <MenuItem value="Mother-in-law">Mother-in-law</MenuItem>
                      <MenuItem value="Father-in-law">Father-in-law</MenuItem>
                      <MenuItem value="Sister-in-law">Sister-in-law</MenuItem>
                      <MenuItem value="Brother-in-law">Brother-in-law</MenuItem>
                      <MenuItem value="Cousins">Cousins</MenuItem>
                      <MenuItem value="Son">Son</MenuItem>
                      <MenuItem value="Daughter">Daughter</MenuItem>
                      <MenuItem value="Grandchildren">Grandchildren</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </div>

            <Grid
              item
              xs={12}
              sx={{
                marginTop: '2rem',
                display: 'flex',
                gap: '16px', // Adjust gap for more spacing
                alignItems: 'center'
              }}
            >
              <Button type="submit" variant="contained" sx={{ backgroundColor: '#1976D2', color: '#fff' }}>
                Save And Billing
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{ backgroundColor: '#2E7D32', color: '#fff' }}
                onClick={(e) => handlePatientSubmitInSpecialCase(e)}
              >
                Save
              </Button>
              <Button variant="contained" sx={{ backgroundColor: '#D32F2F', color: '#fff' }} onClick={closeRegistration}>
                Cancel
              </Button>
            </Grid>
          </>
        )}
      </form>

      {openImpression && (
        <PatientImpression
          open={openImpression}
          setOpen={setOpenImpression}
          imageSrc={imageSrc}
          setImageSrc={setImageSrc}
          setPatientImpression={setPatientImpression}
          patientImpression={patientImpression}
        />
      )}

      <Modal open={opdBillingModal}>
        <OPDBilling
          // close={setOpenBillingModal}
          billingData={billingData}
          getFreshAppointmentAfterConfirmAppoinment={fetchAppointmentsAfterBilling}
        />
      </Modal>
      <Dialog open={isCameraOpen} onClose={handleCloseCamera} fullWidth>
        <DialogTitle>Capture Photo</DialogTitle>
        <DialogContent>
          <video ref={videoRef} autoPlay />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCaptureImage}>
            Capture
          </Button>
          <Button variant="contained" onClick={handleCloseCamera}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
};
export default ConfirmAppointment;
