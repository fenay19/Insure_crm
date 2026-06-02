import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import AddPackage from './forms//AddPackage';
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
  MenuItem,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';

import EditPackage from './forms/EditPackage';

import { Cancel, TouchApp } from '@mui/icons-material';
import { get, put } from 'api/api';
import { toast } from 'react-toastify';
import Loader from 'component/Loader/Loader';
import NoDataPlaceholder from 'component/NoDataPlaceholder';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import ImportExport from 'component/ImportExport';
import DataTable from 'component/DataTable';
import { Visibility as EyeIcon } from '@mui/icons-material';
import { set } from 'date-fns';


const OpdPackage = () => {
  const [allData, setAllData] = useState([]);
  const [patientPayee, setPatientPayee] = useState([]);
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewMOdel, setOpenViewMOdel] = useState(false);
  const [openViewData, setOpenViewData] = useState(false);
  const [openActiveModal, setOpenActiveModal] = useState(false);
  const [data, setData] = useState({});

  const [filterInput, setFilterInput] = useState({
    patientPayee: '',
    empanelment: '',
    patientEncounter: ''
  });

  const headerFields = [
    'Opd Package Name',
    'Total Visit',
    'Total Days',
    'Patient Type',
    'Patient Encounter',
    'Service Group or Bill Group',
    'Ledger',
    'Sub Ledger',
    'Department'
  ];

  const downheaderFields = [
    'Opd Package Name',
    'Total Visit',
    'Total Days',
    'Patient Type',
    'Patient Encounter',
    'Service Group or Bill Group',
    'Ledger',
    'Sub Ledger',
    'Department',
    'Status'
  ];

  const [loader, setLoader] = useState(true);
  const [serviceName, setServiceName] = useState([]);
  const [billGroupData, setBillGroupData] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [subLedger, setSubLedger] = useState([]);

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
    setOpenViewMOdel(false);
  };

  const getData = async (dataAdd) => {
    setLoader(true);

    await get('category/patient-payee').then((response) => {
      setPatientPayee(response.data);
    });

    await get('opd-package').then((respose) => {
      setShowData(respose.package);
      setServerData(respose.package);
    });

    await get(`department-setup`).then((response) => {
      setAllData(response.data);
    });

    await get(`category/patient-payee`).then((response) => {
      setPatientPayee(response.data);
      setLoader(false);
    });

    await get(`billgroup-master`).then((response) => {
      setBillGroupData(response.data);
    });

    await get(`ledger`).then((response) => {
      setLedger(response.allLedger);
    });

    await get(`ledger/sub-ledger`).then((response) => {
      setSubLedger(response.allSubLedger);
    });
  };

  useEffect(() => {
    get('service-details-master').then((response) => {
      let addsr = [];
      response.service.forEach((val, index) => {
        addsr.push({
          serviceId: val._id,
          detailServiceName: val.detailServiceName
          // existingAmount: val.amount
        });
      });
      setServiceName(addsr);
    });

    getData();
    // eslint-disable-next-line
  }, []);

  const handleEdit = (item) => {

    setType(!type);
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  const handleView = (item) => {

    setOpenViewMOdel(true);
    setOpenViewData(item);

  };

  console.log('openViewData--', openViewData.DepartmentConsultants);
  const combinedData = Object.entries(openViewData.othersServices || {}).flatMap(([key, value]) =>
    (value || []).map(item => ({
      ...item,
      category: key,
    }))
  );
  const groupedData = combinedData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item.detailServiceName);
    return acc;
  }, {});


  console.log("combinedData", combinedData)
  const deleteService = async (id) => {
    await put(`opd-package/delete/${id}`)
      .then(() => {
        getData(data);
        toast.error(`${data.opdPackageName} OPD Package Deleted!!`);
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const activateService = async (id) => {
    try {
      const response = await put(`opd-package/${id}`, {
        ...data,
        status: data.status === 'active' ? 'inactive' : 'active'
      });
      if (response) {
        closeRegistration();
        getData(data);
        toast({
          title: `${data.status === 'active' ? 'Inactivate' : 'Activate'} ${data.opdPackageName} OPD Package!!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        });
      } else {
        toast.error('Something went wrong, Please try later!!');
      }
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

  // const fileValidationHandler = (fileData) => {
  //   const newData = [];

  //   fileData.forEach((entry) => {
  //     let formattedEntry = {};

  //     //these fields are required
  //     const isValidEntry =
  //       entry['Opd Package Name'] &&
  //       entry['Total Visit'] &&
  //       entry['Total Days'] &&
  //       entry['Patient Type'] &&
  //       entry['Patient Encounter'] &&
  //       entry['Service Group or Bill Group'] &&
  //       entry['Ledger'] &&
  //       entry['Sub Ledger'] &&
  //       entry['Department'] !== undefined;

  //     if (isValidEntry) {
  //       //assigning the master ids according to given data

  //       const department = allData.find((data) => data.departmentName === entry['Department']);
  //       const departmentId = department ? department._id : '';

  //       const parentGroup = patientPayee.find((item) => item.parentGroup === entry['Parent Group']);
  //       const parentGroupId = parentGroup ? parentGroup.parentGroupId : '';

  //       const payeeData = patientPayee.find((item) => item.payeeName === entry['Patient Payee']);
  //       const patientPayeeId = payeeData ? payeeData._id : '';

  //       const billGroup = billGroupData.find((item) => item.billGroupName === entry['Service Group or Bill Group']);
  //       const billGroupId = billGroup ? billGroup._id : '';

  //       const ledgerData = ledger.find((item) => item.ledger === entry['Ledger']);
  //       const ledgerId = ledgerData ? ledgerData._id : '';

  //       const subLedgerData = subLedger.find((item) => item.subLedger === entry['Sub Ledger']);

  //       const subLedgerId = subLedgerData ? subLedgerData._id : '';

  //       //construct each object
  //       formattedEntry = {
  //         opdPackageName: entry['Opd Package Name'],
  //         visit: entry['Total Visit'],
  //         duration: entry['Total Days'],
  //         patientType: entry['Patient Type'],
  //         patientEncounter: entry['Patient Encounter'],
  //         serviceGroupOrBillGroup: entry['Service Group or Bill Group'],
  //         serviceGroupOrBillGroupId: billGroupId,
  //         ledger: entry['Ledger'],
  //         ledgerId: ledgerId,
  //         subLedger: entry['Sub Ledger'],
  //         subLedgerId: subLedgerId,
  //         department: entry['Department'],
  //         departmentId: departmentId
  //       };

  //       newData.push(formattedEntry);
  //     }
  //   });

  //   return newData;
  // };


  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData.forEach((entry) => {
      let formattedEntry = {};

      // Department Handling
      let departmentNames = [];
      let departmentIds = [];

      const departmentField = entry['Department']?.toLowerCase()?.trim();

      if (departmentField === 'all department' || departmentField === 'all departments') {
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

      // Master lookups
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

      // Handle Patient Encounter
      const patientEncounter = Array.isArray(entry['Patient Encounter'])
        ? entry['Patient Encounter']
        : entry['Patient Encounter']?.split(',').map((e) => e.trim()) || [];

      // Construct final formatted entry
      formattedEntry = {
        opdPackageName: entry['Opd Package Name'],
        visit: entry['Total Visit'],
        duration: entry['Total Days'],
        patientType: entry['Patient Type'],
        patientEncounter: patientEncounter,
        serviceGroupOrBillGroup: entry['Service Group or Bill Group'],
        serviceGroupOrBillGroupId: billGroupId,
        ledger: entry['Ledger'],
        ledgerId: ledgerId,
        subLedger: entry['Sub Ledger'],
        subLedgerId: subLedgerId,
        department: departmentNames,
        departmentId: departmentIds
      };

      newData.push(formattedEntry);
    });

    return newData;
  };
  const exportDataHandler = () => {
    let datadd = [];
    showData.forEach((val, ind) => {
      datadd.push({
        SN: ind + 1,
        'Opd Package Name': val.opdPackageName,
        'Total Visit': val.visit,
        'Total Days': val.duration,
        'Patient Type': val.patientType,
        'Service Group or Bill Group': val.serviceGroupOrBillGroup,
        'Patient Encounter': val.patientEncounter,
        Department:
          Array.isArray(val.department) && val.department.length > 0 && allData?.length === val.department?.length
            ? 'All Department'
            : val.department.join(','),
        'Service Code': val.serviceCode,
        Ledger: val.ledger,
        'Sub Ledger': val.subLedger
      });
    });
    return datadd;
  };
const filterData = (e) => {
  const searchValue = e.target.value?.toLowerCase();

  const filteredData = serverData?.filter((item) => {
    const matchesSearch =
      !searchValue ||
      item.opdPackageName?.toLowerCase()?.includes(searchValue) ||
      item.patientType?.toLowerCase()?.includes(searchValue) ||
      String(item.visit)?.includes(searchValue) ||
      item.serviceGroup?.toLowerCase()?.includes(searchValue) ||
      item.ledger?.toLowerCase()?.includes(searchValue) ||
      item.subLedger?.toLowerCase()?.includes(searchValue);

    const matchesFilters =
      (!filterInput.patientPayee || item.patientPayee?.toLowerCase() === filterInput.patientPayee?.toLowerCase()) &&
      (!filterInput.patientEncounter || item.patientEncounter?.toLowerCase() === filterInput.patientEncounter?.toLowerCase());

    return matchesSearch && matchesFilters;
  });

  setShowData(filteredData);
};
  /* search filtering ends here */

  /* filter by input field */
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setFilterInput((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = (data) => {
    return data?.filter((item) => {
      // const payeeMatch = filterInput.patientPayee ? item.patientPayee?.toLowerCase() === filterInput.patientPayee.toLowerCase() : true;

      const encounterMatch = filterInput.patientEncounter
        ? item.patientEncounter?.toLowerCase() === filterInput.patientEncounter.toLowerCase()
        : true;

      return encounterMatch;
    });
  };

  useEffect(() => {
    setShowData(applyFilters(serverData));
  }, [filterInput, serverData]);

  /* end filter by input field */

  const columns = [
    'SN',
    'OPD Package',
    'Visit',
    'Duration',
    'Patient Type',
    'Patient Encounter',
    'Service Group/Bill Group',
    'Service Code',
    'Ledger',
    'Sub Ledger',
    'Department',
    'Actions'
  ];

  const finalData =
    showData &&
    showData.map((item, index) => {
      return {
        SN: index + 1,
        'OPD Package': item.opdPackageName,
        Visit: item.visit,
        Duration: item.duration,
        'Patient Type': item.patientType,
        'Patient Encounter':
          Array.isArray(item.patientEncounter) && item.patientEncounter.length > 0 ? item.patientEncounter.join(',') : 'N/A',
        Department:
          Array.isArray(item.department) && item.department.length > 0 && allData?.length === item.department?.length
            ? 'All Department'
            : item.department.join(','),
        'Service Group/Bill Group': item.serviceGroupOrBillGroup,
        'Service Code': item.serviceCode,
        Ledger: item.ledger,
        'Sub Ledger': item.subLedger,
        Actions: (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EyeIcon sx={{ cursor: 'pointer', fontSize: 26, mr: 2 }} onClick={() => handleView(item)} />
            <EditBtn onClick={() => handleEdit(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          </Box>
        )
      };
    });



  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="contained" color="primary" onClick={openRegistration}>
          + Add
        </Button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          <input
            className="search_input"
            type="search"
            placeholder="Search..."
            onChange={filterData}
            style={{ height: '53px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
          />
          <ImportExport
            update={getData}
            headerFields={headerFields}
            downheaderFields={downheaderFields}
            name="OPD Package Details"
            fileValidationHandler={fileValidationHandler}
            exportDataHandler={exportDataHandler}
            api="opd-package/import"
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
          <AddPackage handleClose={closeRegistration} getData={getData} serviceName={serviceName} />
        ) : (
          <EditPackage handleClose={closeRegistration} editData={editData} getData={getData} serviceName={serviceName} />
        )}
      </Modal>
      <Modal open={openActiveModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="modal">
          <h2 className="popupHead">
            {data.status === 'active' ? 'Inactivate' : 'Activate'} {data.opdPackageName} OPD Package?
          </h2>
          <div className="deleteBtnGroup">
            <IconButton
              title={data.status === 'active' ? 'Inactivate' : 'Activate'}
              className={`btnPopup ${data.status === 'active' ? 'btnDelete' : 'btnSave'}`}
              onClick={() => activateService(data._id)}
            >
              <TouchApp />
            </IconButton>
            <IconButton type="submit" title="Cancel" onClick={() => closeRegistration()} className="btnPopup btnCancel">
              <Cancel />
            </IconButton>
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
          <h2 className="popupHead">Delete {data.opdPackageName} OPD Package?</h2>
          <div className="deleteBtnGroup">
            <Button title="Delete" onClick={() => deleteService(data._id)}>
              Delete
            </Button>
            <Button type="submit" title="Cancel" onClick={() => closeRegistration()}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      <Dialog
        open={openViewMOdel}
        onClose={closeRegistration}
        maxWidth={false}
        fullWidth
        sx={{ '& .MuiDialog-paper': { width: '800px', height: '500px' } }}
      >
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="h6">Services Overview</Typography>
          <IconButton onClick={closeRegistration}>
            {/* <CloseIcon /> */}
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Detail Service Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedData).map(([category, services], catIndex) => (
                  services.map((service, serviceIndex) => (
                    <TableRow key={`${catIndex}-${serviceIndex}`}>
                      {serviceIndex === 0 ? (
                        <TableCell
                          rowSpan={services.length}
                          sx={{ verticalAlign: 'top', fontWeight: 'bold' }}
                        >
                          {category}
                        </TableCell>
                      ) : null}
                      <TableCell>{service}</TableCell>

                    </TableRow>
                  ))
                ))}
              </TableBody>
              {/* {openViewData?.DepartmentConsultants?.map((department, index) => (
                <Box key={index} mb={3} p={2} sx={{ border: '1px solid #ddd', borderRadius: '8px' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                    {department?.departmentId?.departmentName || "Unknown Department"}
                  </Typography>

                  {department?.consultants?.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {department.consultants.map((consultant, idx) => {
                        const { firstName, middleName, lastName } = consultant?.basicDetails || {};
                        const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");
                        return (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            {fullName || "Unnamed Consultant"}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No consultants available
                    </Typography>
                  )}
                </Box>
              ))} */}
            </Table>
          </TableContainer>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
              Department-wise Consultant Details
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Department Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Consultant Name</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {openViewData?.DepartmentConsultants?.map((department, deptIndex) => {
                  const consultants = department?.consultants || [];

                  return consultants.length > 0 ? (
                    consultants.map((consultant, consIndex) => {
                      const { firstName, middleName, lastName } = consultant?.basicDetails || {};
                      const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

                      return (
                        <TableRow key={`${deptIndex}-${consIndex}`}>
                          {consIndex === 0 && (
                            <TableCell rowSpan={consultants.length}>
                              {department?.departmentId?.departmentName || "Unknown Department"}
                            </TableCell>
                          )}
                          <TableCell>{fullName || "Unnamed Consultant"}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow key={`empty-${deptIndex}`}>
                      <TableCell>
                        {department?.departmentId?.departmentName || "Unknown Department"}
                      </TableCell>
                      <TableCell>No consultants</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

        </DialogContent>
      </Dialog>


    </div>
  );
};

export default OpdPackage;
