import React, { useState, useEffect } from 'react'
import { Card, CardHeader, Grid, Typography, Button, Modal, Box } from '@mui/material'
import { gridSpacing } from 'config.js'
import DataTable from 'component/DataTable'
import Loader from 'component/Loader/Loader'
import DeleteBtn from 'component/buttons/DeleteBtn'
import EditBtn from 'component/buttons/EditBtn'
import { get, post, put } from 'api/api'
import AddDepartment from './forms/AddDepartment'
import EditDepartment from './forms/EditDepartment'
import { CSVLink } from 'react-csv'
import Papa from 'papaparse'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import InputField from 'component/Input'
import { saveAs } from 'file-saver'

const Department = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false)
  const [type, setType] = useState('add')
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [data, setData] = useState([])
  const [deleteId, setDeleteId] = useState('')
  const [loader, setLoader] = useState(true)
  const [departmentTypeData, setDepartmentTypeData] = useState([])
  const [departmentSubTypeData, setDepartmentSubTypeData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  let [latestDepartmentCode, setLatestDepartmentCode] = useState('')
  const fetchData = async () => {
    try {
      const result = await get('department-setup')
      setData(result?.data ?? [])
      setFilteredData(result?.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoader(false)
    }
  }

  const fetchDepartmentData = async () => {
    await get('department-type').then(result => {
      setDepartmentTypeData(result.data || [])
    })
  }

  const fetchDepartmentSubTypeData = async () => {
    await get('department-sub-type').then(result => {
      setDepartmentSubTypeData(result.data)
    })
  }

  const fetchLatestDepartmentCode = async () => {
    const response = await get('department-setup/generate/departmentCode')
    setLatestDepartmentCode(response.newDepartmentCode ? response.newDepartmentCode : 0)
  }

  useEffect(() => {
    fetchData()
    fetchDepartmentData()
    fetchDepartmentSubTypeData()
    fetchLatestDepartmentCode()
  }, [])

  const handleDelete = async () => {
    if (openDeleteModal && deleteId) {
      try {
        await put(`department-setup/delete/${deleteId}`)
        fetchData()
      } catch (err) {
        console.error(err)
      } finally {
        setOpenDeleteModal(false)
      }
    }
  }

  const openDeleteModalFun = id => {
    setDeleteId(id)
    setOpenDeleteModal(true)
  }

  const openRegistration = () => {
    setOpenRegistrationModal(true)
    setType('add')
    setEditData({})
  }

  const openEditRegistration = item => {
    setType('edit')
    setOpenRegistrationModal(true)
    setEditData(item)
  }

  const closeRegistration = () => {
    setOpenRegistrationModal(false)
    setOpenDeleteModal(false)
  }

  // Search Function
  const onSearch = value => {
    const filteredData = data?.filter(item => {
      return (
        item?.departmentType?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.departmentBranch?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.departmentName?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.departmentSubType?.toLowerCase()?.includes(value?.toLowerCase())
      )
    })

    setFilteredData(filteredData)
  }

  // Prepare data for DataTable
  const showData = filteredData?.map((item, index) => {
    let departmentFunctions = ''
    Object.entries(item.departmentFunction || {}).forEach(([key, value]) => {
      if (value) {
        departmentFunctions += (departmentFunctions ? ', ' : '') + key.replace('is', 'is ')
      }
    })

    return {
      SN: index + 1,
      'Department Type': item.departmentType,
      'Department Subtype': item.departmentSubType,
      'Department Branch': item.departmentBranch,
      'Department Name': item.departmentName,
      'Department Code': item.departmentCode,
      'Service Ledger': <p style={{ width: '150px' }}>{item.serviceLedger}</p>,
      'Department Function': <p style={{ width: '230px' }}>{departmentFunctions}</p>,
      Action: (
        <>
          <EditBtn onClick={() => openEditRegistration(item)} />
          <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
        </>
      )
    }
  })

  const columns = [
    'SN',
    'Department Type',
    'Department Subtype',
    'Department Branch',
    'Department Name',
    'Department Code',
    'Service Ledger',
    'Department Function',
    'Action'
  ]

  // import file logic

  const [processedData, setProcessedData] = useState([])
  const [isDataProcessed, setIsDataProcessed] = useState(false)
  const [isFileSelected, setIsFileSelected] = useState(false)

  const handleFileUpload = event => {
    const file = event.target.files[0]
    if (!file) return
    const fileExtension = file.name.split('.').pop().toLowerCase()

    if (fileExtension === 'csv') {
      setIsFileSelected(true)
      setIsDataProcessed(false)
      parseCsvFile(file)
    } else {
      toast.error('Unsupported file type. Please upload a .csv file.')
      setIsFileSelected(false)
    }
    event.target.value = ''
  }

  // Mandatory fields
  const expectedKeys = ['Department Type', 'Department Sub-Type', 'Department Name']

  const parseCsvFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
  
      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data; // Array format of CSV data
          let latestDepCode = parseInt(latestDepartmentCode, 10); // Convert to integer for incrementing
          if (data.length === 0) {
            toast.error('No data found in the CSV file.');
            return;
          }
  
          // Get raw column names (keys)
          const rawColumnNames = Object.keys(data[0]);
  
          // Trim extra spaces from column names
          const trimmedColumnNames = rawColumnNames.map((key) => key.trim());
  
          // Validate that the expected keys are present
          const isValid = expectedKeys.every((expectedKey) =>
            trimmedColumnNames.includes(expectedKey)
          );
  
          if (!isValid) {
            toast.error('Invalid CSV format. Please ensure the column names are correct.');
            console.error('Invalid keys:', trimmedColumnNames);
            return;
          }
  
          // Process the data
          let dataToSend = [];
          data.forEach((item) => {
            const departmentTypeCheck = departmentTypeData.find(
              (departmentType) => departmentType.departmentTypeName.trim() === item['Department Type'].trim()
            );
  
            if (!departmentTypeCheck) {
              toast.error(`${item['Department Type']} is not found in Department Type Master`);
              return;
            }
  
            const departmentSubTypeCheck = departmentSubTypeData.find(
              (departmentSubType) => departmentSubType.departmentSubTypeName.trim() === item['Department Sub-Type'].trim()
            );
  
            if (!departmentSubTypeCheck) {
              toast.error(`${item['Department Sub-Type']} is not a found in Department Sub Type master`);
              return;
            }
  
            const departmentBranch = item['Department Branch']?.trim();
            // if (departmentBranch !== 'Medical' && departmentBranch !== 'Surgical') {
            //   toast.error(`Department Branch : ${departmentBranch} is incorrect`);
            //   return;
            // }
  
            const departmentName = item['Department Name']?.trim();
            const serviceLedger = item['Service Ledger']?.trim();
  
            // if (serviceLedger !== 'Laboratory' && serviceLedger !== 'General Surgery') {
            //   toast.error(`Service Ledger : ${serviceLedger} is incorrect`);
            //   return;
            // }
  
            const departmentFunctionString = item['Department Function']?.trim();
            const departmentFunction = parseDepartmentFunction(departmentFunctionString);
  
            if (!departmentFunction) {
              toast.error(`Department Functions are incorrect`);
              return;
            }
  
            // Increment department code with each item processed
            latestDepCode++;
  
            dataToSend.push({
              departmentType: item['Department Type'].trim(),
              departmentSubType: item['Department Sub-Type'].trim(),
              departmentBranch: departmentBranch,
              departmentName: departmentName,
              departmentCode: latestDepCode.toString().padStart(6, '0'), // Incremented department code
              serviceLedger: serviceLedger,
              departmentFunction: departmentFunction,
              status: 'active',
            });
          });
  
          console.log('Processed data:', dataToSend);
  
          setProcessedData(dataToSend);
          setIsDataProcessed(true);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast.error('Failed to parse the CSV file.');
        },
      });
    };
  
    reader.readAsText(file);
  };
  
  
  const parseDepartmentFunction = (departmentFunctionString) => {
    // Initialize all keys as false
    const departmentFunction = {
      isLab: false,
      isPharmacy: false,
      isSpeciality: false,
      isRadiology: false,
      Other: false,
    };
  
    // If the string is empty or undefined, return the default object
    if (!departmentFunctionString || departmentFunctionString.trim() === '') {
      return departmentFunction;
    }
  
    // Map function strings to the correct keys
    departmentFunctionString.split(',').forEach((func) => {
      switch (func.trim().toLowerCase()) {
        case 'lab':
          departmentFunction.isLab = true;
          break;
        case 'pharmacy':
          departmentFunction.isPharmacy = true;
          break;
        case 'speciality':
          departmentFunction.isSpeciality = true;
          break;
        case 'radiology':
          departmentFunction.isRadiology = true;
          break;
        case 'other':
          departmentFunction.Other = true;
          break;
        default:
          console.error(`Unknown department function: ${func}`);
      }
    });
  
    return departmentFunction;
  };
  

  const submitProcessedData = async () => {
    try {
      const result = await post('department-setup/import', { processedData })
      console.log(result)

      if (result.status === true) {
        toast.success(result.message)
        fetchData()
        setIsFileSelected(false)
        setProcessedData([])
        setIsDataProcessed(false)
      } else if (result.status === false) {
        toast.error(result.message)
        setIsFileSelected(false)
      }
    } catch (err) {
      console.error('Error submitting data:', err)
      toast.error('An error occurred while submitting the data.')
      setIsFileSelected(false)
    }
  }

  console.log('ISFILE SELECTED', isFileSelected)
  //import file logic ends here



  /* -------------------------------------------------------------------------------------------- */

  //export file logic

  // Headers for CSV Export
  const csvHeaders = [
    { label: 'SN', key: 'SN' },
    { label: 'Department Type', key: 'departmentType' },
    { label: 'Department Sub-Type', key: 'departmentSubType' },
    { label: 'Department Branch', key: 'departmentBranch' },
    { label: 'Department Name', key: 'departmentName' },
    { label: 'Service Ledger', key: 'serviceLedger' },
    { label: 'Department Function', key: 'departmentFunction' }
  ]

  const transformedDataForExport = data.map((item, ind) => ({
    SN: ind + 1,
    departmentType: item.departmentType,
    departmentSubType: item.departmentSubType,
    departmentBranch: item.departmentBranch,
    departmentName: item.departmentName,
    serviceLedger: item?.serviceLedger,
    departmentFunction: Object.entries(item.departmentFunction)
      .filter(([key, value]) => value)
      .map(([key]) => (key.includes('is') ? key.toString().slice(2) : key))
      .join(', ')
  }))
  //export file logic ends here


 /* -------------------------------------------------------------------------------------------- */

  //logic for sample

  const headers = ['Department Type', 'Department Sub-Type', 'Department Branch', 'Department Name', 'Service Ledger']
  const sampleData = [
    {
      'Department Type': '',
      'Department Sub-Type': '',
      'Department Branch': '',
      'Department Name': '',
      'Service Ledger': ''
    }
  ]

  const generateSampleCsv = () => {
    const csvHeaders = headers.join(',') + '\n'
    const csvRows = sampleData.map(row => headers.map(header => row[header] || '').join(','))
    const csvContent = csvHeaders + csvRows.join('\n')
    return csvContent
  }

  // Download CSV function
  const downloadSampleCsv = () => {
    const csvContent = generateSampleCsv()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'Sample_Department_Data.csv')
  }

   /* -------------------------------------------------------------------------------------------- */
  console.log(latestDepartmentCode)
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Grid container alignItems='center' justifyContent='space-between'>
                <div>
                  <Button variant='contained' color='primary' onClick={openRegistration}>
                    Add Department
                  </Button>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <InputField name='search' type='search' placeholder='Search...' onChange={onSearch} />
                  <Button
                    onClick={downloadSampleCsv}
                    variant='contained'
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #FF512F 0%, #F09819 51%, #FF512F 100%)',
                      color: '#fff'
                    }}
                  >
                    Sample
                  </Button>
                  <Button variant='outlined' component='label'>
                    Select File
                    <input type='file' accept='.csv' hidden onChange={handleFileUpload} />
                  </Button>

                  {isFileSelected && (
                    <Button
                      variant='contained'
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

                  <Button variant='contained' style={{ backgroundColor: '#008000' }}>
                    <CSVLink
                      data={transformedDataForExport}
                      headers={csvHeaders}
                      filename='department_setup_data.csv'
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
            <Box>
              {type === 'add' ? (
                <AddDepartment handleClose={closeRegistration} getData={fetchData} />
              ) : (
                <EditDepartment handleClose={closeRegistration} editdata={editData} getData={fetchData} />
              )}
            </Box>
          </Modal>

          <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
            <Box sx={{ padding: 3, backgroundColor: 'white', margin: 'auto', marginTop: '15%', maxWidth: 400 }}>
              <Typography>Are you sure you want to delete this department?</Typography>
              <Box mt={2}>
                <Button variant='contained' color='error' onClick={handleDelete} sx={{ marginRight: 1 }}>
                  Delete
                </Button>
                <Button variant='outlined' onClick={() => setOpenDeleteModal(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>

          {loader ? (
            <Loader />
          ) : (
            <>
              <DataTable data={showData} columns={columns} />
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default Department
