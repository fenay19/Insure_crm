import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import NoDataPlaceholder from '../../../../component/NoDataPlaceholder';
import ImportExport from '../../../../component/ImportExport';
import Loader from 'component/Loader/Loader';
import { get, put } from 'api/api';
import Breadcrumb from 'component/Breadcrumb';
import DataTable from 'component/DataTable';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import { toast } from 'react-toastify';
import AddAppointment from './forms/AddAppointment';
import EditAppointment from './forms/EditAppointment';
import { MdSchedule } from 'react-icons/md';
import Sechedule from './forms/Sechedule';

const AppointmentScheduling = () => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState(serverData);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  //   const toast = useToast();
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const [secheduleData,setSecheduleData]=useState({});

  const headerFields = ['Department', 'Doctor', 'Schedule', 'Time slot', 'Mode', 'Instruction'];
  const downheaderFields = ['Department', 'Doctor', 'Schedule', 'Time slot', 'Mode', 'Instruction'];

  const navigate = useNavigate();

  const openDeleteModalFun = (data) => {
    setData(data);
    setOpenDeleteModal(true);
  };

  const openRegistration = () => {
    setOpenRegistrationModal(true);
    setType('add');
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
  };

  const getData = async () => {
    setLoader(true);
    await get('appointmentSchedule-master').then((response) => {
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
    const filteredData = serverData.filter((item) => {
      return item.employeeRole.toLowerCase().includes(searchValue);
    });
    let addsr = [];
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
  };

  const handleEdit = (item) => {
    setType('edit');
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  const deleteData = async (id) => {
    await put(`appointmentSchedule-master/delete/${id}`)
      .then(() => {
        getData();
        toast.error('Appointment deleted');
        setOpenDeleteModal(false);
      })
      .catch((error) => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const handleSchedule = (item) => {
    setType('Sechedule');
    setOpenRegistrationModal(true);
    setSecheduleData(item);
  };

  const fileValidationHandler = (fileData) => {
    const newData = [];

    fileData.forEach((val) => {
      let d = {};
      if (val['Employee Role'] !== '') {
        d = {
          employeeRole: val['Employee Role']
        };
        newData.push(d);
      }
    });

    return newData;
  };

  const exportDataHandler = () => {
    let datadd = [];
    showData.forEach((val, ind) => {
      datadd.push({
        SN: ind + 1,
        'Employee Role': val.employeeRole?.replace(/,/g, ' ')
      });
    });
    return datadd;
  };

  const columns = ['SN', 'Department', 'Doctor',  'Mode', 'Instructions', 'Action'];
  const finalData =
    showData &&
    showData.map((item, ind) => {
      return {
        SN: ind + 1,
        Department: item?.departmentName,
        Doctor: item?.doctorName,
        // 'Time Interval': <p>{item?.timeInterval} min</p>,
        Mode: item?.modes.map((item, i) => <p>{item}</p>),
        Instructions: item?.instructions,
        Action: (
          <div className="action_btn">
            <MdSchedule
              style={{
                fontSize: '1.5rem',
                background: 'blue',
                color: '#fff',
                padding: '3px',
                borderRadius: '4px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
              onClick={() => handleSchedule(item)}
            />
            <EditBtn onClick={() => handleEdit(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          </div>
        )
      };
    });



console.log(secheduleData)



  return (
    <>
      <Breadcrumb title="Scheduling">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Scheduling Setup
        </Typography>
      </Breadcrumb>
      <Card>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <div style={{marginBottom:"1rem"}}>
          <Button variant="outlined" className="global_btn" onClick={()=>navigate('/master/time-interval')}>
          Time Interval
             </Button>
            <Button style={{marginLeft:"1.5rem"}}  variant="contained" className="global_btn" onClick={openRegistration}>
              + Add
            </Button>
          </div>
            

            <div style={{ display: 'flex', justifyContent: '', alignItems: 'center' }}>
              <input
                style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
                className="search_input"
                type="search"
                placeholder="Search..."
                onChange={filterData}
              />
              <ImportExport
                update={getData}
                headerFields={headerFields}
                downheaderFields={downheaderFields}
                name="Employee-role"
                fileValidationHandler={fileValidationHandler}
                exportDataHandler={exportDataHandler}
                api="employee-role/import"
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
              <AddAppointment close={closeRegistration} getAppointmentSchedulling={getData} />
            ) : type === 'Sechedule' ? (
              <Sechedule secheduleData={secheduleData} close={closeRegistration} getAppointmentSchedulling={getData}/>
            ) : type === 'edit' ? (
              <EditAppointment close={closeRegistration} item={editData} getAppointmentSchedulling={getData} />
            ) : (
              <div>Invalid Type</div> 
            )}
          </Modal>



          <Modal
            open={openDeleteModal}
            onClose={closeRegistration}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="modal">
              <h2 className="popupHead">Delete {data.employeeRole} Employee Role?</h2>
              <div style={{ marginTop: '2rem' }}>
                <Button onClick={() => deleteData(data._id)}>delete</Button>
                <Button title="Cancel" onClick={() => closeRegistration()}>
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

export default AppointmentScheduling;
