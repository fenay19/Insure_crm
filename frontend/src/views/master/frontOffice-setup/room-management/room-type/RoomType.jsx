import React, { useState, useEffect } from 'react';
import { Button, Grid, Modal, Switch, TextField, MenuItem, FormHelperText, FormControl, InputLabel, Select } from '@mui/material';
import { Paper, IconButton } from '@mui/material';
import { Cancel, Save, TouchApp } from '@mui/icons-material';
import { get, post, put } from 'api/api';
import { toast } from 'react-toastify';
import ImportExport from 'component/ImportExport';
import Loader from 'component/Loader/Loader';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import DataTable from 'component/DataTable';
import NoDataPlaceholder from 'component/NoDataPlaceholder';

const RoomType = () => {
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openActiveModal, setOpenActivateModal] = useState(false);
  const [showData, setShowData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState({});
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [loader, setLoader] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [ledgerData, setLedgerData] = useState([]);
  const [subLedgerData, setSubLedgerData] = useState([]);
  const [filteredSubLedgerData, setFilteredSubLedgerData] = useState([]);
  const [forEditSubLedgerData, setForEditSubLedgerData] = useState([]);
  const [roomCategory,setRoomCategory]=useState([]);
  const [RoomTypeData, setRoomTypeData] = useState({
    categoryName:'',
    categoryNameId: '',
    roomType: '',
    ledger: '',
    ledgerId: '',
    subLedger: '',
    subLedgerId: '',
    serviceGroup: '',
    service: '',
    floorNumber: '',
    description: '',
    status: 'active'
  });

  const [error, setError] = useState({
    categoryName:'',
    roomType: '',
    ledger: '',
    subLedger: '',
    serviceGroup: '',
    service: '',
    floorNumber: ''
  });

  const headerFields = [ 
    'Room Category',
    'Room Type',
    'Ledger',
    'Sub Ledger',
    'Service Group',
    'Service',
    'Floor Number',
    'Description'
  ];
  const downheaderFields = ['Room Category','Room Type', 'Ledger', 'Sub Ledger', 'Service Group', 'Service', 'Floor Number', 'Description', 'Status'];

  const fetchLedgerData = async () => {
    await get('ledger')
      .then((response) => {
        setLedgerData(response.allLedger);
      })
      .catch((err) => toast.error('Something went wrong, Please try later!!'));
  };

  const fetchSubLedgerData = async () => {
    await get('ledger/sub-ledger')
      .then((response) => {
        setSubLedgerData(response.allSubLedger);
      })
      .catch((err) => toast.error('Something went wrong, Please try later!!'));
  };

  useEffect(() => {
    fetchLedgerData();
    fetchSubLedgerData();
    fetchRoomType();
  }, []);

  const handleLedgerChange = (e) => {
    const ledgerId = e.target.value;
    const selectedLedger = ledgerData.find((item) => item._id === ledgerId);
    const filteredSubLedger = subLedgerData.filter((item) => item.ledgerId === ledgerId);

    setRoomTypeData((prev) => ({
      ...prev,
      ledger: selectedLedger.ledger,
      ledgerId: ledgerId
    }));

    if (filteredSubLedger.length > 0) {
      setFilteredSubLedgerData(filteredSubLedger);
    }
  };

  const handleSubLedgerChange = (e) => {
    const subLedgerId = e.target.value;
    const selectedSubLedger = subLedgerData.find((item) => item._id === subLedgerId);

    if (selectedSubLedger) {
      setRoomTypeData((prev) => ({
        ...prev,
        subLedgerId: subLedgerId,
        subLedger: selectedSubLedger.subLedger
      }));
    }
  };

  useEffect(() => {
    const data = subLedgerData.filter((item) => item.ledgerId === RoomTypeData.ledgerId);
    setForEditSubLedgerData(data);
  }, [openEditModal, RoomTypeData.ledger]);

  const filterDataHandler = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = filterData.filter((item) => {
      return (
        item.categoryName.toLowerCase().includes(searchValue) ||
        item.roomType.toLowerCase().includes(searchValue) ||
        item.ledger.toLowerCase().includes(searchValue) ||
        item.subLedger.toLowerCase().includes(searchValue) ||
        item.serviceGroup?.toString().includes(searchValue) ||
        item.service?.toString().includes(searchValue) ||
        item.floorNumber.toString().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue)
      );
    });
    let addsr = [];
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === 'categoryNameId') {
      const findData = roomCategory.find((el,ind)=>el._id === value);
      setRoomTypeData((prev) => ({...prev, categoryName: findData?.categoryName, categoryNameId: value }));
    }

    setRoomTypeData((prev) => {
      return { ...prev, [name]: value };
    });
    setError((prev) => {
      return { ...prev, [name]: '' };
    });
  };

  const fetchRoomType = async () => {
    setLoader(true);
    await get('room-type')
      .then((response) => {
        let addsr = [];
        response.data.forEach((val, index) => {
          addsr.push({ ...val, sr: index + 1 });
        });
        setShowData(addsr);
        setFilterData(addsr);
        setLoader(false);
      })
      .catch((err) => toast.error('Something went wrong, Please try later!!'));
  };

  const deleteRoomType = async (id) => {
    try {
      const response = await put(`room-type/delete/${id}`);
      if (response) {
        fetchRoomType();
        toast.error(`${data.roomType} Room Type deleted!!`);
        setOpenDeleteModal(false);
      } else {
        toast.error('Something went wrong, Please try later!!');
      }
    } catch (error) {
      toast.error('Something went wrong, Please try later!!');
    }
  };

  const activateRoomType = async (id) => {
    const RoomTypeDataToSend = {
      ...data,
      status: data.status === 'active' ? 'inactive' : 'active'
    };
    try {
      await put(`room-type/${id}`, RoomTypeDataToSend);
      setOpenActivateModal(false);
      fetchRoomType();
      toast({
        title: `${data.status === 'active' ? 'Inactivate' : 'Activate'} ${data.roomType} Room Type!!`,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
      setRoomTypeData({
        roomType: '',
        accountLedger: '',
        description: '',
        status: ''
      });
    } catch (error) {
      toast({
        title: 'Something went wrong, Please try later!!',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom'
      });
    }
  };

  const openRegistration = () => {
    setOpenRegistrationModal(true);
  };

  const openEditModalFun = (room) => {
    setSelectedRoomType(room);
    setRoomTypeData({
      categoryName:room.categoryName,
      categoryNameId: room.categoryNameId,
      roomType: room.roomType,
      ledger: room.ledger,
      ledgerId: room.ledgerId,
      subLedger: room.subLedger,
      subLedgerId: room.subLedgerId,
      serviceGroup: room.serviceGroup,
      service: room.service,
      floorNumber: room.floorNumber,
      description: room.description,
      status: room.status
    });
    setOpenEditModal(true);
  };

  const openDeleteModalFun = (data) => {
    setData(data);
    setOpenDeleteModal(true);
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setOpenActivateModal(false);
    setRoomTypeData({
      roomType: '',
      description: '',
      status: ''
    });
    setError({
      roomType: '',
      ledger: '',
      description: '',
      status: ''
    });
  };

  const validation = () => {
    const newError = {};
    let hasError = false;

    if (RoomTypeData.roomType === '') {
      newError.roomType = 'Room Type is required';
      hasError = true;
    }

    if (RoomTypeData.ledger === '') {
      newError.ledger = 'Ledger is required';
      hasError = true;
    }

    if (RoomTypeData.subLedger === '') {
      newError.subLedger = 'Sub Ledger is required';
      hasError = true;
    }

    if (RoomTypeData.serviceGroup === '') {
      newError.totalBedNo = 'service group is required';
      hasError = true;
    }

    if (RoomTypeData.service === '') {
      newError.totalBedNo = 'service is required';
      hasError = true;
    }

    if (RoomTypeData.floorNumber === '') {
      newError.floorNumber = 'Floor Number is required';
      hasError = true;
    }

    setError(newError);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (validation()) {
      const addedData = { ...RoomTypeData, status: 'active' };
      try {
        await post(`room-type`, addedData);
        setOpenRegistrationModal(false);
        fetchRoomType();
        setRoomTypeData({
          categoryName:"",
          roomType: '',
          ledger: '',
          ledgerId: '',
          subLedger: '',
          subLedgerId: '',
          serviceGroup: '',
          service: '',
          floorNumber: '',
          description: '',
          status: ''
        });
        toast.success('Room Type Added!!');
      } catch (error) {
        toast.error('Something went wrong, Please try later!!');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validation()) {
      const RoomTypeDataToSend = {
        ...selectedRoomType,
        ...RoomTypeData
      };

      try {
        await put(`room-type/${selectedRoomType._id}`, RoomTypeDataToSend);
        setOpenEditModal(false);
        fetchRoomType();
        toast.error(`${RoomTypeData.roomType} Room Type Updated!!`);
        setRoomTypeData({
          categoryName:"",
          roomType: '',
          ledger: '',
          ledgerId: '',
          subLedger: '',
          subLedgerId: '',
          serviceGroup: '',
          service: '',
          floorNumber: '',
          description: '',
          status: ''
        });
      } catch (error) {
        toast.error('Something went wrong, Please try later!!');
      }
    }
  };

  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData.forEach((val) => {
      let d = {};
      if (
        val['Room Category']!== '' &&
        val['Room Type'] !== '' &&
        val['Ledger'] !== undefined &&
        val['Sub Ledger'] !== undefined &&
        val['Service Group'] !== '' &&
        val['Service'] !== '' &&
        val['Floor Number'] !== ''
      ) {
        d = {
          categoryName: val['Room Category'],
          roomType: val['Room Type'],
          ledger: val['Ledger'],
          subLedger: val['Sub Ledger'],
          serviceGroup: val['Service Group'],
          service: val['Service'],
          floorNumber: val['Floor Number'],
          description: val['Description'],
          status: 'active'
        };
        newData.push(d);
      }
    });

    return newData;
  };

  const exportDataHandler = () => {
    let datadd = [];
    // console.log('export',showData)
    showData.forEach((val, ind) => {
      datadd.push({
        SN: ind + 1,
        'Room Category': val.categoryName?.replace(/,/g, ' '),
        'Room Type': val.roomType?.replace(/,/g, ' '),
        Ledger: val.ledger?.replace(/,/g, ' '),
        'Sub Ledger': val.subLedger?.replace(/,/g, ' '),
        'Service Group': val.serviceGroup?.replace(/,/g, ' '),
        Service: val.service?.replace(/,/g, ' '),
        'Floor Number': val.floorNumber?.replace(/,/g, ' '),
        Description: val.description?.replace(/,/g, ' '),
        Status: val.status?.replace(/,/g, ' ')
      });
    });
    return datadd;
  };

  const columns = ['SN', 'Room Category', 'Room Type', 'Ledger', 'Sub Ledger', 'Service Group', 'Service', 'Floor No', 'Description', 'Action'];

  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Room Category': item.categoryName,
        'Room Type': item.roomType,
        Ledger: item.ledger,
        'Sub Ledger': item.subLedger,
        'Service Group': item.serviceGroup,
        Service: item.service,
        'Floor No': item.floorNumber,
        Description: item.description,
        Action: (
          <div className="action_btn">
            <EditBtn onClick={() => openEditModalFun(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          </div>
        )
      };
    });

    const getCategoryData = async () => {
      await get('room-category').then(response => {
        setRoomCategory(response.data)
      })
    }
useEffect(()=>{
  getCategoryData()
},[])


  return (
    <div>
      <div className="top_bar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="contained" className="global_btn" onClick={openRegistration}>
            + Add
          </Button>
          <div style={{ display: 'flex', justifyContent: '', alignItems: 'center' }}>
            <input
              style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
              className="search_input"
              type="search"
              placeholder="Search..."
              onChange={filterDataHandler}
            />
            <ImportExport
              update={fetchRoomType}
              headerFields={headerFields}
              downheaderFields={downheaderFields}
              name="Room Type"
              fileValidationHandler={fileValidationHandler}
              exportDataHandler={exportDataHandler}
              api="room-type/import"
            />
          </div>
        </div>

        <Modal open={openRegistrationModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <div className="modal">
            <h2 className="popupHead">Add Room Type</h2>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={formSubmitted && !!error.categoryName}>
                    <InputLabel>Room category</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      name="categoryNameId"
                      label="Room category"
                      value={RoomTypeData.categoryNameId}
                      onChange={handleInputChange}
                    >
                      {roomCategory.map((item) => (
                        <MenuItem value={item._id} key={item._id}>
                          {item.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{error.categoryName}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={formSubmitted && !!error.ledger}>
                    <InputLabel>Ledger</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      name="ledger"
                      label="Ledger"
                      value={RoomTypeData.ledgerId}
                      onChange={handleLedgerChange}
                    >
                      {ledgerData.map((item) => (
                        <MenuItem value={item._id} key={item._id}>
                          {item.ledger}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{error.ledger}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={formSubmitted && !!error.subLedger}>
                    <InputLabel>Sub Ledger</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      name="subLedger"
                      label="Sub Ledger"
                      value={RoomTypeData.subLedgerId}
                      onChange={handleSubLedgerChange}
                      disabled={RoomTypeData.ledger === ''}
                    >
                      {filteredSubLedgerData.map((item, ind) => {
                        return (
                          <MenuItem value={item._id} key={ind}>
                            {item.subLedger}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>{error.subLedger}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Room Type"
                    variant="outlined"
                    name="roomType"
                    value={RoomTypeData.roomType}
                    onChange={handleInputChange}
                    error={formSubmitted && !!error.roomType}
                    helperText={formSubmitted && error.roomType}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Service Group"
                    variant="outlined"
                    name="serviceGroup"
                    type="text"
                    value={RoomTypeData.serviceGroup}
                    onChange={handleInputChange}
                    error={formSubmitted && !!error.serviceGroup}
                    helperText={formSubmitted && error.serviceGroup}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Service"
                    variant="outlined"
                    name="service"
                    type="text"
                    value={RoomTypeData.service}
                    onChange={handleInputChange}
                    error={formSubmitted && !!error.service}
                    helperText={formSubmitted && error.service}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Floor No."
                    variant="outlined"
                    name="floorNumber"
                    value={RoomTypeData.floorNumber}
                    onChange={handleInputChange}
                    error={formSubmitted && !!error.floorNumber}
                    helperText={formSubmitted && error.floorNumber}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    name="description"
                    value={RoomTypeData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="btnGroup">
                    <IconButton type="submit" title="Save" className="btnPopup btnSave">
                      <Save />
                    </IconButton>
                    <IconButton type="submit" title="Cancel" onClick={() => closeRegistration()} className="btnPopup btnCancel">
                      <Cancel />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        </Modal>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <Paper>{showData.length <= 0 ? <NoDataPlaceholder /> : <DataTable data={finalData} columns={columns} />}</Paper>
      )}
      <Modal open={openEditModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="modal">
          <h2 className="popupHead">Update Room Type</h2>
          <form onSubmit={handleEditSubmit}>
            <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={formSubmitted && !!error.categoryName}>
                    <InputLabel>Room category</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 300 }
                        }
                      }}
                      name="categoryNameId"
                      label="Room category"
                      value={RoomTypeData.categoryNameId}
                      onChange={handleInputChange}
                    >
                      {roomCategory.map((item) => (
                        <MenuItem value={item._id} key={item._id}>
                          {item.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{error.categoryName}</FormHelperText>
                  </FormControl>
                </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={formSubmitted && !!error.ledger}
                  helperText={formSubmitted && error.ledger}
                >
                  <InputLabel>Ledger</InputLabel>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 }
                      }
                    }}
                    name="ledger"
                    label="Ledger"
                    value={RoomTypeData.ledgerId}
                    onChange={handleLedgerChange}
                  >
                    {ledgerData.map((item) => (
                      <MenuItem value={item._id} key={item._id}>
                        {item.ledger}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error.ledger}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={formSubmitted && !!error.subLedger}
                  helperText={formSubmitted && error.subLedger}
                >
                  <InputLabel>Sub Ledger</InputLabel>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 }
                      }
                    }}
                    name="subLedger"
                    label="Sub Ledger"
                    value={RoomTypeData.subLedgerId}
                    onChange={handleSubLedgerChange}
                  >
                    {forEditSubLedgerData.map((item, index) => (
                      <MenuItem value={item._id} key={index}>
                        {item.subLedger}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error.subLedger}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room Type"
                  variant="outlined"
                  name="roomType"
                  value={RoomTypeData.roomType}
                  onChange={handleInputChange}
                  error={formSubmitted && !!error.roomType}
                  helperText={formSubmitted && error.roomType}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service Group"
                  variant="outlined"
                  name="serviceGroup"
                  type="text"
                  value={RoomTypeData.serviceGroup}
                  onChange={handleInputChange}
                  error={formSubmitted && !!error.serviceGroup}
                  helperText={formSubmitted && error.serviceGroup}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service"
                  variant="outlined"
                  name="serviceGroup"
                  type="text"
                  value={RoomTypeData.service}
                  onChange={handleInputChange}
                  error={formSubmitted && !!error.service}
                  helperText={formSubmitted && error.service}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Floor No."
                  variant="outlined"
                  name="floorNumber"
                  value={RoomTypeData.floorNumber}
                  onChange={handleInputChange}
                  error={formSubmitted && !!error.floorNumber}
                  helperText={formSubmitted && error.floorNumber}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  name="description"
                  value={RoomTypeData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <div className="btnGroup">
                  <IconButton type="submit" title="Update" className="btnPopup btnSave">
                    <Save />
                  </IconButton>
                  <IconButton type="submit" title="Cancel" onClick={() => closeRegistration()} className="btnPopup btnCancel">
                    <Cancel />
                  </IconButton>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
      <Modal open={openActiveModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="modal">
          <h2 className="popupHead">
            {data.status === 'active' ? 'Inactivate' : 'Activate'} {data.roomType} Room Type?
          </h2>
          <div className="deleteBtnGroup">
            <IconButton
              title={data.status === 'active' ? 'Inactivate' : 'Activate'}
              className={`btnPopup ${data.status === 'active' ? 'btnDelete' : 'btnSave'}`}
              onClick={() => activateRoomType(data._id)}
            >
              <TouchApp />
            </IconButton>
            <IconButton title="Cancel" onClick={() => closeRegistration()} className="btnPopup btnCancel">
              <Cancel />
            </IconButton>
          </div>
        </div>
      </Modal>
      <Modal open={openDeleteModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="modal">
          <h2 className="popupHead">Delete {data.roomType} Room Type?</h2>
          <div style={{marginTop:"1rem"}} className="deleteBtnGroup">
            <Button className="btnPopup btnDelete" onClick={() => deleteRoomType(data._id)}>
              Delete
            </Button>
            <Button type="submit"  onClick={() => closeRegistration()} className="btnPopup btnCancel">
              Cancel 
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoomType;
