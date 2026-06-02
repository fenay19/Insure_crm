import React, { useState, useEffect } from 'react'
import Modal from '@mui/material/Modal'
import AddService from '../service-detail/forms/AddService'
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
  Switch,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { Cancel, TouchApp } from '@mui/icons-material'
import { get, put } from 'api/api'
import { toast } from 'react-toastify'
import EditBtn from 'component/buttons/EditBtn'
import DeleteBtn from 'component/buttons/DeleteBtn'
import Loader from 'component/Loader/Loader'
import NoDataPlaceholder from 'component/NoDataPlaceholder'
import DataTable from 'component/DataTable'
import EditService from '../service-detail/forms/EditService'
import ImportExport from 'component/ImportExport'


const PathalogyService = () => {
  const [allData, setAllData] = useState([])
  const [patientPayee, setPatientPayee] = useState([])
  const [serverData, setServerData] = useState([])
  const [showData, setShowData] = useState([])
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false)
  const [type, setType] = useState('add')
  const [editData, setEditData] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openActiveModal, setOpenActiveModal] = useState(false)
  const [data, setData] = useState({})
  const [billGroupData, setBillGroupData] = useState([])
  const [ledger, setLedger] = useState([])
  const [subLedger, setSubLedger] = useState([])

  const [filterInput, setFilterInput] = useState({
    patientPayee: '',
    empanelment: '',
    patientEncounter: ''
  })
  const headerFields = [
    'Service Name',
    'Alternate Service Name',
    'Service Group or Bill Group',
    'service Code',
    'Payee Category',
    'Patient Payee',
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
    'Payee Category',
    'Patient Payee',
    'Patient Encounter',
    'Ledger',
    'Sub Ledger',
    'Department',
    'Status'
  ];

  const [empanelment, setEmpanelment] = useState([])

  const [loader, setLoader] = useState(true)
  const [serviceName, setServiceName] = useState([])


  const handleSave = () => {
    if (openDeleteModal) {
      deleteService(data._id)
    }
    if (openActiveModal) {
      activateService(data._id)
    }
  }

  const openDeleteModalFun = data => {
    setData(data)
    setOpenDeleteModal(true)
  }


  const openRegistration = () => {
    setOpenRegistrationModal(true)
    setType('add')
  }

  const closeRegistration = () => {
    setOpenRegistrationModal(false)
    setOpenDeleteModal(false)
    setOpenActiveModal(false)
  }

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
        if (val.whichService === 'Pathology') {
          serData.push(val);
        }
      });
      setShowData(serData);

      let addsr = [];
      let count = 1;

      if (dataAdd === undefined) {
        serData.forEach((val, index) => {
          if (
            pp?.toLowerCase() === 'cash' &&
            val.patientPayee === pp &&
            (filterInput.patientEncounter !== ''
              ? val.patientEncounter?.toLowerCase() === filterInput.patientEncounter?.toLowerCase()
              : val.patientEncounter)
          ) {
            addsr.push({ ...val, sr: count });
            count++;
          }

          if (
            pp?.toLowerCase() !== 'cash' &&
            val.patientPayee === pp &&
            (filterInput.empanelment !== ''
              ? val.empanelment?.toLowerCase() === filterInput.empanelment?.toLowerCase()
              : val.empanelment) &&
            (filterInput.patientEncounter !== ''
              ? val.patientEncounter?.toLowerCase() === filterInput.patientEncounter?.toLowerCase()
              : val.patientEncounter)
          ) {
            addsr.push({ ...val, sr: count });
            count++;
          }
        });
      } else {
        if (dataAdd.empanelment === '') {
          serData.forEach((val, index) => {
            if (
              val.patientPayee === dataAdd.patientPayee &&
              (dataAdd.patientEncounter !== ''
                ? val.patientEncounter?.toLowerCase() === dataAdd.patientEncounter?.toLowerCase()
                : val.patientEncounter)
            ) {
              addsr.push({ ...val, sr: count });
              count++;
            }
          });
        } else {
          serData.forEach((val, index) => {
            if (
              val.patientPayee === dataAdd.patientPayee &&
              (dataAdd.empanelment !== '' ? val.empanelment?.toLowerCase() === dataAdd.empanelment?.toLowerCase() : val.empanelment) &&
              (dataAdd.patientEncounter !== ''
                ? val.patientEncounter?.toLowerCase() === dataAdd.patientEncounter?.toLowerCase()
                : val.patientEncounter)
            ) {
              addsr.push({ ...val, sr: count });
              count++;
            }
          });
        }

        if (dataAdd.patientPayee?.toLowerCase() !== 'cash') {
          let aa = [];
          serData.forEach((val, index) => {
            if (val.patientPayee === dataAdd.patientPayee) {
              aa.push(val.empanelment);
            }
          });

          aa = [...new Map(aa.map((item) => [item, item])).values()];
          setEmpanelment(aa);
        }

        setFilterInput((prev) => {
          return {
            ...prev,
            patientPayee: dataAdd.patientPayee,
            empanelment: dataAdd.empanelment,
            patientEncounter: dataAdd.patientEncounter
          };
        });
      }
      setShowData(addsr);
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
       get('investigation-pathology-master').then(response => {
        let addsr = []
        response.data.investigation.forEach((val, index) => {
          addsr.push({
            detailServiceName: val.testName,
            investigationId: val._id
          })
        })
        setServiceName(addsr)
      })

    getData()
    // eslint-disable-next-line
  }, [])

  const filterData = (e) => {
    const searchValue = e.target.value?.toLowerCase(); // Get the search value

    if (searchValue) {
      // If search value is provided, filter based on it
      const filteredData = serverData.filter((item) => {
        return (
          (filterInput.patientPayee !== '' ? item.patientPayee?.toLowerCase() === filterInput.patientPayee?.toLowerCase() : true) && // Change to true if there's no filter
          (filterInput.patientEncounter !== ''
            ? item.patientEncounter?.toLowerCase() === filterInput.patientEncounter?.toLowerCase()
            : true) && // Change to true if there's no filter
          // item.patientType?.toLowerCase().includes(searchValue) ||
          (item.detailServiceName?.toLowerCase().includes(searchValue) ||
            item.alternateServiceName?.toLowerCase().includes(searchValue) ||
            item.serviceGroup?.toLowerCase().includes(searchValue) ||
            item.ledger?.toLowerCase().includes(searchValue) ||
            item.subLedger?.toLowerCase().includes(searchValue) ||
            item.serviceCode?.toLowerCase().includes(searchValue) ||
            item.department?.toLowerCase().includes(searchValue) ||
            item.status?.toLowerCase().includes(searchValue))
          // String(item.amount).toLowerCase().includes(searchValue) ||
        );
      });

      // Adding serial number to the filtered data
      const addsr = filteredData.map((val, index) => ({
        ...val,
        sr: index + 1
      }));

      setShowData(addsr);
    } else {
      // If search value is empty, filter data based on patientPayee and patientEncounter
      const filteredByAdditionalCriteria = serverData.filter((item) => {
        return (
          (filterInput.patientPayee !== '' ? item.patientPayee?.toLowerCase() === filterInput.patientPayee?.toLowerCase() : true) && // Change to true if there's no filter
          (filterInput.patientEncounter !== ''
            ? item.patientEncounter?.toLowerCase() === filterInput.patientEncounter?.toLowerCase()
            : true) // Change to true if there's no filter
        );
      });

      // Adding serial number to the filtered data
      const addsr = filteredByAdditionalCriteria.map((val, index) => ({
        ...val,
        sr: index + 1
      }));

      setShowData(addsr);
    }
  };

  const handleEdit = item => {
    setType(!type)
    setOpenRegistrationModal(true)
    setEditData(item)
  }

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

  const fileValidationHandler = fileData => {
    const newData = []

    fileData.forEach(entry => {
      let formattedEntry = {}

      //these fields are required
      const isValidEntry =
        entry['Service code'] &&
        entry['Patient Payee'] &&
        entry['Payee Category'] &&
        entry['Service Name'] &&
        entry['Alternate Service Name'] &&
        entry['Ledger'] &&
        entry['Sub Ledger'] &&
        entry['Service Group or Bill Group'] &&
        // entry['Amount'] &&
        entry['Patient Encounter'] &&
        entry['Department'] !== undefined;

      if (isValidEntry) {
        //assigning the master ids according to given data

        const department = allData.find(
          data => data.departmentName === entry['Department']
        )
        const departmentId = department ? department._id : ''

        const parentGroup = patientPayee.find((item) => item.parentGroup === entry['Payee Category']);
        const parentGroupId = parentGroup ? parentGroup.parentGroupId : '';


        const payeeData = patientPayee.find(
          item => item.payeeName === entry['Patient Payee']
        )
        const patientPayeeId = payeeData ? payeeData._id : ''

        const billGroup = billGroupData.find(
          item => item.billGroupName === entry['Service Group or Bill Group']
        )
        const billGroupId = billGroup ? billGroup._id : ''

        const ledgerData = ledger.find(item => item.ledger === entry['Ledger'])
        const ledgerId = ledgerData ? ledgerData._id : ''

        const subLedgerData = subLedger.find(
          item => item.subLedger === entry['Sub Ledger']
        )

        const subLedgerId = subLedgerData ? subLedgerData._id : ''

        //construct each object
        formattedEntry = {
          patientPayee: entry['Patient Payee'],
          patientPayeeId: patientPayeeId,
          payeeCategory: entry['Payee Category'],
          parentGroupId: parentGroupId,
          patientEncounter: entry['Patient Encounter'],
          detailServiceName: entry['Service Name'],
          alternateServiceName: entry['Alternate Service Name'],
          serviceGroupOrBillGroup: entry['Service Group or Bill Group'],
          serviceGroupOrBillGroupId: billGroupId,
          ledger: entry['Ledger'],
          ledgerId: ledgerId,
          subLedger: entry['Sub Ledger'],
          subLedgerId: subLedgerId,
          department: entry['Department'],
          departmentId: departmentId,
          whichService: 'Pathology',
          serviceCode:
            entry['Service Name'].substring(0, 3).toUpperCase() + '_01',
          status: 'active'
        }

        newData.push(formattedEntry)
      }
    })

    return newData
  }

  const exportDataHandler = () => {
    let datadd = [];
    showData.forEach((val, ind) => {
      datadd.push({
        SN: ind + 1,
        'Patient Payee': val.patientPayee,
        'Payee Category': val.payeeCategory,
        'Patient Encounter': val.patientEncounter,
        Department: val.department,
        'Service Name': val.detailServiceName,
        'Alternate Service Name': val.alternateServiceName,
        'Service Group or Bill Group': val.serviceGroupOrBillGroup,
        'Service Code': val.serviceCode,
        Ledger: val.ledger,
        'Sub Ledger': val.subLedger,
        Status: val.status
      });
    });
    return datadd;
  };

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
    }
  };

  const columns = [
    'SN',
    'Service Name',
    'Alternate Name',
    'Service Group/Bill Group',
    'Service Code',
    'Payee Category',
    'Patient Payee',
    'Patient Encounter',
    'Ledger',
    'Sub Ledger',
    'Department',
    'Action'
  ];

  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Service Name': item.detailServiceName,
        'Alternate Name': item.alternateServiceName,
        'Service Group/Bill Group': item.serviceGroupOrBillGroup,
        'Service Code': item.serviceCode,
        'Payee Category': item.payeeCategory,
        'Patient Payee': item.patientPayee,
        'Patient Encounter': item.patientEncounter,
        Ledger: item.ledger,
        'Sub Ledger': item.subLedger,
        Department: item.department,
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
        <div style={{ display: 'flex', justifyContent: 'center',gap:"10px",alignItems:"center" }}>
          <FormControl variant="outlined">
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
              width: '170px',
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
          </FormControl>
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
            name='service-details-Pathology'
            fileValidationHandler={fileValidationHandler}
            exportDataHandler={exportDataHandler}
            api='service-details-master/import'
          />
        </div>
      </div>
      {loader ? (
        <Loader/>
      ) : (
        <Paper>
          {showData && showData.length === 0 ? (
            <NoDataPlaceholder />
          ) : (
            <DataTable columns={columns} data={finalData} />
          )}
          
        </Paper>
      )}
      <Modal open={openRegistrationModal}>
        {type === 'add' ? (
          <AddService
            handleClose={closeRegistration}
            getData={getData}
            serverData={serverData}
            whichService='Pathology'
            serviceName={serviceName}
          />
        ) : (
          <EditService
            handleClose={closeRegistration}
            editData={editData}
            getData={getData}
            serviceName={serviceName}
            whichService='Pathology'
          />
        )}
      </Modal>
      <Modal
        open={openActiveModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <div className='modal'>
          <h2 className='popupHead'>
            {data.status === 'active' ? 'Inactivate' : 'Activate'}{' '}
            {data.detailServiceName} Service?
          </h2>
          <div className='deleteBtnGroup'>
            <IconButton
              title={data.status === 'active' ? 'Inactivate' : 'Activate'}
              className={`btnPopup ${
                data.status === 'active' ? 'btnDelete' : 'btnSave'
              }`}
              onClick={() => activateService(data._id)}
            >
              <TouchApp />
            </IconButton>
            <IconButton
              type='submit'
              title='Cancel'
              onClick={() => closeRegistration()}
              className='btnPopup btnCancel'
            >
              <Cancel />
            </IconButton>
          </div>
        </div>
      </Modal>
      <Modal
        open={openDeleteModal}
        onClose={closeRegistration}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <div className='modal'>
          <h2 className='popupHead'>
            Delete {data.detailServiceName} Service?
          </h2>
          <div className='deleteBtnGroup'>
            <Button
              title='Delete'
              onClick={() => deleteService(data._id)}
            >
              Delete
            </Button>
            <Button
              type='submit'
              title='Cancel'
              onClick={() => closeRegistration()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PathalogyService
