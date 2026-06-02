import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Loader from 'component/Loader/Loader';
import { get, remove } from 'api/api';
import Breadcrumb from 'component/Breadcrumb';
import DataTable from 'component/DataTable';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import { toast, ToastContainer } from 'react-toastify';
import NoDataPlaceholder from 'component/NoDataPlaceholder';
import AddSetup from './forms/AddSetup';
import EditSetup from './forms/EditSetup';
import ViewBtn from 'component/buttons/ViewBtn';
import SwitchBtn from 'component/buttons/SwitchBtn';
import RangeSlider from './components/RangeSlider';
import InputField from 'component/Input';

const FormSetUpNew = () => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState(serverData);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);

  const openDeleteModalFun = (data) => {
    setData(data);
    setOpenDeleteModal(true);
  };

  const openRegistration = (type) => {
    setType(type);
    setEditData({});
    setOpenRegistrationModal(true);
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
  };

  const getData = async () => {
    setLoader(true);
    try {
      const response = await get('form-setup');
      const addsr = response.data.map((val, index) => ({
        ...val,
        sr: index + 1
      }));
      setShowData(addsr);
      setServerData(addsr);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleEdit = (item) => {
    console.log("Item",item)
    setType('edit');
    setEditData(item);
    setOpenRegistrationModal(true);
  };

  const deleteData = async (id) => {
    try {
      await remove(`form-setup/delete/${id}`);
      getData();
      toast.error(`${data.serviceName} Deleted`);
      setOpenDeleteModal(false);
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Something went wrong, Please try later!!');
    }
  };

  const handleSwitch = (item) => {
    console.log('Item', item);
  };

  const column = ['Sr. No.', 'Department', 'Form Status', 'Action'];
  const handleChange = (event) => {
    const term = event.target.value;
  console.log("TERM",term)
    // Filter data based on search term
    const filtered = serverData.filter((item) =>
      item?.department?.toLowerCase()?.includes(term.toLowerCase())
    );
    
    setShowData(filtered);  
  };
  const finalData = showData.map((item) => {
    return {
      'Sr. No.': item.sr,
      Department: item.department,
      'Form Status': <RangeSlider />,
      Action: (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ViewBtn onClick={() => {}} />
          <EditBtn style={{ marginRight: '0px !important' }} onClick={() => handleEdit(item)} />
          <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          <SwitchBtn onClick={() => handleSwitch(item)} />
        </div>
      )
    };
  });

  return (
    <>
      <Breadcrumb title="OPD Form Setup">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          OPD Form Setup
        </Typography>
      </Breadcrumb>
      <Card>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Button variant="contained" onClick={() => openRegistration('add')}>
              + Add
            </Button>
            <TextField type="search" placeholder="Search..." onChange={handleChange} />
          </div>

          {loader ? (
            <Loader />
          ) : showData && showData.length === 0 ? (
            <NoDataPlaceholder />
          ) : (
            <DataTable columns={column} data={finalData} />
          )}

          <Dialog open={openRegistrationModal} onClose={closeRegistration} fullScreen>
            <DialogContent>
                {type === 'add' && <AddSetup close={closeRegistration} getData={getData} />}
                {type === 'edit' && <EditSetup close={closeRegistration} getData={getData} editData={editData} isDrProfile={true}/>}
            </DialogContent>
          </Dialog>

          <Dialog open={openDeleteModal} onClose={closeRegistration} maxWidth="xs" fullWidth>
            {/* Dialog Title */}
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>Delete {data.serviceName}?</DialogTitle>

            {/* Dialog Content (Empty for simplicity, but can be extended) */}
            <DialogContent dividers sx={{ textAlign: 'center', padding: '16px' }}>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions sx={{ justifyContent: 'center', gap: 2, paddingBottom: '16px' }}>
              <Button variant="contained" color="error" onClick={() => deleteData(data._id)}>
                Delete
              </Button>
              <Button variant="outlined" onClick={closeRegistration}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
};

export default FormSetUpNew;
