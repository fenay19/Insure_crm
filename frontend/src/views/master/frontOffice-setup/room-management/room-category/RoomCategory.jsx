import React, { useState, useEffect } from 'react'
import Modal from '@mui/material/Modal'
import Loader from 'component/Loader/Loader'
import { get, put } from 'api/api'
import Breadcrumb from 'component/Breadcrumb'
import DataTable from 'component/DataTable'
import { Button, Card, CardContent, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import EditBtn from 'component/buttons/EditBtn'
import DeleteBtn from 'component/buttons/DeleteBtn'
import ImportExport from 'component/ImportExport'
import NoDataPlaceholder from 'component/NoDataPlaceholder'
import AddRoom from './forms/AddRoom'
import EditRoom from './forms/EditRoom'


const RoomCategory = () => {
  const [serverData, setServerData] = useState([])
  const [showData, setShowData] = useState(serverData)
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false)
  //   const toast = useToast();
  const [type, setType] = useState('add')
  const [editData, setEditData] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [data, setData] = useState({})
  const [loader, setLoader] = useState(true)

  const headerFields = ['Room Category']
  const downheaderFields = ['Room Category']

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
    await get('room-category').then(response => {
      let addsr = []
      response.data.forEach((val, index) => {
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
      return item.categoryName.toLowerCase().includes(searchValue)
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

  const deleteData = async id => {
    await put(`room-category/delete/${id}`)
      .then(() => {
        getData()
        toast.error(`${data.roomCategory} category deleted!!`);
        setOpenDeleteModal(false)
      })
      .catch(error => {
        toast.error("Something went wrong, Please try later!!");
      })
  }

  const fileValidationHandler = fileData => {
    const newData = []

    fileData.forEach(val => {
      let d = {}
      if (val['Room Category'] !== '') {
        d = {
          categoryName: val['Room Category']
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
        'Room Category': val.categoryName?.replace(/,/g, ' ')
      })
    })
    return datadd
  }

  const columns = ['SN', 'Room Category', 'Action']
  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Room Category': item.categoryName,
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
      <>
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
                name='Room Category'
                fileValidationHandler={fileValidationHandler}
                exportDataHandler={exportDataHandler}
                api='room-category/import'
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
              <AddRoom handleClose={closeRegistration} getData={getData} />
            ) : (
              <EditRoom handleClose={closeRegistration} editData={editData} getData={getData} />
            )}
          </Modal>
          <Modal
            open={openDeleteModal}
            onClose={closeRegistration}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <div className='modal'>
              <h2 className='popupHead'>Delete {data.categoryName} category?</h2>
              <div style={{ marginTop: '2rem' }}>
                <Button onClick={() => deleteData(data._id)}>delete</Button>
                <Button title='Cancel' onClick={() => closeRegistration()}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </CardContent>
      </>
      
    </>
  )
}

export default RoomCategory
