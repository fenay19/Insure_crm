import React, { useEffect, useState, useMemo } from 'react';
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
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { get, put } from 'api/api';
import { Details } from '@mui/icons-material';

const EditPolicy = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState());
  const [errors, setErrors] = useState({});

  const [financialYearData, setFinancialYearData] = useState([]);
  const [gstData, setGstData] = useState([]);
  const [clientTypeValue, setClientTypeValue] = useState('retail');
  const [departmentValue, setDepartmentValue] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [brokerageValue, setBrokerageValue] = useState('brokerage');

  const [clientList, setClientList] = useState([]);
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
  const [policyData, setPolicyData] = useState([]);

  const [taxes, setTaxes] = useState({
    CGST: setForm.CGST,
    SGST: setForm.SGST,
    IGST: setForm.IGST,
    UGST: setForm.UGST
  });

  const handleFilterByDocumentChange = (e) => setFilterByDocumentValue(e.target.value);

  function initialState() {
    return {
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
      terrirism: '',
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

  // Fetch dropdown and lead details
  const fetchDropdownData = async () => {
    try {
      const [
        financialYearData,
        gstData,
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
        get('gst-percentage'),
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
      setGstData(gstData.data || []);
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
      // console.log('Prefix List data', gstData);
    } catch (err) {
      console.error('Dropdown load error:', err);
    }
  };

  const fetchPolicyDetailById = async () => {
    try {
      const res = await get(`policyDetail/${id}/`);
      if (res.success) {
        const policyData = res.data;
        setPolicyData(res.data);
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
          tpGstAmount: policyData?.tpGstAmount || '',
          tpAmount: policyData?.tpAmount || '',
          odPolicyDuration: policyData?.odPolicyDuration || '',
          odStartDate: policyData?.odStartDate ? policyData?.odStartDate?.split('T')[0] : '',
          odEndDate: policyData?.odEndDate?.split('T')[0] || '',
          odPremium: policyData?.odPremium || '',
          odGstAmount: policyData?.odGstAmount || '',
          odAmount: policyData?.odAmount || '',
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
          occupation: policyData?.occupation || '',
          permiumOtherThanTerrorism: policyData?.permiumOtherThanTerrorism || '',
          policyNumber: policyData?.policyNumber || '',
          terrorism: policyData?.terrorism || '',
          netPremium: policyData?.netPremium || '',
          gstAmount: Number(policyData?.gstAmount ?? 0) || '',
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
          chequeNo: policyData?.chequeNo || '',
          transactionDate: policyData?.transactionDate ? policyData?.transactionDate?.split('T')[0] : '',
          posMisRef: policyData?.posMisRef || '',
          bqpCode: policyData?.bqpCode || '',
          amountOnOtherTerr: policyData?.amountOnOtherTerr || '',
          amountOnTerr: policyData?.amountOnTerr || '',
          tpBrokerageAmount: policyData?.tpBrokerageAmount || '',
          odBrokerageAmount: policyData?.odBrokerageAmount || '',

          totalBrokerageAmount: policyData?.totalBrokerageAmount || '',
          totalBrokerageGst: policyData?.totalBrokerageGst || '',
          totalBrokerageAmountincGst: policyData?.totalBrokerageAmountincGst || '',
          totalAmount: Number(policyData?.totalAmount ?? 0) || '',
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

          tpGst: policyData?.tpGst?._id ? String(policyData?.tpGst._id) : policyData?.tpGst ? String(policyData?.tpGst) : '',
          odGst: policyData?.odGst?._id ? String(policyData?.odGst._id) : policyData?.odGst ? String(policyData?.odGst) : '',
          gst: policyData?.gst?._id ? String(policyData?.gst._id) : policyData?.gst ? String(policyData?.gst) : '',
          brokerageGst: policyData?.brokerageGst?._id
            ? String(policyData?.brokerageGst._id)
            : policyData?.brokerageGst
              ? String(policyData?.brokerageGst)
              : '',
          tpBrokerageRate: policyData?.tpBrokerageRate?._id
            ? String(policyData?.tpBrokerageRate._id)
            : policyData?.tpBrokerageRate
              ? String(policyData?.tpBrokerageRate)
              : '',
          odBrokerageRate: policyData?.odBrokerageRate?._id
            ? String(policyData?.odBrokerageRate._id)
            : policyData?.odBrokerageRate
              ? String(policyData?.odBrokerageRate)
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
    // console.log('Department to Filter product ', departmentValue);
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

  useEffect(() => {
    {
      /* this will work only when department is  MOTOR */
    }

    if (departmentValue != '69539cdef88ccbb626abc903') return;
    // console.log('abc903 department value ', departmentValue);

    setForm((prev) => {
      const tpPremium = prev?.tpPremium ? parseFloat(prev.tpPremium) : 0;
      const tpGstId = prev?.tpGst;
      const tpGstValue = gstData?.find((i) => i._id === tpGstId)?.value || 0;

      const tpGstAmount = tpGstId ? round2(tpPremium * (tpGstValue / 100)) : safeNum(prev?.tpGstAmount);
      const tpAmount = round2(tpPremium + tpGstAmount);

      const odPremium = prev?.odPremium ? parseFloat(prev.odPremium) : 0;
      const odGstId = prev?.odGst;
      const odGstValue = gstData?.find((i) => i._id === odGstId)?.value || 0;

      const odGstAmount = odGstId ? round2(odPremium * (odGstValue / 100)) : safeNum(prev?.odGstAmount);
      const odAmount = round2(odPremium + odGstAmount);

      const totalPremium = round2(tpPremium + odPremium);
      const totalGstAmount = round2(tpGstAmount + odGstAmount);
      const totalAmount = round2(tpAmount + odAmount);

      return {
        ...prev,
        tpGstAmount: tpGstAmount,
        tpAmount: tpAmount,
        odGstAmount: odGstAmount,
        odAmount: odAmount,
        netPremium: totalPremium,
        gstAmount: totalGstAmount,
        totalAmount: totalAmount,
        paidAmount: totalAmount
      };
    });

    // console.log(`tpPre ${tpPremium} gst id ${tpGstId} gst value ${tpGstValue} tax amount ${tpGstAmount} and tpAmount ${tpAmount}`);
  }, [form.tpPremium, form.odPremium, form.tpGst, form.odGst, departmentValue]);

  useEffect(() => {
    // const netPremium = round2(parseFloat(form.netPremium) || 0);
    if (departmentValue !== '69539cdef88ccbb626abc903') {
      // console.log('0 department value ', departmentValue);
      const isTaxApplicable = taxes.IGST || taxes.UGST || taxes.CGST || taxes.SGST;

      if (form.netPremium === '') {
        setForm((prev) => ({
          ...prev,
          gstAmount: 0,
          totalAmount: 0,
          paidAmount: 0
        }));
        return;
      }
      const netPremium = round2(safeNum(form.netPremium));

      if (form.netPremium != '') {
        const gstValue = safeNum(gstData?.find((i) => i._id === form.gst)?.value);

        setForm((prev) => {
          const gstAmount = prev.gst ? (round2(netPremium * (gstValue / 100)) || 0) : safeNum(prev.gstAmount);
          const totalAmount = round2(netPremium + gstAmount);

          return {
            ...prev,
            gstAmount,
            totalAmount,
            paidAmount: totalAmount
          };
        });
      }
    }
  }, [form.netPremium, form.gst, departmentValue, gstData]);

  const safeNum = (v) => (v === '' || v === null || v === undefined ? 0 : Number(v) || 0);

  useEffect(() => {
    const terrorism = parseFloat(form.terrorism) || 0;
    const premiumOther = parseFloat(form.permiumOtherThanTerrorism) || 0;

    const total = terrorism + premiumOther;

    setForm((prev) => ({
      ...prev,
      netPremium: total
    }));
  }, [form.terrorism, form.permiumOtherThanTerrorism]);

  // console.log('Filtered Sub Pro,', filteredSubProducts);

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

    const error = validateForm();

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));

    // console.log('Tax value ', taxes);
  };

  const handleBrokerage = (e) => setBrokerageValue(e.target.value);

  const validateForm = () => {
    const newErrors = {};

    // Only required fields
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
    // console.log('All Errors ', newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (action) => {
    if (validateForm()) {
      console.log('form submitted', form);
      try {
        const response = await put(`policyDetail/${id}`, form);
        console.log(response);
        if (response) {
          toast.success(response.message || '✅ Record updated successfully!', {
            autoClose: 3000,
            theme: 'colored'
          });
          // navigate('/policy');
        }
      } catch (error) {
        console.error('Error updating lead:', error);
        toast.error('Failed to update lead');
      }
    } else {
      toast.error('Please fill the required Fields');
    }
    console.log('submit ', action);
    if (action === 'submit') navigate('/policy');
  };

  useEffect(() => {
    const fetchSubCustomerByCustomer = async () => {
      const selectedId = form.customerGroup;
      // const selectedName = customerGroupData.find((branch) => branch._id === selectedId);
      // console.log('bb ', selectedId);
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

  const isEditMode = Boolean(policyData?._id);

  useEffect(() => {
    // ⛔ wait until gstData is loaded
    if (!gstData || gstData.length === 0) return;

    const tpPremium = Number(form.tpPremium);
    const odPremium = Number(form.odPremium);

    // ⛔ if both premiums are empty, don’t calculate
    if (!tpPremium && !odPremium) return;

    const tpGstValue = gstData.find((i) => i._id === form.tpGst)?.value;

    const odGstValue = gstData.find((i) => i._id === form.odGst)?.value;

    // ⛔ in edit mode, don’t override existing values
    if (isEditMode && !tpGstValue && !odGstValue) return;

    const tpGstAmount = tpGstValue ? tpPremium * (tpGstValue / 100) : Number(form.tpGstAmount || 0);

    const odGstAmount = odGstValue ? odPremium * (odGstValue / 100) : Number(form.odGstAmount || 0);

    const netPremium = tpPremium + odPremium;
    const gstAmount = tpGstAmount + odGstAmount;
    const totalAmount = netPremium + gstAmount;

    setForm((prev) => ({
      ...prev,
      tpGstAmount,
      odGstAmount,
      netPremium,
      gstAmount,
      totalAmount
    }));
  }, [form.tpPremium, form.odPremium, form.tpGst, form.odGst, gstData]);

  const round2 = (num) => Math.round((Number(num) + Number.EPSILON) * 100) / 100;

  const getRateValue = (rateId) => {
    return Number(brokerageRateData?.find((r) => r._id === rateId)?.brokerageRate || 0);
  };

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
        totalBrokerageAmount,
        totalBrokerageAmountincGst: totalBrokerageAmount
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
        totalBrokerageAmount,
        totalBrokerageAmountincGst: totalBrokerageAmount
      }));
    }
  }, [form.rateOnOtherTerr, form.rateOnTerr, form.netPremium, brokerageRateData]);

  useEffect(() => {
    if (!gstData?.length) return;

    const broAmount = Number(form?.totalBrokerageAmount) || 0;

    const broGstId = form?.brokerageGst;
    const broGstValue = gstData?.find((i) => i._id === broGstId)?.value || 0;

    const gstAmount = round2((broAmount * broGstValue) / 100);
    const amount = broAmount + gstAmount;

    setForm((prev) => ({
      ...prev,
      totalBrokerageGst: gstAmount,
      totalBrokerageAmountincGst: amount
    }));
  }, [form.brokerageGst, form.totalBrokerageAmount]);

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

  // useEffect(() => {
  //   setForm((prev) => ({
  //     ...prev,
  //     tpBrokerageRate: '',
  //     odBrokerageRate: '',
  //     tpBrokerageAmount: 0,
  //     odBrokerageAmount: 0,
  //     totalBrokerageAmount: 0,
  //     totalBrokerageAmountincGst: 0,
  //   }));
  // }, [form.tpPremium, form.odPremium]);

  useEffect(() => {
    setTaxes({
      IGST: form?.IGST,
      UGST: form?.UGST,
      CGST: form?.CGST,
      SGST: form?.SGST
    });

    if (taxes.CGST) setTaxes({ SGST: true, CGST: true, IGST: false, UGST: false });
    if (taxes.IGST) setTaxes({ SGST: false, CGST: false, IGST: true, UGST: false });
    if (taxes.UGST) setTaxes({ SGST: false, CGST: false, IGST: false, UGST: true });
  }, [taxes]);

  useEffect(() => {
    fetchPolicyDetailById();
    fetchDropdownData();
  }, []);

  // const formatAmount = (value) => {
  //   const num = Number(value);
  //   if (isNaN(num)) return 0;

  //   return Number.isInteger(num) ? num : Number(num.toFixed(2));
  // };

  return (
    <div>
      <Card>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              <Typography variant="h6">Policy Registration</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                <ArrowBackIcon /> Back
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 2 }} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} sx={{ mb: 2 }}>
              <FormControl fullWidth>
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
                control={<Checkbox name="nomineeDetailsCheckbox" checked={showNominee} onChange={handleCheckboxChange} />}
                label="Fill Nominee Details"
              />
            </Grid>

            {showNominee && (
              <>
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
                </Grid>
              </>
            )}
          </Grid>
          <Grid item xs={12} sm={5}>
            <Button variant="contained" onClick={() => handleSubmit('save')}>
              Update
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
                <Select labelId="product" label="product" name="product" key={form?.product} value={form?.product} onChange={handleChange}>
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
                <Select labelId="subProduct" label="subProduct" name="subProduct" value={form.subProduct} onChange={handleChange}>
                  {filteredSubProducts?.length > 0 &&
                    filteredSubProducts?.map((type) => (
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
                <Select labelId="branchBroker" label="branchBroker" name="branchBroker" value={form.branchBroker} onChange={handleChange}>
                  {branchBrokerData.length > 0 &&
                    branchBrokerData.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.branchBroker}
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
                      value={form.tpStartDate}
                      name="tpStartDate"
                      onChange={handleChange}
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
                      value={form.tpEndDate}
                      name="tpEndDate"
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="TP Premium"
                      value={form.tpPremium}
                      onChange={handleChange}
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
                      value={Number(form.tpGstAmount).toFixed(2)}
                      name="tpGstAmount"
                      disabled
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="TP Amount"
                      onChange={handleChange}
                      value={Number(form.tpAmount).toFixed(2)}
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
                      label="TP GST"
                      onChange={handleChange}
                      value={Number(form.odGstAmount).toFixed(2)}
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
                    value={form.startDate}
                    onChange={handleChange}
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
                    value={form.endDate}
                    onChange={handleChange}
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
                      name="Site Location"
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
                    name="nextInstallmentDate"
                    value={form.nextInstallmentDate}
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
            {(departmentValue === 'marine' || departmentValue === '69539cd6f88ccbb626abc900') && (
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
            {departmentValue === 'marine' && (
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel id="marineClause">Marine Cargo Clause</InputLabel>
                  <Select labelId="marineClause" label="marineClause" name="marineClause" value={form.marineClause} onChange={handleChange}>
                    <MenuItem value="Mr">INSTITITE CARGO CLAUSE A</MenuItem>
                    <MenuItem value="Mrs">INSTITITE CARGO CLAUSE B</MenuItem>
                    <MenuItem value="Mrs">INSTITITE CARGO CLAUSE C</MenuItem>
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
                onChange={(e) => setForm({ ...form, netPremium: e.target.value })}
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
                value={Number(form?.gstAmount).toFixed(2) || 0}
                name="gstAmount"
                disabled
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <FormControlLabel
                control={<Switch checked={taxes.CGST} value={form.CGST} onChange={handleChange} name="CGST" color="primary" />}
                label="CGST"
              />
              <FormControlLabel
                control={<Switch checked={taxes.SGST} value={form.SGST} onChange={handleChange} name="SGST" color="primary" />}
                label="SGST"
              />
              <FormControlLabel
                control={<Switch checked={taxes.IGST} value={form.IGST} onChange={handleChange} name="IGST" color="primary" />}
                label="IGST"
              />
              <FormControlLabel
                control={<Switch checked={taxes.UGST} value={form.UGST} onChange={handleChange} name="UGST" color="primary" />}
                label="UGST"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Total Amount"
                name="totalAmount"
                value={Number(form.totalAmount).toFixed(2)}
                disabled
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Button variant="contained" onClick={() => handleSubmit('save')}>
              Update
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
                  value={form?.endorsementReason || ''}
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
                  <MenuItem value="LINK">LINK</MenuItem>
                </Select>
                {errors.paymentMode && <FormHelperText>{errors.paymentMode}</FormHelperText>}
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
              <Button variant="contained" onClick={() => handleSubmit('save')}>
                Update
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
              <Button variant="contained" onClick={() => handleSubmit('save')}>
                Update
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
                    value={form.amountOnTerr}
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
                    value={form.amountOnOtherTerr}
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
                value={form.totalBrokerageAmount}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="brokerageGst">Brokerage GST</InputLabel>
                <Select labelId="brokerageGst" label="brokerageGst" name="brokerageGst" value={form.brokerageGst} onChange={handleChange}>
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
                label={brokerageValue === 'brokerage' ? 'Total Brokerage GST' : 'Endorsement Total Brokerage GST Amount'}
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
          <Button variant="contained" sx={{ mr: 2 }} onClick={() => handleSubmit('submit')}>
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
      <ToastContainer />
    </div>
  );
};

export default EditPolicy;
