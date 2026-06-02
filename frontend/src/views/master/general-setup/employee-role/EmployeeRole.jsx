import React, { useState, useEffect } from 'react'
import Modal from '@mui/material/Modal'
import NoDataPlaceholder from '../../../../component/NoDataPlaceholder'
import ImportExport from '../../../../component/ImportExport'
import Loader from 'component/Loader/Loader'
import { get, put, remove } from 'api/api'
import Breadcrumb from 'component/Breadcrumb'
import DataTable from 'component/DataTable'
import AddRole from './forms/AddRole'
import EditRole from './forms/EditRole'
import { Button, Card, CardContent, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import EditBtn from 'component/buttons/EditBtn'
import DeleteBtn from 'component/buttons/DeleteBtn'

const EmployeeRole = () => {
  const [serverData, setServerData] = useState([])
  const [showData, setShowData] = useState(serverData)
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false)
  //   const toast = useToast();
  const [type, setType] = useState('add')
  const [editData, setEditData] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [data, setData] = useState({})
  const [loader, setLoader] = useState(true)

  const headerFields = ['Employee Role']
  const downheaderFields = ['Employee Role']

  const handleSave = () => {
    if (openDeleteModal) {
      deleteEmployeeRole(data._id)
    }
  }

  // Use the custom hook

  const handleCancel = () => {
    closeRegistration()
  }

  // Use the custom hook

  const openDeleteModalFun = data => {
    setData(data)
    console.log('data', data)
    setOpenDeleteModal(true)
  }

  const openRegistration = () => {
    setOpenRegistrationModal(true)
    setType('add')
  }

  const closeRegistration = () => {
    setOpenRegistrationModal(false)
    setOpenDeleteModal(false)
  }

  const getData = async () => {
    setLoader(true)
    await get('employee-role').then(response => {
      let addsr = []
      response.employeeRole.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 })
      })
      setShowData(addsr)
      setServerData(addsr)
      setLoader(false)
    })
  }

  useEffect(() => {
    getData()
    // eslint-disable-next-line
  }, [])

  const filterData = e => {
    const searchValue = e.target.value.toLowerCase()
    const filteredData = serverData.filter(item => {
      return item.employeeRole.toLowerCase().includes(searchValue)
    })
    let addsr = []
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 })
    })
    setShowData(addsr)
  }

  const handleEdit = item => {
    setType(!type)
    setOpenRegistrationModal(true)
    setEditData(item)
  }

  const deleteEmployeeRole = async id => {
    await remove(`employee-role/${id}`)
      .then(() => {
        getData()
        console.log('id', id)
        // toast({
        //   title: `${data.employeeRole} Employee Role deleted!!`,
        //   status: "success",
        //   duration: 4000,
        //   isClosable: true,
        //   position: "bottom",
        // });
        setOpenDeleteModal(false)
      })
      .catch(error => {
        // toast({
        //   title: "Something went wrong, Please try later!!",
        //   status: "error",
        //   duration: 4000,
        //   isClosable: true,
        //   position: "bottom",
        // });
      })
  }

  const fileValidationHandler = fileData => {
    const newData = []

    fileData.forEach(val => {
      let d = {}
      if (val['Employee Role'] !== '') {
        d = {
          employeeRole: val['Employee Role']
        }
        newData.push(d)
      }
    })

    return newData
  }

  const exportDataHandler = () => {
    let datadd = []
    showData.forEach((val, ind) => {
      datadd.push({
        SN: ind + 1,
        'Employee Role': val.employeeRole?.replace(/,/g, ' ')
      })
    })
    return datadd
  }

  const columns = ['SN', 'Employee Role', 'Action']
  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Employee Role': item.employeeRole,
        Action: (
          <div className='action_btn'>
            <EditBtn onClick={() => handleEdit(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          </div>
        )
      }
    })

  return (
    <>
      <Breadcrumb title='Employee-Role'>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Employee-Role
        </Typography>
      </Breadcrumb>
      <Card>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant='contained' className='global_btn' onClick={openRegistration}>
              + Add
            </Button>

            <div style={{ display: 'flex', justifyContent: '', alignItems: 'center' }}>
              <input
                style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
                className='search_input'
                type='search'
                placeholder='Search...'
                onChange={filterData}
              />
              <ImportExport
                update={getData}
                headerFields={headerFields}
                downheaderFields={downheaderFields}
                name='Employee-role'
                fileValidationHandler={fileValidationHandler}
                exportDataHandler={exportDataHandler}
                api='employee-role/import'
              />
            </div>
          </div>

          {loader ? (
            <Loader />
          ) : (
            <>{showData && showData.length === 0 ? <NoDataPlaceholder /> : <DataTable columns={columns} data={finalData} />}</>
          )}
          <Modal open={openRegistrationModal}>
            {type === 'add' ? (
              <AddRole handleClose={closeRegistration} getData={getData} />
            ) : (
              <EditRole handleClose={closeRegistration} editData={editData} getData={getData} />
            )}
          </Modal>
          <Modal
            open={openDeleteModal}
            onClose={closeRegistration}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <div className='modal'>
              <h2 className='popupHead'>Delete {data.employeeRole} Employee Role?</h2>
              <div style={{ marginTop: '2rem' }}>
                <Button onClick={() => deleteEmployeeRole(data._id)}>delete</Button>
                <Button title='Cancel' onClick={() => closeRegistration()}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </CardContent>
      </Card>
    </>
  )
}

export default EmployeeRole
