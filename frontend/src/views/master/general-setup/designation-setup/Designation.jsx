import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, Divider, Grid, Typography, Button, Modal, Box } from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import DataTable from 'component/DataTable';
import Loader from 'component/Loader/Loader';
import AddDesignation from './forms/AddDesignation';
import EditDesignation from './forms/EditDesignation';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';
import { get, put } from 'api/api';
import ImportExport from 'component/ImportExport';
import { toast, ToastContainer } from 'react-toastify';

const Designation = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [loader, setLoader] = useState(true);
  const [nextDesignationCode, setNextDesignationCode] = useState(0);

  // Simulate data loading

  const fetchData = async () => {
    await get('designation-master')
      .then((result) => {
        setData(result.data);
        setFilteredData(result.data);
        setNextDesignationCode(result.nextDesignationCode);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchEmployeeRoles = async () => {
    await get('employee-role')
      .then((result) => {
        setEmployeeRoles(result.employeeRole);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchEmployeeRoles();
  }, []);

  const handleSave = async () => {
    if (openDeleteModal) {
      await put(`designation-master/delete/${deleteId}`).then((response) => {
        toast.success(response.msg);
      });
      setOpenDeleteModal(false);
      fetchData();
    }
  };

  const handleCancel = () => {
    closeRegistration();
  };

  const openDeleteModalFun = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const openRegistration = () => {
    setOpenRegistrationModal(true);
    setType('add');
  };

  const openEditRegistration = (item) => {
    setType('edit');
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
  };

  const columns = [
    'SN',
    'Employee Role',
    'Designation Name',
    'Designation Type',
    'Designation Code',
    'Description/Job Responsibility ',
    'Action'
  ];
  const showData = filteredData.map((item, ind) => {
    const trueDesignationKey = Object.entries(item.designationFunction).find(([key, value]) => value === true)?.[0];

    const trueCapitalizeKey = trueDesignationKey
      ? trueDesignationKey.charAt(0).toUpperCase() + trueDesignationKey.slice(1).toLocaleLowerCase()
      : '';

    return {
      SN: ind + 1,
      'Employee Role': item.empRole,
      'Designation Name': item.designationName,
      'Designation Type': <>{trueCapitalizeKey}</>,
      'Designation Code': item.designationCode,
      'Description/Job Responsibility ': item.description,
      Action: (
        <Box display="flex" gap={1} p={0}>
          <EditBtn onClick={() => openEditRegistration(item)} />
          <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
        </Box>
      )
    };
  });

  //logic for search and import export

  const filterData = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = data.filter((item) => {
      return (
        item.designationName.toLowerCase().includes(searchValue) ||
        item.designationCode.toLowerCase().includes(searchValue) ||
        item.empRole.toLowerCase().includes(searchValue)
      );
    });

    setFilteredData(filteredData);
  };

  const headerFields = ['Employee Role', 'Designation Name', 'Designation Type', 'Description/Job Responsibility '];
  const downheaderFields = ['Employee Role', 'Designation Name', 'Designation Type', 'Designation Code', 'Description/Job Responsibility '];

  const fileValidationHandler = (fileData) => {
    const newData = [];

    let currentDesignationCode = nextDesignationCode;

    fileData.forEach((val) => {
      let d = {};

      if (val['Designation Name'] && val['Employee Role']) {
        const matchingRole = employeeRoles.find((role) => role.employeeRole === val['Employee Role']);

        d = {
          empRole: val['Employee Role'],
          empRoleId: matchingRole ? matchingRole._id : null,
          designationName: val['Designation Name'],
          designationType: val['Designation Type'].toString().toString(),
          designationCode: (currentDesignationCode++).toString().padStart(3, '0'),
          description: val['Description/Job Responsibility ']
        };

        newData.push(d);
      }
    });

    return newData;
  };

  const exportDataHandler = () => {
    let datadd = [];
    data.forEach((val, ind) => {
      const trueDesignationKey = Object.keys(val.designationFunction).find((key) => val.designationFunction[key] === true);

      const trueCapitalizeKey = trueDesignationKey
        ? trueDesignationKey.charAt(0).toUpperCase() + trueDesignationKey.slice(1).toLocaleLowerCase()
        : '';

      datadd.push({
        SN: ind + 1,
        'Employee Role': val.empRole,
        'Designation Name': val.designationName,
        'Designation Type': trueCapitalizeKey,
        'Designation Code': val.designationCode,
        Description: val.description
      });
    });
    return datadd;
  };

  // const designationType = data.map(item => {
  //   const trueKey = Object.keys(item.designationFunction).find(key => item.designationFunction[key] === true)
  //   return trueKey
  // })

  // console.log(designationType)

  return (
    <>
      <ToastContainer />
      <Breadcrumb title="Designation">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Designation
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button variant="contained" color="primary" onClick={openRegistration}>
                    Add
                  </Button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
                      className="search_input"
                      type="search"
                      placeholder="Search..."
                      onChange={filterData}
                    />

                    <ImportExport
                      update={fetchData}
                      headerFields={headerFields}
                      downheaderFields={downheaderFields}
                      name="Designation"
                      fileValidationHandler={fileValidationHandler}
                      exportDataHandler={exportDataHandler}
                      api="designation-master/import"
                    />
                  </div>
                </div>
              }
            />

            <Divider />
            <Modal open={openRegistrationModal} onClose={closeRegistration}>
              <Box p={3} style={{ margin: 'auto', maxWidth: '800px' }}>
                {type === 'add' ? (
                  <AddDesignation handleClose={closeRegistration} getData={fetchData} nextDesignationCode={nextDesignationCode} />
                ) : (
                  <EditDesignation handleClose={closeRegistration} editData={editData} getData={fetchData} />
                )}
              </Box>
            </Modal>
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box
                p={3}
                style={{
                  backgroundColor: 'white',
                  margin: 'auto',
                  marginTop: '15%',
                  maxWidth: '400px'
                }}
              >
                <Typography>Are you sure you want to delete this Designation?</Typography>
                <Button onClick={handleSave} sx={{ marginRight: '10px' }}>
                  Delete
                </Button>
                <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
              </Box>
            </Modal>
            {loader ? (
              <Loader />
            ) : (
              <CardContent>
                <DataTable data={showData} columns={columns} />
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Designation;
