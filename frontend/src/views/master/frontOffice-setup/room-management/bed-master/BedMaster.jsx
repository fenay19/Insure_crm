import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Loader from 'component/Loader/Loader';
import { get, put } from 'api/api';
import Breadcrumb from 'component/Breadcrumb';
import DataTable from 'component/DataTable';
import { Button, CardContent, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import AddBed from './forms/AddBed';
import EditBed from './forms/EditBed';
import { FaEye, FaBed } from 'react-icons/fa';

const BedMaster = () => {
  const [serverData, setServerData] = useState([]);
  const [showData, setShowData] = useState(serverData);
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const [openViewBedsModal, setOpenViewBedsModal] = useState(false);
  const [viewBedsData, setViewBedsData] = useState([]);

  const getData = async () => {
    setLoader(true);
    await get('bed-master')
      .then((response) => {
        let addsr = [];
        response.data.forEach((val, index) => {
          addsr.push({ ...val, sr: index + 1 });
        });
        setShowData(addsr);
        setServerData(addsr);
        setLoader(false);
      })
      .catch(() => {
        toast.error('Failed to fetch data!');
        setLoader(false);
      });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const openDeleteModalFun = (data) => {
    setData(data);
    setOpenDeleteModal(true);
  };

  const closeRegistration = () => {
    setOpenRegistrationModal(false);
    setOpenDeleteModal(false);
    setOpenViewBedsModal(false);
  };

  const handleEdit = (item) => {
    setType('edit');
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  const deleteData = async (id) => {
    await put(`bed-master/delete/${id}`)
      .then(() => {
        getData();
        toast.error(`${data.bedNo} Bed deleted!!`);
        setOpenDeleteModal(false);
      })
      .catch(() => {
        toast.error('Something went wrong, Please try later!!');
      });
  };

  const filterData = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = serverData.filter((item) =>
      item.roomNo.toLowerCase().includes(searchValue)
    );
    let addsr = [];
    filteredData.forEach((val, index) => {
      addsr.push({ ...val, sr: index + 1 });
    });
    setShowData(addsr);
  };

  const columns = ['SN', 'Room No./Name', 'Total Bed', 'View Total Beds', 'Action'];
  const finalData =
    showData &&
    showData.map((item, ind) => ({
      SN: ind + 1,
      'Room No./Name': item.roomName,
      'Total Bed': item.bedNo,
      'View Total Beds': (
        <FaEye
          onClick={() => {
            setViewBedsData(item.totalBeds || []);
            setOpenViewBedsModal(true);
          }}
          style={{ cursor: 'pointer', color: '#126078' }}
        />
      ),
      Action: (
        <div className="action_btn">
          <EditBtn onClick={() => handleEdit(item)} />
          <DeleteBtn onClick={() => openDeleteModalFun(item)} />
        </div>
      ),
    }));

  return (
    <>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="contained" className="global_btn" onClick={() => setOpenRegistrationModal(true)}>
            + Add
          </Button>

          <input
            style={{ height: '40px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
            className="search_input"
            type="search"
            placeholder="Search..."
            onChange={filterData}
          />
        </div>

        {loader ? (
          <Loader />
        ) : showData && showData.length === 0 ? (
          <p>No Data Found</p>
        ) : (
          <DataTable columns={columns} data={finalData} />
        )}

        {/* Add/Edit Modal */}
        <Modal open={openRegistrationModal}>
          {type === 'add' ? (
            <AddBed handleClose={closeRegistration} getData={getData} />
          ) : (
            <EditBed handleClose={closeRegistration} editData={editData} getData={getData} />
          )}
        </Modal>

        <Modal
          open={openViewBedsModal}
          onClose={closeRegistration}
          aria-labelledby="view-beds-modal-title"
          aria-describedby="view-beds-modal-description"
        >
          <div className="modal">
            <h2 id="view-beds-modal-title" className="popupHead">
              Total Beds
            </h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '10px',
              }}
            >
              {viewBedsData.map((bed, index) => (
                <Chip
                  key={index}
                  icon={<FaBed />}
                  label={bed}
                  variant="outlined"
                  color="primary"
                  style={{ fontWeight: 'bold' }}
                />
              ))}
            </div>
            <Button
              variant="contained"
              style={{ marginTop: '20px' }}
              onClick={closeRegistration}
            >
              Close
            </Button>
          </div>
        </Modal>
        <Modal
          open={openDeleteModal}
          onClose={closeRegistration}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="modal">
            <h2 className="popupHead">Delete {data.roomNo} Room Name?</h2>
            <div style={{ marginTop: '2rem' }}>
              <Button onClick={() => deleteData(data._id)}>Delete</Button>
              <Button onClick={closeRegistration}>Cancel</Button>
            </div>
          </div>
        </Modal>
      </CardContent>
    </>
  );
};

export default BedMaster;
