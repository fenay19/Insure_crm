// import React, { useState, useEffect } from 'react'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
//   TextField,
//   Grid,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   CardContent
// } from '@mui/material'
// import Loader from 'component/Loader/Loader'
// import { get } from 'api/api'
// import TestMasterTableBody from './testMasterForms/TestMasterTableBody'
// import TestMasterAddForm from './testMasterForms/TestMasterAddForm'
// import ImportExport from 'component/ImportExport'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// export default function TestMaster () {
//   const [TestMasterData, setTestMasterData] = useState([])
//   const [filteredData, setFilteredData] = useState([])
//   const [loader, setLoader] = useState(true)
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(10)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [isAddTestMasterModalOpen, setIsAddTestMasterModalOpen] = useState(false)
//   const [nextTestCode, setNextTestCode] = useState([])

//   const fetchData = async () => {
//     try {
//       const response = await get('investigation-pathology-master')
//       setTestMasterData(response.investigations || [])
//       setFilteredData(response.investigations || [])
//       setNextTestCode(response.nextTestCode)
//     } catch (error) {
//       console.error(error)
//     } finally {
//       setLoader(false)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//   }, [])

//   //fetching masters data

//   const [departments, setAllDepartments] = useState([])
//   const [machines, setAllMachine] = useState([])
//   const [specimens, setAllSpecimen] = useState([])
//   const [units, setAllUnits] = useState([])
//   const [serviceAndBillGroup, setAllServiceAndBillGroup] = useState([])

//   const fetchMastersData = async () => {
//     try {
//       const [departmentsData, machinesData, unitsData, specimensData, serviceBillGroupData] = await Promise.all([
//         get('department-setup'),
//         get('machine-pathology-master'),
//         get('unit-pathology-master'),
//         get('specimen-pathology-master'),
//         get('billgroup-master')
//       ])
//       setAllDepartments(departmentsData.data)
//       setAllMachine(machinesData.data)
//       setAllSpecimen(specimensData.specimen)
//       setAllUnits(unitsData.data)
//       setAllServiceAndBillGroup(serviceBillGroupData.data)
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     } finally {
//     }
//   }

//   useEffect(() => {
//     fetchMastersData()
//   }, [])

//   useEffect(() => {
//     const lowercasedSearchTerm = searchTerm.toLowerCase()
//     const filtered = TestMasterData.filter(
//       test =>
//         test.testName.toLowerCase().includes(lowercasedSearchTerm) ||
//         test.testCode.toLowerCase().includes(lowercasedSearchTerm) ||
//         test.department.toLowerCase().includes(lowercasedSearchTerm)
//     )
//     setFilteredData(filtered)
//   }, [searchTerm, TestMasterData])

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage)
//   }

//   const handleChangeRowsPerPage = event => {
//     setRowsPerPage(parseInt(event.target.value, 10))
//     setPage(0)
//   }

//   const openModalAddTestMaster = () => {
//     setIsAddTestMasterModalOpen(true)
//   }

//   const closeModalAddTestMaster = () => {
//     setIsAddTestMasterModalOpen(false)
//   }

//   //logic for import export
//   const headerFields = ['Test Name', 'Department', 'Sub Department', 'Service/Bill Group', 'Machine Name', 'Specimen', 'Unit', 'Formula', 'Test Type', 'Note', 'Min Test Range', 'Max Test Range', 'Gender', 'Min Age', 'Max Age', 'Duration']
//   const downheaderFields = [
//     'Test Name',
//     'Test Code',
//     'Department',
//     'Service/Bill Group',
//     'Machine Name',
//     'Specimen',
//     'Unit',
//     'Formula',
//     'Description'
//   ]

//   const fileValidationHandler = (fileData) => {
//     const validatedData = [];
//     let currentTestCode = parseInt(nextTestCode, 10);

//     fileData.forEach((val, index) => {
//       // Validate required fields
//       if (
//         val['Test Name']?.trim() &&
//         val['Department']?.trim() &&
//         val['Machine Name']?.trim() &&
//         val['Unit']?.trim() &&
//         val['Specimen']?.trim() &&
//         val['Service/Bill Group']?.trim()
//       ) {
//         try {
//           // Find matching IDs
//           const { _id: departmentId } = departments.find(
//             (item) => item?.departmentName?.trim() === val['Department']?.trim()
//           ) || {};
//           const { _id: machineId } = machines.find(
//             (item) => item?.machineName?.trim() === val['Machine Name']?.trim()
//           ) || {};
//           const { _id: unitId } = units.find(
//             (item) => item?.name?.trim() === val['Unit'].trim()
//           ) || {};
//           const { _id: specimenId } = specimens.find(
//             (item) => item?.name?.trim() === val['Specimen']?.trim()
//           ) || {};
//           const { _id: serviceBillGroupId } = serviceAndBillGroup.find(
//             (item) => item?.billGroupName?.trim() === val['Service/Bill Group']?.trim()
//           ) || {};

