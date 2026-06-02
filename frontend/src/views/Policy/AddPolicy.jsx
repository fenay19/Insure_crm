import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  IconButton,
  CardContent,
  FormControl,
  Switch,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  Divider,
  Box,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { get, post } from '../../api/api';
import { set } from 'lodash';

const AddPolicy = () => {
  // useEffect(() => {
  //   const storedFY = localStorage.getItem('selectedFY');
  //   console.log('FY ', storedFY);

  //   // if you want to set it in state
  //   setSelectedFY(storedFY);
  // }, []);

  function initialState() {
    return {
      financialYear: selectedFY || '',
      clientType: 'retail',
      retailCustomer: '',
      customerGroup: '',
      subCustomerGroup: '',
      checkSubGroup: '',
      branchCode: '',
      branchName: 'NAGPUR',
      prefix: '',
      cutomerName: '',
      mobile: '',
      email: '',
      insurerName: '',
      gstNo: '',
      showNominee: false,
      nomineeName: '',
      nomineeRelation: '',
      insDepartment: '',
      product: '',
      subProduct: '',
      insCompany: '',
      brokerName: '',
      branchBroker: '',
      tpPolicyDuration: '',
      tpStartDate: '',
      tpEndDate: '',
      tpPremium: '',
      tpGst: '',
      tpGstAmount: '',
      tpAmount: '',
      odPolicyDuration: '',
      odStartDate: '',
      odEndDate: '',
      odPremium: '',
      odGst: '',
      odGstAmount: '',
      odAmount: '',
      policyNumber: '',
      renewalDate: '',
      sumInsured: '',
      renewable: '',
      policyDuration: '',
      startDate: '',
      endDate: '',
      riskCode: '',
      otherAddon: '',
      netPremium: '',
      gst: '',
      gstAmount: '',
      totalAmount: '',
      siteLocation: '',
      numberOfInstallments: '',
      occupation: '',
      retroActive: '',
      incoterms: '',
      marineClause: '',
      terrorism: '',
      permiumOtherThanTerrorism: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleSubModel: '',
      vehicleNumber: '',
      engineNumber: '',
      monthYearOfRegn: '',
      fuelType: '',
      yearOfManufacturing: '',
      chassisNumber: '',
      endorsementName: '',
      endorsementReason: '',
      endorsementPolicyNumber: '',
      endorStartDate: '',
      endorEndDate: '',
      endorsementTerrorism: '',
      endorsementOtherTerrorism: '',
      endorsementNetPremium: '',
      paymentMode: '',
      etotalAmount: '',
      paidAmount: '',
      chequeNo: '',
      transactionDate: '',
      posMisRef: '',
      bqpCode: '',
      rateOnOtherTerr: '',
      amountOnOtherTerr: '',
      rateOnTerr: '',
      amountOnTerr: '',
      odBrokerageRate: '',
      odBrokerageAmount: '',
      tpBrokerageRate: '',
      tpBrokerageAmount: '',
      totalBrokerageAmount: '',
      brokerageGst: '',
      totalBrokerageGst: '',
      totalBrokerageAmountincGst: ''
    };
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFY, setSelectedFY] = useState(localStorage.getItem('selectedFY'));
  const [form, setForm] = useState(initialState());
  const [errors, setErrors] = useState({});
  const [filterByDocumentValue, setFilterByDocumentValue] = useState('');
  const [clientTypeValue, setClientTypeValue] = useState('retail');
  const [departmentValue, setDepartmentValue] = useState('');
  const [branchNameValue, setBranchNameValue] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [brokerageValue, setBrokerageValue] = useState('brokerage');
  const [brokerageLabel, setBrokerageLabel] = useState('Rate on Other Terrorism');

  const [financialYearData, setFinancialYearData] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [customerGroupData, setCustomerGroupData] = useState([]);
  const [subCustomerGroupData, setSubCustomerGroupData] = useState([]);
  const [prefixData, setPrefixData] = useState([]);
  const [branchCodeData, setBranchCodeData] = useState([]);
  const [insCompanyData, setInsCompanyData] = useState({});
  const [brokerNameData, setBrokerNameData] = useState({});
  const [branchBrokerData, setBranchBrokerData] = useState({});
  const [insDepartmentData, setInsDepartmentData] = useState({});
  const [productData, setProductData] = useState([]);
  const [subProductData, setSubProductData] = useState([]);
  const [fuelTypeData, setFuelTypeData] = useState([]);
  const [gstData, setGstData] = useState([]);
  const [riskCodeData, setRiskCodeData] = useState([]);
  const [addonData, setAddonData] = useState([]);
  const [marineClauseData, setMarineClauseData] = useState([]);
  const [brokerageRateData, setBrokerageRateData] = useState([]);
  const [incotermsData, setIncotermsData] = useState([]);
  const [endorsementData, setEndorsementData] = useState([]);
  const [showNominee, setShowNominee] = useState(false);
  const [taxes, setTaxes] = useState({
    TPGST: false,
    ODGST: false,
    CGST: false,
    SGST: false,
    IGST: false,
    UGST: false
  });
  const [motorTaxes, setMotorTaxes] = useState({
    TPGST: false,
    ODGST: false
  });

  useEffect(() => {}, [filterByDocumentValue, clientTypeValue, departmentValue, brokerageValue]);

  useEffect(() => {
    const fetchSubProductsByProduct = async () => {
      console.log('Sub products by products called ');
      const selectedId = form?.product;
      const selectedName = productData.find((branch) => branch._id === selectedId);
      console.log(selectedId, ' ', selectedName);
      const productName = selectedName?.productName;
      const res = await get(`subproductCategory/${productName}`);
      console.log('Sub Products', res);
      if (res.data) setSubProductData(res.data);
      else setSubProductData([]);
    };

    fetchSubProductsByProduct();
  }, [form.product]);

  useEffect(() => {
    const fetchSubCustomerByCustomer = async () => {
      const selectedId = form.customerGroup;
      const res = await get(`subCustomerGroup/${selectedId}`);
      // console.log('Sub Customers   ', res.data);
      if (res.data) setSubCustomerGroupData(res.data);
      else setSubCustomerGroupData([]);
    };

    fetchSubCustomerByCustomer();
  }, [form.customerGroup]);

  useEffect(() => {
    const terrorism = parseFloat(form.terrorism) || 0;
    const premiumOther = parseFloat(form.permiumOtherThanTerrorism) || 0;

    const total = terrorism + premiumOther;

    setForm((prev) => ({
      ...prev,
      netPremium: total
    }));
  }, [form.terrorism, form.permiumOtherThanTerrorism]);

  useEffect(() => {
    const tpPremium = form?.tpPremium ? parseFloat(form.tpPremium) : 0;
    const tpGstId = form?.tpGst;
    const tpGstValue = gstData?.find((i) => i._id === tpGstId)?.value || 0;

    const tpGstAmount = round2(tpPremium * (tpGstValue / 100));
    const tpAmount = round2(tpPremium + tpGstAmount);

    const odPremium = form?.odPremium ? parseFloat(form.odPremium) : 0;
    const odGstId = form?.odGst;
    const odGstValue = gstData?.find((i) => i._id === odGstId)?.value || 0;

    const odGstAmount = round2(odPremium * (odGstValue / 100));
    const odAmount = round2(odPremium + odGstAmount);

    const totalPremium = round2(tpPremium + odPremium);
    const gstAmount = round2(tpGstAmount + odGstAmount);
    const totalAmount = round2(tpAmount + odAmount);

    setForm((prev) => ({
      ...prev,
      // gstAmount: gstAmount,
      // totalAmount: calculatedTotal > 0 ? calculatedTotal.toFixed(2) : ''
      tpGstAmount: tpGstAmount,
      tpAmount: tpAmount,
      odGstAmount: odGstAmount,
      odAmount: odAmount,
      netPremium: totalPremium,
      gstAmount: tpGstAmount + odGstAmount,
      totalAmount: totalAmount,
      paidAmount: totalAmount
    }));

    // console.log(`tpPre ${tpPremium} gst id ${tpGstId} gst value ${tpGstValue} tax amount ${tpGstAmount} and tpAmount ${tpAmount}`);
  }, [form.tpPremium, form.odPremium, form.tpGst, form.odGst]);

  useEffect(() => {
    // const netPremium = parseFloat(form.netPremium) || 0;

    // if (departmentValue != '69539cdef88ccbb626abc903') {
    //   const isTaxApplicable = taxes.IGST || taxes.UGST || taxes.CGST || taxes.SGST;
    //   const gstId = form?.gst;
    //   const gstValue = gstData?.find((i) => i._id === gstId)?.value;
    //   const gstAmount = netPremium * (gstValue / 100) || 0;
    //   const totalAmount = netPremium + gstAmount;

    const netPremium = round2(parseFloat(form.netPremium) || 0);

    if (departmentValue !== '69539cdef88ccbb626abc903') {
      const isTaxApplicable = taxes.IGST || taxes.UGST || taxes.CGST || taxes.SGST;

      const gstId = form?.gst;
      const gstValue = gstData?.find((i) => i._id === gstId)?.value || 0;

      const gstAmount = round2(netPremium * (gstValue / 100));

      const totalAmount = round2(netPremium + gstAmount);

      setForm((prev) => ({
        ...prev,
        gstAmount: gstAmount || 0,
        // totalAmount: calculatedTotal > 0 ? calculatedTotal.toFixed(2) : ''
        totalAmount: totalAmount || '',
        paidAmount: totalAmount
      }));
    }
  }, [form.netPremium, form.gst]);

  useEffect(() => {
    if (taxes.CGST) setTaxes({ SGST: true, CGST: true, IGST: false, UGST: false });
    if (taxes.IGST) setTaxes({ SGST: false, CGST: false, IGST: true, UGST: false });
    if (taxes.UGST) setTaxes({ SGST: false, CGST: false, IGST: false, UGST: true });
  }, [taxes]);

  const handleFilterByDocumentChange = (e) => setFilterByDocumentValue(e.target.value);
  // const handleClientTypeChange = (e) => setClientTypeValue(e.target.value);
  const handleBrokerage = (e) => setBrokerageValue(e.target.value);
  const handleDepartmentChange = (e) => {
    console.log('department ', e.target.value);
    setDepartmentValue(e.target.value);
    if (e.target.value === 'engineering') setSiteLocation('Location of Project Site');
    else if (e.target.value === 'fire') setSiteLocation('Location of Property Insured');
  };

  const handleCheckboxChange = (event) => {
    setShowNominee(event.target.checked);
    setForm((prev) => ({
      ...prev,
      showNominee: event.target.checked
    }));
  };

  const fetchFYData = async () => {
    const res = await get('financialYear');
    // console.log('FY data:', res.data);
    if (res.data) setFinancialYearData(res.data);
    else setFinancialYearData([]);
  };

  const fetchGstData = async () => {
    const res = await get('gst-percentage');
    // console.log('gst percentage data:', res.data);
    if (res && res.data) setGstData(res.data);
    else setGstData([]);
  };

  const fetchClients = async () => {
    try {
      const role = localStorage.getItem('loginRole');
      let url = role === 'super-admin' ? 'clientRegistration' : 'customerRegistration';
      const res = await get(url);
      if (res.status) {
        setClientList(res.data);
        // console.log('Client List set:', clientList);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchCustomerGroupData = async () => {
    const res = await get('customerGroup');
    // console.log('Customer Grup data:', res.data);
    if (res.data) setCustomerGroupData(res.data);
    else setCustomerGroupData([]);
  };

  const fetchFuelTypeData = async () => {
    const res = await get('fuelType');
    // console.log('Fuel Type data:', res.data);
    if (res.data) setFuelTypeData(res.data);
    else setFuelTypeData([]);
  };

  const fetchPrefixData = async () => {
    const res = await get('prefix');
    // console.log('Prefix data:', res.allPrefix);
    if (res && res.allPrefix) setPrefixData(res.allPrefix);
    else setPrefixData([]);
  };

  const fetchBranchCode = async () => {
    const res = await get('brokerBranch');
    // console.log('branch code', res.data);
    if (res.status) setBranchCodeData(res.data);
    else setBranchCodeData([]);
  };

  const fetchInsCompany = async () => {
    const res = await get('insCompany');
    // console.log('insurance Company', res.data);
    if (res.data) setInsCompanyData(res.data);
    else setInsCompanyData([]);
  };
  const fetchInsDepartment = async () => {
    const res = await get('insDepartment');
    // console.log('insurance Department', res.data);
    if (res.data) setInsDepartmentData(res.data);
    else setInsDepartmentData([]);
  };

  const fetchProducts = async () => {
    const res = await get('productOrServiceCategory');
    // console.log('products', res.data);
    if (res.data) setProductData(res.data);
    else setProductData([]);
  };

  const fetchSubProducts = async () => {
    const res = await get('subproductCategory');
    console.log('Sub Products', res.data);
    if (res.data) setSubProductData(res.data);
    else setSubProductData([]);
  };

  const fetchRiskCode = async () => {
    const res = await get('riskCode');
    // console.log('riskCode', res.data);
    if (res.data) setRiskCodeData(res.data);
    else setRiskCodeData([]);
  };

  const fetchAddon = async () => {
    const res = await get('otherAddon');
    // console.log('addon', res.data);
    if (res.data) setAddonData(res.data);
    else setAddonData([]);
  };

  const fetchMarineClause = async () => {
    const res = await get('marineClause');
    // console.log('marineClause', res.data);
    if (res.data) setMarineClauseData(res.data);
    else setMarineClauseData([]);
  };

  const fetchIncoterms = async () => {
    const res = await get('incoterms');
    // console.log('incoterms', res.data);
    if (res.data) setIncotermsData(res.data);
    else setIncotermsData([]);
  };
  const fetchBrokerName = async () => {
    const res = await get('brokerName');
    // console.log('brokerName', res.data);
    if (res.data) setBrokerNameData(res.data);
    else setBrokerNameData([]);
  };
  const fetchBranchBroker = async () => {
    const res = await get('branchBroker');
    // console.log('branchBroker', res.data);
    if (res.data) setBranchBrokerData(res.data);
    else setBranchBrokerData([]);
  };

  const fetchEndorsement = async () => {
    const res = await get('endorsement');
    // console.log('endorsement', res.data);
    if (res.data) setEndorsementData(res.data);
    else setEndorsementData([]);
  };

  const fetchBrokerageRate = async () => {
    try {
      const res = await get('brokerageRate');
      // console.log('BrokerageRate data:', res.data);
      if (res.data) setBrokerageRateData(res.data);
      else setBrokerageRateData([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFYData();
    fetchGstData();
    // fetchSubCustomerGroup();
    fetchClients();
    fetchCustomerGroupData();
    fetchFuelTypeData();
    fetchPrefixData();
    fetchBranchCode();
    fetchInsCompany();
    fetchInsDepartment();
    fetchProducts();
    fetchSubProducts();
    fetchRiskCode();
    fetchAddon();
    fetchMarineClause();
    fetchBrokerName();
    fetchBranchBroker();
    fetchIncoterms();
    fetchEndorsement();
    fetchBrokerageRate();
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      branchCode: '695386ca12bb6dd679ffa330'
    }));
  }, []);

  // ── Pre-fill from PDF Extraction page ──────────────────────────────────────
  useEffect(() => {
    if (!location.state?.prefill) return;
    
    const rawPrefill = location.state.prefill;
    const safePrefill = { ...rawPrefill }; // Text fields like policyNumber stay here

    // 1. Remove ID-bound fields initially to prevent strings leaking into state
    //    while their respective dropdown data lists are still loading.
    delete safePrefill.department;
    delete safePrefill.productName;
    delete safePrefill.fuelType;
    delete safePrefill.insCompany;

    // 2. Department Match
    if (rawPrefill.department && Array.isArray(insDepartmentData) && insDepartmentData.length > 0) {
      const match = insDepartmentData.find((d) => d.insDepartment?.toLowerCase() === rawPrefill.department.toLowerCase());
      if (match) {
        safePrefill.insDepartment = match._id;
        setDepartmentValue(match._id);
      }
    }

    // 3. Product Match
    if (rawPrefill.productName && Array.isArray(productData) && productData.length > 0) {
      const match = productData.find((p) => p.productName?.toLowerCase() === rawPrefill.productName.toLowerCase());
      if (match) {
        safePrefill.product = match._id;
      }
    }

    // 4. FuelType Match
    if (rawPrefill.fuelType && Array.isArray(fuelTypeData) && fuelTypeData.length > 0) {
      const match = fuelTypeData.find((f) => f.fuelType?.toLowerCase() === rawPrefill.fuelType.toLowerCase());
      if (match) {
        safePrefill.fuelType = match._id;
      }
    }

    // 5. InsCompany Match
    if (rawPrefill.insCompany && Array.isArray(insCompanyData) && insCompanyData.length > 0) {
      const match = insCompanyData.find((c) => c.insCompany?.toLowerCase() === rawPrefill.insCompany.toLowerCase());
      if (match) {
        safePrefill.insCompany = match._id;
      }
    }

    // 6. Merge safe fields into form state
    setForm((prev) => ({
      ...prev,
      ...safePrefill
    }));
  }, [insDepartmentData, productData, fuelTypeData, insCompanyData, location.state]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration) return '';

    const start = new Date(startDate);
    const end = new Date(start);

    switch (duration) {
      case 'YEARLY':
        end.setFullYear(end.getFullYear() + 1);
        break;

      case 'QUARTERLY':
        end.setMonth(end.getMonth() + 3);
        break;

      case 'MONTHLY':
        end.setMonth(end.getMonth() + 1);
        break;

      default:
        return '';
    }

    // 🔹 subtract 1 day
    end.setDate(end.getDate() - 1);

    return end.toISOString().split('T')[0]; // yyyy-mm-dd
  };

  // useEffect(() => {
  //   if (!form.startDate || !form.endDate) return;

  //   const start = new Date(form.startDate);
  //   const end = new Date(form.endDate);

  //   const diffTime = end - start;
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //   const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  //   const diffYears = end.getFullYear() - start.getFullYear();

  //   let duration = '';

  //   if (diffYears === 1 && diffMonths === 12) {
  //     duration = 'YEARLY';
  //   } else if (diffMonths === 3) {
  //     duration = 'QUARTERLY';
  //   } else if (diffMonths === 1) {
  //     duration = 'MONTHLY';
  //   } else if (diffYears > 1) {
  //     duration = `DAYS`;
  //   } else {
  //     duration = `DAYS`;
  //   }

  //   setForm((prev) => ({
  //     ...prev,
  //     policyDuration: duration,
  //     renewalDate: form.endDate
  //   }));
  // }, [form.startDate, form.endDate]);

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return '';

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    const diffYears = end.getFullYear() - start.getFullYear();

    if (diffYears === 1 && diffMonths === 12) return 'YEARLY';
    if (diffMonths === 3) return 'QUARTERLY';
    if (diffMonths === 1) return 'MONTHLY';

    return 'DAYS';
  };

  useEffect(() => {
    const policyDuration = calculateDuration(form.startDate, form.endDate);
    const tpPolicyDuration = calculateDuration(form.tpStartDate, form.tpEndDate);
    const odPolicyDuration = calculateDuration(form.odStartDate, form.odEndDate);

    setForm((prev) => ({
      ...prev,
      policyDuration,
      tpPolicyDuration,
      odPolicyDuration,
      renewalDate: form.odEndDate || form.tpEndDate || form.endDate // priority
    }));
  }, [form.startDate, form.endDate, form.tpStartDate, form.tpEndDate, form.odStartDate, form.odEndDate]);

  // useEffect(() => {
  //   if (!form.startDate || !form.policyDuration) return;

  //   const calculatedEndDate = calculateEndDate(form.startDate, form.policyDuration);

  //   if (!calculatedEndDate) return;

  //   setForm((prev) => ({
  //     ...prev,
  //     endDate: calculatedEndDate,
  //     renewalDate: calculatedEndDate
  //     // transactionDate
  //   }));
  // }, [form.startDate, form.policyDuration]);

  const filteredProducts = useMemo(() => {
    if (!departmentValue) {
      return productData; // show all
    }

    return productData.filter((product) => product.insDepartment?._id === departmentValue);
  }, [productData, departmentValue]);

  // useEffect(() => {
  //   if (!form.tpStartDate || !form.tpPolicyDuration) return;

  //   const tpEndDate = calculateEndDate(form.tpStartDate, form.tpPolicyDuration);

  //   if (!tpEndDate) return;

  //   setForm((prev) => ({
  //     ...prev,
  //     tpEndDate,
  //     // transactionDate,
  //     renewalDate: tpEndDate
  //   }));
  // }, [form.tpStartDate, form.tpPolicyDuration]);

  // useEffect(() => {
  //   if (!form.odStartDate || !form.odPolicyDuration) return;

  //   const odEndDate = calculateEndDate(form.odStartDate, form.odPolicyDuration);

  //   if (!odEndDate) return;

  //   setForm((prev) => ({
  //     ...prev,
  //     odEndDate,
  //     // transactionDate,
  //     renewalDate: odEndDate
  //   }));
  // }, [form.odStartDate, form.odPolicyDuration]);

  const selectedProductName = useMemo(() => {
    const selectedProduct = productData.find((p) => p._id === form.product);

    return selectedProduct?.productName?.trim() || '';
  }, [productData, form.product]);

  const filteredSubProducts = useMemo(() => {
    if (!selectedProductName) {
      return subProductData; // no product selected → show all
    }

    return subProductData.filter((sub) => sub.productName?.trim() === selectedProductName);
  }, [subProductData, selectedProductName]);

  // console.log('Filtered Sub Pro,', filteredSubProducts);
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log('handleChnage ', name, value);
    if (name === 'branchCode') {
      const selectedId = e.target.value;
      const selectedName = branchCodeData.find((branch) => branch._id === selectedId);

      setForm((prev) => ({
        ...prev,
        branchName: selectedName.branchName
      }));
    }
    if (name === 'insDepartment') {
      setDepartmentValue(e.target.value);
    }
    if (name === 'clientType') setClientTypeValue(e.target.value);

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    // const error = validateForm();

    // setErrors((prev) => ({
    //   ...prev,
    //   [name]: error
    // }));

    setTaxes({
      ...taxes,
      [e.target.name]: e.target.checked
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Only required fields
    if (!form.financialYear) newErrors.financialYear = 'FY is required';
    if (!form.cutomerName) newErrors.cutomerName = 'Customer Name is required';
    if (!form.insurerName) newErrors.insurerName = 'Insurer Name is required';
    if (!form.insDepartment) newErrors.insDepartment = 'Department is required';
    if (!form.product) newErrors.product = 'Product is required';
    if (!form.policyNumber) newErrors.policyNumber = 'Policy Number is required';
    if (!form.paymentMode) newErrors.paymentMode = 'Payment Mode is required';

    if (departmentValue === '69539cdef88ccbb626abc903') {
      if (!form.tpPolicyDuration && !form.odPolicyDuration) {
        newErrors.tpPolicyDuration = 'TP/OD Policy Duration is required';
        newErrors.odPolicyDuration = 'TP/OD Policy Duration is required';
      }
      // if (!form.odPolicyDuration) newErrors.odPolicyDuration = 'OD Policy Duration is required';
      if (!form.tpPremium && !form.odPremium) {
        newErrors.tpPremium = 'TP/OD Premium is required';
        newErrors.odPremium = 'TP/OD Premium is required';
      }
      if (!form.tpBrokerageRate && !form.odBrokerageRate) {
        newErrors.tpBrokerageRate = 'TP/OD Brokerage Rate is required';
        newErrors.odBrokerageRate = 'TP/OD Brokerage Rate is required';
      }
      // if (!form.odBrokerageRate) newErrors.odBrokerageRate = 'OD Brokerage Rate is required';
      // if (!form.odPremium) newErrors.odPremium = 'OD Premium is required';
      if (!form.tpStartDate && !form.odStartDate) {
        newErrors.tpStartDate = 'TP/OD Start Date is required';
        newErrors.odStartDate = 'TP/OD Start Date is required';
      }
      // if (!form.odStartDate) newErrors.odStartDate = 'OD Start Date is required';
    } else {
      if (!form.policyDuration) newErrors.policyDuration = 'Policy Duration is required';
      if (!form.netPremium) newErrors.netPremium = 'Net Premium is required';
      if (!form.startDate) newErrors.startDate = 'StartDate is required';
      if (!form.rateOnTerr) newErrors.rateOnTerr = 'Terrorism Rate is required';
      if (!form.rateOnOtherTerr) newErrors.rateOnOtherTerr = 'Terrorism Rate is required';
    }

    // departmentValue === '69539cdef88ccbb626abc903'

    // if (!form.mobile?.match(/^\d{10}$/)) newErrors.mobile = 'Enter valid 10-digit number';

    // if (!form.email?.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Invalid email';

    console.log('All errors ', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill the required Fields');
      return;
    }
    // console.log('submit ', form);
    // return;
    try {
      const role = localStorage.getItem('loginRole');
      console.log(role, form);
      // if (role === 'admin') {
      const res = await post('policyDetail', form);
      console.log('After async ', res);
      if (res.data) {
        toast.success('Record Saved Successfully');
        setForm(initialState());
        // setLogoPreview('');
        setErrors({});
      } else {
        toast.error(res.message || 'Failed to submit');
      }
      // } else {
      //   toast.warning('You are notAuthorised');
      // }
      navigate('/policy');
    } catch (e) {
      console.log(e);
    }
  };

  const getRateValue = (rateId) => {
    return Number(brokerageRateData?.find((r) => r._id === rateId)?.brokerageRate || 0);
  };

  const round2 = (num) => Math.round((Number(num) + Number.EPSILON) * 100) / 100;

  useEffect(() => {
    if (!brokerageRateData || brokerageRateData.length === 0) return;

    if (departmentValue === '694b9c19d0c701ae30685141' || departmentValue === '69539cbff88ccbb626abc8fa') {
      const terr = Number(form.terrorism) || 0;
      const otherTerr = Number(form.permiumOtherThanTerrorism) || 0;

      const otherTerrRate = getRateValue(form.rateOnOtherTerr);
      const terrRate = getRateValue(form.rateOnTerr);

      const amountOnOtherTerr = round2((otherTerr * otherTerrRate) / 100);
      const amountOnTerr = round2((terr * terrRate) / 100);

      const totalBrokerageAmount = round2(amountOnOtherTerr + amountOnTerr);

      setForm((prev) => ({
        ...prev,
        amountOnOtherTerr,
        amountOnTerr,
        totalBrokerageAmount
        // totalBrokerageAmountincGst: totalBrokerageAmount
      }));
    } else {
      const netPremium = Number(form.netPremium) || 0;
      if (!netPremium) return;

      const otherTerrRate = getRateValue(form.rateOnOtherTerr);
      const terrRate = getRateValue(form.rateOnTerr);

      // % calculations
      const amountOnOtherTerr = round2((netPremium * otherTerrRate) / 100);
      const amountOnTerr = round2((netPremium * terrRate) / 100);

      const totalBrokerageAmount = round2(amountOnOtherTerr + amountOnTerr);

      setForm((prev) => ({
        ...prev,
        amountOnOtherTerr,
        amountOnTerr,
        totalBrokerageAmount
        // totalBrokerageAmountincGst: totalBrokerageAmount
      }));
    }
  }, [form.rateOnOtherTerr, form.rateOnTerr, form.netPremium, brokerageRateData]);

  useEffect(() => {
    const broAmount = Number(form.totalBrokerageAmount) || 0;

    const broGstId = form?.brokerageGst;
    const broGstValue = gstData?.find((i) => i._id === broGstId)?.value || 0;

    const gstAmount = round2((broAmount * broGstValue) / 100);
    const amount = broAmount + gstAmount;

    setForm((prev) => ({
      ...prev,
      totalBrokerageGst: gstAmount,
      totalBrokerageAmountincGst: amount
    }));
  }, [form.brokerageGst]);

  useEffect(() => {
    if (!brokerageRateData || brokerageRateData.length === 0) return;

    const tpPremium = Number(form.tpPremium) || 0;
    const odPremium = Number(form.odPremium) || 0;

    // ⛔ nothing to calculate
    if (!tpPremium && !odPremium) return;

    const tpRate = getRateValue(form.tpBrokerageRate);
    const odRate = getRateValue(form.odBrokerageRate);

    // % calculations

    const tpBrokerageAmount = round2((tpPremium * tpRate) / 100);
    const odBrokerageAmount = round2((odPremium * odRate) / 100);

    const totalBrokerageAmount = round2(tpBrokerageAmount + odBrokerageAmount);

    setForm((prev) => ({
      ...prev,
      tpBrokerageAmount,
      odBrokerageAmount,
      totalBrokerageAmount,
      totalBrokerageAmountincGst: totalBrokerageAmount
    }));
  }, [form.tpPremium, form.odPremium, form.tpBrokerageRate, form.odBrokerageRate, brokerageRateData]);

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Policy Management
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Policy Registration</Typography>
            <Button variant="contained" onClick={() => navigate('/policy')}>
              <ArrowBack />
            </Button>
          </Grid>

          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} sx={{ mb: 2 }}>
                  <FormControl fullWidth error={!!errors.financialYear}>
                    <InputLabel id="financialYear">Financial Year</InputLabel>
                    <Select
                      labelId="financialYear"
                      label="financialYear"
                      name="financialYear"
                      value={form.financialYear}
                      onChange={handleChange}
                    >
                      {financialYearData.length > 0 &&
                        financialYearData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {new Date(type.fromDate).getFullYear()} - {new Date(type.toDate).getFullYear()}
                          </MenuItem>
                        ))}
                    </Select>
                    {errors.financialYear && <FormHelperText>{errors.financialYear}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="clientType">Customer Type</InputLabel>
                    <Select labelId="clientType" label="clientType" name="clientType" value={form.clientType} onChange={handleChange}>
                      <MenuItem value="retail">Retail</MenuItem>
                      <MenuItem value="corporate">Corporate</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {clientTypeValue === 'retail' ? (
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel id="retailCustomer">Retail Customer</InputLabel>
                      <Select
                        labelId="retailCustomer"
                        label="retailCustomer"
                        name="retailCustomer"
                        value={form.retailCustomer}
                        onChange={handleChange}
                      >
                        {clientList.length > 0 &&
                          clientList.map((type) => (
                            <MenuItem key={type._id} value={type._id}>
                              {type.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel id="customerGroup">Parent Group</InputLabel>
                        <Select
                          labelId="customerGroup"
                          label="customerGroup"
                          name="customerGroup"
                          value={form.customerGroup}
                          onChange={handleChange}
                        >
                          {customerGroupData.length > 0 &&
                            customerGroupData.map((type) => (
                              <MenuItem key={type._id} value={type._id}>
                                {type.customerGroupName}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel id="subCustomerGroup">Sub Group</InputLabel>
                        <Select
                          labelId="subCustomerGroup"
                          label="subCustomerGroup"
                          name="subCustomerGroup"
                          onChange={handleChange}
                          value={form.subCustomerGroup}
                        >
                          {subCustomerGroupData?.length > 0 &&
                            subCustomerGroupData?.map((type) => (
                              <MenuItem key={type?._id} value={type?._id}>
                                {type?.subCustomerGroup}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel control={<Checkbox name="checkSubGroup" />} label="Check for Sub Customer Group" />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="filterByDocument">Filter by Document</InputLabel>
                    <Select
                      labelId="filterByDocument"
                      label="filterByDocument"
                      name="filterByDocument"
                      value={filterByDocumentValue}
                      onChange={handleFilterByDocumentChange}
                    >
                      <MenuItem value="">SELECT...</MenuItem>
                      <MenuItem value="PAN">PAN</MenuItem>
                      <MenuItem value="DL">Driving Licence</MenuItem>
                      <MenuItem value="Adhar">AADHAR</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {filterByDocumentValue && (
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth labelId="searchDocument" label="searchDocument" name="searchDocument" />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" gutterBottom>
            Basic Details
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="branchCode">Branch Code</InputLabel>
                    <Select labelId="branchCode" label="branchCode" name="branchCode" value={form.branchCode} onChange={handleChange}>
                      {branchCodeData.length > 0 &&
                        branchCodeData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.branchCode}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* 695386ca12bb6dd679ffa330 */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Branch Name"
                    name="branchName"
                    value={form.branchName}
                    onChange={handleChange}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="prefix">Title</InputLabel>
                    <Select labelId="prefix" label="prefix" name="prefix" value={form.prefix} onChange={handleChange}>
                      {prefixData.length > 0 &&
                        prefixData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.prefix}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                {[
                  { label: 'Customer Name', name: 'cutomerName', required: true },
                  { label: 'Customer Mobile', name: 'mobile' },
                  { label: 'Customer Email', name: 'email' },
                  { label: 'Insurer Company', name: 'insurerName', required: true },
                  { label: 'GST Number', name: 'gstNo' }
                ].map((field) => (
                  <Grid item xs={12} sm={3} key={field.name}>
                    <TextField
                      label={field.label}
                      name={field.name}
                      required={field.required || false}
                      value={form[field.name]}
                      onChange={handleChange}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="nomineeDetailsCheckbox"
                        checked={showNominee}
                        onChange={handleCheckboxChange}
                        value={form.showNominee}
                      />
                    }
                    label="Fill Nominee Details"
                  />
                </Grid>

                {showNominee && (
                  <>
                    <Grid item xs={12} sm={3}>
                      <TextField label="Nominee Name" name="nomineeName" value={form.nomineeName} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        select
                        label="Relation with Nominee"
                        name="nomineeRelation"
                        value={form.nomineeRelation}
                        onChange={handleChange}
                        fullWidth
                      >
                        <MenuItem key="Son" value="Son">
                          Son
                        </MenuItem>
                        <MenuItem key="Father" value="Father">
                          Father
                        </MenuItem>
                        <MenuItem key="Mother" value="Mother">
                          Mother
                        </MenuItem>
                        <MenuItem key="Spouse" value="Spouse">
                          Spouse
                        </MenuItem>
                        <MenuItem key="Daughter" value="Daughter">
                          Daughter
                        </MenuItem>
                        <MenuItem key="Sister" value="Sister">
                          Sister
                        </MenuItem>
                        <MenuItem key="Brother" value="Brother">
                          Brother
                        </MenuItem>
                      </TextField>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={5}>
                <Button variant="contained" onClick={handleSubmit}>
                  Save
                </Button>
              </Grid>
            </CardContent>
          </Card>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" gutterBottom>
            Policy Details
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth error={!!errors.insDepartment}>
                    <InputLabel id="insDepartment-label" required>
                      Department
                    </InputLabel>

                    <Select
                      labelId="insDepartment-label"
                      id="insDepartment"
                      name="insDepartment"
                      value={form.insDepartment}
                      label="Department"
                      onChange={handleChange}
                    >
                      {insDepartmentData.length > 0 &&
                        insDepartmentData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.insDepartment}
                          </MenuItem>
                        ))}
                    </Select>

                    {errors.insDepartment && <FormHelperText>{errors.insDepartment}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth error={!!errors.product}>
                    <InputLabel id="product" required>
                      Product
                    </InputLabel>
                    <Select
                      labelId="product"
                      label="product"
                      name="product"
                      key={form?.product}
                      value={form?.product}
                      onChange={handleChange}
                    >
                      {filteredProducts.length > 0 &&
                        filteredProducts.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.productName}
                          </MenuItem>
                        ))}
                    </Select>
                    {errors.product && <FormHelperText>{errors.product}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="subProduct">Sub Product</InputLabel>
                    <Select
                      labelId="subProduct"
                      label="subProduct"
                      name="subProduct"
                      value={form?.subProduct || ''}
                      onChange={handleChange}
                    >
                      {filteredSubProducts.length > 0 &&
                        filteredSubProducts.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.subProductName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="insCompany">Insurance Company</InputLabel>
                    <Select labelId="insCompany" label="insCompany" name="insCompany" value={form.insCompany} onChange={handleChange}>
                      {insCompanyData.length > 0 &&
                        insCompanyData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.insCompany}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField select label="Broker Name" name="brokerName" value={form.brokerName} onChange={handleChange} fullWidth>
                    {brokerNameData?.length > 0 &&
                      brokerNameData?.map((type) => (
                        <MenuItem key={type?._id} value={type._id}>
                          {type?.brokerName}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="branchBroker">Broker Branch</InputLabel>
                    <Select
                      labelId="branchBroker"
                      label="branchBroker"
                      name="branchBroker"
                      value={form.branchBroker}
                      onChange={handleChange}
                    >
                      {branchBrokerData?.length > 0 &&
                        branchBrokerData?.map((type) => (
                          <MenuItem key={type?._id} value={type?._id}>
                            {type?.branchBroker}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* MOTOR */}
                {departmentValue === '69539cdef88ccbb626abc903' ? (
                  <>
                    <Typography variant="h5" sx={{ my: 2 }}>
                      TP Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={2}>
                        <FormControl fullWidth error={!!errors.tpPolicyDuration}>
                          <InputLabel id="tpPolicyDuration">Policy Duration</InputLabel>
                          <Select
                            labelId="tpPolicyDuration"
                            label="tpPolicyDuration"
                            name="tpPolicyDuration"
                            value={form.tpPolicyDuration}
                            onChange={handleChange}
                          >
                            <MenuItem value="YEARLY">YEARLY</MenuItem>
                            <MenuItem value="QUARTERLY">QUARTERLY</MenuItem>
                            <MenuItem value="MONTHLY">MONTHLY</MenuItem>
                            <MenuItem value="DAYS">DAYS</MenuItem>
                          </Select>
                          {errors.tpPolicyDuration && <FormHelperText>{errors.tpPolicyDuration}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          type="date"
                          label="Start Date"
                          onChange={handleChange}
                          value={form.tpStartDate}
                          name="tpStartDate"
                          fullWidth
                          error={!!errors.tpStartDate}
                          helperText={errors.tpStartDate}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          type="date"
                          label="End Date"
                          onChange={handleChange}
                          value={form.tpEndDate}
                          name="tpEndDate"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="TP Premium"
                          onChange={handleChange}
                          value={form.tpPremium}
                          name="tpPremium"
                          fullWidth
                          error={!!errors.tpPremium}
                          helperText={errors.tpPremium}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <FormControl fullWidth>
                          <InputLabel id="tpGst">GST</InputLabel>
                          <Select labelId="tpGst" label="tpGst" name="tpGst" value={form.tpGst} onChange={handleChange}>
                            {gstData.length > 0 &&
                              gstData.map((type) => (
                                <MenuItem key={type._id} value={type._id}>
                                  {type.value}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <TextField
                          label="TP GST"
                          onChange={handleChange}
                          value={form.tpGstAmount}
                          disabled
                          name="tpGstAmount"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="TP Amount"
                          onChange={handleChange}
                          value={form.tpAmount}
                          name="tpAmount"
                          disabled
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                    <Typography variant="h5" sx={{ my: 2 }}>
                      OD Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={2}>
                        <FormControl fullWidth error={!!errors.odPolicyDuration}>
                          <InputLabel id="odPolicyDuration">Policy Duration</InputLabel>
                          <Select
                            labelId="odPolicyDuration"
                            label="odPolicyDuration"
                            name="odPolicyDuration"
                            value={form.odPolicyDuration}
                            onChange={handleChange}
                          >
                            <MenuItem value="YEARLY">YEARLY</MenuItem>
                            <MenuItem value="QUARTERLY">QUARTERLY</MenuItem>
                            <MenuItem value="MONTHLY">MONTHLY</MenuItem>
                            <MenuItem value="DAYS">DAYS</MenuItem>
                          </Select>
                          {errors.odPolicyDuration && <FormHelperText>{errors.odPolicyDuration}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          type="date"
                          label="Start Date"
                          value={form.odStartDate}
                          onChange={handleChange}
                          name="odStartDate"
                          fullWidth
                          error={!!errors.odStartDate}
                          helperText={errors.odStartDate}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          type="date"
                          label="End Date"
                          value={form.odEndDate}
                          onChange={handleChange}
                          name="odEndDate"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="OD Premium"
                          value={form.odPremium}
                          onChange={handleChange}
                          name="odPremium"
                          fullWidth
                          error={!!errors.odPremium}
                          helperText={errors.odPremium}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <FormControl fullWidth>
                          <InputLabel id="odGst">GST</InputLabel>
                          <Select labelId="odGst" label="odGst" name="odGst" value={form.odGst} onChange={handleChange}>
                            {gstData.length > 0 &&
                              gstData.map((type) => (
                                <MenuItem key={type._id} value={type._id}>
                                  {type.value}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <TextField
                          label="OD GST"
                          onChange={handleChange}
                          value={form.odGstAmount}
                          name="odGstAmount"
                          disabled
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="OD Amount"
                          onChange={handleChange}
                          value={form.odAmount}
                          name="odAmount"
                          disabled
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth error={!!errors.policyDuration}>
                        <InputLabel id="policyDuration">Policy Duration</InputLabel>
                        <Select
                          labelId="policyDuration"
                          label="policyDuration"
                          name="policyDuration"
                          onChange={handleChange}
                          value={form.policyDuration}
                        >
                          <MenuItem value="YEARLY">YEARLY</MenuItem>
                          <MenuItem value="QUARTERLY">QUARTERLY</MenuItem>
                          <MenuItem value="MONTHLY">MONTHLY</MenuItem>
                          <MenuItem value="DAYS">DAYS</MenuItem>
                        </Select>
                        {errors.policyDuration && <FormHelperText>{errors.policyDuration}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        type="date"
                        label="Start Date"
                        onChange={handleChange}
                        value={form.startDate}
                        name="startDate"
                        fullWidth
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        type="date"
                        label="End Date"
                        onChange={handleChange}
                        value={form.endDate}
                        name="endDate"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} sm={3}>
                  <TextField
                    type="date"
                    label="Renewal Date"
                    name="renewalDate"
                    fullWidth
                    value={form.renewalDate}
                    onChange={handleChange}
                    error={!!errors.renewalDate}
                    helperText={errors.renewalDate}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                {/* MOTOR */}
                {departmentValue === '69539cdef88ccbb626abc903' && (
                  <>
                    <Grid item xs={12} sm={9}></Grid>
                  </>
                )}
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Policy Number"
                    name="policyNumber"
                    fullWidth
                    required
                    value={form.policyNumber}
                    onChange={handleChange}
                    error={!!errors.policyNumber}
                    helperText={errors.policyNumber}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="renewable">Renewable</InputLabel>
                    <Select labelId="renewable" label="renewable" name="renewable" value={form.renewable} onChange={handleChange}>
                      <MenuItem value="RENEWAL">RENEWAL</MenuItem>
                      <MenuItem value="NEW">NEW</MenuItem>
                      <MenuItem value="ENDOSEMENT">ENDOSEMENT</MenuItem>
                      <MenuItem value="PORTABILITY">PORTABILITY</MenuItem>
                      <MenuItem value="ROLLOVER">ROLLOVER</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="riskCode">Risk Code</InputLabel>
                    <Select labelId="riskCode" label="riskCode" name="riskCode" value={form.riskCode} onChange={handleChange}>
                      {riskCodeData.length > 0 &&
                        riskCodeData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.riskCode}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Sum Insured"
                    name="sumInsured"
                    value={form.sumInsured}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                {/* ['engineering','fire',health]
                motor = 69539cdef88ccbb626abc903
engineeting = 695374b412bb6dd679ffa0f6
health = 694b9c19d0c701ae30685141
fire = 69539cbff88ccbb626abc8fa
liability = 69539cccf88ccbb626abc8fd
misc = 69539cd6f88ccbb626abc900
marine = 695b707e85025083e095d36e
finance = 69522c7b583c668bdda53af5
                */}
                {(departmentValue === '695374b412bb6dd679ffa0f6' ||
                  departmentValue === '69539cbff88ccbb626abc8fa' ||
                  departmentValue === '694b9c19d0c701ae30685141') && (
                  <>
                    {departmentValue !== '694b9c19d0c701ae30685141' && (
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label={siteLocation}
                          name="siteLocation"
                          value={form.siteLocation}
                          onChange={handleChange}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={departmentValue === '694b9c19d0c701ae30685141' ? 3 : 4}>
                      <TextField
                        label="Number of Premium Installments"
                        name="numberOfInstallments"
                        value={form.numberOfInstallments}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={departmentValue === '694b9c19d0c701ae30685141' ? 3 : 4}>
                      <TextField
                        type="date"
                        label="Next Installment Due Date"
                        name="siteLocation"
                        value={form.siteLocation}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    {departmentValue === '694b9c19d0c701ae30685141' && (
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Number of Lives Cover"
                          name="livesCover"
                          value={form.livesCover}
                          onChange={handleChange}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    )}
                  </>
                )}
                {departmentValue === '69539cccf88ccbb626abc8fd' && (
                  <>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Occupation"
                        name="occupation"
                        value={form.occupation}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        type="date"
                        label="Retroactive Date"
                        name="retroActive"
                        value={form.retroActive}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
                {(departmentValue === '695b707e85025083e095d36e' || departmentValue === '69539cd6f88ccbb626abc900') && (
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel id="incoterms">Incoterms</InputLabel>
                      <Select labelId="incoterms" label="incoterms" name="incoterms" value={form.incoterms} onChange={handleChange}>
                        {incotermsData.length > 0 &&
                          incotermsData.map((type) => (
                            <MenuItem key={type._id} value={type._id}>
                              {type.incoterms}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {departmentValue === '695b707e85025083e095d36e' && (
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel id="marineClause">Marine Cargo Clause</InputLabel>
                      <Select
                        labelId="marineClause"
                        label="marineClause"
                        name="marineClause"
                        value={form.marineClause}
                        onChange={handleChange}
                      >
                        {marineClauseData.length > 0 &&
                          marineClauseData.map((type) => (
                            <MenuItem key={type._id} value={type._id}>
                              {type.marineClause}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {/* health = 694b9c19d0c701ae30685141
fire = 69539cbff88ccbb626abc8fa */}
                {(departmentValue === '694b9c19d0c701ae30685141' || departmentValue === '69539cbff88ccbb626abc8fa') && (
                  <>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Terrorism"
                        name="terrorism"
                        fullWidth
                        value={form.terrorism}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Premium other than Terrorism"
                        name="permiumOtherThanTerrorism"
                        value={form.permiumOtherThanTerrorism}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth>
                    <InputLabel id="otherAddon">Other Addon</InputLabel>
                    <Select labelId="otherAddon" label="otherAddon" name="otherAddon" value={form.otherAddon} onChange={handleChange}>
                      {addonData.length > 0 &&
                        addonData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.otherAddon}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Net Premium"
                    name="netPremium"
                    onChange={handleChange}
                    value={form.netPremium}
                    fullWidth
                    error={!!errors.netPremium}
                    helperText={errors.netPremium}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <FormControl fullWidth>
                    <InputLabel id="gst">GST</InputLabel>
                    <Select labelId="gst" label="gst" name="gst" value={form.gst} onChange={handleChange}>
                      {gstData.length > 0 &&
                        gstData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.value}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="GST Amt"
                    onChange={handleChange}
                    value={form.gstAmount}
                    name="gstAmount"
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={9}>
                  <FormControlLabel
                    control={<Switch checked={taxes.CGST} onChange={handleChange} name="CGST" color="primary" />}
                    label="CGST"
                  />
                  <FormControlLabel
                    control={<Switch checked={taxes.SGST} onChange={handleChange} name="SGST" color="primary" />}
                    label="SGST"
                  />
                  <FormControlLabel
                    control={<Switch checked={taxes.IGST} onChange={handleChange} name="IGST" color="primary" />}
                    label="IGST"
                  />
                  <FormControlLabel
                    control={<Switch checked={taxes.UGST} onChange={handleChange} name="UGST" color="primary" />}
                    label="UGST"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Total Amount"
                    name="totalAmount"
                    value={Number(form.totalAmount)}
                    onChange={handleChange}
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Button variant="contained" onClick={handleSubmit}>
                  Save
                </Button>
              </Grid>
            </CardContent>
          </Card>
          {/* MOTOR */}
          {departmentValue === '69539cdef88ccbb626abc903' ? (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" gutterBottom>
                Motor Details
              </Typography>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Vehicle Make"
                        name="vehicleMake"
                        value={form.vehicleMake}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Vehicle Model"
                        name="vehicleModel"
                        value={form.vehicleModel}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Vehicle Sub Model"
                        name="vehicleSubModel"
                        value={form.vehicleSubModel}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Vehicle Number"
                        name="vehicleNumber"
                        value={form.vehicleNumber}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Engine Number"
                        name="engineNumber"
                        value={form.engineNumber}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        type="month"
                        label="Month/Year of REGN"
                        name="monthYearOfRegn"
                        value={form.monthYearOfRegn}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel id="fuelType">Fuel Type</InputLabel>
                        <Select labelId="fuelType" label="fuelType" name="fuelType" value={form.fuelType} onChange={handleChange}>
                          {fuelTypeData.length > 0 &&
                            fuelTypeData.map((type) => (
                              <MenuItem key={type._id} value={type._id}>
                                {type.fuelType}
                              </MenuItem>
                            ))}
                          {/* <MenuItem value="customer1">PETROL</MenuItem> */}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel id="yearOfManufacturing">Year of Manufacturing</InputLabel>
                        <Select
                          labelId="yearOfManufacturing"
                          label="yearOfManufacturing"
                          name="yearOfManufacturing"
                          value={form.yearOfManufacturing}
                          onChange={handleChange}
                        >
                          <MenuItem value="2009">2009</MenuItem>
                          <MenuItem value="2010">2010</MenuItem>
                          <MenuItem value="2011">2011</MenuItem>
                          <MenuItem value="2012">2012</MenuItem>
                          <MenuItem value="2013">2013</MenuItem>
                          <MenuItem value="2014">2014</MenuItem>
                          <MenuItem value="2015">2015</MenuItem>
                          <MenuItem value="2016">2016</MenuItem>
                          <MenuItem value="2017">2017</MenuItem>
                          <MenuItem value="2018">2018</MenuItem>
                          <MenuItem value="2019">2019</MenuItem>
                          <MenuItem value="2020">2020</MenuItem>
                          <MenuItem value="2021">2021</MenuItem>
                          <MenuItem value="2022">2022</MenuItem>
                          <MenuItem value="2023">2023</MenuItem>
                          <MenuItem value="2024">2024</MenuItem>
                          <MenuItem value="2025">2025</MenuItem>
                          <MenuItem value="2026">2026</MenuItem>
                          <MenuItem value="2027">2027</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Chassis Number"
                        name="chassisNumber"
                        value={form.chassisNumber}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </>
          ) : (
            <></>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" gutterBottom>
            Endorsement Details
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Endorsement Name"
                    name="endorsementName"
                    value={form.endorsementName}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <FormControl fullWidth>
                    <InputLabel id="endorsementReason">Endorsement Reason</InputLabel>
                    <Select
                      labelId="endorsementReason"
                      label="endorsementReason"
                      name="endorsementReason"
                      value={form.endorsementReason}
                      onChange={handleChange}
                    >
                      {endorsementData.length > 0 &&
                        endorsementData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.endorsement}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Endorsement Policy Number"
                    name="endorsementPolicyNumber"
                    value={form.endorsementPolicyNumber}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="date"
                    label="Start Date"
                    value={form.endorStartDate}
                    name="endorStartDate"
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="date"
                    label="End Date"
                    value={form.endorEndDate}
                    onChange={handleChange}
                    name="endorEndDate"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Endorsement Terrorism"
                    value={form.endorsementTerrorism}
                    name="endorsementTerrorism"
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Endorsement Other Terrorism"
                    value={form.endorsementOtherTerrorism}
                    name="endorsementOtherTerrorism"
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Endorsement Net Premium"
                    value={form.endorsementNetPremium}
                    name="endorsementNetPremium"
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <FormControlLabel control={<Checkbox name="ECGST" />} label="Endorsement CGST" />
                  <FormControlLabel control={<Checkbox name="ESGST" />} label="Endorsement SGST" />
                  <FormControlLabel control={<Checkbox name="EIGST" />} label="Endorsement IGST" />
                  <FormControlLabel control={<Checkbox name="EUGST" />} label="Endorsement UGST" />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Endorsement Total Amount"
                    name="etotalAmount"
                    value={form.etotalAmount}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" gutterBottom>
            Payment Details
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth error={!!errors.paymentMode}>
                    <InputLabel id="paymentMode">Payment Mode</InputLabel>
                    <Select labelId="paymentMode" label="paymentMode" name="paymentMode" value={form.paymentMode} onChange={handleChange}>
                      <MenuItem value="ONLINE">ONLINE</MenuItem>
                      <MenuItem value="CASH">CASH</MenuItem>
                      <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                      <MenuItem value="NEFT">NEFT</MenuItem>
                      <MenuItem value="RTGS">RTGS</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                    </Select>
                    {errors.paymentMode && <FormHelperText>{errors.paymentMode}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Paid Amount"
                    value={Number(form.paidAmount)}
                    onChange={handleChange}
                    name="paidAmount"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                {form.paymentMode === 'CHEQUE' && (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Cheque No."
                      value={form.chequeNo}
                      onChange={handleChange}
                      name="chequeNo"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="date"
                    label="Transaction Date"
                    value={form.transactionDate}
                    onChange={handleChange}
                    name="transactionDate"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="contained" onClick={handleSubmit}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" gutterBottom>
            Servicing Details
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="POS MIS REF"
                    value={form.posMisRef}
                    onChange={handleChange}
                    name="posMisRef"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="BQP Code"
                    value={form.bqpCode}
                    onChange={handleChange}
                    name="bqpCode"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Button variant="contained" onClick={handleSubmit}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" gutterBottom></Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <RadioGroup row value={brokerageValue} onChange={handleBrokerage}>
                    <FormControlLabel value="brokerage" control={<Radio />} label="Brokerage Details" />
                    <FormControlLabel value="endorsement" control={<Radio />} label="Endorsement Details" />
                  </RadioGroup>
                </Grid>
                {/* <Grid item xs={12}>
                  <RadioGroup row value={leadCategory} onChange={(e) => setLeadCategory(e.target.value)}>
                    <FormControlLabel value="prospect" control={<Radio />} label="Prospect" />
                    <FormControlLabel value="client" control={<Radio />} label="Client" />
                    <FormControlLabel value="newLead" control={<Radio />} label="New Lead" />
                  </RadioGroup>
                </Grid> */}

                {departmentValue === '69539cdef88ccbb626abc903' ? (
                  <>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth error={!!errors.tpBrokerageRate}>
                        <InputLabel id="tpBrokerageRate">TP Brokerage Rate</InputLabel>
                        <Select
                          labelId="tpBrokerageRate"
                          label="TP Brokerage Rate"
                          name="tpBrokerageRate"
                          value={form.tpBrokerageRate}
                          onChange={handleChange}
                        >
                          {brokerageRateData.length > 0 &&
                            brokerageRateData.map((type) => (
                              <MenuItem key={type._id} value={type._id}>
                                {type.brokerageRate}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors.tpBrokerageRate && <FormHelperText>{errors.tpBrokerageRate}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="TP Brokerage Amount"
                        name="tpBrokerageAmount"
                        value={Number(form.tpBrokerageAmount).toFixed(2)}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth error={!!errors.odBrokerageRate}>
                        <InputLabel id="odBrokerageRate">OD Brokerage Rate</InputLabel>
                        <Select
                          labelId="odBrokerageRate"
                          label="OD Brokerage Rate"
                          name="odBrokerageRate"
                          value={form.odBrokerageRate}
                          onChange={handleChange}
                        >
                          {brokerageRateData.length > 0 &&
                            brokerageRateData.map((type) => (
                              <MenuItem key={type._id} value={type._id}>
                                {type.brokerageRate}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors.odBrokerageRate && <FormHelperText>{errors.odBrokerageRate}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="OD Brokerage Amount"
                        name="odBrokerageAmount"
                        value={Number(form.odBrokerageAmount).toFixed(2)}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth error={!!errors.rateOnTerr}>
                        <InputLabel id="rateOnTerr">
                          {brokerageValue === 'brokerage' ? 'Rate on Terrorism' : 'Endorsement Rate on Terrorism'}
                        </InputLabel>
                        <Select labelId="rateOnTerr" label="rateOnTerr" name="rateOnTerr" value={form.rateOnTerr} onChange={handleChange}>
                          {brokerageRateData.length > 0 &&
                            brokerageRateData.map((type) => (
                              <MenuItem key={type._id} value={type._id}>
                                {type.brokerageRate}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors.rateOnTerr && <FormHelperText>{errors.rateOnTerr}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label={brokerageValue === 'brokerage' ? 'Amount on Terrorism' : 'Endorsement Amount on Terrorism'}
                        name="amountOnTerr"
                        value={Number(form.amountOnTerr).toFixed(2)}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth error={!!errors.rateOnOtherTerr}>
                        <InputLabel id="rateOnOtherTerr">
                          {brokerageValue === 'brokerage' ? 'Rate on Other Terrorism' : 'Endorsement Rate on Other Terrorism'}
                        </InputLabel>
                        <Select
                          labelId="rateOnOtherTerr"
                          label="rateOnOtherTerr"
                          name="rateOnOtherTerr"
                          value={form.rateOnOtherTerr}
                          onChange={handleChange}
                        >
                          {brokerageRateData.length > 0 &&
                            brokerageRateData.map((type) => (
                              <MenuItem key={type._id} value={type._id}>
                                {type.brokerageRate}
                              </MenuItem>
                            ))}
                        </Select>
                        {errors.rateOnOtherTerr && <FormHelperText>{errors.rateOnOtherTerr}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label={brokerageValue === 'brokerage' ? 'Amount on other Terrorism' : 'Endorsement Amount on other Terrorism'}
                        name="amountOnOtherTerr"
                        value={Number(form.amountOnOtherTerr).toFixed(2)}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={3}>
                  <TextField
                    label={brokerageValue === 'brokerage' ? 'Total Brokerage Amount' : 'Endorsement Total Brokerage Amount'}
                    name="totalBrokerageAmount"
                    value={Number(form.totalBrokerageAmount).toFixed(2)}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="brokerageGst">Brokerage GST</InputLabel>
                    <Select
                      labelId="brokerageGst"
                      label="brokerageGst"
                      name="brokerageGst"
                      value={form.brokerageGst}
                      onChange={handleChange}
                    >
                      {gstData.length > 0 &&
                        gstData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.value}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    label={brokerageValue === 'brokerage' ? 'Total Brokerage GST%' : 'Endorsement Total Brokerage GST%'}
                    name="totalBrokerageGst"
                    value={form.totalBrokerageGst}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label={brokerageValue === 'brokerage' ? 'Total Brokerage Amount inc GST' : 'Endorsement Total Brokerage Amount inc GST'}
                    name="totalBrokerageAmountincGst"
                    value={form.totalBrokerageAmountincGst}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <FormControlLabel control={<Checkbox name="coBrockerageDetails" />} label="Co-Brokerage Details" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="contained" sx={{ backgroundColor: 'grey', mr: 2 }} onClick={() => navigate('/policy')}>
                Close
              </Button>
              <Button variant="contained" sx={{ backgroundColor: 'orange' }} onClick={() => setForm(initialState())}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default AddPolicy;
