import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, Divider, Grid, Typography, Button, Modal, Box, TextField } from '@mui/material'
import { gridSpacing } from 'config.js'
import DataTable from 'component/DataTable'
import Loader from 'component/Loader/Loader'
import AddListOfCouncil from './forms/AddListOfCouncil'
import EditListOfCouncil from './forms/EditListOfCouncil'
import DeleteBtn from 'component/buttons/DeleteBtn'
import EditBtn from 'component/buttons/EditBtn'
import Breadcrumb from 'component/Breadcrumb'
import { ToastContainer, toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { get, put } from 'api/api'

const ListOfCouncils = () => {
  const [openModal, setOpenModal] = useState(false)
  const [type, setType] = useState('add')
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [loader, setLoader] = useState(true)

  const fetchData = async () => {
    setLoader(true)
    const response = await get('listOfCouncils')
    setData(response.data)
    setFilteredData(response.data)
    setLoader(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const filtered = data.filter(item => item.council.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredData(filtered)
  }, [searchTerm, data])

  const handleSave = async () => {
    if (openDeleteModal) {
      const response = await put(`listOfCouncils/delete/${deleteId}`)
      console.log(response)
      if (response.success === true) {
        toast.error('Council deleted successfully.')
        setOpenDeleteModal(false)
        fetchData()
      }
      else{
        toast.error("something went wrong !")
      }
    }
  }

  const openDeleteModalFun = id => {
    setDeleteId(id)
    setOpenDeleteModal(true)
  }

  const openRegistration = () => {
    setOpenModal(true)
    setType('add')
  }

  const openEditRegistration = item => {
    setType('edit')
    setOpenModal(true)
    setEditData(item)
  }

  const closeModal = () => {
    setOpenModal(false)
    setOpenDeleteModal(false)
  }

  const columns = ['SN', 'Council', 'Action']
  const showData = filteredData.map((item, ind) => ({
    SN: ind + 1,
    Council: item.council,
    Action: (
      <Box display='flex' gap={1} p={0}>
        <EditBtn onClick={() => openEditRegistration(item)} />
        <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
      </Box>
    )
  }))

  return (
    <>
      <Breadcrumb title='List of Councils'>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Councils
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container alignItems='center' justifyContent='space-between'>
                  <Grid item>
                    <Button variant='contained' color='primary' onClick={openRegistration}>
                      Add Council
                    </Button>
                  </Grid>
                  <Grid item>
                    <TextField
                      size='small'
                      label='Search'
                      variant='outlined'
                      placeholder='Search Council'
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </Grid>
                </Grid>
              }
            />
            <Divider />
            <Modal open={openModal} onClose={closeModal}>
              <Box style={{ backgroundColor: 'white', margin: 'auto', marginTop: '10%', maxWidth: '400px' }}>
                {type === 'add' ? (
                  <AddListOfCouncil handleClose={closeModal} getData={fetchData} />
                ) : (
                  <EditListOfCouncil handleClose={closeModal} editData={editData} getData={fetchData} />
                )}
              </Box>
            </Modal>
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box p={3} style={{ backgroundColor: 'white', margin: 'auto', marginTop: '15%', maxWidth: '400px' }}>
                <Typography>Are you sure you want to delete this Council?</Typography>
                <Button onClick={handleSave}>Delete</Button>
                <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
              </Box>
            </Modal>
            {loader ? (
              <Loader />
            ) : (
              <CardContent>
                {filteredData.length > 0 ? (
                  <DataTable data={showData} columns={columns} />
                ) : (
                  <Typography align='center' variant='body1'>
                    No Data Found
                  </Typography>
                )}
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default ListOfCouncils
