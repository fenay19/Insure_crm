import React, { useState, useEffect } from 'react';
import { CardHeader, Grid, Typography, Button, Modal, Box } from '@mui/material';
import { gridSpacing } from 'config.js';
import DataTable from 'component/DataTable';
import Loader from 'component/Loader/Loader';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';
import { get, post, put } from 'api/api';
import AddSubType from './forms/AddSubType';
import EditSubType from './forms/EditSubType';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from 'component/Input';

const DepartmentSubType = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [loader, setLoader] = useState(true);
  const [departmentTypeData, setDepartmentTypeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    await get('department-sub-type')
      .then((result) => {
        setData(result?.data ?? []);
        setFilteredData(result?.data ?? []);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDepartmentData = async () => {
    await get('department-type').then((result) => {
      setDepartmentTypeData(result.data || []);
    });
  };

  useEffect(() => {
    fetchData();
    fetchDepartmentData();
  }, []);

  const handleSave = async () => {
    if (openDeleteModal) {
      await put(`department-sub-type/delete/${deleteId}`);
      setOpenDeleteModal(false);
      fetchData();
    }
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

  const onSearch = (value) => {
    const filteredData = data?.filter((item) => {
      return (
        item?.departmentSubTypeName?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.departmentTypeId?.departmentTypeName?.toLowerCase()?.includes(value?.toLowerCase())
      );
    });
    setFilteredData(filteredData);
  };

  const columns = ['SN', 'Department Type', 'Department Sub-Type', 'Action'];
  const showData = filteredData?.map((item, ind) => {
    return {
      SN: ind + 1,
      'Department Type': item.departmentTypeId?.departmentTypeName,
      'Department Sub-Type': item.departmentSubTypeName,
      Action: (
        <>
          <EditBtn onClick={() => openEditRegistration(item)} />
          <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
        </>
      )
    };
  });

  //code for import export and sample

  const [processedData, setProcessedData] = useState([]); // Store processed data
  const [isDataProcessed, setIsDataProcessed] = useState(false); // Flag for data processed
  const [isFileSelected, setIsFileSelected] = useState(false); // Track if a file is selected

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      setIsFileSelected(true); // File is selected
      setIsDataProcessed(false); // Reset the processed data flag
      parseCsvFile(file);
    } else {
      toast.error('Unsupported file type. Please upload a .csv file.');
      setIsFileSelected(false); // Reset if invalid file is uploaded
    }
    event.target.value = ''; // Reset file input
  };

  // Mandatory fields
  const expectedKeys = ['Department Type', 'Department Sub-Type'];

  const parseCsvFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;

          if (data.length === 0) {
            toast.error('No data found in the CSV file.');
            return;
          }

          const rawColumnNames = Object.keys(data[0]);

          const trimmedColumnNames = rawColumnNames.map((key) => key.trim());

          const isValid = expectedKeys.every((expectedKey) => trimmedColumnNames.includes(expectedKey));

          if (!isValid) {
            toast.error('Invalid CSV format. Please ensure the column names are correct.');
            console.error('Invalid keys:', trimmedColumnNames);
            return;
          }

          let dataToSend = [];
          data.forEach((item, index) => {
            //extracting id of added department type in excel sheet

            const department = departmentTypeData.find(
              (departmentType) => departmentType.departmentTypeName.trim() === item['Department Type'].trim()
            );

            if (!department) {
              toast.error(`${item['Department Type']} is not found in Department Type Master`);
              return;
            }

            dataToSend.push({
              departmentSubTypeName: item['Department Sub-Type'].trim() || '',
              departmentTypeId: department._id
            });
          });

          console.log('Processed data:', dataToSend);
          setProcessedData(dataToSend);
          setIsDataProcessed(true);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast.error('Failed to parse the CSV file.');
        }
      });
    };

    reader.readAsText(file);
  };

  const submitProcessedData = async () => {
    try {
      const result = await post('department-sub-type/import', { processedData });
      console.log(result);

      if (result.status === true) {
        toast.success(result.message);
        fetchData();
        setIsFileSelected(false);
        setProcessedData([]);
        setIsDataProcessed(false);
      } else if (result.status === false) {
        toast.error(result.message);
        setIsFileSelected(false);
      }
    } catch (err) {
      console.error('Error submitting data:', err);
      toast.error('An error occurred while submitting the data.');
      setIsFileSelected(false);
    }
  };

  // Headers for CSV Export
  const csvHeaders = [
    { label: 'SN', key: 'SN' },
    { label: 'Department Type', key: 'departmentTypeName' },
    { label: 'Department Sub-Type', key: 'departmentSubTypeName' }
  ];

  const transformedDataForExport = data.map((item, ind) => ({
    SN: ind + 1,
    departmentTypeName: item.departmentTypeId.departmentTypeName,
    departmentSubTypeName: item.departmentSubTypeName
  }));

  // console.log(data)

  const headers = [
    { label: 'Department Type', key: 'Department Type' },
    { label: 'Department Sub-Type', key: 'Department Sub-Type' }
  ];

  // Define data
  const sampleData = [{ 'Department Type': '', 'Department Sub-Type': '' }];

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <CardHeader
            title={
              <Grid container alignItems="center" justifyContent="space-between">
                <Button variant="contained" color="primary" onClick={openRegistration}>
                  Add
                </Button>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <InputField name="search" type="search" placeholder="Search..." onChange={onSearch} />
                  <Button
                    variant="contained"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #FF512F 0%, #F09819 51%, #FF512F 100%)',
                      color: '#fff'
                    }}
                  >
                    <CSVLink
                      data={sampleData}
                      headers={headers}
                      filename="sample_department_Sub_type.csv"
                      style={{ textDecoration: 'none', color: '#fff' }}
                    >
                      Sample
                    </CSVLink>
                  </Button>
                  <Button variant="outlined" component="label">
                    Select File
                    <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
                  </Button>

                  {isFileSelected && (
                    <Button
                      variant="contained"
                      style={{
                        backgroundImage: 'linear-gradient(45deg, #FF512F 0%, #F09819 51%, #FF512F 100%)',
                        color: '#fff'
                      }}
                      onClick={submitProcessedData}
                      disabled={!isDataProcessed}
                    >
                      Import Data
                    </Button>
                  )}

                  <Button variant="contained" style={{ backgroundColor: '#008000' }}>
                    <CSVLink
                      data={transformedDataForExport}
                      headers={csvHeaders}
                      filename="department_sub_type_data.csv"
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      Export Data
                    </CSVLink>
                  </Button>
                </div>
              </Grid>
            }
          />
          <Modal open={openRegistrationModal} onClose={closeRegistration}>
            <Box p={3} style={{ margin: 'auto', maxWidth: '400px' }}>
              {type === 'add' ? (
                <AddSubType handleClose={closeRegistration} getData={fetchData} />
              ) : (
                <EditSubType handleClose={closeRegistration} editData={editData} getData={fetchData} />
              )}
            </Box>
          </Modal>
          <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
            <Box p={3} style={{ backgroundColor: 'white', margin: 'auto', marginTop: '15%', maxWidth: '400px' }}>
              <Typography>Are you sure you want to delete this prefix?</Typography>
              <Button onClick={handleSave}>Delete</Button>
              <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
            </Box>
          </Modal>
          {loader ? (
            <Loader />
          ) : (
            <>
              <DataTable data={showData} columns={columns} />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default DepartmentSubType;