//           // Construct test detail
//           const testDetail = {
//             minTestRange: val['Min Test Range']?.replace(/[^\d.]/g, '')?.trim() || '',
//             maxTestRange: val['Max Test Range']?.replace(/[^\d.]/g, '')?.trim() || '',
//             gender: val['Gender']?.trim() || '',
//             minAge : val['Min Age']?.trim() || '',
//             maxAge : val['Max Age']?.trim() || '',
//             duration : val['Duration']?.trim() || '',
//             note : val['Note']?.trim() || '',
//           };

//           const formattedTestCode = currentTestCode.toString().padStart(4, '0');

//           // Check if test name already exists
//           const existingTestIndex = validatedData.findIndex(
//             (test) => test.testName.trim() === val['Test Name'].trim()
//           );

//           if (existingTestIndex !== -1) {
//             // Append testDetail to existing test
//             validatedData[existingTestIndex].testDetail.push(testDetail);
//           } else {
//             // Create a new test entry
//             validatedData.push({
//               testName: val['Test Name'].trim(),
//               department: val['Department'].trim(),
//               departmentId: departmentId || null,
//               subDepartment : val['Sub Department'].trim() || '',
//               billGroup: val['Service/Bill Group'].trim(),
//               billGroupId: serviceBillGroupId || null,
//               machineName: val['Machine Name'].trim(),
//               machineId: machineId || null,
//               unit: val['Unit'].trim(),
//               unitId: unitId || null,
//               specimen: val['Specimen'].trim(),
//               specimenId: specimenId || null,
//               formula: val['Formula']?.trim() || 'NA',
//               testType: val['Test Type']?.trim() || 'Unknown',
//               testCode: formattedTestCode,
//               testDetail: [testDetail],
//             });

//             currentTestCode += 1; // Increment test code only for new tests
//           }
//         } catch (error) {
//           console.error(`Error processing record at index ${index}:`, error.message);
//         }
//       } else {
//         console.error(`Missing required fields in record at index ${index}:`, val);
//       }
//     });

//     return validatedData;
//   };

//   // Prepare data for export
//   const exportDataHandler = () => {
//     return filteredData.map((val, ind) => ({
//       SN: ind + 1,
//       'Test Name': val.testName,
//       'Test Code': val.testCode,
//       Department: val.department,
//       'Service/Bill Group': val.billGroup,
//       'Machine Name': val.machineName,
//       Unit: val.unit,
//       Specimen: val.specimen,
//       Formula: val.formula,
//       Description: val.description
//     }))
//   }

//   if (loader) return <Loader />

//   return (
//     <Paper>
//       <Grid container justifyContent='space-between' alignItems='center' padding={2}>
//         {/* Add Button */}
//         <Grid item>
//           <Button variant='contained' color='primary' onClick={openModalAddTestMaster}>
//             Add
//           </Button>
//         </Grid>

//         {/* Search and Import/Export */}
//         <Grid item>
//           <Grid container alignItems='center' spacing={2}>
//             <Grid item>
//               <TextField
//                 label='Search'
//                 variant='outlined'
//                 size='small'
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//                 placeholder='Search by Name, Code, or Department'
//               />
//             </Grid>
//             <Grid item>
//               <ImportExport
//                 update={fetchData}
//                 headerFields={headerFields}
//                 downheaderFields={downheaderFields}
//                 name='Tests'
//                 fileValidationHandler={fileValidationHandler}
//                 exportDataHandler={exportDataHandler}
//                 api='investigation-pathology-master/import'
//               />
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>

