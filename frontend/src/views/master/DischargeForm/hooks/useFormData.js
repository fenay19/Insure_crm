import { get } from 'api/api';
import { useEffect, useState } from 'react';

const useDischargeFormData = () => {
  const [formData, setFormData] = useState({
    name: '',
    uhid: '',
    ipdNo: '',
    department: '',
    departmentId: '',
    consultantDoctor: '',
    dateOfAdmission: '',
    bedNo: '',
    dischargeRequestDate: '',
    dischargeRequestTime: '',
    dischargeType: '',
    dischargeCondition: '',
    patientCategory: '',
    patientCategoryId: '',
    patientPayee: '',
    patientPayeeId: '',
    paymentStatus: '',
    tpa: '',
    tpaId: '',
    reasonOfDama: '',
    reasonOfTransfer: '',
    causeOfDeath: '',
    diagnosis: '',
    deathDay: '',
    deathTime: '',
    transferTo: ''
  });
  const [tpaData, setTpaData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [patientCategory, setPatientData] = useState([]);
  const [patientPayee, setPatientPayee] = useState([]);

  //  $$$$$$  { Handle Change}   $$$$$$$$$$$

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    if (name === 'tpa') {
      const selectedTpa = tpaData?.find((val) => val?._id === value);
      setFormData({ ...formData, tpa: selectedTpa ? selectedTpa?.tpaCompanyName : value, tpaId: value });
    } else if (name === 'department') {
      const selectedDepartment = departments?.find((val) => val?._id === value);
      setFormData({ ...formData, department: selectedDepartment ? selectedDepartment?.departmentName : value, departmentId: value });
    } else if (name === 'patientCategory') {
      const selectedCategory = patientCategory?.find((val) => val?._id === value);
      setFormData({ ...formData, patientCategory: selectedCategory ? selectedCategory?.parentGroupName : value, patientCategoryId: value });
    } else if (name === 'patientPayee') {
      const selectedPayee = patientPayee?.find((val) => val?._id === value);
      setFormData({ ...formData, patientPayee: selectedPayee ? selectedPayee?.payeeName : value, patientPayeeId: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(() => {
    get('insurance-company/tpa').then((res) => setTpaData(res?.allTpaCompany));
    get(`department-setup`).then((response) => {
      setDepartments(response.data);
    });
    get('category/parent-group').then((response) => {
      setPatientData(response.data);
    });
    get('category/patient-payee').then((response) => {
      setPatientPayee(response.data);
    });
  }, []);

  return { formData, handleChange, handleSubmit, tpaData, patientPayee, patientCategory, departments };
};

export default useDischargeFormData;
