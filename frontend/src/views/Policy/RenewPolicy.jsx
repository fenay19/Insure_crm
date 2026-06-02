import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  Switch,
  IconButton,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  Box,
  Checkbox,
  FormControlLabel,
  TableContainer
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { get, post } from '../../api/api';
import { set } from 'lodash';

const RenewPolicy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(initialState());
  const [errors, setErrors] = useState({});

  const [financialYearData, setFinancialYearData] = useState([]);
  const [clientTypeValue, setClientTypeValue] = useState('retail');
  const [departmentValue, setDepartmentValue] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [brokerageValue, setBrokerageValue] = useState('brokerage');

  const [clientList, setClientList] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [filterByDocumentValue, setFilterByDocumentValue] = useState('');

  const [prefixData, setPrefixData] = useState([]);
  const [branchCodeData, setBranchCodeData] = useState([]);
  const [insCompanyData, setInsCompanyData] = useState({});
  const [insDepartmentData, setInsDepartmentData] = useState({});
  const [productData, setProductData] = useState([]);
  const [subProductData, setSubProductData] = useState([]);
  const [riskCodeData, setRiskCodeData] = useState([]);
  const [addonData, setAddonData] = useState([]);
  const [brokerageRateData, setBrokerageRateData] = useState([]);
  const [endorsementData, setEndorsementData] = useState([]);
  const [showNominee, setShowNominee] = useState(false);
  const [customerGroupData, setCustomerGroupData] = useState([]);
  const [subCustomerGroupData, setSubCustomerGroupData] = useState([]);
  const [brokerNameData, setBrokerNameData] = useState([]);
  const [branchBrokerData, setBranchBrokerData] = useState([]);
  const [incotermsData, setIncotermsData] = useState([]);
  const [fuelTypeData, setFuelTypeData] = useState([]);
  const [branchNameId, setBranchNameId] = useState('');
  const [taxes, setTaxes] = useState({
    CGST: setForm.CGST,
    SGST: setForm.SGST,
    IGST: setForm.IGST,
    UGST: setForm.UGST
  });

  function initialState() {
    return {
      renewpolicyDuration: '',
      renewstartDate: '',
      renewCGST: '',
      renewIGST: '',
      renewSGST: '',
      renewUGST: '',
      renewendDate: '',
      renewinsCompany: '',
      renewmobile: '',
      renewemail: '',
      renewnetPremium: '',
      renewodPremium: '',
      renewpolicyNumber: '',
      renewsumInsured: '',
      renewtotalAmount: '',
      renewtpPremium: '',
      financialYear: '',
      clientType: '',
      retailCustomer: '',
      customerGroup: '',
      subCustomerGroup: '',
      checkSubGroup: '',
      branchCode: '',
      branchName: '',
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
      odPolicyDuration: '',
      odStartDate: '',
      odEndDate: '',
      odPremium: '',
      policyNumber: '',
      renewalDate: '',
      sumInsured: '',
      renewable: '',
      policyDuration: '',
      startDate: '',
      endDate: '',
      riskCode: '',
      otherAddon: '',
      terrirism: '',
      netPremium: '',
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
      transactionDate: '',
      posMisRef: '',
      bqpCode: '',
      rateOnOtherTerr: '',
      amountOnOtherTerr: '',
      rateOnTerr: '',
      amountOnTerr: '',
      odBrokerageAmount: '',
      tpBrokerageRate: '',
      tpBrokerageAmount: '',
      totalBrokerageAmount: '',
      totalBrokerageGst: '',
      totalBrokerageAmountincGst: ''
    };
  }

  // Fetch dropdown and lead details
  const fetchDropdownData = async () => {
    try {
      const [
        financialYearData,
        clientList,
        prefixData,
        branchCodeData,
        insCompanyData,
        insDepartmentData,
        productData,
        subProductData,
        riskCodeData,
        addonData,
        endorsementData,
        brokerageRateData,
        customerGroupData,
        subCustomerGroupData,
        brokerNameData,
        branchBrokerData,
        incotermsData,
        fuelTypeData
      ] = await Promise.all([
        get('financialYear'),
        get('customerRegistration'),
        get('prefix'),
        get('brokerBranch'),
        get('insCompany'),
        get('insDepartment'),
        get('productOrServiceCategory'),
        get('subproductCategory'),
        get('riskCode'),
        get('otherAddon'),
        get('endorsement'),
        get('brokerageRate'),
        get('customerGroup'),
        get('subCustomerGroup'),
        get('brokerName'),
        get('branchBroker'),
        get('incoterms'),
        get('fuelType')
      ]);
      setFinancialYearData(financialYearData.data || []);
      setClientList(clientList.data || []);
      setPrefixData(prefixData.allPrefix || []);
      setBranchCodeData(branchCodeData.data || []);
      setInsCompanyData(insCompanyData.data || []);
      setInsDepartmentData(insDepartmentData.data || []);
      setProductData(productData.data || []);
      setSubProductData(subProductData.data || []);
      setRiskCodeData(riskCodeData.data || []);
      setAddonData(addonData.data || []);
      setEndorsementData(endorsementData.data || []);
      setBrokerageRateData(brokerageRateData.data || []);
      setCustomerGroupData(customerGroupData.data || []);
      setSubCustomerGroupData(subCustomerGroupData.data || []);
      setBrokerNameData(brokerNameData.data || []);
      setBranchBrokerData(branchBrokerData.data || []);
      setIncotermsData(incotermsData.data || []);
      setFuelTypeData(fuelTypeData.data || []);
      // console.log('Prefix List data', clientList);
    } catch (err) {
      console.error('Dropdown load error:', err);
    }
  };

  const fetchPolicyDetailById = async () => {
    try {
      const res = await get(`policyDetail/${id}/`);
      if (res.success) {
        const policyData = res.data;
        console.log('Pol ', policyData);
        setDepartmentValue(policyData.insDepartment);
        setClientTypeValue(policyData.clientType);
        setBranchNameId(policyData.branchCode);
        setForm((prev) => ({
          ...prev,
          policyData,
          branchName: policyData?.branchName || '',
          email: policyData?.email || '',
          mobile: policyData?.mobile || '',
          clientType: policyData?.clientType || '',
          cutomerName: policyData?.cutomerName || '',
          showNominee: policyData?.showNominee || false,
          nomineeName: policyData?.nomineeName || '',
          nomineeRelation: policyData?.nomineeRelation || '',
          livesCover: policyData?.livesCover || '',
          numberOfInstallments: policyData?.numberOfInstallments || '',
          nextInstallmentDate: policyData?.nextInstallmentDate ? policyData?.nextInstallmentDate?.split('T')[0] : '',
          policyDuration: policyData?.policyDuration || '',
          startDate: policyData?.startDate ? policyData?.startDate?.split('T')[0] : '',
          endDate: policyData?.endDate?.split('T')[0] || '',
          tpPolicyDuration: policyData?.tpPolicyDuration || '',
          tpStartDate: policyData?.tpStartDate ? policyData?.tpStartDate?.split('T')[0] : '',
          tpEndDate: policyData?.tpEndDate?.split('T')[0] || '',
          tpPremium: policyData?.tpPremium || '',
          odPolicyDuration: policyData?.odPolicyDuration || '',
          odStartDate: policyData?.odStartDate ? policyData?.odStartDate?.split('T')[0] : '',
          odEndDate: policyData?.odEndDate?.split('T')[0] || '',
          odPremium: policyData?.odPremium || '',
          renewalDate: policyData?.renewalDate?.split('T')[0] || '',
          renewable: policyData?.renewable || '',
          SGST: policyData?.SGST || '',
          CGST: policyData?.CGST || '',
          IGST: policyData?.IGST || '',
          UGST: policyData?.UGST || '',
          engineNumber: policyData?.engineNumber || '',
          monthYearOfRegn: policyData?.monthYearOfRegn || '',
          yearOfManufacturing: policyData?.yearOfManufacturing || '',
          vehicleMake: policyData?.vehicleMake || '',
          vehicleModel: policyData?.vehicleModel || '',
          vehicleSubModel: policyData?.vehicleSubModel || '',
          vehicleNumber: policyData?.vehicleNumber || '',
          chassisNumber: policyData?.chassisNumber || '',
          insurerName: policyData?.insurerName || '',
          gstNo: policyData?.gstNo || '',
          sumInsured: policyData?.sumInsured || '',
          permiumOtherThanTerrorism: policyData?.permiumOtherThanTerrorism || '',
          policyNumber: policyData?.policyNumber || '',
          terrorism: policyData?.terrorism || '',
          netPremium: policyData?.netPremium || '',
          gstAmount: policyData?.gstAmount || '',
          endorsementName: policyData?.endorsementName || '',
          endorsementPolicyNumber: policyData?.endorsementPolicyNumber || '',
          endorsementTerrorism: policyData?.endorsementTerrorism || '',
          endorsementOtherTerrorism: policyData?.endorsementOtherTerrorism || '',
          endorsementNetPremium: policyData?.endorsementNetPremium || '',
          etotalAmount: policyData?.etotalAmount || '',
          endorStartDate: policyData?.endorStartDate ? policyData?.endorStartDate?.split('T')[0] : '',
          endorEndDate: policyData?.endorEndDate ? policyData?.endorEndDate?.split('T')[0] : '',
          paymentMode: policyData?.paymentMode || '',
          paidAmount: policyData?.paidAmount || '',
          transactionDate: policyData?.transactionDate ? policyData?.transactionDate?.split('T')[0] : '',
          posMisRef: policyData?.posMisRef || '',
          bqpCode: policyData?.bqpCode || '',
          amountOnOtherTerr: policyData?.amountOnOtherTerr || '',
          amountOnTerr: policyData?.amountOnTerr || '',
          totalBrokerageAmount: policyData?.totalBrokerageAmount || '',
          totalBrokerageGst: policyData?.totalBrokerageGst || '',
          totalBrokerageAmountincGst: policyData?.totalBrokerageAmountincGst || '',
          totalAmount: policyData?.totalAmount || '',
          financialYear: policyData?.financialYear?._id
            ? String(policyData?.financialYear._id)
            : policyData?.financialYear
              ? String(policyData?.financialYear)
              : '',
          branchCode: policyData?.branchCode?._id
            ? String(policyData?.branchCode._id)
            : policyData?.branchCode
              ? String(policyData?.branchCode)
              : '',
          brokerName: policyData?.brokerName?._id
            ? String(policyData?.brokerName._id)
            : policyData?.brokerName
              ? String(policyData?.brokerName)
              : '',
          branchBroker: policyData?.branchBroker?._id
            ? String(policyData?.branchBroker._id)
            : policyData?.branchBroker
              ? String(policyData?.branchBroker)
              : '',
          subProduct: policyData?.subProduct?._id
            ? String(policyData?.subProduct._id)
            : policyData?.subProduct
              ? String(policyData?.subProduct)
              : '',
          customerGroup: policyData?.customerGroup?._id
            ? String(policyData?.customerGroup._id)
            : policyData?.customerGroup
              ? String(policyData?.customerGroup)
              : '',
          subCustomerGroup: policyData?.subCustomerGroup?._id
            ? String(policyData?.subCustomerGroup._id)
            : policyData?.subCustomerGroup
              ? String(policyData?.subCustomerGroup)
              : '',
          retailCustomer: policyData?.retailCustomer?._id
            ? String(policyData?.retailCustomer._id)
            : policyData?.retailCustomer
              ? String(policyData?.retailCustomer)
              : '',
          prefix: policyData?.prefix?._id ? String(policyData?.prefix._id) : policyData?.prefix ? String(policyData?.prefix) : '',
          insDepartment: policyData?.insDepartment?._id
            ? String(policyData?.insDepartment._id)
            : policyData?.insDepartment
              ? String(policyData?.insDepartment)
              : '',
          product: policyData?.product?._id ? String(policyData?.product._id) : policyData?.product ? String(policyData?.product) : '',
          incoterms: policyData?.incoterms?._id
            ? String(policyData?.incoterms._id)
            : policyData?.incoterms
              ? String(policyData?.incoterms)
              : '',
          insCompany: policyData?.insCompany?._id
            ? String(policyData?.insCompany._id)
            : policyData?.insCompany
              ? String(policyData?.insCompany)
              : '',
          endorsementReason: policyData?.endorsementReason?._id
            ? String(policyData?.endorsementReason._id)
            : policyData?.endorsementReason
              ? String(policyData?.endorsementReason)
              : '',
          rateOnOtherTerr: policyData?.rateOnOtherTerr?._id
            ? String(policyData?.rateOnOtherTerr._id)
            : policyData?.rateOnOtherTerr
              ? String(policyData?.rateOnOtherTerr)
              : '',
          rateOnTerr: policyData?.rateOnTerr?._id
            ? String(policyData?.rateOnTerr._id)
            : policyData?.rateOnTerr
              ? String(policyData?.rateOnTerr)
              : '',
          riskCode: policyData?.riskCode?._id ? String(policyData?.riskCode._id) : policyData?.riskCode ? String(policyData?.riskCode) : '',
          fuelType: policyData?.fuelType?._id ? String(policyData?.fuelType._id) : policyData?.fuelType ? String(policyData?.fuelType) : '',
          otherAddon: policyData?.otherAddon?._id
            ? String(policyData?.otherAddon._id)
            : policyData?.otherAddon
              ? String(policyData?.otherAddon)
              : ''
        }));
      }
    } catch (err) {
      console.error('Failed to fetch lead details:', err);
    }
  };

  const handleCheckboxChange = (event) => {
    setShowNominee(event.target.checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(name);

    if (name === 'branchCode') {
      const selectedId = e.target.value;
      const selectedName = branchCodeData.find((branch) => branch._id === selectedId);

      setForm((prev) => ({
        ...prev,
        branchName: selectedName.branchName
      }));
    }
    if (name === 'insDepartment') setDepartmentValue(e.target.value);
    if (name === 'clientType') setClientTypeValue(e.target.value);
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    setTaxes({
      ...taxes,
      [e.target.name]: e.target.checked
    });

    // console.log('Tax value ', taxes);
  };

  // useEffect(() => {
  //   if (form.retailCustomer) {
  //     const selectedId = form.retailCustomer;
  //     const selectedName = clientList.find((branch) => branch._id === selectedId);
  //     setCustomerName(selectedName.name);
  //     setCustomerEmail(selectedName.email);
  //     setCustomerMobile(selectedName.mobile);
  //     setCustomerAddress(selectedName.address);
  //     console.log('reat ', selectedName);
  //   }
  //   console.log(`name ${customerName} emaail ${customerEmail} mobol ${customerMobile} address ${customerAddress} `);
  // }, [form.retailCustomer]);

  const handleBrokerage = (e) => setBrokerageValue(e.target.value);

  useEffect(() => {
    const fetchSubCustomerByCustomer = async () => {
      const selectedId = form.customerGroup;
      // const selectedName = customerGroupData.find((branch) => branch._id === selectedId);
      console.log('bb ', selectedId);
      const res = await get(`subCustomerGroup/${selectedId}`);
      console.log('Sub Customers   ', res.data);
      if (res.data) setSubCustomerGroupData(res.data);
      else setSubCustomerGroupData([]);
    };

    fetchSubCustomerByCustomer();
  }, [form.customerGroup]);
  useEffect(() => {
    const fetchSubProductsByProduct = async () => {
      const selectedId = form.product;
      const selectedName = productData.find((branch) => branch._id === selectedId);
      const productName = selectedName.productName;
      const res = await get(`subproductCategory/${productName}`);
      // console.log('Sub Products', res.data);
      if (res.data) setSubProductData(res.data);
      else setSubProductData([]);
    };

    fetchSubProductsByProduct();
  }, [form.product]);

  useEffect(() => {
    // Convert string input to number
    const tpPremium = parseFloat(form.tpPremium) || 0;
    const odPremium = parseFloat(form.odPremium) || 0;
    const total = tpPremium + odPremium;

    setForm((prev) => ({
      ...prev,
      netPremium: total
    }));
  }, [form.tpPremium, form.odPremium]);

  useEffect(() => {
    // Convert string input to number
    const net = parseFloat(form.netPremium) || 0;
    const gst = parseFloat(form.gstAmount);
    setTaxes({
      IGST: '',
      UGST: '',
      CGST: '',
      SGST: ''
    });

    if (taxes.CGST) setTaxes({ SGST: true, CGST: true, IGST: false, UGST: false });
    if (taxes.IGST) setTaxes({ SGST: false, CGST: false, IGST: true, UGST: false });
    if (taxes.UGST) setTaxes({ SGST: false, CGST: false, IGST: false, UGST: true });

    // Logic: Base amount + 18% if IGST is toggled ON
    const isTaxApplicable = taxes.IGST || taxes.UGST || taxes.CGST || taxes.SGST;
    const taxMultiplier = isTaxApplicable ? 1.18 : 1.0;
    const gstAmount = net * 0.18;
    const calculatedTotal = net * taxMultiplier;

    setForm((prev) => ({
      ...prev,
      gstAmount: gstAmount,
      totalAmount: calculatedTotal > 0 ? calculatedTotal.toFixed(2) : ''
    }));
  }, [form.netPremium, taxes]);

  useEffect(() => {
    fetchPolicyDetailById();
    fetchDropdownData();
  }, []);

  // ── Context-Aware PDF Prefill Logic ──
  useEffect(() => {
    const prefill = location.state?.prefill;
    if (!prefill) return;

    // We only want to attempt mapping if the dropdowns have actually loaded
    if (
      insCompanyData.length === 0 ||
      insDepartmentData.length === 0 ||
      productData.length === 0 ||
      fuelTypeData.length === 0
    ) {
      return; 
    }

    const newFormUpdates = { ...prefill };

    // 1. Safe mapping for Insurance Company
    if (typeof newFormUpdates.insCompany === 'string' && newFormUpdates.insCompany.trim() !== '') {
      const match = insCompanyData.find(
        (item) =>
          item.insCompany?.toLowerCase().replace(/\s+/g, '') ===
          newFormUpdates.insCompany.toLowerCase().replace(/\s+/g, '')
      );
      if (match) {
        newFormUpdates.insCompany = match._id;
      } else {
        delete newFormUpdates.insCompany; 
      }
    }

    // 2. Safe mapping for Department
    if (typeof newFormUpdates.department === 'string' && newFormUpdates.department.trim() !== '') {
      const match = insDepartmentData.find(
        (item) =>
          item.insDepartment?.toLowerCase().replace(/\s+/g, '') ===
          newFormUpdates.department.toLowerCase().replace(/\s+/g, '')
      );
      if (match) {
        newFormUpdates.insDepartment = match._id;
      }
      delete newFormUpdates.department;
    }

    // 3. Safe mapping for Product
    if (typeof newFormUpdates.productName === 'string' && newFormUpdates.productName.trim() !== '') {
      const match = productData.find(
        (item) =>
          item.productName?.toLowerCase().replace(/\s+/g, '') ===
          newFormUpdates.productName.toLowerCase().replace(/\s+/g, '')
      );
      if (match) {
        newFormUpdates.product = match._id;
      }
      delete newFormUpdates.productName;
    }

    // 4. Safe mapping for Fuel Type
    if (typeof newFormUpdates.fuelType === 'string' && newFormUpdates.fuelType.trim() !== '') {
      const match = fuelTypeData.find(
        (item) =>
          item.fuelType?.toLowerCase().replace(/\s+/g, '') ===
          newFormUpdates.fuelType.toLowerCase().replace(/\s+/g, '')
      );
      if (match) {
        newFormUpdates.fuelType = match._id;
      } else {
        delete newFormUpdates.fuelType;
      }
    }

    // List of keys that RenewPolicy uses with a 'renew' prefix for the UI inputs
    const renewPrefixKeys = [
      'policyDuration', 'startDate', 'endDate', 'insCompany', 'mobile',
      'email', 'netPremium', 'odPremium', 'policyNumber', 'sumInsured',
      'totalAmount', 'tpPremium'
    ];

    setForm((prev) => {
      const updated = { ...prev, ...newFormUpdates };
      
      // Mirror base keys to their renew-prefixed counterparts so the UI updates
      for (const key of renewPrefixKeys) {
        if (newFormUpdates[key] !== undefined) {
          updated[`renew${key}`] = newFormUpdates[key];
        }
      }
      
      return updated;
    });

    // Clear location state to prevent infinite re-prefilling on unrelated renders
    navigate(location.pathname, { replace: true, state: {} });
    
  }, [
    location.state, 
    insCompanyData, 
    insDepartmentData, 
    productData, 
    fuelTypeData, 
    navigate, 
    location.pathname
  ]);

  return (
    <>
      <Breadcrumb title="">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        {/* <Typography variant="subtitle2" color="primary">
            Parametric
          </Typography> */}
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Policy Renew</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" color="secondary" onClick={() => navigate('/renewal/pdf-extraction', { state: { source: 'renewalPage', originalPolicyId: id } })}>
                Upload PDF
              </Button>
              <Button variant="contained" onClick={() => navigate('/renewal/renewal-reminder')}>
                <ArrowBack />
              </Button>
            </Box>
          </Grid>

          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth>
                    <InputLabel id="policyDuration">Policy Duration</InputLabel>
                    <Select
                      labelId="policyDuration"
                      label="policyDuration"
                      value={form.renewpolicyDuration}
                      onChange={handleChange}
                      name="policyDuration"
                    >
                      <MenuItem value="YEARLY">YEARLY</MenuItem>
                      <MenuItem value="QUATERLY">QUATERLY</MenuItem>
                      <MenuItem value="MONTHLY">MONTHLY</MenuItem>
                      <MenuItem value="DAYS">DAYS</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    type="date"
                    label="Start Date"
                    value={form.renewstartDate}
                    onChange={handleChange}
                    name="startDate"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    type="date"
                    label="End Date"
                    value={form.renewendDate}
                    onChange={handleChange}
                    name="endDate"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Policy Number"
                    name="policyNumber"
                    fullWidth
                    value={form.renewpolicyNumber}
                    onChange={handleChange}
                    // error={!!errors.dateOfBirth}
                    // helperText={errors.dateOfBirth}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Sum Insured"
                    name="sumInsured"
                    value={form.renewsumInsured}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="TP Premium"
                    value={form.renewtpPremium}
                    onChange={handleChange}
                    name="tpPremium"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="OD Premium"
                    value={form.renewodPremium}
                    onChange={handleChange}
                    name="odPremium"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Net Premium"
                    name="netPremium"
                    onChange={(e) => setForm({ ...form, netPremium: e.target.value })}
                    value={form.renewnetPremium}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <FormControlLabel
                    control={<Switch checked={taxes.CGST} value={form.renewCGST} onChange={handleChange} name="CGST" color="primary" />}
                    label="CGST"
                  />
                  <FormControlLabel
                    control={<Switch checked={taxes.SGST} value={form.renewSGST} onChange={handleChange} name="SGST" color="primary" />}
                    label="SGST"
                  />
                  <FormControlLabel
                    control={<Switch checked={taxes.IGST} value={form.renewIGST} onChange={handleChange} name="IGST" color="primary" />}
                    label="IGST"
                  />
                  <FormControlLabel
                    control={<Switch checked={taxes.UGST} value={form.renewUGST} onChange={handleChange} name="UGST" color="primary" />}
                    label="UGST"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Total Amount"
                    name="totalAmount"
                    value={form.renewtotalAmount}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="insCompany">Insurance Company</InputLabel>
                    <Select labelId="insCompany" label="insCompany" name="insCompany" value={form.renewinsCompany} onChange={handleChange}>
                      {insCompanyData.length > 0 &&
                        insCompanyData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.insCompany}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="Address" name="address" fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Email"
                    value={form.renewemail}
                    onChange={handleChange}
                    name="email"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Mobile"
                    value={form.renewmobile}
                    onChange={handleChange}
                    name="mobile"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" sx={{ my: 2 }}>
            Payment Details
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="paymentMode">Payment Mode</InputLabel>
                    <Select labelId="paymentMode" label="paymentMode" name="paymentMode" value={form.paymentMode} onChange={handleChange}>
                      <MenuItem value="ONLINE">ONLINE</MenuItem>
                      <MenuItem value="CASH">CASH</MenuItem>
                      <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                      <MenuItem value="NEFT">NEFT</MenuItem>
                      <MenuItem value="RTGS">RTGS</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Paid Amount"
                    value={form.paidAmount}
                    onChange={handleChange}
                    name="paidAmount"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="Transaction ID/NO/Cheque No" name="transactionId" fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
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
              </Grid>
            </CardContent>
          </Card>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" sx={{ my: 2 }}>
            Brokerage Details
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
                  { label: 'Customer ID', name: 'customerId', value: '', required: true },
                  { label: 'Customer Name', name: 'retailCustomer', value: '', required: true },
                  { label: 'Customer Mobile', name: 'altPhoneNo1', value: '' },
                  { label: 'Customer Email', name: 'altPhoneNo2', value: '' },
                  { label: 'Insurer Name', name: 'insurerName', value: form.insurerName }
                ].map((field) => (
                  <Grid item xs={12} sm={3} key={field.name}>
                    <TextField
                      label={field.label}
                      name={field.name}
                      value={field.value}
                      onChange={handleChange}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      required={field.required || false}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={3}>
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
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="subCustomerGroup">Sub Group</InputLabel>
                    <Select
                      labelId="subCustomerGroup"
                      label="subCustomerGroup"
                      name="subCustomerGroup"
                      value={form.subCustomerGroup}
                      onChange={handleChange}
                    >
                      {subCustomerGroupData.length > 0 &&
                        subCustomerGroupData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.subCustomerGroup}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Nominee Name"
                    name="nomineeName"
                    value={form.nomineeName}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <TextField
                      select
                      label="Relation with Nominee"
                      name="nomineeRelation"
                      value={form.nomineeRelation}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    >
                      <MenuItem value="Son">Son</MenuItem>
                      <MenuItem value="Father">Fater</MenuItem>
                      <MenuItem value="Mother">Mother</MenuItem>
                      <MenuItem value="Spouse">Spouse</MenuItem>
                      <MenuItem value="Daughter">Daughter</MenuItem>
                      <MenuItem value="Sister">Sister</MenuItem>
                      <MenuItem value="Brother">Brother</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" sx={{ my: 2 }}>
            Policy Details
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="insDepartment">Department</InputLabel>
                    <Select
                      labelId="insDepartment"
                      label="insDepartment"
                      name="insDepartment"
                      value={form.insDepartment}
                      onChange={handleChange}
                    >
                      {insDepartmentData.length > 0 &&
                        insDepartmentData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.insDepartment}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="product">Product</InputLabel>
                    <Select labelId="product" label="product" name="product" value={form.product} onChange={handleChange}>
                      {productData.length > 0 &&
                        productData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.productName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="subProduct">Sub Product</InputLabel>
                    <Select labelId="subProduct" label="subProduct" name="subProduct" value={form.subProduct} onChange={handleChange}>
                      {subProductData.length > 0 &&
                        subProductData.map((type) => (
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
                  <TextField select label="Broker Name" name="brokerName" onChange={handleChange} value={form.brokerName} fullWidth>
                    {brokerNameData.length > 0 &&
                      brokerNameData.map((type) => (
                        <MenuItem key={type._id} value={type._id}>
                          {type.brokerName}
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
                      {branchBrokerData.length > 0 &&
                        branchBrokerData.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.branchBroker}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="policyDuration">Policy Duration</InputLabel>
                    <Select
                      labelId="policyDuration"
                      label="policyDuration"
                      value={form.policyDuration}
                      onChange={handleChange}
                      name="policyDuration"
                    >
                      <MenuItem value="YEARLY">YEARLY</MenuItem>
                      <MenuItem value="QUATERLY">QUATERLY</MenuItem>
                      <MenuItem value="MONTHLY">MONTHLY</MenuItem>
                      <MenuItem value="DAYS">DAYS</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="date"
                    label="Start Date"
                    value={form.startDate}
                    onChange={handleChange}
                    name="startDate"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="date"
                    label="End Date"
                    value={form.endDate}
                    onChange={handleChange}
                    name="endDate"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Policy Number"
                    name="policyNumber"
                    fullWidth
                    value={form.policyNumber}
                    onChange={handleChange}
                    // error={!!errors.dateOfBirth}
                    // helperText={errors.dateOfBirth}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="renewable">Renewable</InputLabel>
                    <Select labelId="renewable" label="renewable" name="renewable" value={form.renewable} onChange={handleChange}>
                      <MenuItem value="RENEWAL">RENEWAL</MenuItem>
                      <MenuItem value="NEW BUSINESS">NEW BUSINESS</MenuItem>
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
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="TP Premium"
                    value={form.tpPremium}
                    onChange={handleChange}
                    name="tpPremium"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="OD Premium"
                    value={form.odPremium}
                    onChange={handleChange}
                    name="odPremium"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Net Premium"
                    name="netPremium"
                    onChange={(e) => setForm({ ...form, netPremium: e.target.value })}
                    value={form.netPremium}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField label="CGST" name="CGST" fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField label="SGST" name="SGST" fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField label="IGST" name="IGST" fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField label="UGST" name="UGST" fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Total Amount"
                    name="totalAmount"
                    value={form.totalAmount}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" sx={{ mr: 2 }}>
                Save
              </Button>
              <Button variant="contained" sx={{ backgroundColor: 'grey', mr: 2 }}>
                Close
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RenewPolicy;
