import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import AddService from './forms/AddService';
import {
  Paper,
  Button,
  Input,
} from '@mui/material';

import { get, put } from 'api/api';
import { toast } from 'react-toastify';
import ImportExport from 'component/ImportExport';
import Loader from 'component/Loader/Loader';
import NoDataPlaceholder from 'component/NoDataPlaceholder';
import EditBtn from 'component/buttons/EditBtn';
import DeleteBtn from 'component/buttons/DeleteBtn';
import DataTable from 'component/DataTable';
import EditService from './forms/EditService';

const OpdConsultation = () => {
  const [showData, setShowData] = useState([]); // State to store data for display
  const [filteredData, setFilteredData] = useState([]); // State to store filtered data
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
  const [openRegistrationModal, setOpenRegistrationModal] = useState(false);
  const [type, setType] = useState('add');
  const [editData, setEditData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);

  const headerFields = ['Service Name', 'Type', 'Specialty/Department', 'Consultant Name', 'Service Group/Bill Group'];
  const downheaderFields = ['Service Name', 'Type', 'Specialty/Department', 'Consultant Name', 'Service Group/Bill Group'];

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

    try {
      const serviceDataResponse = await get('opd-consultant-service/all');
      const data = serviceDataResponse.data ?? [];
      setShowData(data); // Store fetched data in showData
      setFilteredData(data); // Initialize filteredData with all data
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getData();
  }, []); // Fetch data once on component mount

  const handleEdit = (item) => {
    setType(!type);
    setOpenRegistrationModal(true);
    setEditData(item);
  };

  const deleteService = async (id) => {
    try {
      await put(`opd-consultant-service/delete/${id}`);
      getData(); // Refresh data after delete
      toast.error(`${data.detailServiceName} Service deleted`);
      setOpenDeleteModal(false);
    } catch (err) {
      toast.error('Something went wrong, Please try later');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on the search query
    const filtered = showData.filter((item) => {
      return (
        item.serviceName?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query) ||
        item.department?.toLowerCase().includes(query) ||
        item.consultantName?.toLowerCase().includes(query) ||
        item.billGroup?.toLowerCase().includes(query)
      );
    });

    setFilteredData(filtered);
  };

  const exportDataHandler = () => {
    return filteredData.map((val, ind) => ({
      SN: ind + 1,
      'Service Name': val?.serviceName,
      Type: val?.type,
      'Specialty/Department': val.department,
      'Consultant Name': val.consultantName,
      'Service Group/Bill Group': val?.billGroup,
    }));
  };

  const columns = ['SN', 'Service Name', 'Type', 'Specialty/Department', 'Consultant Name', 'Service Group/Bill Group', 'Action'];

  const finalData =
    filteredData &&
    filteredData.map((item, ind) => {
      return {
        SN: ind + 1,
        'Service Name': item?.serviceName,
        Type: item?.type,
        'Specialty/Department': item?.department,
        'Consultant Name': item.consultantName,
        'Service Group/Bill Group': item?.billGroup,
        Action: (
          <>
            <EditBtn onClick={() => handleEdit(item)} />
            <DeleteBtn onClick={() => openDeleteModalFun(item)} />
          </>
        )
      };
    });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="contained" color="primary" onClick={openRegistration}>
          + Add
        </Button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          <Input
            style={{ height: '53px', padding: '5px', borderRadius: '5px', border: '1px solid #126078' }}
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <ImportExport
            update={getData}
            headerFields={headerFields}
            downheaderFields={downheaderFields}
            name="Opd service"
            exportDataHandler={exportDataHandler}
            api="opd-consultant-service/import"
          />
        </div>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <Paper>{filteredData.length === 0 ? <NoDataPlaceholder /> : <DataTable columns={columns} data={finalData} />}</Paper>
      )}
      <Modal open={openRegistrationModal}>
        {type === 'add' ? (
          <AddService handleClose={closeRegistration} getData={getData} />
        ) : (
          <EditService handleClose={closeRegistration} editData={editData} getData={getData} />
        )}
      </Modal>

      <Modal
        open={openDeleteModal}
        onClose={closeRegistration}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <h2 className="popupHead">Delete {data?.serviceName} Service?</h2>
          <div style={{ marginTop: '1rem' }}>
            <Button title="Delete" onClick={() => deleteService(data?._id)}>
              Delete
            </Button>
            <Button type="submit" onClick={() => closeRegistration()}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OpdConsultation;