//       <CardContent style={{ width: '100%' }}>
//         <TableContainer>
//           <Table stickyHeader aria-label='collapsible table'>
//             <TableHead sx={{ bgcolor: 'rgb(8,155,171)' }}>
//               <TableRow>
//                 <TableCell >Sr.no</TableCell>
//                 <TableCell >Test Name</TableCell>
//                 <TableCell >Test Code</TableCell>
//                 <TableCell >Department</TableCell>
//                 <TableCell >Service/Bill group</TableCell>
//                 <TableCell >Machine</TableCell>
//                 <TableCell >Specimen</TableCell>
//                 <TableCell >Unit</TableCell>
//                 <TableCell >Formula</TableCell>
//                 <TableCell >Test Type</TableCell>
//                 <TableCell >Description</TableCell>
//                 <TableCell >Standard Range</TableCell>
//                 <TableCell >Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               <TestMasterTableBody
//                 TestMasterData={filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
//                 fetchData={fetchData}
//               />
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </CardContent>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 15, 20]}
//         component='div'
//         count={filteredData.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       {/* Modal for Add Form */}
//       <Dialog maxWidth='lg' open={isAddTestMasterModalOpen} onClose={closeModalAddTestMaster}>
//         <DialogContent>
//           <TestMasterAddForm handleClose={closeModalAddTestMaster} fetchData={fetchData} nextTestCode={nextTestCode} />
//         </DialogContent>
//         <DialogActions></DialogActions>
//       </Dialog>

