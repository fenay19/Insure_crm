import React, { useState, useEffect } from 'react';
import { CardHeader, Button, Grid, Modal, Box, Typography } from '@mui/material';
import DataTable from 'component/DataTable';
import Loader from 'component/Loader/Loader';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';
import { get, post, put } from 'api/api';
import AddType from './forms/AddType';
import EditType from './forms/EditType';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputField from 'component/Input';

const DepartmentType = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [loader, setLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch department types from the server
  const fetchData = async () => {
    setLoader(true);
    try {
      const result = await get('department-type');
      setData(result?.data ?? []);
      setFilteredData(result?.data ?? []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Delete functionality
  const handleSave = async () => {
    try {
      if (openDeleteModal) {
        await put(`department-type/delete/${deleteId}`);
        setOpenDeleteModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  /* ------------------------------------------------------------------------------------------------- */
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
  const expectedKeys = ['Department Type'];

  const parseCsvFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data; // Array format of CSV data

          if (data.length === 0) {
            toast.error('No data found in the CSV file.');
            return;
          }

          // Get raw column names (keys)
          const rawColumnNames = Object.keys(data[0]);

          // Trim extra spaces from column names
          const trimmedColumnNames = rawColumnNames.map((key) => key.trim());

          // Validate that the expected keys are present
          const isValid = expectedKeys.every((expectedKey) => trimmedColumnNames.includes(expectedKey));

          if (!isValid) {
            toast.error('Invalid CSV format. Please ensure the column names are correct.');
            console.error('Invalid keys:', trimmedColumnNames);
            return;
          }

          // Process the data (trim the values and format them as required)
          let dataToSend = [];
          data.forEach((item) => {
            dataToSend.push({
              departmentTypeName: item['Department Type'].trim()
            });
          });

          console.log('Processed data:', dataToSend);
          // Store the processed data in state
          setProcessedData(dataToSend);
          setIsDataProcessed(true); // Set flag indicating data is ready for submission
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
      const result = await post('department-type/import', { processedData });
      console.log(result);

      if (result.status === true) {
        toast.success(result.message);
        fetchData();
        setIsFileSelected(false); // Reset file selection
        setProcessedData([]); // Clear processed data
        setIsDataProcessed(false); // Reset data processed flag
      } else if (result.status === false) {
        toast.error(result.message);
        setIsFileSelected(false); // Hide import button if submission fails
      }
    } catch (err) {
      console.error('Error submitting data:', err);
      toast.error('An error occurred while submitting the data.');
      setIsFileSelected(false); // Reset if there's an error
    }
  };

  /* import function ends here */

  /*------------------------------------------------------------------------------------------------------------- */

  // Close Modal Handlers
  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
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

  const onSearch = (value) => {
    const filteredData = data?.filter((item) => {
      return item?.departmentTypeName?.toLowerCase()?.includes(value?.toLowerCase());
    });
    setFilteredData(filteredData);
  };

  // Data and Columns for Table
  const columns = ['SN', 'Department Type', 'Action'];
  const showData = filteredData?.map((item, ind) => ({
    SN: ind + 1,
    'Department Type': item.departmentTypeName,
    Action: (
      <>
        <EditBtn onClick={() => openEditRegistration(item)} />
        <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
      </>
    )
  }));

  // Headers for CSV Export
  const csvHeaders = [
    { label: 'SN', key: 'SN' },
    { label: 'Department Type', key: 'departmentTypeName' }
  ];

  const transformedDataForExport = data.map((item, ind) => ({
    SN: ind + 1,
    departmentTypeName: item.departmentTypeName
  }));

  // Sample column names
  const sampleHeaders = ['Department Type'];

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CardHeader
            title={
              <Grid container alignItems="center" justifyContent="space-between">
                {/* Left Side - Add Button */}
                {/* Add Btn */}
                <Button variant="contained" color="primary" onClick={openRegistration}>
                  Add
                </Button>

                {/* Right Side - Import, Sample, Submit, Export Buttons */}
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
                      data={[{ 'Department Type': '' }]}
                      headers={[{ label: 'Department Type', key: 'Department Type' }]}
                      filename="sample_department_type.csv"
                      style={{ textDecoration: 'none', color: '#fff' }}
                    >
                      Sample
                    </CSVLink>
                  </Button>
                  <Button variant="outlined" component="label">
                    Select file
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
                      filename="department_data.csv"
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
                <AddType handleClose={closeRegistration} getData={fetchData} />
              ) : (
                <EditType handleClose={closeRegistration} editData={editData} getData={fetchData} />
              )}
            </Box>
          </Modal>
          <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
            <Box
              p={3}
              style={{
                backgroundColor: 'white',
                margin: 'auto',
                maxWidth: '400px',
                top: '30%',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Are you sure you want to delete?
              </Typography>
              <Button variant="contained" color="secondary" onClick={handleSave}>
                Yes
              </Button>
              <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
                No
              </Button>
            </Box>
          </Modal>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
          <DataTable data={showData} columns={columns} />
          {loader && <Loader />}
        </div>
      </Grid>
    </>
  );
};

export default DepartmentType;
