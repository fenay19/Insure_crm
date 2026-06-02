import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Collapse,
  IconButton,
  TableContainer,
  Paper
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Loader from 'component/Loader/Loader'
import AddFirstLevelData from './InvestigationMasterForms/firstLevelData/AddFirstLevelData'
import EditFirstLevelData from './InvestigationMasterForms/firstLevelData/EditFirstLevelData'
import AddSecondLevelNestedData from './InvestigationMasterForms/secondLevelNestedData/AddSecondLevelNestedData'
import DeleteBtn from 'component/buttons/DeleteBtn'
import EditBtn from 'component/buttons/EditBtn'
import AddBtn from 'component/buttons/AddBtn'
import { get, put } from 'api/api'

import SecondLevelNestedTable from './InvestigationMasterForms/secondLevelNestedData/SecondLevelNestedTable'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const InvestigationMaster = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false)
  const [type, setType] = useState('add')
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [editData, setEditData] = useState({})
  const [data, setData] = useState([])
  const [deleteId, setDeleteId] = useState('')
  const [loader, setLoader] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [openParameterModal, setOpenParameterModal] = useState(false)
  const [selectedInvestigation, setSelectedInvestigation] = useState(null)

  const fetchData = async () => {
    try {
      const response = await get('investigation-pathology-master')
      setData(response.investigation)
    } catch (error) {
      console.error(error)
    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async () => {
    if (openDeleteModal) {
      await put(`investigation-pathology-master/delete/${deleteId}`).then(response => toast.success(response.msg))
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

  const toggleRowExpansion = index => {
    setExpanded(expanded === index ? null : index)
  }

  const openAddParameterModal = investigation => {
    setSelectedInvestigation(investigation)
    setOpenParameterModal(true)
  }

  const closeParameterModal = () => {
    setOpenParameterModal(false)
    setSelectedInvestigation(null)
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Button variant='contained' color='primary' onClick={openRegistration}>
                  Add Test
                </Button>
              }
            />
            <Divider />
            <Modal open={openRegistrationModal} onClose={closeRegistration}>
              <Box
                style={{
                  backgroundColor: 'white',
                  padding: '50px',
                  margin: 'auto',
                  marginTop: '5%',
                  maxWidth: '900px',
                  height: '500px',
                  overflowY: 'auto'
                }}
              >
                {type === 'add' ? (
                  <AddFirstLevelData handleClose={closeRegistration} getData={fetchData} />
                ) : (
                  <EditFirstLevelData handleClose={closeRegistration} editData={editData} getData={fetchData} />
                )}
              </Box>
            </Modal>
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box
                p={3}
                sx={{
                  backgroundColor: 'white',
                  padding: '20px',
                  margin: 'auto',
                  marginTop: '15%',
                  maxWidth: '400px',
                  textAlign: 'center'
                }}
              >
                <Typography variant='h6'>Confirm Deletion</Typography>
                <Typography variant='body1' mt={2}>
                  Are you sure you want to delete this Test?
                </Typography>
                <Box mt={3} display='flex' justifyContent='space-around'>
                  <Button variant='contained' color='error' onClick={handleSave}>
                    Delete
                  </Button>
                  <Button variant='outlined' onClick={() => setOpenDeleteModal(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Modal>

            <Modal
              open={openParameterModal}
              onClose={closeParameterModal}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
              s
            >
              <Box
                sx={{
                  backgroundColor: 'white',
                  padding: '50px',
                  margin: 'auto',
                  marginTop: '5%',
                  maxWidth: '900px',
                  height: '600px',
                  overflowY: 'auto'
                }}
              >
                <AddSecondLevelNestedData
                  investigationData={selectedInvestigation ? selectedInvestigation : null}
                  handleClose={closeParameterModal}
                  fetchData={fetchData}
                />
              </Box>
            </Modal>
            {loader ? (
              <Loader />
            ) : (
              <CardContent>
                <TableContainer component={Paper}>
                  <Table aria-label='simple table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>{''}</TableCell>
                        <TableCell>
                          <strong>Sr.No</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Test Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Test Code</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Department</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Machine</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Specimen</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Unit</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Formula</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Test Type</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Description</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Standard Range</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Actions</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((investigation, index) => (
                        <React.Fragment key={index}>
                          <TableRow hover>
                            <TableCell>
                              <IconButton onClick={() => toggleRowExpansion(index)}>
                                <ExpandMoreIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{investigation.testName}</TableCell>
                            <TableCell>{investigation.testCode}</TableCell>
                            <TableCell>{investigation.department}</TableCell>
                            <TableCell>{investigation.machineName}</TableCell>
                            <TableCell>{investigation.specimen}</TableCell>
                            <TableCell>{investigation.unit}</TableCell>
                            <TableCell>{investigation.formula}</TableCell>
                            <TableCell>{investigation.testType}</TableCell>
                            <TableCell>{investigation.description || 'N/A'}</TableCell>
                            <TableCell>
                              {investigation.testDetail.map((detail, idx) => (
                                <div key={idx} style={{ marginBottom: '5px' }}>
                                  <strong>{idx + 1}. </strong>
                                  {detail.minTestRange} - {detail.maxTestRange} {detail.gender} (Age: {detail.ageRange})
                                </div>
                              ))}
                            </TableCell>
                            <TableCell>
                              <Box display='flex' gap={1} p={0}>
                                <Button onClick={() => openAddParameterModal(investigation)} style={{ minWidth: 0, padding: 0 }}>
                                  <AddBtn />
                                </Button>
                                <Button onClick={() => openEditRegistration(investigation)} style={{ minWidth: 0, padding: 0 }}>
                                  <EditBtn />
                                </Button>
                                <Button onClick={() => openDeleteModalFun(investigation._id)} style={{ minWidth: 0, padding: 0 }}>
                                  <DeleteBtn />
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={11}>
                              <Collapse in={expanded === index} timeout='auto' unmountOnExit>
                                <Box>
                                  <SecondLevelNestedTable
                                    parameters={investigation.parameters}
                                    fetchData={fetchData}
                                    investigation={investigation}
                                  />
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  )
}

export default InvestigationMaster
