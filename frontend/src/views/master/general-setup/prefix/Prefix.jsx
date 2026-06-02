import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardContent, Divider, Grid, Typography, Button, Modal, Box } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { gridSpacing } from 'config.js'
import DataTable from 'component/DataTable'
import Loader from 'component/Loader/Loader'
import AddPrefix from './forms/AddPrefix'
import EditPrefix from './forms/EditPrefix'
import DeleteBtn from 'component/buttons/DeleteBtn'
import EditBtn from 'component/buttons/EditBtn'
import { get, put } from 'api/api'

const Prefix = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false)
  const [type, setType] = useState('add')
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [data, setData] = useState([])
  const [deleteId, setDeleteId] = useState('')
  const [loader, setLoader] = useState(true)

  // Simulate data loading

  const fetchData = async () => {
    await get('prefix')
      .then(result => {
        setData(result.allPrefix)
        setLoader(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async () => {
    if (openDeleteModal) {
      await put(`prefix/delete/${deleteId}`)
      setOpenDeleteModal(false)
      fetchData()
    }
  }

  const handleCancel = () => {
    closeRegistration()
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

  const columns = ['SN', 'Prefix', 'Action']
  const showData = data.map((item, ind) => {
    return {
      SN: ind + 1,
      Prefix: item.prefix,
      Action: (
        <>
          <EditBtn onClick={() => openEditRegistration(item)} />
          <DeleteBtn onClick={() => openDeleteModalFun(item._id)} />
        </>
      )
    }
  })

  return (
    <>
      <Breadcrumb title='Prefix'>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Prefix
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Button variant='contained' color='primary' onClick={openRegistration}>
                  Add
                </Button> 
              }
            />
            <Divider />
            <Modal open={openRegistrationModal} onClose={closeRegistration}>
              <Box p={3} style={{margin: 'auto', maxWidth: '400px' }}>
                {type === 'add' ? <AddPrefix handleClose={closeRegistration} getData={fetchData} /> : <EditPrefix handleClose={closeRegistration} editData={editData} getData={fetchData} />}
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
              <CardContent style={{ width: '75vw' }}>
                <DataTable data={showData} columns={columns} />
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Prefix
