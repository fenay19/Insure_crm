import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Loader from 'component/Loader/Loader';
import { get, remove } from 'api/api';
import Breadcrumb from 'component/Breadcrumb';
import DataTable from 'component/DataTable';
import { Button, Card, CardContent, Checkbox, Chip, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import { toast, ToastContainer } from 'react-toastify';
import NoDataPlaceholder from 'component/NoDataPlaceholder';
import AddAppointment from './forms/AddAppointment';
import EditAppointment from './forms/EditAppointment';
import ConfirmAppointment from './forms/ConfirmAppointment';

const Appointment = () => {
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

  const navigate = useNavigate();

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
    await get('patient-appointment').then((response) => {
      let addsr = [];
      response.data.forEach((val, index) => {
        addsr.push({ ...val, sr: index + 1 });
      });
      setShowData(addsr);
      setServerData(addsr);
      setLoader(false);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const filterData = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = serverData.filter(
      (item) =>
        `${item?.patientFirstName}`.toLowerCase().includes(searchValue) ||
        item.departmentName.toLowerCase().includes(searchValue) ||
        item.contact.toLowerCase().includes(searchValue)
    );
    let addsr = [];
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
  };

  const handleEdit = (item) => {
    setType('edit');
    setEditData(item);
    setOpenRegistrationModal(true);
  };

  const [patientInfo, setPatientInfo] = useState(null);
  const fetchPatient = async (id) => {
    if (id) {
      const res = await get(`opd-patient/patient/${id}`);
      setPatientInfo(res?.data ?? null);
    }
  };

  const handleConfirmApp = (item) => {
    fetchPatient(item?._id);
    setType('confirm');
    setEditData(item);

    setTimeout(() => {
      setOpenRegistrationModal(true);
    }, 1000);
  };

  const deleteData = async (id) => {
    await remove(`patient-appointment/delete/${id}`)
      .then(() => {
        getData();
        toast.error(`${data.patientFirstName} ${data.patientLastName} patient Deleted`);
        setOpenDeleteModal(false);
      })
      .catch(() => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const columns = [
    'SN',
    'Patient Name',
    'Age',
    'Consultant Name',
    'Consultation Type',
    'Department',
    'Date',
    'Slot',
    'Contact No',
    'Patient Req',
    'Confirm Req',
    'Paid/Unpaid',
    'Action'
  ];
  const finalData =
    showData &&
    showData.map((item, ind) => ({
      SN: ind + 1,
      'Patient Name': `${item.prefix} ${item.patientFirstName} ${item.patientMiddleName} ${item.patientLastName}`,
      Age: item.age,
      'Consultant Name': item.consultantName,
      'Consultation Type': item.consultationType,
      Department: item.departmentName,
      Date: item.date,
      Slot: item.time,
      'Contact No': item.contact,
      'Patient Req': (
        <select style={{ padding: '5px', borderRadius: '4px' }}>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>
      ),
      'Confirm Req': <Checkbox />,
      'Paid/Unpaid': (
        <Chip
          label={item?.billingStatus === 'Non_Paid' ? 'Paid' : 'Unpaid'}
          sx={{
            backgroundColor: item?.billingStatus === 'Non_Paid' ? 'green' : 'red',
            color: 'white',
            padding: 'auto 10px'
          }}
        />
      ),
      Action: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            style={{
              backgroundColor: `${item.isConfirm ? 'gray' : 'orange'}`,
              borderRadius: '5px',
              padding: '5px',
              color: 'white',
              textTransform: 'uppercase',
              marginRight: '5px',
              cursor: 'pointer'
            }}
            onClick={() => handleConfirmApp(item)}
            //  disabled={item.isConfirm}
          >
            {item.isConfirm ? 'BOOKED' : 'BOOK'}
          </Button>

          <EditBtn onClick={() => handleEdit(item)} />
          <DeleteBtn onClick={() => openDeleteModalFun(item)} />
        </div>
      )
    }));

  return (
    <>
      <Breadcrumb
        title={
          <Typography
            variant="subtitle2"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              padding: '10px 16px', // Increased padding for better width
              borderRadius: '6px',
              display: 'inline-block',
              fontSize: '1.3rem', // Increased font size
              minWidth: '190px', // Ensures the button has a minimum width
              textAlign: 'center', // Centers the text inside
              cursor: 'pointer'
              // '&:hover': {
              //   backgroundColor: 'primary.dark',
              // },
            }}
          >
            Appointment Booking
          </Typography>
        }
      >
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Appointment
        </Typography>
      </Breadcrumb>

      <Card>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
              <Button variant="contained" onClick={() => navigate('/dashboard')}>
                Back
              </Button>
              <Button variant="contained" onClick={() => openRegistration('add')}>
                + add
              </Button>
              {/* <Button variant="contained" color="warning">
                Provisional Patient
              </Button>
              <Button variant="contained" color="success" onClick={() => navigate('/confirm-patientForm')}>
                Confirm Patient
              </Button> */}
            </div>
            <div>
              <input
                style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
                className="search_input"
                type="search"
                placeholder="Search..."
                onChange={filterData}
              />
            </div>
          </div>

          {loader ? (
            <Loader />
          ) : showData && showData.length === 0 ? (
            <NoDataPlaceholder />
          ) : (
            <DataTable columns={columns} data={finalData} />
          )}

          <Modal open={openRegistrationModal} onClose={closeRegistration}>
            <div>
              {type === 'add' && <AddAppointment close={closeRegistration} getData={getData} />}
              {type === 'edit' && <EditAppointment close={closeRegistration} editData={editData} getData={getData} />}
              {type === 'confirm' && (
                <ConfirmAppointment
                  close={closeRegistration}
                  patientDetail={editData}
                  opdPatient={patientInfo}
                  fetchAppointmentsAfterBilling={getData}
                />
              )}
            </div>
          </Modal>

          <Modal open={openDeleteModal} onClose={closeRegistration}>
            <div className="modal">
              <h2 className="popupHead">Delete {data.patientname} patient delete?</h2>
              <div style={{ marginTop: '2rem' }}>
                <Button onClick={() => deleteData(data._id)}>Delete</Button>
                <Button title="Cancel" onClick={closeRegistration}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </CardContent>
      </Card>
    </>
  );
};

export default Appointment;
