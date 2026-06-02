import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, Divider, Grid, Typography, Button, Modal, Box, TextField } from '@mui/material'
import { gridSpacing } from 'config.js'
import DataTable from 'component/DataTable'
import Loader from 'component/Loader/Loader'
import AddMachine from './machineMasterForms/AddMachine'
import EditMachine from './machineMasterForms/EditMachine'
import DeleteBtn from 'component/buttons/DeleteBtn'
import EditBtn from 'component/buttons/EditBtn'
import { get, put } from 'api/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ImportExport from 'component/ImportExport'
const MachineMaster = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false)
  const [type, setType] = useState('add')
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [loader, setLoader] = useState(true)
  const [departments, setAllDepartments] = useState([])

  // Fetch data from the server
  const fetchData = async () => {
    await get('machine-pathology-master')
      .then(result => {
        setData(result.data)
        setFilteredData(result.data)
        setLoader(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    /*department setup master api */
    const fetchDepartments = async () => {
      await get('department-setup').then(response => {
        const dept = response.data.filter(v => v.departmentFunction.isLab === true)
        setAllDepartments(dept)
      })
    }

    fetchDepartments()
  }, [])

  useEffect(() => {
    // Filter data based on the search query
    const lowerCaseQuery = searchQuery.toLowerCase()
    const filtered = data.filter(
      item =>
        item.machineName.toLowerCase().includes(lowerCaseQuery) ||
        item.methodName.toLowerCase().includes(lowerCaseQuery) ||
        item.department.toLowerCase().includes(lowerCaseQuery) ||
        item.make.toLowerCase().includes(lowerCaseQuery) ||
        item.modelNumber.toLowerCase().includes(lowerCaseQuery) ||
        item.serialNumber.toLowerCase().includes(lowerCaseQuery)
    )
    setFilteredData(filtered)
  }, [searchQuery, data])

  const handleSave = async () => {
    if (openDeleteModal) {
      await put(`machine-pathology-master/delete/${deleteId}`).then(response => toast.success('Machine Deleted Successfully'))
      setOpenDeleteModal(false)
      fetchData()
    }
  }

  const openDeleteModalFun = id => {
    setDeleteId(id)
    setOpenDeleteModal(true)
  }

  const openRegistration = () => {
    setOpenRegistrationModal(true)
    setType('add')
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

  const columns = ['SN', 'Machine Name', 'Method Name', 'Department', 'Manufacturer', 'Model Number', 'Serial Number', 'Action']
  const showData = filteredData.map((item, ind) => {
    return {
      SN: ind + 1,
      'Machine Name': item.machineName,
      'Method Name': item.methodName,
      Department: item.department,
      Manufacturer: item.make,
      'Model Number': item.modelNumber,
      'Serial Number': item.serialNumber,
      Action: (
        <Box display='flex' gap={1} p={0}>
          <EditBtn onClick={() => openEditRegistration(item)} />
          <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
        </Box>
      )
    }
  })

  const headerFields = ['Machine Name', 'Method Name', 'Department', 'Manufacturer', 'Model Number', 'Serial Number']
  const fileValidationHandler = fileData => {
    const newData = []

    fileData.forEach(val => {
      let d = {}
      if (
        val['Machine Name'] !== '' &&
        val['Method Name'] !== '' &&
        val['Department'] !== '' &&
        val['Manufacturer'] !== '' &&
        val['Model Number'] !== '' &&
        val['Serial Number'] !== '' &&
        val['Machine Name'] !== undefined &&
        val['Method Name'] !== undefined &&
        val['Department'] !== undefined &&
        val['Manufacturer'] !== undefined &&
        val['Model Number'] !== undefined &&
        val['Serial Number'] !== undefined
      ) {
        let dep = ''
        departments.forEach(v => {
          if (v.departmentName === val['Department']) {
            dep = v._id
          }
        })
        d = {
          machineName: val['Machine Name'],
          departmentId: dep,
          department: val['Department'],
          methodName: val['Method Name'],
          make: val['Manufacturer'],
          modelNumber: val['Model Number'],
          serialNumber: val['Serial Number']
        }

        newData.push(d)
      }
    })
    return newData
  }

  const exportDataHandler = () => {
    let datadd = []
    data.forEach((val, ind) => {
      datadd.push({
        SN: ind + 1,
        'Machine Name': val.machineName.replace(/,/g, ' '),
        'Method Name': val.methodName.replace(/,/g, ' '),
        Department: val.department.replace(/,/g, ' '),
        Manufacturer: val.make.replace(/,/g, ' '),
        'Model Number': val.modelNumber.replace(/,/g, ' '),
        'Serial Number': val.serialNumber.replace(/,/g, ' ')
      })
    })
    return datadd
  }

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container alignItems='center' justifyContent='space-between'>
                  <Grid item>
                    <Button variant='contained' color='primary' onClick={openRegistration}>
                      Add
                    </Button>
                  </Grid>

                  <Grid item>
                    <Grid container alignItems='center' spacing={2}>
                      <Grid item>
                        <TextField
                          variant='outlined'
                          label='Search'
                          size='small'
                          placeholder='Search...'
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                        />
                      </Grid>
                      <Grid item>
                        <ImportExport
                          update={fetchData}
                          headerFields={headerFields}
                          downheaderFields={headerFields}
                          name='Machine'
                          fileValidationHandler={fileValidationHandler}
                          exportDataHandler={exportDataHandler}
                          api='machine-pathology-master/import'
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              }
            />
            <Divider />
            <Modal open={openRegistrationModal} onClose={closeRegistration}>
              <Box style={{ backgroundColor: 'white', margin: 'auto', marginTop: '10%', maxWidth: '500px' }}>
                {type === 'add' ? (
                  <AddMachine handleClose={closeRegistration} getData={fetchData} />
                ) : (
                  <EditMachine handleClose={closeRegistration} editData={editData} getData={fetchData} />
                )}
              </Box>
            </Modal>
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box p={3} style={{ backgroundColor: 'white', margin: 'auto', marginTop: '15%', maxWidth: '400px' }}>
                <Typography>Are you sure you want to delete this machine?</Typography>
                <Button onClick={handleSave}>Delete</Button>
                <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
              </Box>
            </Modal>
            {loader ? (
              <Loader />
            ) : (
              <CardContent style={{ width: '100%' }}>
                <DataTable data={showData} columns={columns} />
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  )
}

export default MachineMaster