//       <ToastContainer />
//     </Paper>
//   )
// }

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  CardContent
} from '@mui/material';
import Loader from 'component/Loader/Loader';
import { get } from 'api/api';
import TestMasterTableBody from './testMasterForms/TestMasterTableBody';
import TestMasterAddForm from './testMasterForms/TestMasterAddForm';
import ImportExport from 'component/ImportExport';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TestMaster() {
  const [TestMasterData, setTestMasterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTestMasterModalOpen, setIsAddTestMasterModalOpen] = useState(false);
  const [nextTestCode, setNextTestCode] = useState([]);

  const fetchData = async () => {
    try {
      const response = await get('investigation-pathology-master');
      setTestMasterData(response.investigations || []);
      setFilteredData(response.investigations || []);
      setNextTestCode(response.nextTestCode);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //fetching masters data

  const [departments, setAllDepartments] = useState([]);
  const [machines, setAllMachine] = useState([]);
  const [specimens, setAllSpecimen] = useState([]);
  const [units, setAllUnits] = useState([]);
  const [serviceAndBillGroup, setAllServiceAndBillGroup] = useState([]);

  const fetchMastersData = async () => {
    try {
      const [departmentsData, machinesData, unitsData, specimensData, serviceBillGroupData] = await Promise.all([
        get('department-setup'),
        get('machine-pathology-master'),
        get('unit-pathology-master'),
        get('specimen-pathology-master'),
        get('billgroup-master')
      ]);
      setAllDepartments(departmentsData.data);
      setAllMachine(machinesData.data);
      setAllSpecimen(specimensData.specimen);
      setAllUnits(unitsData.data);
      setAllServiceAndBillGroup(serviceBillGroupData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchMastersData();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = TestMasterData.filter(
      (test) =>
        test.testName.toLowerCase().includes(lowercasedSearchTerm) ||
        test.testCode.toLowerCase().includes(lowercasedSearchTerm) ||
        test.department.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, TestMasterData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openModalAddTestMaster = () => {
    setIsAddTestMasterModalOpen(true);
  };

  const closeModalAddTestMaster = () => {
    setIsAddTestMasterModalOpen(false);
  };

  //logic for import export
  const headerFields = [
    'Test Name',
    'Department',
    'Sub Department',
    'Service/Bill Group',
    'Machine Name',
    'Specimen',
    'Unit',
    'Formula',
    'Test Type',
    'Note',
    'Min Test Range',
    'Max Test Range',
    'Gender',
    'Min Age',
    'Max Age',
    'Duration'
  ];
  const downheaderFields = [
    'Test Name',
    'Test Code',
    'Department',
    'Service/Bill Group',
    'Machine Name',
    'Specimen',
    'Unit',
    'Formula',
    'Description'
  ];

  const fileValidationHandler = (fileData) => {
    const validatedData = [];
    let currentTestCode = parseInt(nextTestCode, 10);

    fileData.forEach((val, index) => {
      // Validate required fields
      if (
        // val['Test Name']?.trim() &&
        // val['Department']?.trim() &&
        // val['Machine Name']?.trim() &&
        // val['Unit']?.trim() &&
        // val['Specimen']?.trim() &&
        // val['Service/Bill Group']?.trim()
        true
      ) {
        try {
          // Find matching IDs
          const { _id: departmentId } = departments.find((item) => item?.departmentName?.trim() === val['Department']?.trim()) || {};
          const { _id: machineId } = machines.find((item) => item?.machineName?.trim() === val['Machine Name']?.trim()) || {};
          const { _id: unitId } = units.find((item) => item?.name?.trim() === val['Unit'].trim()) || {};
          const { _id: specimenId } = specimens.find((item) => item?.name?.trim() === val['Specimen']?.trim()) || {};
          const { _id: serviceBillGroupId } =
            serviceAndBillGroup.find((item) => item?.billGroupName?.trim() === val['Service/Bill Group']?.trim()) || {};

          // Construct test detail
          const testDetail = {
            minTestRange: val['Min Test Range']?.replace(/[^\d.]/g, '')?.trim() || '',
            maxTestRange: val['Max Test Range']?.replace(/[^\d.]/g, '')?.trim() || '',
            gender: val['Gender']?.trim() || '',
            minAge: val['Min Age']?.trim() || '',
            maxAge: val['Max Age']?.trim() || '',
            duration: val['Duration']?.trim() || '',
            note: val['Note']?.trim() || ''
          };

          const formattedTestCode = currentTestCode.toString().padStart(4, '0');

          // Check if test name already exists
          const existingTestIndex = validatedData.findIndex((test) => test.testName.trim() === val['Test Name'].trim());

          if (existingTestIndex !== -1) {
            // Append testDetail to existing test
            validatedData[existingTestIndex].testDetail.push(testDetail);
          } else {
            // Create a new test entry
            validatedData.push({
              testName: val['Test Name'].trim(),
              department: val['Department'].trim(),
              departmentId: departmentId || null,
              subDepartment: val['Sub Department'].trim() || '',
              billGroup: val['Service/Bill Group'].trim(),
              billGroupId: serviceBillGroupId || null,
              machineName: val['Machine Name'].trim(),
              machineId: machineId || null,
              unit: val['Unit'].trim(),
              unitId: unitId || null,
              specimen: val['Specimen'].trim(),
              specimenId: specimenId || null,
              formula: val['Formula']?.trim() || 'NA',
              testType: val['Test Type']?.trim() || 'Unknown',
              testCode: formattedTestCode,
              testDetail: [testDetail]
            });

            currentTestCode += 1; // Increment test code only for new tests
          }
        } catch (error) {
          console.error(`Error processing record at index ${index}:`, error.message);
        }
      } else {
        console.error(`Missing required fields in record at index ${index}:`, val);
      }
    });

    return validatedData;
  };

  // Prepare data for export
  const exportDataHandler = () => {
    return filteredData.map((val, ind) => ({
      SN: ind + 1,
      'Test Name': val.testName,
      'Test Code': val.testCode,
      Department: val.department,
      'Service/Bill Group': val.billGroup,
      'Machine Name': val.machineName,
      Unit: val.unit,
      Specimen: val.specimen,
      Formula: val.formula,
      Description: val.description
    }));
  };

  if (loader) return <Loader />;

  return (
    <Paper>
      <Grid container justifyContent="space-between" alignItems="center" padding={2}>
        {/* Add Button */}
        <Grid item>
          <Button variant="contained" color="primary" onClick={openModalAddTestMaster}>
            Add
          </Button>
        </Grid>

        {/* Search and Import/Export */}
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Name, Code, or Department"
              />
            </Grid>
            <Grid item>
              <ImportExport
                update={fetchData}
                headerFields={headerFields}
                downheaderFields={downheaderFields}
                name="Tests"
                fileValidationHandler={fileValidationHandler}
                exportDataHandler={exportDataHandler}
                api="investigation-pathology-master/import"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <CardContent style={{ width: '100%' }}>
        <TableContainer>
          <Table stickyHeader aria-label="collapsible table">
            <TableHead sx={{ bgcolor: 'rgb(8,155,171)' }}>
              <TableRow>
                <TableCell>Sr.no</TableCell>
                <TableCell>Test Name</TableCell>
                <TableCell>Test Code</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Sub Department</TableCell>
                <TableCell>Service/Bill group</TableCell>
                <TableCell>Machine</TableCell>
                <TableCell>Specimen</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Formula</TableCell>
                <TableCell>Test Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Standard Range</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TestMasterTableBody
                TestMasterData={filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                fetchData={fetchData}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for Add Form */}
      <Dialog maxWidth="lg" open={isAddTestMasterModalOpen} onClose={closeModalAddTestMaster}>
        <DialogContent>
          <TestMasterAddForm handleClose={closeModalAddTestMaster} fetchData={fetchData} nextTestCode={nextTestCode} />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      <ToastContainer />
    </Paper>
  );
}
