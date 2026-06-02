import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import AddService from './forms/AddService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import { Cancel, TouchApp } from '@mui/icons-material';
import { get, put } from 'api/api';
import { toast } from 'react-toastify';
import ImportExport from 'component/ImportExport';
import Loader from 'component/Loader/Loader';
import NoDataPlaceholder from 'component/NoDataPlaceholder';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import DataTable from 'component/DataTable';
import EditService from './forms/EditService';

const ServiceDetail = () => {
  const [allData, setAllData] = useState([]);
  const [patientPayee, setPatientPayee] = useState([]);
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openActiveModal, setOpenActiveModal] = useState(false);
  const [data, setData] = useState({});
  const [billGroupData, setBillGroupData] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [subLedger, setSubLedger] = useState([]);

  const [filterInput, setFilterInput] = useState({
    patientPayee: '',
    empanelment: '',
    patientEncounter: ''
  });
  const headerFields = [
    'Service Name',
    'Alternate Service Name',
    'Service Group or Bill Group',
    'service Code',

    'Patient Encounter',
    'Ledger',
    'Sub Ledger',
    'Department'
  ];

  const downheaderFields = [
    'Service Name',
    'Alternate Service Name',
    'Service Group or Bill Group',
    'service Code',

    'Patient Encounter',
    'Ledger',
    'Sub Ledger',
    'Department',
    'Status'
  ];

  const [empanelment, setEmpanelment] = useState([]);
  const [loader, setLoader] = useState(true);

  const handleSave = () => {
    if (openDeleteModal) {
      deleteService(data._id);
    }
    if (openActiveModal) {
      activateService(data._id);
    }
  };

  const openDeleteModalFun = (data) => {
    setData(data);
    setOpenDeleteModal(true);
  };

  const openRegistration = () => {
    setOpenRegistrationModal(true);
    setType('add');
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
    setOpenActiveModal(false);
  };

  const getData = async (dataAdd) => {
    setLoader(true);
    let pp = null;
    await get('category/patient-payee').then((response) => {
      setPatientPayee(response.data);

      setFilterInput((prev) => {
        return { ...prev, patientPayee: response?.data[0]?.payeeName };
      });
      pp = response.data[0]?.payeeName;
    });

    await get('service-details-master').then((respose) => {
      let serData = [];
      respose.service.forEach((val, index) => {
        if (val.whichService === 'Service') {
          serData.push(val);
        }
      });
      setShowData(serData);

      setServerData(serData);
    });

    await get('department-setup').then((response) => {
      setAllData(response.data);
      setLoader(false);
    });

    await get('billgroup-master').then((response) => {
      setBillGroupData(response.data);
    });

    await get('ledger').then((response) => {
      setLedger(response.allLedger);
    });
    await get('ledger/sub-ledger').then((response) => {
      setSubLedger(response.allSubLedger);
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);
  console.log('SSS', serverData);
  const filterData = (e) => {
    const searchValue = e.target.value?.toLowerCase();

    if (searchValue) {
      const filteredData = serverData.filter((item) => {
        return (
          item?.detailServiceName?.toLowerCase().includes(searchValue) ||
          item?.alternateServideName?.toLowerCase().includes(searchValue) ||
          item?.serviceGroupOrBillGroup?.toLowerCase().includes(searchValue) ||
          item?.ledger?.toLowerCase().includes(searchValue) ||
          item?.subLedger?.toLowerCase().includes(searchValue) ||
          (Array.isArray(item?.patientEncounter) && item.patientEncounter.some((d) => d?.toLowerCase().includes(searchValue)))
        );
      });
      if (filteredData.length > 0) {
        const addsr = filteredData.map((val, index) => ({
          ...val,
          sr: index + 1
        }));
        setShowData(addsr);
      } else {
        setShowData([]);
        // Optionally show a "No results found" message in the UI
      }
    } else {
      // Reset to full data if search input is cleared
      const addsr = serverData.map((val, index) => ({
        ...val,
        sr: index + 1
      }));
      setShowData(addsr);
    }
  };

  const handleEdit = (item) => {
    setType(!type);
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  const deleteService = async (id) => {
    await put(`service-details-master/delete/${id}`)
      .then(() => {
        getData(data);
        toast.error(`${data.detailServiceName} Service deleted`);
        setOpenDeleteModal(false);
      })
      .catch((err) => {
        toast.error('Something went wrong, Please try later');
      });
  };

  const activateService = async (id) => {
    try {
      const response = await put(`service-details-master/${id}`, {
        ...data,
        status: data.status === 'active' ? 'inactive' : 'active'
      });
      if (response) {
        closeRegistration();
        getData(data);
        toast.success(`${data.status === 'active' ? 'Inactivate' : 'Activate'} ${data.detailServiceName} Service!!`);
      } else {
        toast.error('Something went wrong, Please try later!!');
      }
    } catch (error) {
      toast.error('Something went wrong, Please try later!!');
    }
  };

  const fileValidationHandler = (fileData) => {
    const lastServiceCode = showData?.at(-1)?.serviceCode || '000001';
    const startCode = parseInt(lastServiceCode, 10);
    let codeCounter = startCode;
  
    const newData = [];
  
    fileData.forEach((entry) => {
      let formattedEntry = {};
      let departmentNames = [];
      let departmentIds = [];
  
      const departmentField = entry['Department']?.toLowerCase()?.trim();
  
      if (departmentField === 'all departments'||departmentField === 'all department') {
        const { departmentNameExtrcted, departmentIdsExtracted } = (allData || []).reduce(
          (acc, curr) => {
            if (curr?.departmentName && curr?._id) {
              acc.departmentNameExtrcted.push(curr.departmentName);
              acc.departmentIdsExtracted.push(curr._id);
            }
            return acc;
          },
          {
            departmentNameExtrcted: [],
            departmentIdsExtracted: []
          }
        );
  
        departmentNames = departmentNameExtrcted;
        departmentIds = departmentIdsExtracted;
      } else {
        const departmentRaw = entry['Department'];
  
        if (!departmentRaw || departmentRaw.trim() === '') {
          departmentNames = [];
          departmentIds = [];
        } else {
          const depSet = new Set(departmentRaw.split(',').map((dep) => dep.trim()));
  
          const { departmentNameExtrcted, departmentIdsExtracted } = (allData || []).reduce(
            (acc, currObj) => {
              if (depSet.has(currObj?.departmentName)) {
                acc.departmentNameExtrcted.push(currObj.departmentName);
                acc.departmentIdsExtracted.push(currObj._id);
              }
              return acc;
            },
            {
              departmentNameExtrcted: [],
              departmentIdsExtracted: []
            }
          );
  
          departmentNames = departmentNameExtrcted;
          departmentIds = departmentIdsExtracted;
        }
      }
  
      // ID mappings
      const parentGroup = patientPayee.find((item) => item.parentGroup === entry['Payee Category']);
      const parentGroupId = parentGroup ? parentGroup.parentGroupId : '';
  
      const payeeData = patientPayee.find((item) => item.payeeName === entry['Patient Payee']);
      const patientPayeeId = payeeData ? payeeData._id : '';
  
      const billGroup = billGroupData.find((item) => item.billGroupName === entry['Service Group or Bill Group']);
      const billGroupId = billGroup ? billGroup._id : '';
  
      const ledgerData = ledger.find((item) => item.ledger === entry['Ledger']);
      const ledgerId = ledgerData ? ledgerData._id : '';
  
      const subLedgerData = subLedger.find((item) => item.subLedger === entry['Sub Ledger']);
      const subLedgerId = subLedgerData ? subLedgerData._id : '';
  
      const patientEncounter = entry['Patient Encounter']?.length ? [] : entry['Patient Encounter'];
  
      // 🔢 Generate new service code
      codeCounter += 1;
      const newServiceCode = String(codeCounter).padStart(6, '0');
  
      formattedEntry = {
        patientEncounter: patientEncounter,
        detailServiceName: entry['Service Name'],
        alternateServiceName: entry['Alternate Service Name'],
        serviceGroupOrBillGroup: entry['Service Group or Bill Group'],
        serviceGroupOrBillGroupId: billGroupId,
        ledger: entry['Ledger'],
        ledgerId: ledgerId,
        subLedger: entry['Sub Ledger'],
        subLedgerId: subLedgerId,
        department: departmentNames,
        departmentId: departmentIds,
        whichService: 'Service',
        serviceCode: newServiceCode,
        status: 'active'
      };
  
      newData.push(formattedEntry);
    });
  
    return newData;
  };
  

  const exportDataHandler = () => {
    return showData.map((val, ind) => ({
      SN: ind + 1,
      'Patient Encounter':
        Array.isArray(val?.patientEncounter) && val.patientEncounter.length > 0 ? val.patientEncounter.join(', ') : 'N/A',

      Department: Array.isArray(val?.department)
        ? val.department.length > 0
          ? allData?.length === val.department.length
            ? 'All Department'
            : val.department.join(', ')
          : 'N/A'
        : 'N/A',

      'Service Name': val?.detailServiceName || 'N/A',
      'Alternate Service Name': val?.alternateServiceName || 'N/A',
      'Service Group or Bill Group': val?.serviceGroupOrBillGroup || 'N/A',
      'Service Code': val?.serviceCode || 'N/A',
      Ledger: val?.ledger || 'N/A',
      'Sub Ledger': val?.subLedger || 'N/A'
    }));
  };

  console.log('D', exportDataHandler());

  const handleSearchChange = (e) => {
    let { name, value } = e.target;
    if (name === 'patientPayee') {
      setFilterInput((prev) => {
        return {
          ...prev,
          [name]: value,
          empanelment: '',
          patientEncounter: ''
        };
      });
      const filteredData = serverData.filter((item) => {
        return item.patientPayee?.toLowerCase() === value?.toLowerCase();
      });
      let addsr = [];
      filteredData.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setShowData(addsr);

      if (value?.toLowerCase() !== 'cash') {
        get('service-details-master').then((respose) => {
          let addsr = [];

          respose.service.forEach((val, index) => {
            if (val.patientPayee === value && val.whichService === 'Service') {
              addsr.push(val.empanelment);
            }
          });
          addsr = [...new Map(addsr.map((item) => [item, item])).values()];
          setEmpanelment(addsr);
        });
      }
    } else if (name === 'empanelment') {
      setFilterInput((prev) => {
        return { ...prev, [name]: value, patientEncounter: '' };
      });
      const filteredData = serverData.filter((item) => {
        return (
          item.empanelment?.toLowerCase() === value?.toLowerCase() &&
          (filterInput.patientPayee !== ''
            ? item.patientPayee?.toLowerCase() === filterInput.patientPayee?.toLowerCase()
            : item.patientPayee)
        );
      });
      let addsr = [];
      filteredData.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setShowData(addsr);
    } else if (name === 'patientEncounter') {
      setFilterInput((prev) => {
        return { ...prev, [name]: value };
      });
      let filteredData = [];
      if (filterInput.empanelment === '') {
        filteredData = serverData.filter((item) => {
          return (
            item.patientEncounter?.toLowerCase() === value?.toLowerCase() &&
            (filterInput.patientPayee !== ''
              ? item.patientPayee?.toLowerCase() === filterInput.patientPayee?.toLowerCase()
              : item.patientPayee)
          );
        });
      } else {
        filteredData = serverData.filter((item) => {
          return (
            item.patientEncounter?.toLowerCase() === value?.toLowerCase() &&
            (filterInput.patientPayee !== ''
              ? item.patientPayee?.toLowerCase() === filterInput.patientPayee?.toLowerCase()
              : item.patientPayee) &&
            (filterInput.empanelment !== '' ? item.empanelment?.toLowerCase() === filterInput.empanelment?.toLowerCase() : item.empanelment)
          );
        });
      }

      let addsr = [];
      filteredData.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setShowData(addsr);
    } else if (name === '') {
      console.log('serverData', serverData);
    }
  };

  const columns = [
    'SN',
    'Service Name',
    'Alternate Name',
    'Service Group/Bill Group',
    'Service Code',

    'Patient Encounter',
    'Ledger',
    'Sub Ledger',
    'Department',
    'Action'
  ];

  const finalData =
    showData &&
    showData?.map((item, ind) => {
      return {
        SN: ind + 1,
        'Service Name': item?.detailServiceName,
        'Alternate Name': item?.alternateServiceName,
        'Service Group/Bill Group': item?.serviceGroupOrBillGroup,
        'Service Code': item?.serviceCode,
        'Patient Encounter': `${item?.patientEncounter}`,
        Ledger: item?.ledger,
        'Sub Ledger': item?.subLedger,
        Department:
          Array.isArray(item?.department) && item?.department.length > 0 && allData?.length === item?.department?.length
            ? 'All Department'
            : item?.department.join(','),
        Action: (
          <>
            <EditBtn onClick={() => handleEdit(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          </>
        )
      };
    });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="contained" color="primary" className="global_btn" onClick={openRegistration}>
          + Add
        </Button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          {/* <FormControl variant="outlined" style={{ width: '120px' }}>
            <InputLabel>Patient Payee</InputLabel>
            <Select
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 300 }
                }
              }}
              label="Patient Payee"
              name="patientPayee"
              value={filterInput.patientPayee}
              onChange={handleSearchChange}
            >
              <MenuItem value="">Select</MenuItem>

              {patientPayee.map((r, ind) => {
                return (
                  <MenuItem value={r.payeeName} key={ind}>
                    {r.payeeName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            style={{
              width: '170px'
            }}
          >
            <InputLabel>Patient Encounter </InputLabel>
            <Select
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 300 }
                }
              }}
              label="Patient Encounter	"
              name="patientEncounter"
              value={filterInput.patientEncounter}
              onChange={handleSearchChange}
            >
              <MenuItem value="IPD">IPD</MenuItem>
              <MenuItem value="OPD">OPD</MenuItem>
              <MenuItem value="Walk In">Walk In</MenuItem>
              <MenuItem value="Casualty">Casualty</MenuItem>
              <MenuItem value="Daycare">Daycare</MenuItem>
            </Select>
          </FormControl> */}
          <input
            style={{ height: '53px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
            type="search"
            placeholder="Search..."
            onChange={filterData}
          />
          <ImportExport
            update={getData}
            headerFields={headerFields}
            downheaderFields={downheaderFields}
            name="Service Details"
            fileValidationHandler={fileValidationHandler}
            exportDataHandler={exportDataHandler}
            api="service-details-master/import"
          />
        </div>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <Paper>{showData && showData.length === 0 ? <NoDataPlaceholder /> : <DataTable columns={columns} data={finalData} />}</Paper>
      )}
      <Modal open={openRegistrationModal}>
        {type === 'add' ? (
          <AddService handleClose={closeRegistration} getData={getData} serverData={serverData} whichService="Service" />
        ) : (
          <EditService
            handleClose={closeRegistration}
            editData={editData}
            getData={getData}
            whichService="Service"
            serverData={serverData}
          />
        )}
      </Modal>
      <Modal open={openActiveModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="modal">
          <h2 className="popupHead">
            {data.status === 'active' ? 'Inactivate' : 'Activate'} {data.detailServiceName} Service?
          </h2>
          <div className="deleteBtnGroup">
            <Button
              title={data.status === 'active' ? 'Inactivate' : 'Activate'}
              className={`btnPopup ${data.status === 'active' ? 'btnDelete' : 'btnSave'}`}
              onClick={() => activateService(data._id)}
            >
              <TouchApp />
            </Button>
            <Button type="submit" title="Cancel" onClick={() => closeRegistration()}>
              <Cancel />
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={openDeleteModal}
        onClose={closeRegistration}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <h2 className="popupHead">Delete {data.detailServiceName} Service?</h2>
          <div style={{ marginTop: '1rem' }}>
            <Button title="Delete" onClick={() => deleteService(data._id)}>
              Delete
            </Button>
            <Button type="submit" onClick={() => closeRegistration()}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceDetail;
