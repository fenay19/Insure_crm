import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, Divider, Grid, Typography, Button, Modal, Box, TextField } from '@mui/material'
import { gridSpacing } from 'config.js'
import DataTable from 'component/DataTable'
import Loader from 'component/Loader/Loader'
import AddUnit from './unitMasterForms/AddUnit'
import EditUnit from './unitMasterForms/EditUnit'
import DeleteBtn from 'component/buttons/DeleteBtn'
import EditBtn from 'component/buttons/EditBtn'
import { get, put } from 'api/api'
import { ToastContainer, toast } from 'react-toastify'
import ImportExport from 'component/ImportExport'

const Unit = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false)
  const [type, setType] = useState('add')
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [loader, setLoader] = useState(true)

  const headerFields = ['Unit']
  const downheaderFields = ['Unit']

  const fetchData = async () => {
    setLoader(true)
    await get('unit-pathology-master')
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
    const filtered = data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredData(filtered)
  }, [searchTerm, data])

  const handleSave = async () => {
    if (openDeleteModal) {
      await put(`unit-pathology-master/delete/${deleteId}`).then(response => {
        toast.error(response.msg)
      })
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

  // Validate imported data
  const fileValidationHandler = fileData => {
    const newData = []

    fileData.forEach(val => {
      if (val['Unit'] && val['Unit'].trim() !== '') {
        newData.push({ name: val['Unit'] })
      }
    })

    return newData
  }

  // Prepare data for export
  const exportDataHandler = () => {
    return filteredData.map((val, ind) => ({
      SN: ind + 1,
      Unit: val.name?.trim()
    }))
  }

  const columns = ['SN', 'Unit', 'Action']
  const showData = filteredData.map((item, ind) => {
    return {
      SN: ind + 1,
      Unit: item.name,
      Action: (
        <Box display='flex' gap={1} p={0}>
          <EditBtn onClick={() => openEditRegistration(item)} />
          <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
        </Box>
      )
    }
  })

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
                          size='small'
                          label='Search'
                          variant='outlined'
                          placeholder='Search Unit'
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                      </Grid>
                      <Grid item>
                        <ImportExport
                          update={fetchData}
                          headerFields={headerFields}
                          downheaderFields={downheaderFields}
                          name='Unit'
                          fileValidationHandler={fileValidationHandler}
                          exportDataHandler={exportDataHandler}
                          api='unit-pathology-master/import'
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              }
            />
            <Divider />
            <Modal open={openRegistrationModal} onClose={closeRegistration}>
              <Box style={{ backgroundColor: 'white', margin: 'auto', marginTop: '10%', maxWidth: '400px' }}>
                {type === 'add' ? (
                  <AddUnit handleClose={closeRegistration} getData={fetchData} />
                ) : (
                  <EditUnit handleClose={closeRegistration} editData={editData} getData={fetchData} />
                )}
              </Box>
            </Modal>
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box p={3} style={{ backgroundColor: 'white', margin: 'auto', marginTop: '15%', maxWidth: '400px' }}>
                <Typography>Are you sure you want to delete this Unit?</Typography>
                <Button onClick={handleSave}>Delete</Button>
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
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default Unit
